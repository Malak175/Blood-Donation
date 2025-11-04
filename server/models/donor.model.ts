import mongoose, { Schema, Document } from "mongoose";

export interface IDonor extends Document {
  name: string;
  email: string;
  phone: string;
  bloodType: string;
  age: number;
  address: string;
  status: "pending" | "approved" | "rejected";
  appliedAt: Date;
}

const donorSchema = new Schema<IDonor>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    bloodType: { type: String, required: true },
    age: { type: Number, required: true },
    address: { type: String, required: true },
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
    appliedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Donor = mongoose.model<IDonor>("Donor", donorSchema);

export default Donor;
