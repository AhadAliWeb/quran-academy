const mongoose = require("mongoose")

const TeacherProfileSchema = new mongoose.Schema({
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true
    },
    subjects: [String],
    salaryHistory: [
      {
        amount: Number,
        date: Date,
        status: { type: String, enum: ["paid", "pending"], default: "pending" }
      }
    ]
  }, { timestamps: true });
  
  const TeacherProfile = mongoose.model("TeacherProfile", TeacherProfileSchema);


module.exports = TeacherProfile