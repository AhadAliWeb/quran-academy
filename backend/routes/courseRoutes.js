const express = require("express");
const router = express.Router();

const {
  addNewCourse,
  editCourse,
  viewCourse,
  deleteCourse,
  viewAllCourses,
  searchCourses,
} = require("../controllers/courseController");

// Create a new course
router.post("/", addNewCourse);

// Get all courses
router.get("/", viewAllCourses);

router.get("/search", searchCourses)

// Get a single course by id
router.get("/:id", viewCourse);

// Update a course by id
router.put("/:id", editCourse);

// Delete a course by id
router.delete("/:id", deleteCourse);


module.exports = router;