import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router';

const EnrolledCourses = () => {
  // Sample course data - replace with actual data from your API

  const user = useSelector(state => state.user)

  
  const [enrolledCourses, setEnrolledCourses] = useState([])

  
  const getEnrollments = () => {
    
    axios.get(`/api/v1/enrollment/student-enrollments/${user.id}`).then(res => setEnrolledCourses(res.data.courses)).catch(err => console.log(err))

  }

  useEffect(() => {
    getEnrollments()
  }, [user.id])

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8">
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
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                My Enrolled Courses
              </h1>
              <p className="text-gray-600 text-lg">
                Continue your learning journey
              </p>
            </div>
          </div>
        
        </div>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {enrolledCourses.map((course) => (
          <div
            key={course._id}
            className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transform hover:scale-105 transition-all duration-300 cursor-pointer"
          >
            {/* Course Image */}
            <div className="relative h-48 overflow-hidden">
              <img
                src={course.course.image}
                alt={course.course.name}
                className="w-full h-full object-cover"
              />
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>

            {/* Course Info */}
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-3 line-clamp-2">
                {course.course.name}
              </h3>
              
              <div className='flex flex-col space-y-3'>
                {/* Continue Learning Button */}
                <Link to={`/dashboard/all-lessons/${course._id}`} className="w-full bg-secondary hover:bg-secondary/90 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200">
                  Go to Lessons
                </Link>

                {
                  course.course.pdf &&
                  <Link to={`${course.course.pdf}`} className="w-full bg-secondary hover:bg-secondary/90 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200">
                  Download Book
                  </Link>
                }
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State (shown when no courses) */}
      {enrolledCourses.length === 0 && (
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h3 className="text-2xl font-semibold text-gray-900 mb-2">No Courses Enrolled</h3>
          <p className="text-gray-600 mb-6">Start your learning journey by enrolling in a course</p>
          <button className="bg-secondary hover:bg-secondary/90 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200">
            Browse Courses
          </button>
        </div>
      )}
    </div>
  );
};

export default EnrolledCourses;