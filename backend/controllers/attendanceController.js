const asyncHandler = require("express-async-handler")
const StatusCodes = require("http-status-codes");
const Attendance = require("../models/attendance");
const mongoose = require("mongoose")


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


module.exports = { addAttendance, getAttendanceSummary, getOverallAttendanceSummary }