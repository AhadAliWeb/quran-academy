const express = require("express")
const { AddEnrollment, AllEnrollments, addBulkEnrollments, AllEnrollmentsByToday, displayStudentEnrollments, getEnrollmentByTeacher, getReportFields, updateEnrollmentLink, getSingleEnrollment, updateEnrollment } = require("../controllers/enrollementController")
const { protect, authorizePermissions } = require("../middleware/authMiddleware")
const router = express.Router()


router.post('/', AddEnrollment)

router.get('/', AllEnrollments)

router.get('/abs', addBulkEnrollments)

router.get('/today', protect, authorizePermissions("teacher", "admin"), AllEnrollmentsByToday)

router.post('/update-link', protect, authorizePermissions("admin"), updateEnrollmentLink);

router.get('/student-enrollments/:studentId', protect, displayStudentEnrollments);

router.get('/teacher-enrollments/:teacherId', protect, authorizePermissions("teacher", "admin"), getEnrollmentByTeacher)

router.get('/:enrollmentId', protect, authorizePermissions("admin"), getSingleEnrollment);

router.put("/update/:enrollmentId", protect, authorizePermissions("admin"), updateEnrollment)

router.get("/fields/:id", getReportFields)


module.exports = router;