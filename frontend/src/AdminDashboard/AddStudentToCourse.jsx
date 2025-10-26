import React, { useState } from 'react';
import { Search, X, Check, Clock, Calendar, User, BookOpen } from 'lucide-react';
import axios from "axios"
import { useAlert } from '../hooks/useAlert';
import Alert from '../components/Alert';

const StudentCourseForm = () => {

  const { alert, showAlert, clearAlert } = useAlert();
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const classDurations = ['30 Minutes', '45 Minutes', '60 Minutes'];

  // State management
  const [students, setStudents] = useState([])
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [courses, setCourses] = useState([])
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedDays, setSelectedDays] = useState([]);
  const [classDuration, setClassDuration] = useState('');
  const [classTime, setClassTime] = useState('');
  const [teachers, setTeachers] = useState([])
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [teacherSearch, setTeacherSearch] = useState('');
  
  // Search states
  const [studentSearch, setStudentSearch] = useState('');
  const [courseSearch, setCourseSearch] = useState('')
  const [showStudentDropdown, setShowStudentDropdown] = useState(false);
  const [showCourseDropdown, setShowCourseDropdown] = useState(false);
  const [showTeacherDropdown, setShowTeacherDropdown] = useState(false);

  // Handler functions
  const handleStudentSelect = (student) => {
    setSelectedStudent(student);
    setStudentSearch('');
    setShowStudentDropdown(false);
  };

  const handleTeacherSelect = (teacher) => {
    setSelectedTeacher(teacher);
    setTeacherSearch('');
    setShowTeacherDropdown(false);
  };


  const searchStudent = (query) => {

    axios.get(`/api/v1/students/search?query=${query}`).then(res => setStudents(res.data.students)).catch(err => {
      console.log(err)
      setStudents([])
    })

  }

  const searchCourse = (query) => {

    axios.get(`/api/v1/courses/search?query=${query}`).then(res => setCourses(res.data.courses)).catch(err => {
      console.log(err)
      setCourses([])
    })

  }

  const searchTeachers = (query) => {

    axios.get(`/api/v1/teachers/search?query=${query}`).then(res => setTeachers(res.data.teachers)).catch(err => {
      setTeachers([])
      console.log(err)
    })

  }


  const handleCourseSelect = (course) => {

    setSelectedCourse(course);
    setCourseSearch('')
    setShowCourseDropdown(false);
  };



  const handleDayToggle = (day) => {
    setSelectedDays(prev =>
      prev.includes(day)
        ? prev.filter(d => d !== day)
        : [...prev, day]
    );
  };

  const handleSubmit = () => {
    
    axios.post("/api/v1/enrollment", {student: selectedStudent._id, teacher: selectedTeacher._id, course: selectedCourse._id, duration: classDuration.split(" ")[0], days: selectedDays, time: classTime})
    .then(res => showAlert(res.data.msg, "success")).catch(err => showAlert(err.response.data.msg, "danger")).finally(() => resetForm())

  };

  const resetForm = () => {
    setSelectedStudent(null);
    setSelectedCourse(null);
    setSelectedTeacher(null)
    setSelectedDays([]);
    setClassDuration('');
    setClassTime('');
    setStudentSearch('');
    setCourseSearch('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br p-4 md:p-6 lg:p-8">
      {
        alert &&
        <Alert
          key={alert.id}
          message={alert.message}
          theme={alert.theme}
        />
      }
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary to-secondary p-6 md:p-8">
            <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
              <Calendar className="w-8 h-8" />
              Add Course Schedule
            </h1>
            <p className="text-white/90 mt-2">Create a new class schedule for students</p>
          </div>

          <div className="p-6 md:p-8 space-y-8">
            {/* Student Selection */}
            <div className="space-y-4">
              <label className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <User className="w-5 h-5 text-primary" />
                Student Name
              </label>
              
              {selectedStudent ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="font-semibold text-green-800">Selected Student</p>
                      <p className="text-green-700">{selectedStudent.name}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedStudent(null)}
                    className="text-green-600 hover:text-green-800 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <div className="relative">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={studentSearch}
                      onChange={(e) => {
                        setStudentSearch(e.target.value);
                        setShowStudentDropdown(true);
                        searchStudent(e.target.value)
                      }}
                      onFocus={() => setShowStudentDropdown(true)}
                      onMouseDown={() => setTimeout(() => setShowStudentDropdown(false), 200)}
                      placeholder="Search for a student..."
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    />
                  </div>
                  
                  {showStudentDropdown && studentSearch && (
                    <div className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-64 overflow-y-auto">
                      {students.length > 0 ? (
                        students.map(student => (
                          <button
                            key={student._id}
                            type="button"
                            onClick={() => handleStudentSelect(student)}
                            className="w-full text-left p-4 hover:bg-primary/10 transition-colors border-b border-gray-100 last:border-b-0 cursor-pointer"
                          >
                            <div className="font-bold text-gray-800">{student.name}</div>
                            <div className="text-sm text-gray-600">{student.email}</div>
                            <div className="text-sm text-gray-600">{student.phone}</div>
                          </button>
                        ))
                      ) : (
                        <div className="p-4 text-gray-500">No students found</div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="space-y-4">
              <label className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <User className="w-5 h-5 text-primary" />
                Teacher
              </label>

              {selectedTeacher ? (
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-purple-600" />
                    <div>
                      <p className="font-semibold text-purple-800">Selected Teacher</p>
                      <p className="text-purple-700">{selectedTeacher.name}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedTeacher(null)}
                    className="text-purple-600 hover:text-purple-800 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <div className="relative">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={teacherSearch}
                      onChange={(e) => {
                        setTeacherSearch(e.target.value);
                        setShowTeacherDropdown(true);
                        searchTeachers(e.target.value)
                      }}
                      onFocus={() => setShowTeacherDropdown(true)}
                      onMouseDown={() => setTimeout(() => setShowTeacherDropdown(false), 200)}
                      placeholder="Search for a teacher..."
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    />
                  </div>

                  {showTeacherDropdown && teacherSearch && (
                    <div className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-64 overflow-y-auto">
                      {teachers.length > 0 ? (
                        teachers.map(teacher => (
                          <button
                            key={teacher.id}
                            type="button"
                            onMouseDown={() => handleTeacherSelect(teacher)} // use onMouseDown to avoid blur issue
                            className="w-full text-left p-4 hover:bg-primary/10 transition-colors border-b border-gray-100 last:border-b-0 cursor-pointer"
                          >
                            <div className="font-bold text-gray-800">{teacher.name}</div>
                            <div className="text-sm text-gray-600">{teacher.email}</div>
                            <div className="text-sm text-gray-600">{teacher.phone}</div>
                          </button>
                        ))
                      ) : (
                        <div className="p-4 text-gray-500">No teachers found</div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Course Selection */}
            <div className="space-y-4">
              <label className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary" />
                Course
              </label>
              
              {selectedCourse ? (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="font-semibold text-blue-800">Selected Course</p>
                      <p className="text-blue-700">{selectedCourse.name} ({selectedCourse.code})</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedCourse(null)}
                    className="text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <div className="relative">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={courseSearch}
                      onChange={(e) => {
                        setCourseSearch(e.target.value)
                        searchCourse(e.target.value)
                        setShowCourseDropdown(true);
                      }}
                      onFocus={() => setShowCourseDropdown(true)}
                      onMouseDown={() => setTimeout(() => setShowCourseDropdown(false), 200)}
                      placeholder="Search for a course..."
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    />
                  </div>
                  
                  {showCourseDropdown && courseSearch && (
                    <div className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-64 overflow-y-auto">
                      {courses.length > 0 ? (
                        courses.map(course => (
                          <button
                            key={course._id}
                            type="button"
                            onClick={() => handleCourseSelect(course)}
                            className="w-full text-left p-4 hover:bg-primary/10 transition-colors border-b border-gray-100 last:border-b-0 cursor-pointer"
                          >
                            <div className="font-bold text-gray-800">{course.name}</div>
                          </button>
                        ))
                      ) : (
                        <div className="p-4 text-gray-500">No courses found</div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Days Selection */}
            <div className="space-y-4">
              <label className="block text-lg font-semibold text-gray-800">Days</label>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
                {daysOfWeek.map(day => (
                  <button
                    key={day}
                    type="button"
                    onClick={() => handleDayToggle(day)}
                    className={`p-3 rounded-lg border-2 transition-all text-sm font-medium ${
                      selectedDays.includes(day)
                        ? 'bg-primary text-white border-primary shadow-md transform scale-105'
                        : 'bg-white text-gray-700 border-gray-200 hover:border-primary hover:bg-primary/5'
                    }`}
                  >
                    {day.slice(0, 3)}
                  </button>
                ))}
              </div>
              {selectedDays.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {selectedDays.map(day => (
                    <span
                      key={day}
                      className="bg-primary text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1"
                    >
                      {day}
                      <button
                        type="button"
                        onClick={() => handleDayToggle(day)}
                        className="ml-1 hover:bg-white/20 rounded-full p-0.5 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Class Duration */}
            <div className="space-y-4">
              <label className="block text-lg font-semibold text-gray-800 flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                Class Duration
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {classDurations.map(duration => (
                  <button
                    key={duration}
                    type="button"
                    onClick={() => setClassDuration(duration)}
                    className={`p-4 rounded-lg border-2 transition-all font-medium ${
                      classDuration === duration
                        ? 'bg-secondary text-white border-secondary shadow-md'
                        : 'bg-white text-gray-700 border-gray-200 hover:border-secondary hover:bg-secondary/5'
                    }`}
                  >
                    {duration}
                  </button>
                ))}
              </div>
            </div>

            {/* Time */}
            <div className="space-y-4">
              <label className="block text-lg font-semibold text-gray-800">Time</label>
              <input
                type="time"
                value={classTime}
                onChange={(e) => setClassTime(e.target.value)}
                className="w-full md:w-auto px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-lg"
              />
            </div>

            {/* Submit Buttons */}
            <div className="flex flex-col md:flex-row gap-4 pt-6">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!selectedStudent || !selectedCourse || selectedDays.length === 0 || !classDuration || !classTime}
                className="flex-1 bg-gradient-to-r from-primary to-secondary text-white py-4 px-6 rounded-lg font-bold text-lg transition-all hover:shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
              >
                Add Schedule
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="flex-1 bg-gray-100 text-gray-700 py-4 px-6 rounded-lg font-bold text-lg transition-all hover:bg-gray-200 hover:shadow-md"
              >
                Reset Form
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentCourseForm;