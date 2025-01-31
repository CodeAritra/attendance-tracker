import attendance from "../models/attendance.js";

export const allSubjects = async (req, res) => {
  try {
    const userid = req.user.id;
    const allAttendance = await attendance.find({ user: userid });
    res.status(200).json(allAttendance);
  } catch (error) {
    res.status(500).json({ error: "Error in getting all subjects" });
  }
};

export const createSubjects = async (req, res) => {
  try {
    const { subject, totalClasses, attendedClasses } = req.body;

    const userId = req.user.id;
    const newAttendance = new attendance({
      subject,
      totalClasses,
      attendedClasses,
      user: userId,
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

// export const updateSubjects = async (req, res) => {
//   const { id } = req.params;
//   const { subject, attendedClasses, totalClasses } = req.body;

//   const newSubject = {};
//   if (subject) newSubject.subject = subject;
//   if (attendedClasses) newSubject.attendedClasses = attendedClasses;
//   if (totalClasses) newSubject.totalClasses = totalClasses;

//   try {
//     const updatedSubject = await attendance.findByIdAndUpdate(id, newSubject, {
//       new: true,
//     });
//     res
//       .status(200)
//       .json({ success: true, message: "Updated successfully", updatedSubject });
//   } catch (error) {
//     res.status(500).json({ error: "Error updating subject" });
//   }
// };

export const updateSubjects = async (req, res) => {
  const { id } = req.params;
  const { subject, attendedClasses, totalClasses } = req.body;
  const { user } = req; // User info from the token

  const newSubject = {};
  if (subject) newSubject.subject = subject;
  if (attendedClasses) newSubject.attendedClasses = attendedClasses;
  if (totalClasses) newSubject.totalClasses = totalClasses;

  try {
    // Optionally, check if the logged-in user has permission to edit this subject
    const existingSubject = await attendance.findById(id);

    if (!existingSubject) {
      return res.status(404).json({ error: "Subject not found" });
    }

    // Example: Check if the logged-in user is the one who created the subject
    if (existingSubject.user.toString() !== user._id.toString()) {
      return res
        .status(403)
        .json({ error: "Not authorized to update this subject" });
    }

    const updatedSubject = await attendance.findByIdAndUpdate(id, newSubject, {
      new: true,
    });

    res.status(200).json({
      success: true,
      message: "Updated successfully",
      updatedSubject,
    });
  } catch (error) {
    res.status(500).json({ error: "Error updating subject" });
  }
};

// export const deleteSubjects = async (req, res) => {
//   const { id } = req.params;

//   try {
//     await attendance.findByIdAndDelete(id);
//     res.status(200).json({ success: true, message: "Deleted successfully" });
//   } catch (error) {
//     res.status(500).json({ error: "Error deleting subject" });
//   }
// };


export const deleteSubjects = async (req, res) => {
  const { id } = req.params;
  const { user } = req; // Extract user info from the token

  try {
    // Check if the subject exists
    const subject = await attendance.findById(id);
    
    if (!subject) {
      return res.status(404).json({ error: "Subject not found" });
    }

    // Optionally, check if the logged-in user is the one who created the subject
    //  Uncomment and modify this if you store user info in your subject
     if (subject.user.toString() !== user._id.toString()) {
       return res.status(403).json({ error: "Not authorized to delete this subject" });
     }

    // Delete the subject
    await attendance.findByIdAndDelete(id);
    
    res.status(200).json({ success: true, message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting subject" });
  }
};
