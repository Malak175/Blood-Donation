import { z } from "zod";

// Admin types
export type Admin = {
  id: string;
  username: string;
  password: string;
  name: string;
};
export type InsertAdmin = Omit<Admin, "id">;

// Contact message
export const insertContactMessageSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  subject: z.string().min(1, "Subject is required"),
  message: z.string().min(1, "Message is required"),
});
export type InsertContactMessage = z.infer<typeof insertContactMessageSchema>;
export type ContactMessage = InsertContactMessage & {
  id: string;
  createdAt: Date;
};

// Donor
export const insertDonorSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(5),
  bloodType: z.string().min(1),
  age: z.number().int().positive(),
  address: z.string().min(1),
});
export type InsertDonor = z.infer<typeof insertDonorSchema>;
export type Donor = {
  id: string;
  name: string;
  email: string;
  phone: string;
  bloodType: string;
  age: number;
  address: string;
  status: "pending" | "approved" | "rejected";
  appliedAt: Date | string;
};
