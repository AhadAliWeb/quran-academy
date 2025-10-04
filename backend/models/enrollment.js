const mongoose = require("mongoose");

const enrollmentSchema = mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",   // must be role: "student"
      required: true,
    },
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",   // must be role: "teacher"
      required: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    schedule: {
        days: {
          type: [String], // ["Monday", "Tuesday"]
          required: true,
        },
        time: {
          type: String,  // "09:00" or "14:30"
          required: true,
        },
        duration: {
          type: Number,
          required: true,
        },
        notificationSend: {
          type: Boolean,
          default: false
        },
        lastNotificationSent: {
          type: Date  // ADD THIS - tracks last notification date
        }
    }
},
  { timestamps: true }
);

module.exports =  mongoose.model("Enrollment", enrollmentSchema);
