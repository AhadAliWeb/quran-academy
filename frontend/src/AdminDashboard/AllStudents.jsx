import React, { useEffect, useState } from 'react';
import { Search, Filter, ChevronLeft, ChevronRight, Eye, Edit, Trash2 } from 'lucide-react';
import axios from 'axios';

const AllStudents = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalStudents, setTotalStudents] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const itemsPerPage = 10;



  const fetchStudents = async (page = 1, search = '', status = 'All') => {
    try {
      setLoading(true);
      setError(null);
      
      const params = new URLSearchParams({
        page: page.toString(),
        limit: itemsPerPage.toString(),
      });
      
      // Add search parameter if exists

      params.append('search', search.trim() || '');
      
      // Add status filter if not 'All'
      if (status !== 'All') {
        params.append('status', status);
      }
  
      const response = await axios.get(`/api/v1/students?${params.toString()}`);
      
      const { students: fetchedStudents, totalStudents, totalPages, page: currentPageFromAPI } = response.data;
      
      setStudents(fetchedStudents);
      setTotalStudents(totalStudents);
      setTotalPages(totalPages);
      setCurrentPage(currentPageFromAPI);
      
    } catch (err) {
      console.error('Error fetching students:', err);
      setError(err.response?.data?.message || 'Failed to fetch students');
    } finally {
      setLoading(false);
    }
  };


// Initial fetch
useEffect(() => {
  fetchStudents(1, searchTerm, statusFilter);
}, []);

// Debounced search effect
useEffect(() => {
  const timeoutId = setTimeout(() => {
    setCurrentPage(1);
    fetchStudents(1, searchTerm, statusFilter);
  }, 500);

  return () => clearTimeout(timeoutId);
}, [searchTerm]);

// Status filter effect
useEffect(() => {
  setCurrentPage(1);
  fetchStudents(1, searchTerm, statusFilter);
}, [statusFilter]);


const handlePageChange = (newPage) => {
  setCurrentPage(newPage);
  fetchStudents(newPage, searchTerm, statusFilter);
};

const formatStudentData = (student) => {
  return {
    id: student._id,
    name: student.name || 'N/A',  // Use name directly instead of firstName + lastName
    email: student.email || 'N/A',
    courses: student.courses || student.enrolledCourses || [],
    fees: student.fees || student.tuitionFees || 0,
    time: student.classTime || student.schedule?.time || 'N/A',
    day: student.classDay || student.schedule?.day || 'N/A',
    status: student.status || 'Active'
  };
};

