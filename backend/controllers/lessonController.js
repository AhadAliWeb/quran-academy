const asyncHandler = require("express-async-handler")
const { StatusCodes } = require("http-status-codes")
const Lesson = require("../models/Lesson")
const { NotFoundError } = require('../errors')

const addLesson = asyncHandler(async(req,res) => {

    const teacherId = req.user._id

    const { enrollment, student, course, chapterNumber, pageNumber, ayahLineNumber, memorizationLessonNumber, imageUrls } = req.body;

    const lesson = await Lesson.create({enrollment, student, course, teacher: teacherId, chapterNumber, pageNumber, ayahLineNumber, memorizationLessonNumber, imageUrls})

    await lesson.save();

    res.status(StatusCodes.OK).json({msg: "Lesson Added Successfully"})

})

const getLatestLesson = asyncHandler(async(req, res) => {

    const { enrollmentId } = req.params

    const lesson = await Lesson.findOne({enrollment: enrollmentId}).sort({createdAt: -1})

    if(!lesson) throw new NotFoundError("Lesson Not Found")

    res.status(StatusCodes.OK).json({msg: "Lesson found Successfully", lesson})

});


const getLessonById = asyncHandler(async(req, res) => {

    const { lessonId } = req.params

    const lesson = await Lesson.findById(lessonId)

    if(!lesson) throw new NotFoundError("Lesson Not Found")

    res.status(StatusCodes.OK).json({msg: "Lesson found Successfully", lesson})

});


// Backend Controller
const getLessonsByEnrollment = asyncHandler(async(req, res) => {
    const { enrollmentId } = req.params;
    const { page = 1, limit = 3 } = req.query;

    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);
    const skip = (pageNumber - 1) * limitNumber;

    // Get total count for pagination info
    const totalLessons = await Lesson.countDocuments({ enrollment: enrollmentId });

    // Get paginated lessons
    const lessons = await Lesson.find({ enrollment: enrollmentId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNumber);

    if(lessons.length === 0 && pageNumber === 1) {
        throw new NotFoundError("No Lessons Found");
    }

    const totalPages = Math.ceil(totalLessons / limitNumber);
    const hasMore = pageNumber < totalPages;

    res.status(StatusCodes.OK).json({
        msg: "Lessons Found Successfully", 
        lessons,
        pagination: {
            currentPage: pageNumber,
            totalPages,
            totalLessons,
            hasMore,
            limit: limitNumber
        }
    });
});
module.exports = { addLesson, getLatestLesson, getLessonsByEnrollment, getLessonById}