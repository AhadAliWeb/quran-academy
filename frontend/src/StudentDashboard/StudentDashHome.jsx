import React, { useState, useEffect } from 'react';
import { BarChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Area, AreaChart } from 'recharts';
import { Eye, BookOpen, Play, Users, Clock, UserCheck, UserX, AlertTriangle, TrendingUp, Calendar, Award, Target } from 'lucide-react';
import axios from "axios"
import { useSelector } from "react-redux"
import { Link } from 'react-router';


const StudentDashHome = () => {
  const [selectedCourse, setSelectedCourse] = useState(null);
  const user = useSelector(state => state.user)

  const [totalStats, setTotalStats] = useState({});
  const [courses, setCourses] = useState([])
  // const [chartData, setChartData] = useState([])


  const getOverAllSummary = () => {

    axios.get(`/api/v1/attendance/overall-summary/${user.id}`).then(res => setTotalStats(res.data.summary)).catch(err => console.log(err))
  }

  const getCourses = () => {

    axios.get(`/api/v1/enrollment/student-enrollments/${user.id}`).then(res => setCourses(res.data.courses)).catch(err => console.log(err))

  }

  // useEffect(() => {

  //   setChartData([
  //     { name: 'Online', value: totalStats.onlineCount },
  //     { name: 'Offline', value: totalStats.offlineCount },
  //     { name: 'Late', value: totalStats.lateCount },
  //     { name: 'Excused', value: totalStats.excusedCount },
  //     // { name: 'Total', value: totalStats.totalCount },
  //   ])

  // }, [totalStats])





  
  // Sample data based on your provided data structure
  

  useEffect(() => {

    if(user.id) { 
      getOverAllSummary()
      getCourses()
    }

  }, [user.id]);



  const COLORS = {
    online: 'linear-gradient(135deg, #10b981, #059669)',
    offline: 'linear-gradient(135deg, #ef4444, #dc2626)',
    late: 'linear-gradient(135deg, #f59e0b, #d97706)',
    excused: 'linear-gradient(135deg, #8b5cf6, #7c3aed)'
  };

  const PIE_COLORS = ['#10b981', '#ef4444', '#f59e0b', '#8b5cf6'];

  const handleSeeDetails = (courseId, courseName) => {
    setSelectedCourse({ id: courseId, name: courseName });
    alert(`Opening details for ${courseName}`);
  };

  // const getTotalAttendance = () => {
  //   return processedData.reduce((acc, curr) => ({
  //     online: acc.online + curr.online,
  //     offline: acc.offline + curr.offline,
  //     late: acc.late + curr.late,
  //     excused: acc.excused + curr.excused,
  //     total: acc.total + curr.total
  //   }), { online: 0, offline: 0, late: 0, excused: 0, total: 0 });
  // };

  // const totalStats = getTotalAttendance();

  const chartData = [
  { name: 'Online', value: totalStats.onlineCount },
  { name: 'Offline', value: totalStats.offlineCount },
  { name: 'Late', value: totalStats.lateCount },
  { name: 'Excused', value: totalStats.excusedCount },
  // { name: 'Total', value: totalStats.totalCount },
  ];



  const WelcomeCard = () => (
    <div className="group relative overflow-hidden bg-white rounded-3xl shadow-2xl p-8 mb-8 border border-gray-100 transition-all duration-700">
      {/* Background gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/5 to-primary/10 opacity-100"></div>
      <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full blur-3xl opacity-30 -translate-y-20 translate-x-20"></div>
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-secondary/20 to-primary/20 rounded-full blur-2xl opacity-30 translate-y-16 -translate-x-16"></div>
      
      <div className="relative z-10">
        {/* Welcome Message */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-primary to-secondary rounded-2xl shadow-lg">
              <Users className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-black text-gray-800">
                Welcome Back, <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">{user.name}</span>
              </h1>
              <p className="text-gray-600 font-medium mt-1">Ready to continue your learning journey?</p>
            </div>
          </div>
        </div>

        {/* Enrolled Courses Section */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center space-x-2">
            <BookOpen className="h-6 w-6 text-primary" />
            <span>Enrolled Courses</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div key={course.course._id} className="group/course relative overflow-hidden bg-white rounded-2xl shadow-lg border border-gray-100 transition-all duration-500 hover:shadow-xl hover:-translate-y-2">
                {/* Course card background */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 group-hover/course:opacity-100 transition-opacity duration-300"></div>
                
                <div className="relative z-10 p-6">
                  {/* Course Icon */}
                  <div className="flex items-center justify-between mb-4">

                    <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover/course:text-primary transition-colors duration-300">
                      {course?.course.name || 'N/A'}
                    </h3>
                    <div className="p-3 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl">
                      <Award className="h-6 w-6 text-primary" />
                    </div>
                    {/* <div className="text-right">
                      <div className="text-lg text-secondary font-medium">{course.name}</div>
                      <div className="text-xl font-bold text-primary">{course.progress}%</div>
                    </div> */}
                  </div>
                  {/* Continue Learning Button */}
                  <Link to={`/dashboard/all-lessons/${course._id}`}>
                    <button
                      className="w-full group/btn relative overflow-hidden cursor-pointer bg-gradient-to-r from-primary to-secondary text-white font-bold py-3 px-6 rounded-xl shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-secondary to-primary opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                      <div className="relative flex items-center justify-center space-x-2">
                        <Play className="h-4 w-4" />
                        <span>Continue Learning</span>
                      </div>
                    </button>
                  </Link>

                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const StatCard = ({ title, count, icon: Icon, gradient, percentage, delay = 0 }) => (
    <div 
      className="group relative overflow-hidden bg-white rounded-3xl shadow-2xl p-8 border border-gray-100 transition-all duration-700 hover:scale-105 hover:-translate-y-2 hover:shadow-3xl"
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-gray-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      {/* Floating particles effect */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full blur-3xl opacity-20 -translate-y-16 translate-x-16"></div>
      
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex-1">
          <p className="text-gray-600 text-sm font-medium uppercase tracking-wide mb-2">{title}</p>
          <p className="text-4xl font-black text-gray-800 mb-1 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text">
            {count}
          </p>
          {percentage !== undefined && (
            <div className="flex items-center space-x-2">
              <p className="text-lg font-bold text-emerald-600">{percentage}%</p>
              <TrendingUp className="h-4 w-4 text-emerald-500" />
            </div>
          )}
        </div>
        <div className="relative">
          <div className={`p-4 rounded-2xl bg-gradient-to-br ${gradient} shadow-lg transform transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110`}>
            <Icon className="h-8 w-8 text-white drop-shadow-lg" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-2xl"></div>
        </div>
      </div>
      
      {/* Progress bar */}
      <div className="mt-4 h-2 bg-gray-100 rounded-full overflow-hidden">
        <div 
          className={`h-full bg-gradient-to-r ${gradient} rounded-full transition-all duration-1000 ease-out`}
          style={{ width: `${percentage || 0}%` }}
        ></div>
      </div>
    </div>
  );

  

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-200 to-indigo-300 rounded-full blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-purple-200 to-pink-300 rounded-full blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-emerald-200 to-cyan-300 rounded-full blur-3xl opacity-10 animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="relative z-10 p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Enhanced Header */}
          {/* <div className="text-center mb-12">
            <div className="inline-flex items-center space-x-3 bg-white/80 backdrop-blur-sm rounded-2xl px-6 py-3 shadow-lg mb-6">
              <Calendar className="h-6 w-6 text-indigo-600" />
              <span className="text-indigo-600 font-semibold">Dashboard Overview</span>
            </div>
            <h1 className="text-5xl lg:text-6xl font-black text-gray-800 mb-4 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-600 bg-clip-text text-transparent">
              Attendance Summary
            </h1>
            <p className="text-xl text-gray-600 font-medium max-w-2xl mx-auto">
              Comprehensive overview of student attendance patterns across all courses
            </p>
          </div> */}

          <WelcomeCard />


          {/* Enhanced Statistics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mb-12">
            <StatCard 
              title="Online Sessions"
              count={totalStats.onlineCount}
              icon={UserCheck}
              gradient="from-emerald-500 to-emerald-600"
              percentage={totalStats.total > 0 ? Math.round((totalStats.online / totalStats.total) * 100) : 0}
              delay={0}
            />
            <StatCard 
              title="Offline Sessions"
              count={totalStats.offlineCount}
              icon={UserX}
              gradient="from-red-500 to-red-600"
              percentage={totalStats.total > 0 ? Math.round((totalStats.offline / totalStats.total) * 100) : 0}
              delay={200}
            />
            <StatCard 
              title="Late Arrivals"
              count={totalStats.lateCount}
              icon={Clock}
              gradient="from-amber-500 to-amber-600"
              percentage={totalStats.total > 0 ? Math.round((totalStats.late / totalStats.total) * 100) : 0}
              delay={400}
            />
            <StatCard 
              title="Excused Absences"
              count={totalStats.excusedCount}
              icon={AlertTriangle}
              gradient="from-indigo-500 to-indigo-600"
              percentage={totalStats.total > 0 ? Math.round((totalStats.excused / totalStats.total) * 100) : 0}
              delay={600}
            />
          </div>

          {/* Enhanced Overall Chart */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 mb-12 border border-white/20">
            <div className="flex items-center space-x-3 mb-8">
              <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-800 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text">
                Overall Performance Analytics
              </h2>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Enhanced Overall Bar Chart */}
              <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 shadow-inner">
                <h3 className="text-xl font-bold text-gray-700 mb-6 flex items-center space-x-2">
                  <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-full"></div>
                  <span>Attendance Overview</span>
                </h3>
                <ResponsiveContainer width="100%" height={320}>
                  <AreaChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <defs>
                      <linearGradient id="totalOnlineGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#10b981" stopOpacity={0.8}/>
                        <stop offset="100%" stopColor="#10b981" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="name" tick={{ fill: '#64748b' }} />
                    <YAxis tick={{ fill: '#64748b' }} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                        border: 'none', 
                        borderRadius: '16px', 
                        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' 
                      }} 
                    />
                    <Area type="monotone" dataKey="value" stroke="#10b981" fill="url(#totalOnlineGrad)" strokeWidth={3} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              
              {/* Enhanced Overall Pie Chart */}
              <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 shadow-inner">
                <h3 className="text-xl font-bold text-gray-700 mb-6 flex items-center space-x-2">
                  <div className="w-1 h-6 bg-gradient-to-b from-purple-500 to-pink-600 rounded-full"></div>
                  <span>Global Distribution</span>
                </h3>
                <ResponsiveContainer width="100%" height={320}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Online', value: totalStats.onlineCount },
                        { name: 'Offline', value: totalStats.offlineCount },
                        { name: 'Late', value: totalStats.lateCount },
                        { name: 'Excused', value: totalStats.excusedCount }
                      ]}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      innerRadius={50}
                      paddingAngle={3}
                      dataKey="value"
                      label={({ name, percent }) => {

                        if(percent === 0) return null;
                        return `${name} ${(percent * 100).toFixed(0)}%`; // Show label for non-zero percentages
                      }}
                      labelLine={false}
                    >
                      {PIE_COLORS.map((color, index) => (
                        <Cell key={`cell-${index}`} fill={color} stroke="white" strokeWidth={3} />
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

          {/* Course-wise Details */}
          {/* <div className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold text-gray-800 mb-4 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                Course Performance Details
              </h2>
              <p className="text-lg text-gray-600">Individual course analytics and insights</p>
            </div>
            
            {processedData.map((course, index) => (
              <CourseCard key={course.courseId} course={course} index={index} />
            ))}
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default StudentDashHome;