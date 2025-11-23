const asyncHandler = require("express-async-handler")
const StatusCodes = require("http-status-codes");
const Attendance = require("../models/attendance");
const Enrollment = require('../models/enrollment')
const { NotFoundError } = require('../errors')
const mongoose = require("mongoose");


const addAttendance = asyncHandler(async(req, res) => {

    const { courseId, enrollmentId, studentId, status } = req.body;

    const attendance = await Attendance.create({course: courseId, enrollment: enrollmentId, teacher: req.user._id, student: studentId, status, date: Date.now()})


    res.status(StatusCodes.OK).json({msg: "Attendance Recorded Successfully"});

})


const getAttendanceSummary = asyncHandler(async (req, res) => {
  const studentId = req.user._id;

  const summary = await Attendance.aggregate([
    {
      $match: {
        student: new mongoose.Types.ObjectId(studentId),
      },
    },
    {
      $group: {
        _id: {
          enrollment: "$enrollment",
          course: "$course",
        },
        onlineCount: {
          $sum: { $cond: [{ $eq: ["$status", "Online"] }, 1, 0] },
        },
        offlineCount: {
          $sum: { $cond: [{ $eq: ["$status", "Offline"] }, 1, 0] },
        },
        lateCount: {
          $sum: { $cond: [{ $eq: ["$status", "Late"] }, 1, 0] },
        },
        excusedCount: {
          $sum: { $cond: [{ $eq: ["$status", "Excused"] }, 1, 0] },
        },
      },
    },
    {
      $lookup: {
        from: "courses", // collection name in Mongo
        localField: "_id.course",
        foreignField: "_id",
        as: "course",
      },
    },
    { $unwind: "$course" },
  ]);

  res.status(StatusCodes.OK).json({
    success: true,
    data: summary,
  });
});


const getOverallAttendanceSummary = asyncHandler(async (req, res) => {
  const {studentId} = req.params;

  const summary = await Attendance.aggregate([
    {
      $match: {
        student: new mongoose.Types.ObjectId(studentId),
      },
    },
    {
      $group: {
        _id: null, // single bucket for all attendances of this student
        onlineCount: {
          $sum: { $cond: [{ $eq: ["$status", "Online"] }, 1, 0] },
        },
        offlineCount: {
          $sum: { $cond: [{ $eq: ["$status", "Offline"] }, 1, 0] },
        },
        lateCount: {
          $sum: { $cond: [{ $eq: ["$status", "Late"] }, 1, 0] },
        },
        excusedCount: {
          $sum: { $cond: [{ $eq: ["$status", "Excused"] }, 1, 0] },
        },
      },
    },
  ]);

  const result = summary[0] || {
    onlineCount: 0,
    offlineCount: 0,
    lateCount: 0,
    excusedCount: 0,
  };

  res.status(StatusCodes.OK).json({
    success: true,
    summary: result,
  });
});

const getAttendanceDetails = asyncHandler(async (req, res) => {
  const { enrollmentId } = req.params;
  const { startDate, endDate, page = 1, limit = 10 } = req.query;

  // Fetch enrollment first
  const enrollment = await Enrollment.findById(enrollmentId);

  if (!enrollment) {
    throw new NotFoundError("Enrollment not found");
  }

  // Check role and ownership
  const user = req.user; // from auth middleware

  const isStudentOwner =
    user.role === "student" &&
    enrollment.student._id.toString() === user._id.toString();

  const isTeacherOwner =
    user.role === "teacher" &&
    enrollment.teacher._id.toString() === user._id.toString();

  const isAdmin = user.role === "admin";

  if (!isStudentOwner && !isTeacherOwner && !isAdmin) {
    return res
      .status(StatusCodes.FORBIDDEN)
      .json({ message: "Not authorized to view this attendance" });
  }

  // Query attendances
  let query = { enrollment: enrollmentId };

  if (startDate && endDate) {
    query.date = {
      $gte: new Date(startDate),
      $lte: new Date(endDate),
    };
  }

  // Calculate pagination
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const skip = (pageNum - 1) * limitNum;

  // Get total count for pagination metadata
  const totalAttendances = await Attendance.countDocuments(query);
  const totalPages = Math.ceil(totalAttendances / limitNum);

  // Fetch paginated attendances
  const attendances = await Attendance.find(query)
    .sort({ date: -1 })
    .select("date status")
    .skip(skip)
    .limit(limitNum);

  if (!attendances.length && pageNum === 1) {
    throw new NotFoundError("No attendances found");
  }

  res.status(StatusCodes.OK).json({
    attendances,
    pagination: {
      currentPage: pageNum,
      totalPages,
      totalRecords: totalAttendances,
      recordsPerPage: limitNum,
      hasNextPage: pageNum < totalPages,
      hasPrevPage: pageNum > 1,
    },
    msg: "Attendance found successfully",
  });
});


module.exports = { addAttendance, getAttendanceSummary, getOverallAttendanceSummary, getAttendanceDetails }