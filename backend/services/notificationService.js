const admin = require('../config/firebase');
const User = require('../models/userModel');

async function sendClassNotification(enrollment) {
  try {
    const teacher = enrollment.teacher;
    const student = enrollment.student;
    const course = enrollment.course;

    const tokens = [teacher.fcmToken, student.fcmToken].filter(Boolean);

    if (tokens.length === 0) {
      console.log(`No FCM tokens available for enrollment ${enrollment._id}`);
      return;
    }

    // Format time nicely
    const [hours, minutes] = enrollment.schedule.time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    const formattedTime = `${displayHour}:${minutes} ${ampm}`;

    const message = {
      notification: {
        title: '🔔 Class Reminder',
        body: `${course.name} class starts in 30 minutes at ${formattedTime}`,
      },
      data: {
        enrollmentId: enrollment._id.toString(),
        courseName: course.name,
        time: enrollment.schedule.time,
        teacherName: teacher.name,
        studentName: student.name,
        type: 'class_reminder'
      },
      tokens: tokens
    };

    const response = await admin.messaging().sendMulticast(message);
    
    console.log(`✅ Sent notifications for ${course.name}:`);
    console.log(`   - Success: ${response.successCount}`);
    console.log(`   - Failure: ${response.failureCount}`);
    console.log(`   - Teacher: ${teacher.name}`);
    console.log(`   - Student: ${student.name}`);
    
    // Handle failed tokens (optional - remove invalid tokens)
    if (response.failureCount > 0) {
      const failedTokens = [];
      response.responses.forEach((resp, idx) => {
        if (!resp.success) {
          failedTokens.push(tokens[idx]);
          console.error(`   - Failed token error: ${resp.error?.message}`);
        }
      });
      
      // Remove invalid tokens from database
      if (failedTokens.length > 0) {
        await User.updateMany(
          { fcmToken: { $in: failedTokens } },
          { $unset: { fcmToken: "" } }
        );
      }
    }
    
    return response;
  } catch (error) {
    console.error('❌ Error sending notification:', error);
    throw error;
  }
}

module.exports = { sendClassNotification };