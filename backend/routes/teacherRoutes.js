const express = require("express");
const router = express.Router();
const {
  getAllTeachers,
  getSingleTeacher,
  updateTeacher,
  deleteTeacher,
  searchTeachers,
} = require("../controllers/teacherController");

// GET all teachers
router.get("/", getAllTeachers);

// GET search teachers
router.get("/search", searchTeachers);

// GET single teacher by ID
router.get("/:id", getSingleTeacher);

// PUT update teacher
router.put("/:id", updateTeacher);

// DELETE teacher
router.delete("/:id", deleteTeacher);


module.exports = router;