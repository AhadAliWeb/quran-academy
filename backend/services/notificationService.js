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


const cron = require("node-cron");
const mongoose = require("mongoose");
const Enrollment = require("../models/enrollment");
const User = require("../models/userModel");
const admin = require("../config/firebase");

// helper: convert day name to number
const dayToNumber = {
  Sunday: 0,
  Monday: 1,
  Tuesday: 2,
  Wednesday: 3,
  Thursday: 4,
  Friday: 5,
  Saturday: 6
};

cron.schedule("* * * * *", async () => {
  try {
    const now = new Date();
    const currentDay = now.getDay(); // 0-6
    const currentTime = now.getHours() * 60 + now.getMinutes();

    // We want classes that start in exactly 15 minutes
    const targetTime = currentTime + 15;

    const enrollments = await Enrollment.find({})
      .populate("student", "fcmToken name")
      .populate("teacher", "fcmToken name")
      .populate("course", "name");

    for (const enrollment of enrollments) {

      console.log("Enrollment", currentTime)

      for (const day of enrollment.schedule.days) {

        console.log(dayToNumber[day], currentDay)

        if (dayToNumber[day] === currentDay) {

          

          const [hours, minutes] = enrollment.schedule.time.split(":").map(Number);
          const classTime = hours * 60 + minutes;

          if (classTime === targetTime) {
            const messageTitle = `Upcoming ${enrollment.course.name} Class`;
            const messageBody = `Your class starts in 15 minutes`;

            const recipients = [enrollment.student, enrollment.teacher];

            for (const user of recipients) {
              if (user.fcmToken) {
                await admin.messaging().send({
                  token: user.fcmToken,
                  notification: {
                    title: messageTitle,
                    body: messageBody,
                  },
                });
              }
            }
          }
        }
      }
    }

  } catch (err) {
    console.error("Error in notification cron:", err);
  }
});


