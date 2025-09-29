const express = require("express");
const router = express.Router();
const {
  createStudent,
  getAllStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
  addNewStudent,
  searchStudents,
} = require("../controllers/studentController");

// Create new student
router.post("/", createStudent);

// Get all students
router.get("/", getAllStudents);


// Add New Student
router.post("/add", addNewStudent)

router.get("/search", searchStudents)

// Get single student
router.get("/:id", getStudentById);

// Update student
router.put("/:id", updateStudent);

// Delete student
router.delete("/:id", deleteStudent);


module.exports = router;