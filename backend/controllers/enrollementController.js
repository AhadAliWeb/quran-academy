const asyncHandler = require("express-async-handler")
const StatusCodes = require("http-status-codes")
const { NotFoundError, BadRequestError } = require("../errors")
const Enrollment = require("../models/enrollment");
const Attendance = require("../models/attendance");
const Lesson = require("../models/Lesson");
const moment = require("moment-timezone");

const AddEnrollment  = asyncHandler(async(req, res) => {

    const { student, teacher, course, days, duration, time} = req.body

    const isEnrolled = await Enrollment.findOne({student, course});

    console.log(isEnrolled)

    if(isEnrolled) throw new BadRequestError("Student is Already Enrolled")

    const enrollment = await Enrollment.create({ student, teacher, course, schedule: { days, duration, time } })

    await enrollment.save()

    res.status(StatusCodes.OK).json({msg: "Enrollment Added Successfully"})

});

const getSingleEnrollment = asyncHandler(async(req,res) => {

  const { enrollmentId } = req.params

  const enrollment = await Enrollment.findById(enrollmentId).populate("student").populate("teacher").populate("course")

  if(!enrollment) throw new NotFoundError("No Enrollment Found")

  res.status(StatusCodes.OK).json({enrollment, msg: "Enrollment Found Successfully"})
});


const updateEnrollment = asyncHandler(async (req, res) => {

  const { schedule, meet } = req.body;

  const { enrollmentId } = req.params

  const enrollment = await Enrollment.findById(enrollmentId)

  if(!enrollment) throw new NotFoundError("Enrollment Not Found")

  
  enrollment.schedule = schedule;

  enrollment.meet = meet;

  await enrollment.save()

  res.status(StatusCodes.OK).json({msg: "Enrollment Updated Successfully"})

})


const updateEnrollmentLink = asyncHandler(async(req, res) => {

  const { enrollmentId, link } = req.body;


  const enrollment = await Enrollment.findById(enrollmentId)

  if(!enrollment) throw new NotFoundError("No Courses Found")

  const meet = {
    link,
    time: new Date()
  }

  enrollment.meet = meet;

  await enrollment.save();


  res.status(StatusCodes.OK).json({msg: "Link Updated Successfully"})

})


// const AllEnrollments = asyncHandler(async (req, res) => {
//   const { filter, page=1 } = req.query;

//   // Get current day in Pakistan timezone
//   const currentDay = moment().tz("Asia/Karachi").format("dddd"); // e.g. "Tuesday"

//   let query = {};

//   if (filter === "today") {
//     // Only find enrollments where today is included in schedule.days array
//     query = { "schedule.days": currentDay };
//   }

//   const skip = (page - 1) * 10;

//   const [enrollments, total] = await Promise.all([

//     Enrollment.find(query)
//     .populate("student", "name id")
//     .populate("course", "name")
//     .sort({ createdAt: -1 })
//     .skip(skip)
//     .limit(Number(10)),

//     Enrollment.countDocuments(query)
//   ])

//   const totalPages = Math.ceil(total / 10)


//   res.status(StatusCodes.OK).json({ enrollments, pagination: {total, totalPages, currentPage: Number(page), pageSize: Number(10)} });
// });

const AllEnrollments = asyncHandler(async (req, res) => {
  const { filter } = req.query;

  // Get current day in Pakistan timezone
  const currentDay = moment().tz("Asia/Karachi").format("dddd"); // e.g. "Tuesday"

  let query = {};

  if (filter === "today") {
    // Only find enrollments where today is included in schedule.days array
    query = { "schedule.days": currentDay };
  }

  const enrollments = await Enrollment.find(query)
    .populate("student", "name id")
    .populate("course", "name")
    .sort({ createdAt: -1 });

  res.status(StatusCodes.OK).json({ enrollments });
});

const AllEnrollmentsByToday = asyncHandler(async (req, res) => {
  const teacherId = req.user._id;

  // Get today's day name
  const now = moment().tz('Asia/Karachi');
  const today = now.format('dddd');

  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const todayName = dayNames[now.day()];

  // Normalize date to midnight (so you can match Attendance by day)
  const startOfDay = now.clone().startOf('day'); // 00:00:00
  const endOfDay = now.clone().endOf('day');

  // Step 1: Fetch all enrollments for this teacher that are scheduled today
  const enrollments = await Enrollment.find({
    teacher: teacherId,
    "schedule.days": { $in: [todayName] }
  })
    .populate("course")
    .populate({
      path: "student",
      select: "name id email status"
    })
    .exec();

  if (!enrollments || enrollments.length === 0) {
    return res.status(StatusCodes.NOT_FOUND).json({ message: "No courses scheduled for today" });
  }

  // Step 2: Fetch all Attendance docs for today by this teacher
  const todaysAttendance = await Attendance.find({
    teacher: teacherId,          // you could also just filter by enrollment + date
    date: { $gte: startOfDay, $lte: endOfDay }
  }).select("enrollment"); // only need enrollment IDs

  // Build a quick lookup Set of marked enrollment IDs
  const markedSet = new Set(todaysAttendance.map(a => a.enrollment.toString()));

  // Step 3: Attach a flag to each enrollment
  const result = enrollments.map(enrollment => {
    return {
      ...enrollment.toObject(),
      attendanceMarked: markedSet.has(enrollment._id.toString())
    };
  });

  // >>> If you want to completely exclude attended ones instead:
  // const result = enrollments.filter(enrollment => !markedSet.has(enrollment._id.toString()));

  res.status(StatusCodes.OK).json({
    enrollments: result,
    message: "Today's courses fetched successfully"
  });
});



