// models/Report.js
const mongoose = require("mongoose")

const reportSchema = new mongoose.Schema({
  enrollment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Enrollment",
    required: true
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // or your Student model
    required: true
  },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true,
  },
  month: { type: String, required: true }, // e.g. "2025-10"
  type: {
    type: String,
    enum: ["progress", "evaluation"]
  },
  data: {
    type: Map,
    of: mongoose.Schema.Types.Mixed // flexible: can be string, number, etc.
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Report', reportSchema);
