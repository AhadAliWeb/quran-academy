const express = require("express");
const router = express.Router();
const {
  getAllTeachers,
  getSingleTeacher,
  updateTeacher,
  deleteTeacher,
  searchTeachers,
  addNewTeacher,
} = require("../controllers/teacherController");
const { protect, authorizePermissions } = require("../middleware/authMiddleware");

// GET all teachers
router.get("/", getAllTeachers);


router.post("/", protect, authorizePermissions("admin"), addNewTeacher)


// GET search teachers
router.get("/search", searchTeachers);

// GET single teacher by ID
router.get("/:id", getSingleTeacher);

// PUT update teacher
router.put("/:id", updateTeacher);

// DELETE teacher
router.delete("/:id", deleteTeacher);


module.exports = router;