const addBulkEnrollments = asyncHandler(async(req, res) => {

    const enrollments = [
        {
          "teacher": "68ca84854e6a6d62d1d0920a",
          "student": "68ca81f1141081960a2cd99d",
          "course": "68ca84ea4e6a6d62d1d0921b",
          "schedule": {
            "duration": 30,
            "days": ["Monday", "Wednesday", "Saturday"],
            "time": "15:00"
          }
        },
        {
          "teacher": "68ca84854e6a6d62d1d0920a",
          "student": "68ca81f1141081960a2cd99e",
          "course": "68ca84ea4e6a6d62d1d0921b",
          "schedule": {
            "duration": 30,
            "days": ["Monday", "Wednesday", "Saturday"],
            "time": "15:00"
          }
        },
        {
          "teacher": "68ca84854e6a6d62d1d0920a",
          "student": "68ca81f1141081960a2cd99f",
          "course": "68ca84ea4e6a6d62d1d0921b",
          "schedule": {
            "duration": 30,
            "days": ["Monday", "Wednesday", "Saturday"],
            "time": "15:00"
          }
        },
        {
          "teacher": "68ca84854e6a6d62d1d0920a",
          "student": "68ca81f1141081960a2cd9a0",
          "course": "68ca84ea4e6a6d62d1d0921b",
          "schedule": {
            "duration": 30,
            "days": ["Monday", "Wednesday", "Saturday"],
            "time": "15:00"
          }
        },
        {
          "teacher": "68ca84854e6a6d62d1d0920a",
          "student": "68ca81f1141081960a2cd9a1",
          "course": "68ca84ea4e6a6d62d1d0921b",
          "schedule": {
            "duration": 30,
            "days": ["Monday", "Wednesday", "Saturday"],
            "time": "15:00"
          }
        },
        {
          "teacher": "68ca84854e6a6d62d1d0920a",
          "student": "68ca81f1141081960a2cd9a2",
          "course": "68ca84ea4e6a6d62d1d0921b",
          "schedule": {
            "duration": 30,
            "days": ["Monday", "Wednesday", "Saturday"],
            "time": "15:00"
          }
        },
        {
          "teacher": "68ca84854e6a6d62d1d0920a",
          "student": "68ca81f1141081960a2cd9a3",
          "course": "68ca84ea4e6a6d62d1d0921b",
          "schedule": {
            "duration": 30,
            "days": ["Monday", "Wednesday", "Saturday"],
            "time": "15:00"
          }
        },
        {
          "teacher": "68ca84854e6a6d62d1d0920a",
          "student": "68ca81f1141081960a2cd9a4",
          "course": "68ca84ea4e6a6d62d1d0921b",
          "schedule": {
            "duration": 30,
            "days": ["Monday", "Wednesday", "Saturday"],
            "time": "15:00"
          }
        },
        {
          "teacher": "68ca84854e6a6d62d1d0920a",
          "student": "68ca81f1141081960a2cd9a5",
          "course": "68ca84ea4e6a6d62d1d0921b",
          "schedule": {
            "duration": 30,
            "days": ["Monday", "Wednesday", "Saturday"],
            "time": "15:00"
          }
        },
        {
          "teacher": "68ca84854e6a6d62d1d0920a",
          "student": "68ca81f1141081960a2cd9a6",
          "course": "68ca84ea4e6a6d62d1d0921b",
          "schedule": {
            "duration": 30,
            "days": ["Monday", "Wednesday", "Saturday"],
            "time": "15:00"
          }
        }
      ]

    const add = await Enrollment.insertMany(enrollments)

    res.status(StatusCodes.OK).json("Enrollments Added Successfully")

});


const displayStudentEnrollments = asyncHandler(async(req, res) => {

  const { studentId } = req.params;

  const courses = await Enrollment.find({ student: studentId}).select("_id meet").populate("course")

  if(courses.length === 0) throw new NotFoundError("No Courses Found")

    res.status(StatusCodes.OK).json({msg: "Courses Founded Successfully", courses})
});

const getEnrollmentByTeacher = asyncHandler(async(req, res) => {


  const { teacherId } = req.params;
  const enrollments = await Enrollment.find({ teacher: teacherId }).select("-schedule").populate("course", "name").populate("student", "name id status")

  if(enrollments.length === 0) throw new NotFoundError("Enrollments Not Found")

  res.status(StatusCodes.OK).json({msg: "Enrollments Found Successfully", enrollments})
});


const getReportFields = asyncHandler(async (req, res) => {

  const { id } = req.params;

  const enrollment = await Enrollment.findById(id).select("course").populate("course", "reportFields")

  if(!enrollment) throw new NotFoundError("Course Not Found")

  res.status(StatusCodes.OK).json({msg: "Fields received Successfully", course: enrollment.course})

})

const deleteEnrollment = asyncHandler(async (req,res) => {

  const { enrollmentId } = req.params;

  const enrollment = await Enrollment.findById(enrollmentId)

  if(!enrollment) {
    throw new NotFoundError("Enrollment Not Found")
  } 

  await Lesson.deleteMany({enrollment: enrollmentId})

  await Attendance.deleteMany({enrollment: enrollmentId})


  await enrollment.deleteOne()

  res.status(StatusCodes.OK).json({msg: "Enrollment Deleted Successfully"})

})


module.exports = { AddEnrollment, getSingleEnrollment, AllEnrollments, updateEnrollmentLink, updateEnrollment,  addBulkEnrollments, AllEnrollmentsByToday, displayStudentEnrollments, getEnrollmentByTeacher, getReportFields, deleteEnrollment }