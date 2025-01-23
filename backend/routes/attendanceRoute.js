import express from "express";
import { allSubjects, createSubjects, deleteSubjects, updateSubjects } from "../controllers/attendanceController.js";

const router = express.Router()

router.get("/",allSubjects);
router.post("/",createSubjects);
router.put("/:id",updateSubjects);
router.delete("/:id",deleteSubjects);

export default router