import React, { useState, useEffect } from 'react';
import { Search, Edit, Trash2, Plus, Users, AlertCircle, Loader } from 'lucide-react';
import axios from "axios"
import {Link} from "react-router"

const AllTeachers = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);

  // Base API URL - adjust according to your backend
  const API_BASE = '/api/v1'; // Update this to match your backend URL

// Fetch all teachers
const fetchTeachers = async () => {
  try {
    setLoading(true);
    const response = await axios.get(`${API_BASE}/teachers`);
    setTeachers(response.data.teachers);
    setError('');
  } catch (err) {
    setError(err.response?.data?.msg || 'Failed to fetch teachers');
    setTeachers([]);
  } finally {
    setLoading(false);
  }
};

// Search teachers
const searchTeachers = async (query) => {
  if (!query.trim()) {
    fetchTeachers();
    return;
  }

  try {
    setSearchLoading(true);
    const response = await axios.get(`${API_BASE}/teachers/search`, {
      params: { search: query },
    });
    setTeachers(response.data.teachers);
    setError('');
  } catch (err) {
    setError(err.response?.data?.msg || 'No matching teachers found');
    setTeachers([]);
  } finally {
    setSearchLoading(false);
  }
};

// Delete teacher
const deleteTeacher = async (id) => {
  if (!window.confirm('Are you sure you want to delete this teacher?')) return;

  try {
    await axios.delete(`${API_BASE}/teachers/${id}`);
    setTeachers(teachers.filter(teacher => teacher._id !== id));
  } catch (err) {
    setError(err.response?.data?.msg || 'Failed to delete teacher');
  }
};

  // Handle search input change
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    
    // Debounce search
    const timeoutId = setTimeout(() => {
      searchTeachers(value);
    }, 500);

    return () => clearTimeout(timeoutId);
  };

  // Get status badge color
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary rounded-lg">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Teachers Management</h1>
                <p className="text-gray-600 mt-1">Manage and view all teachers in the system</p>
              </div>
            </div>
            <Link to="/admin/dashboard/add-teacher">
            <button className="flex items-center gap-2 bg-primary hover:bg-secondary cursor-pointer text-white px-4 py-2 rounded-lg font-medium transition-colors">
              <Plus className="w-4 h-4" />
              Add Teacher
            </button>
            </Link>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search teachers by name or email..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
            />
            {searchLoading && (
              <Loader className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 animate-spin" />
            )}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader className="w-8 h-8 text-primary animate-spin" />
              <span className="ml-2 text-gray-600">Loading teachers...</span>
            </div>
          ) : teachers.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No teachers found</p>
              <p className="text-gray-400 mt-2">Add some teachers to get started</p>
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Salary</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {teachers.map((teacher) => (
                      <tr key={teacher._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                              <span className="text-white font-medium">
                                {teacher.name?.charAt(0)?.toUpperCase() || 'T'}
                              </span>
                            </div>
                            <div className="ml-3">
                              <p className="text-sm font-medium text-gray-900">{teacher.name || 'N/A'}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <p className="text-sm text-gray-900">{teacher.email || 'N/A'}</p>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <p className="text-sm text-gray-900">
                            {teacher.salary ? `$${teacher.salary.toLocaleString()}` : 'N/A'}
                          </p>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(teacher.status || 'active')}`}>
                            {teacher.status || 'Active'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex items-center gap-2">
                            <Link to={`/admin/dashboard/edit-teacher/${teacher._id}`} className="text-primary hover:text-secondary p-1">
                              <Edit className="w-4 h-4" />
                            </Link>
                            <button 
                              onClick={() => deleteTeacher(teacher._id)}
                              className="text-red-600 hover:text-red-800 p-1"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="lg:hidden divide-y divide-gray-200">
                {teachers.map((teacher) => (
                  <div key={teacher._id} className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center flex-1">
                        <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                          <span className="text-white font-medium text-lg">
                            {teacher.name?.charAt(0)?.toUpperCase() || 'T'}
                          </span>
                        </div>
                        <div className="ml-3 flex-1">
                          <p className="text-base font-medium text-gray-900">{teacher.name || 'N/A'}</p>
                          <p className="text-sm text-gray-500 mt-1">{teacher.email || 'N/A'}</p>
                          <div className="flex items-center gap-4 mt-2">
                            <p className="text-sm text-gray-700">
                              <span className="font-medium">Salary:</span> {teacher.salary ? `$${teacher.salary.toLocaleString()}` : 'N/A'}
                            </p>
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(teacher.status || 'active')}`}>
                              {teacher.status || 'Active'}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-2">
                        <button className="text-primary hover:text-secondary p-2">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => deleteTeacher(teacher._id)}
                          className="text-red-600 hover:text-red-800 p-2"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Table Footer */}
              <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{teachers.length}</span> teacher{teachers.length !== 1 ? 's' : ''}
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllTeachers;