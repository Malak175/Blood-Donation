import type { Express } from "express";
import { createServer, type Server } from "http";
import session from "express-session";
import dotenv from "dotenv";

import {
  addDonor,
  getDonors,
  updateDonorStatus,
  deleteDonor,
} from "./Controller/donor.controller";

import Admin from "./models/admin.model";
import ContactMessage from "./models/contact.model";

dotenv.config();

// ==========================
// Extend Express session to include admin info
// ==========================
declare module "express-session" {
  interface SessionData {
    admin?: { _id: string; username: string; name: string };
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // ====== Session middleware ======
  app.use(
    session({
      secret:
        process.env.SESSION_SECRET ||
        "blood-donation-secret-key-change-in-production",
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
      },
    })
  );

  // ==========================
  // AUTH ROUTES (Admins)
  // ==========================

  //  Register new admin (for local testing only)
  app.post("/api/auth/register", async (req, res) => {
    try {
      const { username, password, name } = req.body;
      if (!username || !password || !name) {
        return res.status(400).json({ error: "All fields are required" });
      }

      const existing = await Admin.findOne({ username });
      if (existing) {
        return res.status(400).json({ error: "Username already exists" });
      }

      const admin = new Admin({ username, password, name });
      await admin.save();

      res.status(201).json({ message: "Admin registered successfully" });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // 🔹 Login admin (plaintext password - only for local testing)
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res
          .status(400)
          .json({ error: "Username and password are required" });
      }

      const admin = await Admin.findOne({
        username: { $regex: new RegExp(`^${username}$`, "i") },
      });

      console.log("Found admin in DB:", admin);

      if (!admin) {
        return res
          .status(401)
          .json({ error: "Invalid credentials - user not found" });
      }

      if (password !== admin.password) {
        return res
          .status(401)
          .json({ error: "Invalid credentials - wrong password" });
      }

      // حفظ بيانات الأدمن في السيشن
      req.session.admin = {
        _id: (admin._id as any).toString(),
        username: admin.username,
        name: admin.name,
      };

      return res.json({
        message: "Login successful",
        admin: {
          username: admin.username,
          name: admin.name,
        },
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // 🔹 Logout admin
  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ error: "Logout failed" });
      }
      res.json({ success: true });
    });
  });

  // 🔹 Session check
  app.get("/api/auth/session", (req, res) => {
    if (req.session.admin) {
      res.json({ admin: req.session.admin });
    } else {
      res.json({ admin: null });
    }
  });

  // ==========================
  // DONOR ROUTES
  // ==========================
  app.get("/api/donors", getDonors);
  app.post("/api/donors", addDonor);
  app.put("/api/donors/:id/status", updateDonorStatus);
  app.delete("/api/donors/:id", deleteDonor);

  // ==========================
  // CONTACT ROUTES
  // ==========================
  app.post("/api/contact", async (req, res) => {
    try {
      const { name, email, subject, message } = req.body;

      if (!name || !email || !subject || !message) {
        return res.status(400).json({ error: "All fields are required" });
      }

      const contactMessage = new ContactMessage({
        name,
        email,
        subject,
        message,
      });
      await contactMessage.save();

      res
        .status(201)
        .json({ message: "Contact message saved successfully", contactMessage });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/contact", async (_req, res) => {
    try {
      const messages = await ContactMessage.find().sort({ createdAt: -1 });
      res.status(200).json(messages);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // ==========================
  // Return http server
  // ==========================
  const httpServer = createServer(app);
  return httpServer;
}
