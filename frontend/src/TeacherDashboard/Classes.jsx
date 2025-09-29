import React, { useEffect, useState } from 'react';
import { Calendar, Clock, Users } from 'lucide-react';
import axios from 'axios';


const Classes = () => {
  // Sample data - you can replace this with data from your API
  const [classes, setClasses] = useState([]);


  const getAllEnrollments = () => {

    axios.get(`/api/v1/enrollment/today`).then(res => setClasses(res.data.enrollments)).catch(err => {
      setClasses([])
    })
  }

  useEffect(() => {
    getAllEnrollments()
  }, [])

  const handleTakeAttendance = (classId, courseName) => {
    // Handle attendance taking logic here
    alert(`Taking attendance for ${courseName}`);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const isToday = (dateString) => {
    const today = new Date();
    const classDate = new Date(dateString);
    return today.toDateString() === classDate.toDateString();
  };



  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-black mb-2">
            My Classes
          </h1>
          <p className="text-black/80 text-lg">
            Manage your classes and take attendance
          </p>
        </div>

        {/* Classes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {classes.length > 0 && classes.map((classItem) => (
            <div
              key={classItem.course._id}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <div className="p-6">
                {/* Course Header */}
                <div className="mb-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-xl font-bold text-gray-800 leading-tight">
                      {classItem.course.name}
                    </h3>
                    {/* {isToday(classItem.date) && (
                      <span className="bg-secondary text-white text-xs font-semibold px-2 py-1 rounded-full">
                        Today
                      </span>
                    )} */}
                  </div>
                  {/* <p className="text-primary font-semibold text-sm">
                    {classItem.courseCode}
                  </p> */}
                </div>

                {/* Class Details */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center text-gray-600">
                    <Calendar className="w-4 h-4 mr-3 text-primary" />
                    <span className="text-sm">
                      {formatDate(new Date())}
                    </span>
                  </div>
                  
                  <div className="flex items-center text-gray-600">
                    <Clock className="w-4 h-4 mr-3 text-primary" />
                    <span className="text-sm">{classItem.schedule.time}</span>
                  </div>
                  
                </div>

                {/* Action Button */}
                <button
                  onClick={() => handleTakeAttendance(classItem.id, classItem.courseName)}
                  className={`w-full py-3 px-4 rounded-lg font-semibold text-sm transition-all duration-200 bg-secondary hover:bg-secondary/90 text-white shadow-md hover:shadow-lg`}
                >
                  Take Attandance
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {classes.length === 0 && (
          <div className="text-center py-12">
            <div className="bg-white rounded-xl shadow-lg p-8 max-w-md mx-auto">
              <Calendar className="w-16 h-16 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                No Classes Today
              </h3>
              <p className="text-gray-600">
                You don't have any classes scheduled for today.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Classes;