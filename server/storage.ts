import {
  type Admin,
  type InsertAdmin,
  type Donor,
  type InsertDonor,
  type ContactMessage,
  type InsertContactMessage,
} from "../shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Admin methods
  getAdminByUsername(username: string): Promise<Admin | undefined>;
  createAdmin(admin: InsertAdmin): Promise<Admin>;

  // Donor methods
  getAllDonors(): Promise<Donor[]>;
  getDonor(id: string): Promise<Donor | undefined>;
  createDonor(donor: InsertDonor): Promise<Donor>;
  updateDonorStatus(id: string, status: string): Promise<Donor | undefined>;

  // Contact message methods
  createContactMessage(message: InsertContactMessage): Promise<ContactMessage>;
  getAllContactMessages(): Promise<ContactMessage[]>;
}

export class MemStorage implements IStorage {
  private admins: Map<string, Admin>;
  private donors: Map<string, Donor>;
  private contactMessages: Map<string, ContactMessage>;

  constructor() {
    this.admins = new Map();
    this.donors = new Map();
    this.contactMessages = new Map();

    // Create default admin user
    const defaultAdmin: Admin = {
      id: randomUUID(),
      username: "admin",
      password: "password", // In production, this should be hashed
      name: "Admin User",
    };
    this.admins.set(defaultAdmin.id, defaultAdmin);
  }

  // Admin methods
  async getAdminByUsername(username: string): Promise<Admin | undefined> {
    return Array.from(this.admins.values()).find(
      (admin) => admin.username === username
    );
  }

  async createAdmin(insertAdmin: InsertAdmin): Promise<Admin> {
    const id = randomUUID();
    const admin: Admin = { ...insertAdmin, id };
    this.admins.set(id, admin);
    return admin;
  }

  // Donor methods
  async getAllDonors(): Promise<Donor[]> {
    return Array.from(this.donors.values()).sort(
      (a, b) => new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime()
    );
  }

  async getDonor(id: string): Promise<Donor | undefined> {
    return this.donors.get(id);
  }

  async createDonor(insertDonor: InsertDonor): Promise<Donor> {
    const id = randomUUID();
    const donor: Donor = {
      ...insertDonor,
      id,
      status: "pending",
      appliedAt: new Date(),
    };
    this.donors.set(id, donor);
    return donor;
  }

  async updateDonorStatus(id: string, status: "pending" | "approved" | "rejected"): Promise<Donor | undefined> {
    const donor = this.donors.get(id);
    if (!donor) return undefined;

    const updatedDonor: Donor = { ...donor, status };
    this.donors.set(id, updatedDonor);
    return updatedDonor;
  }

  // Contact message methods
  async createContactMessage(
    insertMessage: InsertContactMessage
  ): Promise<ContactMessage> {
    const id = randomUUID();
    const message: ContactMessage = {
      ...insertMessage,
      id,
      createdAt: new Date(),
    };
    this.contactMessages.set(id, message);
    return message;
  }

  async getAllContactMessages(): Promise<ContactMessage[]> {
    return Array.from(this.contactMessages.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }
}

export const storage = new MemStorage();
