import React, { useState } from 'react';
import { Calendar, CheckCircle, XCircle, Clock, Shield } from 'lucide-react';

const AttendanceDetails = () => {
  const [startDate, setStartDate] = useState('2024-09-01');
  const [endDate, setEndDate] = useState('2024-09-30');

  // Sample attendance data
  const attendanceData = [
    { id: 1, date: '2024-09-28', status: 'Online' },
    { id: 2, date: '2024-09-27', status: 'Offline' },
    { id: 3, date: '2024-09-26', status: 'Late' },
    { id: 4, date: '2024-09-25', status: 'Online' },
    { id: 5, date: '2024-09-24', status: 'Excused' },
    { id: 6, date: '2024-09-23', status: 'Online' },
    { id: 7, date: '2024-09-20', status: 'Late' },
    { id: 8, date: '2024-09-19', status: 'Online' },
    { id: 9, date: '2024-09-18', status: 'Offline' },
    { id: 10, date: '2024-09-17', status: 'Online' },
    { id: 11, date: '2024-09-16', status: 'Online' },
    { id: 12, date: '2024-09-13', status: 'Late' },
    { id: 13, date: '2024-09-12', status: 'Online' },
    { id: 14, date: '2024-09-11', status: 'Offline' },
    { id: 15, date: '2024-09-10', status: 'Online' },
    { id: 16, date: '2024-09-09', status: 'Online' },
    { id: 17, date: '2024-09-06', status: 'Excused' },
    { id: 18, date: '2024-09-05', status: 'Online' },
    { id: 19, date: '2024-09-04', status: 'Late' },
    { id: 20, date: '2024-09-03', status: 'Online' },
  ];

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

  const filteredData = attendanceData.filter(record => {
    const recordDate = new Date(record.date);
    const start = new Date(startDate);
    const end = new Date(endDate);
    return recordDate >= start && recordDate <= end;
  });

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
            <div className="flex-1">
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
            
            <div className="flex-1">
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
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan="2" className="text-center py-12 text-gray-500">
                    No attendance records found for the selected date range.
                  </td>
                </tr>
              ) : (
                filteredData.map((record) => (
                  <tr key={record.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-6 text-gray-900 font-medium">
                      {new Date(record.date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(record.status)}
                        <span className={`px-4 py-2 rounded-full text-sm font-medium border ${getStatusBadgeClass(record.status)}`}>
                          {record.status}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards View */}
        <div className="sm:hidden space-y-4">
          {filteredData.length === 0 ? (
            <div className="bg-white rounded-xl p-8 text-center text-gray-500">
              No attendance records found for the selected date range.
            </div>
          ) : (
            filteredData.map((record) => (
              <div key={record.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 mb-3">
                      {new Date(record.date).toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </p>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(record.status)}
                      <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusBadgeClass(record.status)}`}>
                        {record.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AttendanceDetails;