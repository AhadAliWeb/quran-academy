import React, { useState } from 'react';
import { Edit2, Trash2, Calendar, Clock, Link2, Link, View, EyeIcon, LucideEye, ScanEye, ScanEyeIcon, LucideEyeOff, Eye } from 'lucide-react';

export default function TodayEnrollments() {
  const [enrollments] = useState([
    {
      schedule: {
        days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        time: "11:00",
        duration: 30,
        notificationSend: false
      },
      _id: "68f9bf4a6215717087c2ed31",
      student: {
        _id: "68f90d2610d9da12325c5638",
        name: "Usman"
      },
      teacher: "68e3ac28090658a6fe8c5542",
      course: {
        _id: "68ca84f34e6a6d62d1d09223",
        name: "Translation"
      },
      createdAt: "2025-10-23T05:38:18.971Z",
      updatedAt: "2025-10-23T05:38:18.971Z",
      __v: 0
    }
  ]);

  const formatDays = (days) => {
    if (days.length === 5 && days.includes("Monday") && days.includes("Friday")) {
      return "Mon - Fri";
    }
    return days.map(d => d.substring(0, 3)).join(", ");
  };

  const handleEdit = (id) => {
    console.log('Edit enrollment:', id);
  };

  const handleDelete = (id) => {
    console.log('Delete enrollment:', id);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
            Student Enrollments
          </h1>
          <p className="text-gray-600">
            Manage and view all student course enrollments
          </p>
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-primary text-white">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Student Name</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Student ID</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Course</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Days</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Time</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {enrollments.map((enrollment, index) => (
                  <tr 
                    key={enrollment._id} 
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-white font-semibold">
                          {enrollment.student.name.charAt(0)}
                        </div>
                        <span className="ml-3 text-gray-800 font-medium">
                          {enrollment.student.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600 font-mono text-sm">
                      {enrollment.student.id || 'N/A'}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary bg-opacity-10 text-white">
                        {enrollment.course.name}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600 text-sm">
                    {enrollment.schedule.days.map(item  => item.substring(0, 3).padEnd(3, " ")).join(', ')}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-gray-600">
                        <Clock className="w-4 h-4 mr-2 text-secondary" />
                        <span className="text-sm">{enrollment.schedule.time}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleEdit(enrollment._id)}
                          className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                          aria-label="Edit"
                        >
                          <Link className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(enrollment._id)}
                          className="p-2 rounded-lg bg-teal-50 text-primary hover:bg-teal-100 transition-colors"
                          aria-label="Delete"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden space-y-4">
          {enrollments.map((enrollment) => (
            <div 
              key={enrollment._id} 
              className="bg-white rounded-lg shadow-sm overflow-hidden"
            >
              <div className="bg-primary px-4 py-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-white bg-opacity-20 flex items-center justify-center text-white font-semibold">
                      {enrollment.student.name.charAt(0)}
                    </div>
                    <div className="ml-3">
                      <h3 className="text-white font-semibold">
                        {enrollment.student.name}
                      </h3>
                      <p className="text-white text-opacity-80 text-xs font-mono">
                        ID: {enrollment.student._id.substring(0, 10)}...
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 text-sm">Course</span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary bg-opacity-10 text-primary">
                    {enrollment.course.name}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 text-sm flex items-center">
                    <Calendar className="w-4 h-4 mr-1 text-secondary" />
                    Days
                  </span>
                  <span className="text-gray-800 text-sm font-medium">
                    {formatDays(enrollment.schedule.days)}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 text-sm flex items-center">
                    <Clock className="w-4 h-4 mr-1 text-secondary" />
                    Time
                  </span>
                  <span className="text-gray-800 text-sm font-medium">
                    {enrollment.schedule.time}
                  </span>
                </div>
                
                <div className="flex gap-2 pt-2 border-t border-gray-100">
                  <button
                    onClick={() => handleEdit(enrollment._id)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors font-medium text-sm"
                  >
                    <Edit2 className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(enrollment._id)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-teal-50 text-primary hover:bg-red-100 transition-colors font-medium text-sm"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {enrollments.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              No Enrollments Found
            </h3>
            <p className="text-gray-600">
              There are no student enrollments to display at this time.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}