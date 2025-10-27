import React, { useState, useEffect } from 'react';
import { FileText, ClipboardCheck, Search, Filter, Users } from 'lucide-react';
import axios from "axios";
import { useSelector } from 'react-redux';
import { Link } from 'react-router';

export default function StudentList() {
  const [enrollments, setEnrollments] = useState([]);
  const user = useSelector(state => state.user);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');

  // const filteredStudents = students.filter(student => {
  //   const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //                        student.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //                        student.course.toLowerCase().includes(searchTerm.toLowerCase());
  //   const matchesFilter = filterStatus === 'All' || student.status === filterStatus;
  //   return matchesSearch && matchesFilter;
  // });

  const getEnrollments = () => {
    axios.get(`/api/v1/enrollment/teacher-enrollments/${user.id}`).then(res => setEnrollments(res.data.enrollments || [])).catch(err => console.log(err))
  }

  console.log(enrollments)

  useEffect(() => {
    if(user.id) {
      getEnrollments()
    }
  }, [user.id])

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

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-secondary rounded-lg shadow-lg p-6 md:p-8 mb-6 md:mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-white/20 p-3 rounded-lg">
              <Users className="w-6 h-6 md:w-8 md:h-8 text-white" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-white">
              Students
            </h1>
          </div>
          <p className="text-white/90 text-sm md:text-base ml-0 md:ml-14">
            Manage Student Records and Evaluation
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-lg shadow-lg p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by name, ID, or course..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009689] focus:border-transparent"
              />
            </div>
            
            {/* Filter */}
            <div className="flex items-center gap-2">
              <Filter className="text-gray-400 w-5 h-5" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009689] focus:border-transparent"
              >
                <option value="All">All Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table Container */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#009689] text-white">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold">S.No</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Student Name</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Student ID</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Course</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                { enrollments.length > 0 &&
                enrollments.map((enrollment, index) => (
                  <tr key={enrollment._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-900">{index + 1}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{enrollment.student.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{enrollment.student.id}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{enrollment.course.name}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(enrollment.student.status)}`}>
                        {enrollment.student.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <Link to={`/teacher/dashboard/monthly-report/${enrollment._id}`} className="inline-flex items-center gap-1 px-3 py-2 bg-[#009689] text-white text-xs font-medium rounded-lg hover:bg-[#00d5be] transition-colors">
                          <FileText className="w-4 h-4" />
                          <span>Monthly Report</span>
                        </Link>
                        <Link to={`/teacher/dashboard/general-evaluation/${enrollment._id}`} className="inline-flex items-center gap-1 px-3 py-2 bg-[#00d5be] text-white text-xs font-medium rounded-lg hover:bg-[#009689] transition-colors">
                          <ClipboardCheck className="w-4 h-4" />
                          <span>Evaluation</span>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden divide-y divide-gray-200">
            { enrollments.length > 0 &&
            enrollments.map((enrollment, index) => (
              <div key={enrollment._id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="text-sm text-gray-500 mb-1">S.No: {index + 1}</div>
                    <h3 className="font-semibold text-gray-900 text-lg">{enrollment.student.name}</h3>
                    <p className="text-sm text-gray-600">{enrollment.enrollmentId} || {index}</p>
                  </div>
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(enrollment.student.status)}`}>
                    {enrollment.student.status}
                  </span>
                </div>
                
                <div className="mb-3">
                  <span className="text-sm text-gray-600">Course: </span>
                  <span className="text-sm font-medium text-gray-900">{enrollment.course.name}</span>
                </div>

                <div className="flex flex-col gap-2">
                  <Link to={`/teacher/dashboard/monthly-report/${enrollment._id}`} className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#009689] text-white text-sm font-medium rounded-lg hover:bg-[#00d5be] transition-colors">
                    <FileText className="w-4 h-4" />
                    <span>Add Monthly Report</span>
                  </Link>
                  <Link to={`/teacher/dashboard/general-evaluation/${enrollment._id}`} className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#00d5be] text-white text-sm font-medium rounded-lg hover:bg-[#009689] transition-colors">
                    <ClipboardCheck className="w-4 h-4" />
                    <span>General Evaluation</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {enrollments.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No students found</p>
              <p className="text-gray-400 text-sm mt-2">Try adjusting your search or filter</p>
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="mt-4 text-white text-sm">
          Showing {enrollments.length} of {enrollments.length} students
        </div>
      </div>
    </div>
  );
}