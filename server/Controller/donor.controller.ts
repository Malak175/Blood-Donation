import { Request, Response } from "express";
import Donor from "../models/donor.model";

// ✅ إضافة متبرع جديد
export const addDonor = async (req: Request, res: Response) => {
  try {
    const donor = new Donor(req.body);
    await donor.save();
    res.status(201).json({ message: "Donor added successfully", donor });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ جلب جميع المتبرعين
export const getDonors = async (_req: Request, res: Response) => {
  try {
    const donors = await Donor.find().sort({ appliedAt: -1 });
    res.status(200).json(donors);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ تحديث حالة متبرع (approve / reject)
export const updateDonorStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const donor = await Donor.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!donor) {
      return res.status(404).json({ message: "Donor not found" });
    }

    res.status(200).json({ message: "Status updated successfully", donor });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ حذف متبرع
export const deleteDonor = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const donor = await Donor.findByIdAndDelete(id);

    if (!donor) {
      return res.status(404).json({ message: "Donor not found" });
    }

    res.status(200).json({ message: "Donor deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
