import React, { useState, useEffect } from 'react';
import { Calendar, CheckCircle, XCircle, Clock, Shield, ChevronLeft, ChevronRight } from 'lucide-react';
import axios from "axios";
import { useParams } from 'react-router';
import LoadingScreen from "../components/LoadingScreen";

const AttendanceDetails = () => {
  const [startDate, setStartDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [endDate, setEndDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(10);
  const { enrollmentId } = useParams();

  const [attendanceData, setAttendanceData] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalRecords: 0,
    recordsPerPage: 10,
    hasNextPage: false,
    hasPrevPage: false,
  });

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Online':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'Offline':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'Late':
        return <Clock className="w-5 h-5 text-orange-500" />;
      case 'Excused':
        return <Shield className="w-5 h-5 text-blue-500" />;
      default:
        return null;
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Online':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Offline':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'Late':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Excused':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getAttendance = (page = currentPage) => {
    setLoading(true);

    const params = new URLSearchParams({
      page: page.toString(),
      limit: recordsPerPage.toString(),
    });

    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);

    axios
      .get(`/api/v1/attendance/details/${enrollmentId}?${params.toString()}`)
      .finally(() => setLoading(false))
      .then((res) => {
        setAttendanceData(res.data.attendances);
        setPagination(res.data.pagination);
        setCurrentPage(res.data.pagination.currentPage);
      })
      .catch((err) => {
        setAttendanceData([]);
        setPagination({
          currentPage: 1,
          totalPages: 1,
          totalRecords: 0,
          recordsPerPage: 10,
          hasNextPage: false,
          hasPrevPage: false,
        });
      });
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      getAttendance(newPage);
    }
  };

  const handleSearch = () => {
    setCurrentPage(1);
    getAttendance(1);
  };

  const handleRecordsPerPageChange = (e) => {
    setRecordsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  useEffect(() => {
    getAttendance(1);
  }, [recordsPerPage]);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Attendance Details</h1>
          <p className="text-gray-600">View your attendance records</p>
        </div>

        {/* Date Range Filter */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex-1">
              <button
                className="py-3 px-5 bg-primary text-white rounded-md mt-5 hover:bg-primary-dark transition-colors"
                onClick={handleSearch}
              >
                Search
              </button>
            </div>
          </div>

          {/* Records per page selector */}
          <div className="mt-4 flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Show:</label>
            <select
              value={recordsPerPage}
              onChange={handleRecordsPerPageChange}
              className="px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
            <span className="text-sm text-gray-600">records per page</span>
          </div>
        </div>

        {/* Attendance Table - Desktop */}
        <div className="hidden sm:block bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Date</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {attendanceData.length === 0 ? (
                <tr>
                  <td colSpan="2" className="text-center py-12 text-gray-500">
                    No attendance records found for the selected date range.
                  </td>
                </tr>
              ) : (
                attendanceData.map((record) => (
                  <tr key={record._id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-6 text-gray-900 font-medium">
                      {new Date(record.date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(record.status)}
                        <span
                          className={`px-4 py-2 rounded-full text-sm font-medium border ${getStatusBadgeClass(
                            record.status
                          )}`}
                        >
                          {record.status}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* Pagination Controls - Desktop */}
          {attendanceData.length > 0 && (
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Showing {((currentPage - 1) * recordsPerPage) + 1} to{' '}
                {Math.min(currentPage * recordsPerPage, pagination.totalRecords)} of{' '}
                {pagination.totalRecords} results
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={!pagination.hasPrevPage}
                  className={`px-3 py-2 rounded-lg flex items-center gap-1 text-sm font-medium transition-colors ${
                    pagination.hasPrevPage
                      ? 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </button>

                <div className="flex items-center gap-1">
                  {[...Array(pagination.totalPages)].map((_, index) => {
                    const page = index + 1;
                    if (
                      page === 1 ||
                      page === pagination.totalPages ||
                      (page >= currentPage - 1 && page <= currentPage + 1)
                    ) {
                      return (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                            page === currentPage
                              ? 'bg-primary text-white'
                              : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          {page}
                        </button>
                      );
                    } else if (page === currentPage - 2 || page === currentPage + 2) {
                      return (
                        <span key={page} className="px-2 text-gray-500">
                          ...
                        </span>
                      );
                    }
                    return null;
                  })}
                </div>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={!pagination.hasNextPage}
                  className={`px-3 py-2 rounded-lg flex items-center gap-1 text-sm font-medium transition-colors ${
                    pagination.hasNextPage
                      ? 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Mobile Cards View */}
        <div className="sm:hidden space-y-4">
          {attendanceData.length === 0 ? (
            <div className="bg-white rounded-xl p-8 text-center text-gray-500">
              No attendance records found for the selected date range.
            </div>
          ) : (
            <>
              {attendanceData.map((record) => (
                <div key={record._id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 mb-3">
                        {new Date(record.date).toLocaleDateString('en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </p>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(record.status)}
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusBadgeClass(
                            record.status
                          )}`}
                        >
                          {record.status}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Pagination Controls - Mobile */}
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                <div className="text-sm text-gray-600 text-center mb-4">
                  Page {currentPage} of {pagination.totalPages} ({pagination.totalRecords} total)
                </div>
                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={!pagination.hasPrevPage}
                    className={`px-4 py-2 rounded-lg flex items-center gap-1 text-sm font-medium transition-colors ${
                      pagination.hasPrevPage
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Prev
                  </button>

                  <span className="px-4 py-2 text-sm font-medium text-gray-700">
                    {currentPage}
                  </span>

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={!pagination.hasNextPage}
                    className={`px-4 py-2 rounded-lg flex items-center gap-1 text-sm font-medium transition-colors ${
                      pagination.hasNextPage
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AttendanceDetails;