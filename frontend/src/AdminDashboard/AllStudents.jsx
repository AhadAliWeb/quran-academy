import React, { useEffect, useState } from 'react';
import { Search, Filter, ChevronLeft, ChevronRight, Eye, Edit, Trash2 } from 'lucide-react';
import axios from 'axios';
import { Link } from 'react-router';
import ConfirmationDialog from '../components/ConfirmationDialog';

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
  const [dialog, setDialog] = useState(null);
  const [studentToDelete, setStudentToDelete] = useState(null)



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
    sid: student.id,
    name: student.name || 'N/A',  // Use name directly instead of firstName + lastName
    email: student.email || 'N/A',
    phoneNumber: student.phoneNumber || 'N/A',
    courses: student.courses || student.enrolledCourses || [],
    fees: student.fees || student.tuitionFees || 0,
    status: student.status || 'Active'
  };
};

const handleDelete = (studentId) => {

  setDialog({type: 'delete', message: "All Student Data, including Attendance, Lesons, Enrollments will be Deleted"})

  setStudentToDelete(studentId)

};

const confirmDelete = async (confirm) => {


  if(confirm) {

    try {
      await axios.delete(`/api/v1/students/${studentToDelete}`);
      fetchStudents(currentPage, searchTerm, statusFilter);
    } catch (err) {
      console.error('Error deleting student:', err);
      alert(err.response?.data?.message || 'Failed to delete student');
    }
  }
  else {
    setStudentToDelete(null)
  }

  setDialog(null)

} 


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
      {
        dialog &&
        <ConfirmationDialog
          type={dialog.type}
          message={dialog.message}
          onConfirm={confirmDelete}
        />
      }
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
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student ID
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
                      </div>
                    </td>
                    <td className="px-4 py-4 md:table-cell">
                      <div className="flex flex-wrap gap-1">
                        {student.sid || 'N/A'}
                      </div>
                    </td>
                    <td className="px-4 py-4 hidden md:table-cell">
                      <div className="flex flex-wrap gap-1">
                        {student.email}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm font-medium text-gray-900">{student.phoneNumber}</div>
                    </td>
                    <td className="px-4 py-4">
                      <span className={getStatusBadge(student.status)}>
                        {student.status}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <button className="text-primary hover:text-secondary transition-colors">
                          <Eye className="w-4 h-4" />
                        </button>
                        <Link to={`/admin/dashboard/edit-student/${student.id}`} className="text-blue-600 hover:text-blue-800 transition-colors">
                          <Edit className="w-4 h-4" />
                        </Link>
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