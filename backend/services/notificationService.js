// const admin = require('../config/firebase');
// const User = require('../models/userModel');

// async function sendClassNotification(enrollment) {
//   try {
//     const teacher = enrollment.teacher;
//     const student = enrollment.student;
//     const course = enrollment.course;

//     const tokens = [teacher.fcmToken, student.fcmToken].filter(Boolean);

//     if (tokens.length === 0) {
//       console.log(`No FCM tokens available for enrollment ${enrollment._id}`);
//       return;
//     }

//     // Format time nicely
//     const [hours, minutes] = enrollment.schedule.time.split(':');
//     const hour = parseInt(hours);
//     const ampm = hour >= 12 ? 'PM' : 'AM';
//     const displayHour = hour % 12 || 12;
//     const formattedTime = `${displayHour}:${minutes} ${ampm}`;

//     const message = {
//       notification: {
//         title: '🔔 Class Reminder',
//         body: `${course.name} class starts in 30 minutes at ${formattedTime}`,
//       },
//       data: {
//         enrollmentId: enrollment._id.toString(),
//         courseName: course.name,
//         time: enrollment.schedule.time,
//         teacherName: teacher.name,
//         studentName: student.name,
//         type: 'class_reminder'
//       },
//       tokens: tokens
//     };

//     const response = await admin.messaging().sendMulticast(message);
    
//     console.log(`✅ Sent notifications for ${course.name}:`);
//     console.log(`   - Success: ${response.successCount}`);
//     console.log(`   - Failure: ${response.failureCount}`);
//     console.log(`   - Teacher: ${teacher.name}`);
//     console.log(`   - Student: ${student.name}`);
    
//     // Handle failed tokens (optional - remove invalid tokens)
//     if (response.failureCount > 0) {
//       const failedTokens = [];
//       response.responses.forEach((resp, idx) => {
//         if (!resp.success) {
//           failedTokens.push(tokens[idx]);
//           console.error(`   - Failed token error: ${resp.error?.message}`);
//         }
//       });
      
//       // Remove invalid tokens from database
//       if (failedTokens.length > 0) {
//         await User.updateMany(
//           { fcmToken: { $in: failedTokens } },
//           { $unset: { fcmToken: "" } }
//         );
//       }
//     }
    
//     return response;
//   } catch (error) {
//     console.error('❌ Error sending notification:', error);
//     throw error;
//   }
// }

// module.exports = { sendClassNotification };


// const cron = require("node-cron");
// const mongoose = require("mongoose");
// const Enrollment = require("../models/enrollment");
// const User = require("../models/userModel");
// const admin = require("../config/firebase");

// // helper: convert day name to number
// const dayToNumber = {
//   Sunday: 0,
//   Monday: 1,
//   Tuesday: 2,
//   Wednesday: 3,
//   Thursday: 4,
//   Friday: 5,
//   Saturday: 6
// };

// cron.schedule("* * * * *", async () => {
//   try {
//     const now = new Date();
//     const currentDay = now.getDay(); // 0-6
//     const currentTime = now.getHours() * 60 + now.getMinutes();

//     // We want classes that start in exactly 15 minutes
//     const targetTime = currentTime + 15;

//     const enrollments = await Enrollment.find({})
//       .populate("student", "fcmToken name")
//       .populate("teacher", "fcmToken name")
//       .populate("course", "name");

//     for (const enrollment of enrollments) {

//       for (const day of enrollment.schedule.days) {

//         if (dayToNumber[day] === currentDay) {

//           const [hours, minutes] = enrollment.schedule.time.split(":").map(Number);
//           const classTime = hours * 60 + minutes;

//           console.log(`Class Time: ${classTime}, Target Time: ${targetTime}`)

//           if (classTime === targetTime) {

//             console.log("Sending Notification")

//             const messageTitle = `Upcoming ${enrollment.course.name} Class`;
//             const messageBody = `Your class starts in 15 minutes`;

//             const recipients = [enrollment.student, enrollment.teacher];

//             for (const user of recipients) {
//               if (user.fcmToken) {
//                 await admin.messaging().send({
//                   token: user.fcmToken,
//                   notification: {
//                     title: messageTitle,
//                     body: messageBody,
//                   },
//                 });
//               }
//             }
//           }
//         }
//       }
//     }

//   } catch (err) {
//     console.error("Error in notification cron:", err);
//   }
// });


// Backend: notificationService.js
const admin = require('../config/firebase');
const cron = require('node-cron');
const Enrollment = require('../models/enrollment');
const User = require('../models/userModel')


const messaging = admin.messaging();

// Run every minute to check for classes starting in 15 minutes
const startNotificationScheduler = () => {
  cron.schedule('* * * * *', async () => {
    try {
      await checkAndSendNotifications();
    } catch (error) {
      console.error('Notification scheduler error:', error);
    }
  });
};

const checkAndSendNotifications = async () => {
  const now = new Date();
  const currentDay = getDayName(now);
  const currentTime = formatTime(now);
  const notificationTime = getTimeMinutesBefore(currentTime, +15); // Time + 15 minutes
  
  // Find all enrollments for today
  const enrollments = await Enrollment.find({
    'schedule.days': currentDay
  })
    .populate('student')
    .populate('course')
    .lean()
    .exec();


  for (const enrollment of enrollments) {
    const classTime = enrollment.schedule.time; // "22:00"

    
    // Only send if current time equals 15 minutes before class
    if (notificationTime === classTime) {
      await sendNotificationToStudent(enrollment);
    }
  }
};

const sendNotificationToStudent = async (enrollment) => {
  try {
    const studentId = enrollment.student._id.toString();
    
    const student = await User.findById(enrollment.student._id);
    
    if (!student || !student.fcmToken) {
      return;
    }

    const fcmToken = student.fcmToken;

    const message = {
      notification: {
        title: `${enrollment.course.name} Starting Soon`,
        body: `Your class starts in 15 minutes at ${enrollment.schedule.time}`
      },
      data: {
        enrollmentId: enrollment._id.toString(),
        courseId: enrollment.course._id.toString(),
        type: 'class_reminder'
      },
      token: fcmToken
    };

    await messaging.send(message);
    
  } catch (error) {
    console.error('Error sending notification:', error);
  }
};

const getDayName = (date) => {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[date.getDay()];
};

const formatTime = (date) => {
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
};

const getTimeMinutesBefore = (time, minutesOffset) => {
  const [hours, mins] = time.split(':').map(Number);
  let resultHours = hours;
  let resultMins = mins + minutesOffset;

  if (resultMins < 0) {
    resultHours -= 1;
    resultMins += 60;
  } else if (resultMins >= 60) {
    resultHours += 1;
    resultMins -= 60;
  }

  if (resultHours < 0) resultHours = 23;
  if (resultHours > 23) resultHours = 0;

  return `${String(resultHours).padStart(2, '0')}:${String(resultMins).padStart(2, '0')}`;
};


module.exports = { startNotificationScheduler }