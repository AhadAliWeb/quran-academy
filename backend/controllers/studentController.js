const { StatusCodes } = require("http-status-codes");
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const StudentProfile = require("../models/studentProfile");
const NotFoundError = require("../errors/not-found");
const BadRequestError = require("../errors/bad-request");

// Create a new student
const createStudent = asyncHandler(async (req, res) => {
  const { studentName, email, password, fees, phoneNumber, country, gender, age } = req.body;

  console.log(req.body)

  const exists = await User.findOne({ email });
  if (exists) throw new BadRequestError("Student with this email already exists");

  // create user
  const user = await User.create({
    name: studentName,
    email,
    password,
    role: "student",
    isApproved: true,
    fees,
    phoneNumber,
    gender,
    country,
    age,
  });

  await user.save()

  res
    .status(StatusCodes.CREATED)
    .json({ msg: "Student created successfully", user });
});

// Get all students with pagination
const getAllStudents = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  const search = req.query.search || '';
  const status = req.query.status || '';
  
  // Build query
  let query = { role: "student" };
  
  // Add search functionality
  if (search) {
      query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } }
      ];
  }
  
  // Add status filter
  if (status && status !== 'All') {
      query.status = status;
  }

  const [students, total] = await Promise.all([
      User.find(query).select("-password").skip(skip).limit(limit),
      User.countDocuments(query),
  ]);

  res.status(StatusCodes.OK).json({
      page,
      totalPages: Math.ceil(total / limit),
      totalStudents: total,
      count: students.length,
      students,
  });
});

// Get single student
const getStudentById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const student = await User.findOne({ _id: id, role: "student" }).select(
    "-password"
  );

  if (!student) throw new NotFoundError(`No student found with id: ${id}`);

  const profile = await StudentProfile.findOne({ user: id });
  res.status(StatusCodes.OK).json({ student, profile });
});

// Update student
const updateStudent = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, email, password, fees, age, phoneNumber, country, gender, status } = req.body;

  const student = await User.findOne({ _id: id, role: "student" });
  if (!student) {
    throw new NotFoundError(`No student found with id: ${id}`);
  }

  // Update fields dynamically
  if (name) student.name = name;
  if (email) student.email = email;
  if (fees) student.fees = fees;
  if (age) student.age = age;
  if (phoneNumber) student.phoneNumber = phoneNumber;
  if (country) student.country = country;
  if (gender) student.gender = gender;
  if (status) student.status = status;

  // Only update password if it's provided
  if (password) {
    student.password = password; // will trigger hashing if pre-save middleware exists
  }

  await student.save();

  res.status(StatusCodes.OK).json({
    msg: "Student updated successfully",
    student,
  });
});

// Delete student
const deleteStudent = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const student = await User.findOne({ _id: id, role: "student" });
  if (!student) throw new NotFoundError(`No student found with id: ${id}`);

  await StudentProfile.deleteOne({ user: id });
  await student.deleteOne();

  res.status(StatusCodes.OK).json({ msg: "Student deleted successfully" });
});

const addNewStudent = asyncHandler(async (req, res) => {

  const { name, email, password } = req.body;

  const isStudent = await User.findOne({ email })

  console.log(isStudent)

  if(isStudent) throw new BadRequestError("Student with this email already exists")

  const student = await User.create(
    {
      name,
      email,
      password,
      role: "student",
      isApproved: true
    }
  )

  await student.save()

  res.status(StatusCodes.OK).json({msg: "Student Created Successfully"})

})

const searchStudents = asyncHandler(async (req, res) => {
  const { query } = req.query; // single query param

  let searchCondition = { role: "student" };

  if (query) {
    searchCondition.$or = [
      { name: { $regex: query, $options: "i" } },
      { email: { $regex: query, $options: "i" } },
    ];
  }

  const students = await User.find(searchCondition).select("-password -role");

  res.status(StatusCodes.OK).json({
    count: students.length,
    students,
  });
});


module.exports = {
  createStudent,
  getAllStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
  addNewStudent,
  searchStudents
};