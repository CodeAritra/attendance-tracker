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
    res.status(200).json(newAttendance);
  } catch (error) {
    res.status(500).json({ error: "Error in creating subjects" });
    console.log(error);
  }
};

export const updateSubjects = async (req, res) => {
  try {
    const { id } = req.params;
    const { totalClasses, attendedClasses } = req.body;

    const updateFields = {};
    if (attendedClasses) updateFields.attendedClasses = attendedClasses;
    if (totalClasses) updateFields.totalClasses = totalClasses;

    const updatedSubject = await attendance.findByIdAndUpdate(
      id,
      { $inc: updateFields },
      { new: true }
    );

    if (!updatedSubject) {
      return res.status(404).json({ error: "Subject not found" });
    }
    res.status(200).json(updatedSubject);
  } catch (error) {
    res.status(500).json({ error: "error in updating attendance" });
  }
};

export const deleteSubjects = () => {};
