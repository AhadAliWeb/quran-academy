import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router';
import { BookOpen, Download, BarChart3, Video } from 'lucide-react';

const EnrolledCourses = () => {
  const user = useSelector(state => state.user)
  const [enrolledCourses, setEnrolledCourses] = useState([])

  const getEnrollments = () => {
    axios.get(`/api/v1/enrollment/student-enrollments/${user.id}`)
      .then(res => setEnrolledCourses(res.data.courses))
      .catch(err => console.log(err))
  }

  useEffect(() => {
    if(user.id) {
      getEnrollments()
    }
  }, [user.id])

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8 bg-gray-50">
      {/* Header Card */}
      <div className="mb-8">
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-br from-primary to-secondary p-3 rounded-xl">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-1 md:mb-2">
                My Enrolled Courses
              </h1>
              <p className="text-gray-600 text-sm md:text-base lg:text-lg">
                Continue your learning journey
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
        {enrolledCourses.length > 0 ?
          enrolledCourses.map((course) => (
            <div
              key={course._id}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300"
            >
              {/* Course Image */}
              <div className="relative h-40 md:h-48 overflow-hidden">
                <img
                  src={course.course.image}
                  alt={course.course.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
              </div>

              {/* Course Info */}
              <div className="p-4 md:p-6">
                <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-4 line-clamp-2 min-h-[3.5rem]">
                  {course.course.name}
                </h3>
                
                <div className='flex flex-col space-y-2.5'>
                  {/* Go to Lessons */}
                  <Link 
                    to={`/dashboard/all-lessons/${course._id}`} 
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 md:py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 text-sm md:text-base shadow-sm hover:shadow-md"
                  >
                    <BookOpen className="w-4 h-4 md:w-5 md:h-5" />
                    <span>Go to Lessons</span>
                  </Link>

                  {/* Google Meet Link */}
                  {course?.meet.link && (
                    <a 
                      href={course?.meet.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2.5 md:py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 text-sm md:text-base shadow-sm hover:shadow-md"
                    >
                      <Video className="w-4 h-4 md:w-5 md:h-5" />
                      <span>Join Google Meet</span>
                    </a>
                  )}

                  {/* Download Book */}
                  {course.course.pdf && (
                    <a 
                      href={course.course.pdf}
                      download
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2.5 md:py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 text-sm md:text-base shadow-sm hover:shadow-md"
                    >
                      <Download className="w-4 h-4 md:w-5 md:h-5" />
                      <span>Download Book</span>
                    </a>
                  )}

                  {/* Monthly Reports */}
                  <Link 
                    to={`/dashboard/monthly-reports/${course._id}`} 
                    className="w-full bg-amber-600 hover:bg-amber-700 text-white font-medium py-2.5 md:py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 text-sm md:text-base shadow-sm hover:shadow-md"
                  >
                    <BarChart3 className="w-4 h-4 md:w-5 md:h-5" />
                    <span>Monthly Reports</span>
                  </Link>
                </div>
              </div>
            </div>
          ))
          :
          <div className="col-span-full text-center py-12 md:py-16">
            <div className="w-20 h-20 md:w-24 md:h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
              <svg className="w-10 h-10 md:w-12 md:h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-xl md:text-2xl font-semibold text-gray-900 mb-2">No Courses Enrolled</h3>
            <p className="text-gray-600 mb-4 md:mb-6 text-sm md:text-base">Start your learning journey by enrolling in a course</p>
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 md:py-3 px-6 rounded-lg transition-colors duration-200 text-sm md:text-base shadow-sm hover:shadow-md">
              Browse Courses
            </button>
          </div>
        }
      </div>
    </div>
  );
};

export default EnrolledCourses;