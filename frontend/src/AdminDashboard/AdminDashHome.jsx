import React, { useState, useEffect } from 'react';
import { Users, UserCheck, UserX, TrendingUp, Globe } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import axios from "axios";

const AdminDashboardHome = () => {
  const [stats, setStats] = useState({
    registeredStudents: 1247,
    registeredTeachers: 89,
    unapprovedUsers: 23,
    studentMaleRatio: 58,
    studentFemaleRatio: 42,
    teacherMaleRatio: 65,
    teacherFemaleRatio: 35
  });

  const [studentGenderData, setStudentGenderData] = useState([
    { name: 'Male', value: stats.studentMaleRatio, color: '#009689' },
    { name: 'Female', value: stats.studentFemaleRatio, color: '#00d5be' }
  ]);

  const [teacherGenderData, setTeacherGenderData] = useState([
    { name: 'Male', value: stats.teacherMaleRatio, color: '#009689' },
    { name: 'Female', value: stats.teacherFemaleRatio, color: '#00d5be' }
  ]);

  const [ageRangeData, setAgeRangeData] = useState([
    { range: '13-15', students: 245 },
    { range: '16-18', students: 487 },
    { range: '19-21', students: 356 },
    { range: '22-25', students: 159 },
    { range: '25+', students: 112}
  ]);

  const [countryData, setCountryData] = useState([
    { country: 'Pakistan', students: 456 },
    { country: 'India', students: 312 },
    { country: 'Bangladesh', students: 198 },
    { country: 'UAE', students: 143 },
    { country: 'Saudi Arabia', students: 87 },
    { country: 'Others', students: 51 }
  ]);


  const getAnalytics = () => {
    axios.get("/api/v1/users/dashboard-analytics").then(res => {

      const { registeredStudents, registeredTeachers, unapprovedUsers, countryDistribution, studentGenderRatio, teacherGenderRatio, ageRanges } = res.data.data

      setStats({ registeredStudents, registeredTeachers, unapprovedUsers, studentMaleRatio: studentGenderRatio.male, studentFemaleRatio: studentGenderRatio.female, teacherMaleRatio: teacherGenderRatio.male, teacherFemaleRatio: teacherGenderRatio.female})

      setStudentGenderData([
          { name: 'Male', value: studentGenderRatio.male, color: '#009689' },
          { name: 'Female', value: studentGenderRatio.female, color: '#00d5be' }
        ])

      setTeacherGenderData([
        { name: 'Male', value: teacherGenderRatio.male, color: '#009689' },
        { name: 'Female', value: teacherGenderRatio.female, color: '#00d5be' }
      ])

      setAgeRangeData(ageRanges)

      setCountryData(countryDistribution)



    }).catch(err => console.log(err))
  }

  useEffect(() => {
    getAnalytics()
  }, [])

  const StatCard = ({ icon: Icon, title, value, subtitle, gradient }) => (
    <div className={`bg-gradient-to-br ${gradient} rounded-xl shadow-lg p-6 text-white transform transition-all duration-300 hover:scale-105 hover:shadow-xl`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm opacity-90 font-medium">{title}</p>
          <h3 className="text-3xl font-bold mt-2">{value}</h3>
          {subtitle && <p className="text-xs opacity-80 mt-1">{subtitle}</p>}
        </div>
        <div className="bg-opacity-20 p-4 rounded-full">
          <Icon size={32}/>
        </div>
      </div>
    </div>
  );

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white px-4 py-2 rounded-lg shadow-lg border border-gray-200">
          <p className="text-sm font-semibold text-gray-800">{payload[0].name}</p>
          <p className="text-sm text-gray-600">{payload[0].value}%</p>
        </div>
      );
    }
    return null;
  };

  const CustomBarTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white px-4 py-2 rounded-lg shadow-lg border border-gray-200">
          <p className="text-sm font-semibold text-gray-800">Age: {payload[0].payload.range}</p>
          <p className="text-sm text-gray-600">Students: {payload[0].value}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">Dashboard Overview</h1>
          <p className="text-gray-600">Monitor and manage your institution's analytics</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={Users}
            title="Registered Students"
            value={stats.registeredStudents.toLocaleString()}
            subtitle="Active learners"
            gradient="from-[#009689] to-[#007a6f]"
          />
          <StatCard
            icon={UserCheck}
            title="Registered Teachers"
            value={stats.registeredTeachers}
            subtitle="Active educators"
            gradient="from-[#00d5be] to-[#00b8a8]"
          />
          <StatCard
            icon={UserX}
            title="Unapproved Users"
            value={stats.unapprovedUsers}
            subtitle="Pending approval"
            gradient="from-orange-500 to-orange-600"
          />
          <StatCard
            icon={TrendingUp}
            title="Total Users"
            value={(stats.registeredStudents + stats.registeredTeachers).toLocaleString()}
            subtitle="Combined count"
            gradient="from-purple-500 to-purple-600"
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Student Gender Distribution */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Student Gender Distribution</h2>
            <div className="h-64 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={studentGenderData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {studentGenderData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-6 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-primary"></div>
                <span className="text-sm text-gray-600">Male ({stats.studentMaleRatio}%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-secondary"></div>
                <span className="text-sm text-gray-600">Female ({stats.studentFemaleRatio}%)</span>
              </div>
            </div>
          </div>

          {/* Teacher Gender Distribution */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Teacher Gender Distribution</h2>
            <div className="h-64 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={teacherGenderData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {teacherGenderData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-6 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-[#009689]"></div>
                <span className="text-sm text-gray-600">Male ({stats.teacherMaleRatio}%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-[#00d5be]"></div>
                <span className="text-sm text-gray-600">Female ({stats.teacherFemaleRatio}%)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Age Distribution Chart */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Student Age Distribution</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ageRangeData}>
                <XAxis 
                  dataKey="range" 
                  tick={{ fill: '#6b7280' }}
                  tickLine={{ stroke: '#e5e7eb' }}
                />
                <YAxis 
                  tick={{ fill: '#6b7280' }}
                  tickLine={{ stroke: '#e5e7eb' }}
                />
                <Tooltip content={<CustomBarTooltip />} />
                <Bar 
                  dataKey="students" 
                  fill="#009689"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 text-center text-sm text-gray-600">
            Total Students Across All Age Groups: {ageRangeData.reduce((sum, item) => sum + item.students, 0).toLocaleString()}
          </div>
        </div>

        {/* Country Distribution Chart */}
        <div className="bg-white rounded-xl shadow-lg p-6 mt-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-primary bg-opacity-10 p-2 rounded-lg">
              <Globe className="text-white" size={24} />
            </div>
            <h2 className="text-xl font-bold text-gray-800">Student Country-wise Distribution</h2>
          </div>
          <div className="h-80 mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={countryData}>
                <XAxis 
                  dataKey="country" 
                  tick={{ fill: '#6b7280' }}
                  tickLine={{ stroke: '#e5e7eb' }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis 
                  tick={{ fill: '#6b7280' }}
                  tickLine={{ stroke: '#e5e7eb' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    padding: '8px 12px'
                  }}
                  cursor={{ fill: 'rgba(0, 150, 137, 0.1)' }}
                />
                <Bar 
                  dataKey="students" 
                  fill="#009689" 
                  radius={[8, 8, 0, 0]}
                  name="Students"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-4">
            {countryData.map((item, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 hover:border-[#009689] transition-colors hover:shadow-md">
                <p className="text-sm font-semibold text-gray-800 mb-1">{item.country}</p>
                <p className="text-2xl font-bold text-[#009689]">{item.students}</p>
                <p className="text-xs text-gray-500 mt-1">Students</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardHome;