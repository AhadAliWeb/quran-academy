const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const StatusCodes = require("http-status-codes");
const { NotFoundError, BadRequestError } = require("../errors");



const addNewTeacher = asyncHandler(async (req, res) => {

  const { name, email, password, salary, role } = req.body;


  const teacherExists = await User.findOne({ email });

  if (teacherExists) throw new BadRequestError("Teacher Already Exists")

  const teacher = await User.create({name, email, password, salary, role })

  res.status(StatusCodes.OK).json({msg: "Teacher Added Successfully", teacher});

})


// @desc Get all teachers
const getAllTeachers = asyncHandler(async (req, res) => {
  const teachers = await User.find({ role: "teacher" });

  if (teachers.length === 0) throw new NotFoundError("No Teachers Found");

  res.status(StatusCodes.OK).json({ teachers, msg: "Teachers Found Successfully" });
});


// @desc Get single teacher by ID
const getSingleTeacher = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const teacher = await User.findOne({ _id: id, role: "teacher" }).select('-password')
  if (!teacher) throw new NotFoundError(`No Teacher Found with id: ${id}`);

  res.status(StatusCodes.OK).json({ teacher, msg: "Teacher Found Successfully" });
});


// @desc Update teacher by ID
const updateTeacher = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, email, salary } = req.body; // salary is optional if you extend model

  if (!name && !email && !salary) throw new BadRequestError("Please provide data to update");

  const teacher = await User.findOneAndUpdate(
    { _id: id, role: "teacher" },
    { name, email, salary },
    { new: true, runValidators: true }
  );

  if (!teacher) throw new NotFoundError(`No Teacher Found with id: ${id}`);

  res.status(StatusCodes.OK).json({ teacher, msg: "Teacher Updated Successfully" });
});


// @desc Delete teacher by ID
const deleteTeacher = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const teacher = await User.findOneAndDelete({ _id: id, role: "teacher" });
  if (!teacher) throw new NotFoundError(`No Teacher Found with id: ${id}`);

  res.status(StatusCodes.OK).json({ msg: "Teacher Deleted Successfully" });
});


// @desc Search teachers by name or email
const searchTeachers = asyncHandler(async (req, res) => {
  const { query } = req.query;    

  console.log(query)

  if (!query) throw new BadRequestError("Please provide search query");

  const teachers = await User.find({
    role: "teacher",
    $or: [
      { name: { $regex: query, $options: "i" } },
      { email: { $regex: query, $options: "i" } },
    ],
  });

  if (teachers.length === 0) throw new NotFoundError("No Matching Teachers Found");

  res.status(StatusCodes.OK).json({ teachers, msg: "Teachers Found Successfully" });
});


module.exports = {
  addNewTeacher, 
  getAllTeachers,
  getSingleTeacher,
  updateTeacher,
  deleteTeacher,
  searchTeachers,
};
