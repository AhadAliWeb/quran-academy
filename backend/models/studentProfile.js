const mongoose = require("mongoose")

const StudentProfileSchema = mongoose.Schema({
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true
    },
    enrollmentNumber: {
      type: String,
      unique: true
    },
    feeHistory: [
      {
        amount: Number,
        date: Date,
        status: { type: String, enum: ["paid", "pending"], default: "pending" }
      }
    ],
    courses: [String] // or references to a Course collection
  }, { timestamps: true });
  
const StudentProfile = mongoose.model("StudentProfile", StudentProfileSchema);

module.exports = StudentProfile;