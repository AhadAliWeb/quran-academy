const asyncHandler = require("express-async-handler")
const StatusCodes = require("http-status-codes")
const { NotFoundError } = require("../errors")
const Enrollment = require("../models/enrollment")
const Attendance = require("../models/attendance");

const AddEnrollment  = asyncHandler(async(req, res) => {

    const { student, teacher, course, days, duration, time} = req.body

    console.log(student, teacher, course, days, duration, time)

    const enrollment = await Enrollment.create({ student, teacher, course, schedule: { days, duration, time } })

    await enrollment.save()

    res.status(StatusCodes.OK).json({msg: "Enrollment Added Successfully"})

})


const AllEnrollments = asyncHandler(async(req, res) => {

    
    const enrollments = await Enrollment.find()

    res.status(StatusCodes.OK).json({enrollments})

})


// const AllEnrollmentsByToday = asyncHandler(async (req, res) => {

//   const teacherId = req.user._id;

//   // Get today's day name
//   const today = new Date();
//   const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
//   const todayName = dayNames[today.getDay()];

//   // const courses = await Enrollment.aggregate([
//   //   {
//   //     $match: {
//   //       "schedule.days": todayName,
//   //       teacher: new mongoose.Types.ObjectId(teacherId),
//   //     }
//   //   },
//   //   {
//   //     $lookup: { // populate course details
//   //       from: "courses",
//   //       localField: "course",
//   //       foreignField: "_id",
//   //       as: "courseDetails"
//   //     }
//   //   },
//   //   { $unwind: "$courseDetails" },
//   //   {
//   //     $group: {
//   //       _id: "$courseDetails._id",      // group by course ID
//   //       course: { $first: "$courseDetails" }, // take any course details
//   //       schedule: { $first: "$schedule" }    // take any schedule
//   //     }
//   //   },
//   //   {
//   //     $project: {
//   //       _id: 0,
//   //       course: 1,
//   //       schedule: 1
//   //     }
//   //   }
//   // ]);

//   const enrollments = await Enrollment.find({
//     teacher: teacherId,
//     "schedule.days": { $in: [todayName] }
//   })
//     .populate("course") // Gets all course fields
//     .populate({
//       path: "student",
//       select: "name email status" // Only select name and email from student
//     })
//     .exec();

//   if (!enrollments || enrollments.length === 0) {
//     return res.status(StatusCodes.NOT_FOUND).json({ message: "No courses scheduled for today for this teacher" });
//   }


//   res.status(StatusCodes.OK).json({ enrollments, message: "Today's courses fetched successfully" });
// });

const AllEnrollmentsByToday = asyncHandler(async (req, res) => {
  const teacherId = req.user._id;

  // Get today's day name
  const today = new Date();
  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const todayName = dayNames[today.getDay()];

  // Normalize date to midnight (so you can match Attendance by day)
  const startOfDay = new Date(today.setHours(0, 0, 0, 0));
  const endOfDay = new Date(today.setHours(23, 59, 59, 999));

  // Step 1: Fetch all enrollments for this teacher that are scheduled today
  const enrollments = await Enrollment.find({
    teacher: teacherId,
    "schedule.days": { $in: [todayName] }
  })
    .populate("course")
    .populate({
      path: "student",
      select: "name email status"
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

  const courses = await Enrollment.find({ student: studentId}).select("_id").populate("course")

  if(courses.length === 0) throw new NotFoundError("No Courses Found")

    res.status(StatusCodes.OK).json({msg: "Courses Founded Successfully", courses})
});

const getEnrollmentByTeacher = asyncHandler(async(req, res) => {


  const { teacherId } = req.params;
  const enrollments = await Enrollment.find({ teacher: teacherId }).select("-schedule").populate("course", "name").populate("student", "name status")

  if(enrollments.length === 0) throw new NotFoundError("Enrollments Not Found")

  res.status(StatusCodes.OK).json({msg: "Enrollments Found Successfully", enrollments})
});


const getReportFields = asyncHandler(async (req, res) => {

  const { id } = req.params;

  const enrollment = await Enrollment.findById(id).select("course").populate("course", "reportFields")

  if(!enrollment) throw new NotFoundError("Course Not Found")

  res.status(StatusCodes.OK).json({msg: "Fields received Successfully", course: enrollment.course})

})


module.exports = { AddEnrollment, AllEnrollments, addBulkEnrollments, AllEnrollmentsByToday, displayStudentEnrollments, getEnrollmentByTeacher, getReportFields }