import mongoose, { Schema, Document } from "mongoose";

export interface IAdmin extends Document {
    username: string;
    password: string;
    name: string;
}

const adminSchema = new Schema<IAdmin>(
    {
        username: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        name: { type: String, required: true },
    },
    { timestamps: true }
);

const Admin = mongoose.model<IAdmin>("Admin", adminSchema);
export default Admin;
