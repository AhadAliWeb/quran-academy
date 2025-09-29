const mongoose = require("mongoose")


const attendanceSchema = mongoose.Schema(
{
    enrollment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Enrollment", // ties back to student+teacher+course+schedule
    required: true,
    },
    student: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true,
    },
    course: {
        type: mongoose.Types.ObjectId,
        ref: "Course",
        required: true,
    },
    teacher: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true
    },
    date: {
    type: Date, // exact session date, e.g. 2025-09-16
    required: true,
    },
    status: {
    type: String,
    enum: ["Online", "Offline", "Late", "Excused"],
    default: "Offline",
    },
    // updatedBy: {
    // type: mongoose.Schema.Types.ObjectId,
    // ref: "User", // usually the teacher marking it
    // required: true,
    // },
},
{ timestamps: true }
);


module.exports = mongoose.model("Attandance", attendanceSchema)