// Backend: notificationService.js
const admin = require('../config/firebase');
const cron = require('node-cron');
const Enrollment = require('../models/enrollment');
const User = require('../models/userModel')
const moment = require("moment-timezone")


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
  const now = moment().tz('Asia/Karachi');;
  const currentDay = now.format('dddd');
  const currentTime = now.format('HH:mm');
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

    console.log(notificationTime, classTime)
    console.log(enrollment.student.name)
    
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

    console.log("Sending Notification to", student.name)

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