// const cron = require('node-cron');
// const Enrollment = require('../models/enrollment');
// const { sendClassNotification } = require('../services/notificationService');

// // Run every minute to check for upcoming classes
// function startNotificationJob() {
//   cron.schedule('* * * * *', async () => {
//     try {
//       const now = new Date();
//       const notificationWindow = new Date(now.getTime() + 30 * 60000); // 30 minutes ahead

//       console.log("Job")

//       // Find classes scheduled in the next 30 minutes that haven't been notified
//       const upcomingClasses = await Enrollment.find({
//         schedule: {
//           $gte: now,
//           $lte: notificationWindow
//         },
//         notificationSent: false,
//       });

//       for (const classInfo of upcomingClasses) {
//         console.log(classInfo)
//         await sendClassNotification(classInfo);
//       }
      
//       if (upcomingClasses.length > 0) {
//         console.log(`Processed ${upcomingClasses.length} class notifications`);
//       }
//     } catch (error) {
//       console.error('Error in notification job:', error);
//     }
//   });
// }

// module.exports = { startNotificationJob };

const cron = require('node-cron');
const Enrollment = require('../models/enrollment');
const { sendClassNotification } = require('../services/notificationService');

function startNotificationJob() {
  // Runs every minute
  cron.schedule('* * * * *', async () => {
    try {
      const now = new Date();
      const currentDay = now.toLocaleString("en-US", { weekday: "long" }); // e.g. "Monday"
      const currentMinutes = now.getHours() * 60 + now.getMinutes(); // minutes since midnight
      const windowMinutes = currentMinutes + 30; // 30-minute lookahead

      console.log("Notification job running...");

      // Get all enrollments for today's classes where notification hasn't been sent
      const todayEnrollments = await Enrollment.find({
        "schedule.days": currentDay,
        "schedule.notificationSend": false
      });

      const classesToNotify = todayEnrollments.filter(enrollment => {
        const [hour, minute] = enrollment.schedule.time.split(':').map(Number);
        const classMinutes = hour * 60 + minute;
        return classMinutes >= currentMinutes && classMinutes <= windowMinutes;
      });

      for (const classInfo of classesToNotify) {
        await sendClassNotification(classInfo);

        // Mark notification as sent to avoid duplicates
        await Enrollment.updateOne(
          { _id: classInfo._id },
          {
            $set: {
              "schedule.notificationSend": true,
              "schedule.lastNotificationSent": new Date()
            }
          }
        );

        console.log(`Notification sent for class: ${classInfo._id}`);
      }

      if (classesToNotify.length > 0) {
        console.log(`Processed ${classesToNotify.length} upcoming class notifications`);
      }

    } catch (error) {
      console.error('Error in notification job:', error);
    }
  });
}

module.exports = { startNotificationJob };
