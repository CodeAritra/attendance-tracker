import attendance from "../models/attendance.js";

export const allSubjects = async (req, res) => {
  try {
    const allAttendance = await attendance.find();
    res.status(200).json(allAttendance);
  } catch (error) {
    res.status(500).json({ error: "Error in getting all subjects" });
  }
};

export const createSubjects = async (req, res) => {
  try {
    const { subject, totalClasses, attendedClasses } = req.body;
    const newAttendance = new attendance({
      subject,
      totalClasses,
      attendedClasses,
    });
    await newAttendance.save();
    res
      .status(200)
      .json({ success: true, message: "Added successfully", newAttendance });
  } catch (error) {
    res.status(500).json({ error: "Error in creating subjects" });
    console.log(error);
  }
};

export const updateSubjects = async (req, res) => {
  const { id } = req.params;
  const { subject, attendedClasses, totalClasses } = req.body;
  
  const newSubject = {};
  if (subject) newSubject.subject = subject;
  if (attendedClasses) newSubject.attendedClasses = attendedClasses;
  if (totalClasses) newSubject.totalClasses = totalClasses;

  try {
    const updatedSubject = await attendance.findByIdAndUpdate(id, newSubject, {
      new: true,
    });
    res
      .status(200)
      .json({ success: true, message: "Updated successfully", updatedSubject });
  } catch (error) {
    res.status(500).json({ error: "Error updating subject" });
  }
};

export const deleteSubjects = async (req, res) => {
  const { id } = req.params;

  try {
    await attendance.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting subject" });
  }
};
