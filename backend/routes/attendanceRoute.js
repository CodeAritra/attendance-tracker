import express from "express";
import { allSubjects, createSubjects, deleteSubjects, updateSubjects } from "../controllers/attendanceController.js";
import {protect} from "../utils/jwtUtils.js"

const router = express.Router()

router.get("/",protect,allSubjects);
router.post("/",protect,createSubjects);
router.put("/:id",protect,updateSubjects);
router.delete("/:id",protect,deleteSubjects);

export default router