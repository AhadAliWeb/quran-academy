const mongoose = require("mongoose");

const lessonSchema = new mongoose.Schema(
  {
    enrollment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Enrollment",
      required: true,
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    // Lesson details
    chapterNumber: { type: Number, required: false },
    pageNumber: { type: Number, required: false },
    ayahLineNumber: { type: Number, required: false },
    memorizationLessonNumber: { type: Number, required: false },

    // Resource files (like images of pages/notes)
    imageUrls: [{ type: String }],

    // Metadata
    status: {
      type: String,
      enum: ["scheduled", "completed", "cancelled"],
      default: "scheduled",
    },
    date: { type: Date, default: Date.now },
    notes: { type: String }, // optional teacher notes
  },
  { timestamps: true }
);

module.exports =  mongoose.model("Lesson", lessonSchema);