const handleDelete = async (studentId) => {
  if (window.confirm('Are you sure you want to delete this student?')) {
    try {
      await axios.delete(`/api/v1/students/${studentId}`);
      fetchStudents(currentPage, searchTerm, statusFilter);
    } catch (err) {
      console.error('Error deleting student:', err);
      alert(err.response?.data?.message || 'Failed to delete student');
    }
  }
};



  // Sample student data
  const studentsData = [
    {
      id: 1,
      name: 'John Smith',
      email: 'john.smith@email.com',
      courses: ['Mathematics', 'Physics'],
      fees: 1200,
      time: '9:00 AM',
      day: 'Monday',
      status: 'Active'
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      email: 'sarah.j@email.com',
      courses: ['Chemistry', 'Biology'],
      fees: 1500,
      time: '2:00 PM',
      day: 'Tuesday',
      status: 'Demo'
    },
    {
      id: 3,
      name: 'Mike Davis',
      email: 'mike.davis@email.com',
      courses: ['Computer Science'],
      fees: 800,
      time: '11:00 AM',
      day: 'Wednesday',
      status: 'Left'
    },
    {
      id: 4,
      name: 'Emily Wilson',
      email: 'emily.w@email.com',
      courses: ['English', 'History', 'Art'],
      fees: 2000,
      time: '3:00 PM',
      day: 'Thursday',
      status: 'Active'
    },
    {
      id: 5,
      name: 'David Brown',
      email: 'david.brown@email.com',
      courses: ['Mathematics'],
      fees: 600,
      time: '10:00 AM',
      day: 'Friday',
      status: 'Demo'
    },
    {
      id: 6,
      name: 'Lisa Anderson',
      email: 'lisa.a@email.com',
      courses: ['Physics', 'Chemistry'],
      fees: 1300,
      time: '1:00 PM',
      day: 'Monday',
      status: 'Active'
    },
    {
      id: 7,
      name: 'Tom Wilson',
      email: 'tom.w@email.com',
      courses: ['Biology'],
      fees: 700,
      time: '4:00 PM',
      day: 'Tuesday',
      status: 'Left'
    },
    {
      id: 8,
      name: 'Anna Martinez',
      email: 'anna.m@email.com',
      courses: ['Art', 'Music'],
      fees: 900,
      time: '11:30 AM',
      day: 'Wednesday',
      status: 'Active'
    }
  ];

  // Filter students based on search term and status
  const filteredStudents = studentsData.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || student.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Pagination
  // const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;

  const getStatusBadge = (status) => {
    const baseClasses = 'px-2 py-1 rounded-full text-xs font-medium';
    switch (status) {
      case 'Active':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'Demo':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'Left':
        return `${baseClasses} bg-red-100 text-red-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  {/* Loading State */}
  {loading && (
    <div className="flex items-center justify-center py-12">
      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mr-2"></div>
      <span className="text-gray-600">Loading students...</span>
    </div>
  )}

  {/* Error State */}
  {error && (
    <div className="p-4 bg-red-50 border-l-4 border-red-500 m-4">
      <p className="text-red-800">{error}</p>
      <button 
        onClick={() => fetchStudents(currentPage, searchTerm, statusFilter)}
        className="mt-2 text-sm bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
      >
        Try Again
      </button>
    </div>
  )}

  return (
    <div className="p-4 lg:p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-sm">
        {/* Header */}
        <div className="p-4 lg:p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">All Students</h1>
          
          {/* Search and Filter Controls */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              />
            </div>
            
            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              >
                <option value="All">All Status</option>
                <option value="Active">Active</option>
                <option value="Demo">Demo</option>
                <option value="Left">Left</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                  Email
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Phone
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {students.map((_student) => {
                const student = formatStudentData(_student)
                return (
                  <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{student.name}</div>
                        {/* <div className="text-sm text-gray-500">{student.email}</div> */}
                      </div>
                    </td>
                    <td className="px-4 py-4 hidden md:table-cell">
                      <div className="flex flex-wrap gap-1">
                        {student.email}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm font-medium text-gray-900">{student.phone || "0312-3456789"}</div>
                    </td>
                    <td className="px-4 py-4">
                      <span className={getStatusBadge(student.status)}>
                        {student.status}
                      </span>
                      {/* Show schedule on mobile/tablet */}
                      <div className="lg:hidden mt-1 text-xs text-gray-500">
                        {student.time} - {student.day}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <button className="text-primary hover:text-secondary transition-colors">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="text-blue-600 hover:text-blue-800 transition-colors">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="text-red-600 hover:text-red-800 transition-colors" onClick={() => handleDelete(_student._id)}>
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
              
            </tbody>
          </table>
          {!loading && !error && students.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-500 text-lg">No students found</div>
                <div className="text-gray-400 text-sm mt-1">Try adjusting your search or filter criteria</div>
              </div>
            )}
        </div>

        {/* Pagination */}
        {students.length > 0 && (
          <div className="px-4 py-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-gray-700">
              Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, totalStudents)}  of {totalStudents} students
            </div>
                        
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="flex items-center px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Previous
              </button>
              
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  const pageNum = i + 1;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`px-3 py-1 rounded-md text-sm ${
                        currentPage === pageNum
                          ? 'bg-primary text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>
              
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="flex items-center px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
                <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllStudents;