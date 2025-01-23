import mongoose from "mongoose";

const AttendanceSchema = new mongoose.Schema({
  subject: { type: String, required: true },
  totalClasses: { type: Number, required: true },
  attendedClasses: { type: Number, required: true },
});

export default mongoose.model('Attendance', AttendanceSchema);
