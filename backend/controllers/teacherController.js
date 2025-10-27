const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const StatusCodes = require("http-status-codes");
const { NotFoundError, BadRequestError } = require("../errors");
const Counter = require("../models/counter")



const addNewTeacher = asyncHandler(async (req, res) => {

  const { name, email, password, salary, role, age, gender } = req.body;


  const teacherExists = await User.findOne({ email });

  if (teacherExists) throw new BadRequestError("Teacher Already Exists")

  const teacher = await User.create({name, email, password, salary, age, gender, role, isApproved: true })

  res.status(StatusCodes.OK).json({msg: "Teacher Added Successfully", teacher});

})


// @desc Get all teachers
const getAllTeachers = asyncHandler(async (req, res) => {
  
  const teachers = await User.find({ role: "teacher" }).select("-password")

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
  const { name, email, salary, password, age, gender } = req.body;

  const teacher = await User.findOne({ _id: id, role: "teacher" });
  if (!teacher) {
    throw new NotFoundError(`No teacher found with id: ${id}`);
  }

  // Update fields dynamically
  if (name) teacher.name = name;
  if (email) teacher.email = email;
  if (salary) teacher.salary = salary;
  if (age) teacher.age = age;
  if (gender) teacher.gender = gender;

  // Only update password if it's provided
  if (password) {
    teacher.password = password; // relies on pre-save middleware to hash
  }

  await teacher.save();

  res.status(StatusCodes.OK).json({
    msg: "Teacher updated successfully",
    teacher,
  });
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
