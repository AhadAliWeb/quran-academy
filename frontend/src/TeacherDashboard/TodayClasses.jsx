import React, { useState, useEffect } from 'react';
import { Search, Filter, ChevronDown, Clock, Calendar, User, BookOpen, Link2, Eye } from 'lucide-react';
import axios from "axios"
import moment from "moment"
import { useSelector } from 'react-redux';
import { useAlert } from '../hooks/useAlert';
import Alert from '../components/Alert';
import AddLesson from '../components/AddLesson';
import { Link } from 'react-router';


const TodayClasses = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const user = useSelector(state => state.user)
  const attendanceOptions = ["", "Online", "Offline", "Late", "Excused"];
  const [displayAttendanceId, setDisplayAttendanceId] = useState(false);
  const [attendanceChoice, setAttendanceChoice] = useState("")
  const { alert, showAlert } = useAlert();
  const [selectedEnrollment, setSelectedEnrollment] = useState({});

  const [classes, setClasses] = useState([]);


  const getAllEnrollments = () => {

    axios.get(`/api/v1/enrollment/today`).then(res => setClasses(res.data.enrollments)).catch(err => console.log(err))
  }

  useEffect(() => {
    getAllEnrollments()
  }, [])

  const handleModalClose = () => {
    // Reset the selected enrollment to close the modal
    setSelectedEnrollment({});
  };


  const getStatusColor = (status) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Demo':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Left':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const markAttendance = (enrollmentId, courseId, studentId) => {

    if(attendanceChoice === "") {
      alert("Please Select an Option")
      return;
    }

    axios.post("/api/v1/attendance/add", {enrollmentId, courseId, studentId, status: attendanceChoice}).then(res => {
      showAlert(res.data.msg, "Success")
      getAllEnrollments()
    }).catch(err => showAlert(err.response.data.msg))

  }
  

  return (
    <div className="p-4 lg:p-6 bg-gray-50 min-h-screen">
      {
        alert &&
        <Alert
          message={alert.message}
          theme={alert.theme}
        />
      }
      <AddLesson open={selectedEnrollment.enrollment ? true : false} onClose={handleModalClose} selectedEnrollment={selectedEnrollment}/>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">Students Management</h1>
        <p className="text-gray-600">Manage and track all student information and class details</p>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search students, ID, or course..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none bg-white"
            >
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Demo">Demo</option>
              <option value="Left">Left</option>
            </select>
          </div>
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden lg:block bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-primary text-white">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold">S.No</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Student Name</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Student ID</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Course</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Days</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">See More</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Duration</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Time</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Status</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {classes.length > 0 && classes.map((clas, index) => (
                <tr key={clas._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {index + 1}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center text-white text-sm font-semibold mr-3">
                        {clas.student.name.charAt(0)}
                      </div>
                      <div className="text-sm font-medium text-gray-900">
                        {clas.student.name}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 font-mono">
                    {clas.student.id || 'N/A'}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {clas.course.name}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {clas.schedule.days.map(item  => item.substring(0, 3).padEnd(3, " ")).join(', ')}
                  </td>
                  <td className="flex justify-center items-center px-4 py-8 space-x-2">
                    <Link to={`/teacher/dashboard/display-lesson/${clas._id}`} className='p-1 bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors font-medium text-sm rounded cursor-pointer'><Eye size={18}/></Link>
                    {
                      clas.meet?.link &&
                      <a
                      href={clas.meet?.link || ''}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:text-secondary font-semibold text-lg break-all underline decoration-2 underline-offset-4"
                      >
                      <Link2 size={16}/>
                    </a>
                    }
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {clas.schedule.duration}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {moment(clas.schedule.time, "HH:mm").format("hh:mm A")}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getStatusColor(clas.student.status)}`}>
                      {clas.student.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col space-y-2">
                  {displayAttendanceId === clas._id ? (
                    <div className="flex items-center gap-3 p-3 bg-gray-50 border rounded-lg">
                      <div className="flex items-center gap-2">
                        <label className="text-sm font-medium text-gray-700">
                          Status:
                        </label>
                        <select
                          value={attendanceChoice}
                          onChange={(e) => setAttendanceChoice(e.target.value)}
                          className="px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                        >
                          {attendanceOptions.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      </div>
                      
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setAttendanceChoice("")
                            setDisplayAttendanceId("")
                          }}
                          className="px-3 py-1 text-xs text-gray-600 bg-gray-200 rounded hover:bg-gray-300 transition"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => {
                            markAttendance(clas._id, clas.course._id, clas.student._id)
                            setAttendanceChoice("")
                            setDisplayAttendanceId("")
                          }}
                          className="px-3 py-1 text-xs bg-yellow-400 text-black rounded hover:bg-yellow-500 transition"
                        >
                          Confirm
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button 
                      className="py-1 px-3 bg-yellow-300 text-black/80 rounded hover:bg-yellow-500 hover:text-white transition cursor-pointer disabled:bg-gray-300 disabled:cursor-not-allowed"
                      disabled={clas.attendanceMarked}
                      onClick={() => setDisplayAttendanceId(clas._id)}
                    >
                      Attendance
                    </button>
                  )}
                      <button className="py-1 bg-secondary text-white rounded hover:bg-primary transition cursor-pointer" onClick={() => {
                        setSelectedEnrollment({enrollment: clas._id, student: clas.student._id, course: clas.course._id})
                      }}>
                        Add Lesson
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Cards View */}
      <div className="lg:hidden space-y-4">
        {classes.length > 0 && classes.map((clas, index) => (
          <div key={clas._id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {/* Card Header */}
            <div className="bg-gradient-to-r from-primary to-secondary p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-primary text-lg font-bold shadow-md">
                    {clas.student.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-lg">{clas.student.name}</h3>
                    <p className="text-white/80 text-xs font-mono">{clas.student.id || 'N/A'}</p>
                  </div>
                </div>
                <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full border ${getStatusColor(clas.student.status)}`}>
                  {clas.student.status}
                </span>
              </div>
            </div>

            {/* Card Body */}
            <div className="p-4 space-y-3">
              {/* Course Info */}
              <div className="flex items-start space-x-2">
                <BookOpen className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Course</p>
                  <p className="text-sm font-medium text-gray-900">{clas.course.name}</p>
                </div>
              </div>

              {/* Schedule Info */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-start space-x-2">
                  <Calendar className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Days</p>
                    <p className="text-sm font-medium text-gray-900">
                      {clas.schedule.days.map(item => item.substring(0, 3)).join(', ')}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-2">
                  <Clock className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Time</p>
                    <p className="text-sm font-medium text-gray-900">
                      {moment(clas.schedule.time, "HH:mm").format("hh:mm A")}
                    </p>
                  </div>
                </div>
              </div>

              {/* Duration */}
              <div className="flex items-start space-x-2">
                <Clock className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Duration</p>
                  <p className="text-sm font-medium text-gray-900">{clas.schedule.duration}</p>
                </div>
              </div>

              {/* Action Links */}
              <div className="flex items-center space-x-3 pt-2">
                <Link 
                  to={`/teacher/dashboard/display-lesson/${clas._id}`} 
                  className='flex items-center space-x-1 px-3 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors font-medium text-sm rounded'
                >
                  <Eye size={16}/>
                  <span>View Details</span>
                </Link>
                {clas.meet?.link && (
                  <a
                    href={clas.meet?.link || ''}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-1 px-3 py-2 bg-green-50 text-green-600 hover:bg-green-100 transition-colors font-medium text-sm rounded"
                  >
                    <Link2 size={16}/>
                    <span>Join Meeting</span>
                  </a>
                )}
              </div>
            </div>

            {/* Card Footer - Actions */}
            <div className="border-t border-gray-200 p-4 bg-gray-50 space-y-3">
              {displayAttendanceId === clas._id ? (
                <div className="space-y-3">
                  <div className="flex flex-col space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Mark Attendance
                    </label>
                    <select
                      value={attendanceChoice}
                      onChange={(e) => setAttendanceChoice(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                    >
                      {attendanceOptions.map((option) => (
                        <option key={option} value={option}>
                          {option || "Select Status"}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setAttendanceChoice("")
                        setDisplayAttendanceId("")
                      }}
                      className="flex-1 px-4 py-2 text-sm text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        markAttendance(clas._id, clas.course._id, clas.student._id)
                        setAttendanceChoice("")
                        setDisplayAttendanceId("")
                      }}
                      className="flex-1 px-4 py-2 text-sm bg-yellow-400 text-black rounded-lg hover:bg-yellow-500 transition font-medium"
                    >
                      Confirm
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    className="py-2 px-4 bg-yellow-300 text-black/80 rounded-lg hover:bg-yellow-500 hover:text-white transition cursor-pointer disabled:bg-gray-300 disabled:cursor-not-allowed font-medium text-sm"
                    disabled={clas.attendanceMarked}
                    onClick={() => setDisplayAttendanceId(clas._id)}
                  >
                    Mark Attendance
                  </button>
                  <button 
                    className="py-2 px-4 bg-secondary text-white rounded-lg hover:bg-primary transition cursor-pointer font-medium text-sm" 
                    onClick={() => {
                      setSelectedEnrollment({enrollment: clas._id, student: clas.student._id, course: clas.course._id})
                    }}
                  >
                    Add Lesson
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {classes.length === 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 text-center py-12">
          <User className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Classes for Today</h3>
          <p className="text-gray-600">Take a back seat and relax... 🥳🥳🥳</p>
        </div>
      )}
    </div>
  );
};

export default TodayClasses;