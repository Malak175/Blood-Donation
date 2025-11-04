import mongoose, { Schema, Document } from "mongoose";

export interface IContactMessage extends Document {
    name: string;
    email: string;
    subject: string;
    message: string;
    createdAt: Date;
}

const contactSchema = new Schema<IContactMessage>(
    {
        name: { type: String, required: true },
        email: { type: String, required: true },
        subject: { type: String, required: true },
        message: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
    },
    { timestamps: true }
);

const ContactMessage = mongoose.model<IContactMessage>("ContactMessage", contactSchema);
export default ContactMessage;
