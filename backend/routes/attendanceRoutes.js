const express = require("express")
const router = express.Router()
const { protect, authorizePermissions } = require("../middleware/authMiddleware")
const { addAttendance, getAttendanceSummary, getOverallAttendanceSummary, getAttendanceDetails } = require("../controllers/attendanceController")

router.post('/add', protect, authorizePermissions("teacher"), addAttendance)

router.get('/details/:enrollmentId', protect, authorizePermissions("student", "admin"), getAttendanceDetails);

router.get('/overall-summary/:studentId', protect, getOverallAttendanceSummary)

router.get('/course-attendance-summary', protect, getAttendanceSummary)


module.exports = router;