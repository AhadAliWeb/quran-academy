const { StatusCodes } = require("http-status-codes");
const Course = require("../models/course");
const asyncHandler = require("express-async-handler");
const NotFoundError = require("../errors/not-found");
const BadRequestError = require("../errors/bad-request");

// Add new course
const addNewCourse = asyncHandler(async (req, res) => {
  const { name, image, pdf } = req.body;

  const ifExists = await Course.findOne({ name });
  if (ifExists) throw new BadRequestError("Course with this name already exists");

  const course = await Course.create({ name, image, pdf });
  res
    .status(StatusCodes.CREATED)
    .json({ msg: `Course ${course.name} created successfully` });
});

// Edit course
const editCourse = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, image, pdf } = req.body;

  const course = await Course.findById(id);
  if (!course) throw new NotFoundError(`No course found with id: ${id}`);

  course.name = name || course.name;
  course.image = image || course.image;
  course.pdf = pdf || course.pdf;
  await course.save();

  res
    .status(StatusCodes.OK)
    .json({ msg: `Course ${course.name} updated successfully` });
});

// View single course
const viewCourse = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Add some course Fields here

  const reportFields = [
    {
      name: "portionsCovered",
      label: "Portions Covered (e.g., Tafseer of Surah Al-Fatiha & first 10 ayahs of Surah Baqarah)",
      type: "text",
      required: true,
      options: []
    },
    {
      name: "understandingOfKeyThemes",
      label: "Understanding of Key Themes",
      type: "text",
      required: true,
      options: []
    },
    {
      name: "applicationToDailyLife",
      label: "Application to Daily Life",
      type: "text",
      required: true,
      options: []
    },
    {
      name: "participationInDiscussion",
      label: "Participation in Discussion",
      type: "text",
      required: true,
      options: []
    },
    {
      name: "overallProgress",
      label: "Overall Progress",
      type: "text",
      required: false,
      options: []
    },
    {
      name: "comments",
      label: "Comments",
      type: "textarea",
      required: false,
      options: []
    }
  ];
  
  
  const course = await Course.findById(id);

  course.reportFields = reportFields
  await course.save()


  if (!course) throw new NotFoundError(`No course found with id: ${id}`);

  res.status(StatusCodes.OK).json({ course });
});

// Delete course
const deleteCourse = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const course = await Course.findById(id);
  if (!course) throw new NotFoundError(`No course found with id: ${id}`);

  await course.deleteOne();

  res
    .status(StatusCodes.OK)
    .json({ msg: `Course ${course.name} deleted successfully` });
});

// View all courses
const viewAllCourses = asyncHandler(async (req, res) => {
  const courses = await Course.find({});
  res.status(StatusCodes.OK).json({ courses, count: courses.length });
});


const searchCourses = asyncHandler(async (req, res) => {
  const { query } = req.query;

  const courses = await Course.find({
    name: { $regex: query, $options: "i" } // contains + case-insensitive
  });

  if (courses.length === 0) {
    throw new NotFoundError("Courses Not Found");
  }

  res
    .status(StatusCodes.OK)
    .json({ courses, msg: "Courses Found Successfully" });
});



module.exports = {
  addNewCourse,
  editCourse,
  viewCourse,
  deleteCourse,
  viewAllCourses,
  searchCourses,
};