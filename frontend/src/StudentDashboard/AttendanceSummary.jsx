import axios from 'axios';
import { Award, Target, Eye } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Bar, PieChart, Pie, Cell } from 'recharts';

const AttendanceSummary = () => {

    const [attendanceData, setAttendanceData] = useState([])

    const courseAttendanceSummary = () => {

      axios.get("/api/v1/attendance/course-attendance-summary").then(res => {

        const attendanceData = res.data.data;

      // Process data for charts
      const processedData = attendanceData.map(item => ({
        courseId: item._id,
        courseName: item.course.name,
        online: item.onlineCount,
        offline: item.offlineCount,
        late: item.lateCount,
        excused: item.excusedCount,
        total: item.onlineCount + item.offlineCount + item.lateCount + item.excusedCount,
        courseId: item.course._id,
        attendanceRate: Math.round(((item.onlineCount + item.lateCount) / (item.onlineCount + item.offlineCount + item.lateCount + item.excusedCount)) * 100)
      }));


      setAttendanceData(processedData);

      }).catch(err => console.log(err));

    }

    useEffect(() => {
      courseAttendanceSummary()
    }, [])
    

    const PIE_COLORS = ['#10b981', '#ef4444', '#f59e0b', '#8b5cf6'];


  const CourseCard = ({ course, index }) => (
    <div className="group relative overflow-hidden bg-white rounded-3xl shadow-2xl border border-gray-100 transition-all duration-700 hover:shadow-3xl hover:-translate-y-1">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full blur-3xl opacity-30 -translate-y-20 translate-x-20"></div>
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-emerald-100 to-cyan-100 rounded-full blur-2xl opacity-30 translate-y-16 -translate-x-16"></div>
      
      <div className="relative z-10 p-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg">
              <Award className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text">
                {course.courseName}
              </h3>
              <p className="text-gray-500 font-medium mt-1">
                Total Sessions: <span className="text-indigo-600 font-bold">{course.total}</span>
              </p>
              <div className="flex items-center mt-2 space-x-2">
                <Target className="h-4 w-4 text-emerald-500" />
                <span className="text-sm font-semibold text-emerald-600">
                  {course.attendanceRate}% Attendance Rate
                </span>
              </div>
            </div>
          </div>
          
          <button
            onClick={() => handleSeeDetails(course.courseId, course.courseName)}
            className="mt-6 lg:mt-0 group/btn relative overflow-hidden bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 text-white font-bold py-4 px-8 rounded-2xl shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
            <Link to={`/dashboard/attendance-details/${course.courseId}`} className="relative flex items-center space-x-3">
              <Eye className="h-5 w-5" />
              <span>See Details</span>
            </Link>
            
            {/* Animated border */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300 blur-sm -z-10 scale-105"></div>
          </button>
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Online', value: course.online, color: 'from-emerald-400 to-emerald-600', bgColor: 'bg-emerald-50', textColor: 'text-emerald-700' },
            { label: 'Offline', value: course.offline, color: 'from-red-400 to-red-600', bgColor: 'bg-red-50', textColor: 'text-red-700' },
            { label: 'Late', value: course.late, color: 'from-amber-400 to-amber-600', bgColor: 'bg-amber-50', textColor: 'text-amber-700' },
            { label: 'Excused', value: course.excused, color: 'from-indigo-400 to-indigo-600', bgColor: 'bg-indigo-50', textColor: 'text-indigo-700' }
          ].map((stat, idx) => (
            <div key={stat.label} className={`relative overflow-hidden ${stat.bgColor} rounded-2xl p-5 transition-all duration-300 hover:scale-105 hover:shadow-lg group/stat`}>
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover/stat:opacity-10 transition-opacity duration-300`}></div>
              <div className="relative z-10 text-center">
                <div className={`text-3xl font-black ${stat.textColor} mb-1`}>{stat.value}</div>
                <div className={`text-sm font-semibold ${stat.textColor} uppercase tracking-wide`}>{stat.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 3D-style Bar Chart */}
          <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 shadow-inner">
            <h4 className="text-xl font-bold text-gray-800 mb-4 flex items-center space-x-2">
              <div className="w-1 h-6 bg-gradient-to-b from-indigo-500 to-purple-600 rounded-full"></div>
              <span>Attendance Breakdown</span>
            </h4>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={[course]} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <defs>
                  <linearGradient id="onlineGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#059669" />
                  </linearGradient>
                  <linearGradient id="offlineGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ef4444" />
                    <stop offset="100%" stopColor="#dc2626" />
                  </linearGradient>
                  <linearGradient id="lateGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f59e0b" />
                    <stop offset="100%" stopColor="#d97706" />
                  </linearGradient>
                  <linearGradient id="excusedGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8b5cf6" />
                    <stop offset="100%" stopColor="#7c3aed" />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="courseName" tick={{ fill: '#64748b', fontSize: 12 }} />
                <YAxis tick={{ fill: '#64748b', fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                    border: 'none', 
                    borderRadius: '16px', 
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' 
                  }} 
                />
                <Bar dataKey="online" fill="url(#onlineGrad)" name="Online" radius={[4, 4, 0, 0]} />
                <Bar dataKey="offline" fill="url(#offlineGrad)" name="Offline" radius={[4, 4, 0, 0]} />
                <Bar dataKey="late" fill="url(#lateGrad)" name="Late" radius={[4, 4, 0, 0]} />
                <Bar dataKey="excused" fill="url(#excusedGrad)" name="Excused" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          {/* Enhanced Pie Chart */}
          <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 shadow-inner">
            <h4 className="text-xl font-bold text-gray-800 mb-4 flex items-center space-x-2">
              <div className="w-1 h-6 bg-gradient-to-b from-purple-500 to-pink-600 rounded-full"></div>
              <span>Distribution</span>
            </h4>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <defs>
                  {PIE_COLORS.map((color, index) => (
                    <linearGradient key={index} id={`pieGrad${index}`} x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor={color} />
                      <stop offset="100%" stopColor={`${color}dd`} />
                    </linearGradient>
                  ))}
                </defs>
                <Pie
                  data={[
                    { name: 'Online', value: course.online },
                    { name: 'Offline', value: course.offline },
                    { name: 'Late', value: course.late },
                    { name: 'Excused', value: course.excused }
                  ].filter(item => item.value > 0)}
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  innerRadius={40}
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {PIE_COLORS.map((color, index) => (
                    <Cell key={`cell-${index}`} fill={`url(#pieGrad${index})`} stroke="white" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                    border: 'none', 
                    borderRadius: '16px', 
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' 
                  }} 
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );


  return (
        <div className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold text-gray-800 mb-4 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text">
                Course Attendance Summary
              </h2>
              <p className="text-lg text-gray-600">Individual course analytics and insights</p>
            </div>
            
            {attendanceData.map((course, index) => (
              <CourseCard key={course.courseId} course={course} index={index} />
            ))}
          </div>
  )
}

export default AttendanceSummary