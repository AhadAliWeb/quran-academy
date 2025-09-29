const express = require("express")
const { addLesson, getLatestLesson, getLessonsByEnrollment, getLessonById } = require("../controllers/lessonController");
const { protect } = require("../middleware/authMiddleware");
const router = express.Router()

router.post('/', protect, addLesson);

router.get('/:lessonId', protect, getLessonById);

router.get('/enrollment-lessons/:enrollmentId', getLessonsByEnrollment)
router.get('/latest/:enrollmentId', getLatestLesson)

module.exports = router;