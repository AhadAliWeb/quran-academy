import { useState, useEffect } from 'react';
import { Edit2, Trash2, Calendar, Clock, Link2, Eye, X, Edit } from 'lucide-react';
import axios from "axios"
import { Link } from "react-router"

export default function TodayEnrollments() {
  const [enrollments, setEnrollments] = useState([]);

  const initialData = {
    link: "",
    enrollmentId: "",
    time: ""
  }

  const options = {
    weekday: 'long',    // e.g., "Friday"
    month: 'long',      // e.g., "October"
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  };

  const [data, setData] = useState(initialData);
  const [showModal, setShowModal] = useState(false);

  const getEnrollments = () => {

    axios.get("/api/v1/enrollment").then(res => setEnrollments(res.data.enrollments)).catch(err => console.log(err))
  }

  useEffect(() => {

    getEnrollments();
  },[])

  const addLink = (id, time, link) => {
    setShowModal(true);

    const localTime = new Date(time).toLocaleString('en-US', options);

    setData(prev => ({...prev, enrollmentId: id, time: localTime, link}))

  };

  console.log(data)

  const handleSaveLink = () => {

    axios.post("/api/v1/enrollment/update-link", {enrollmentId: data.enrollmentId, link: data.link}).then(res => {
      getEnrollments()
    }).catch(err => console.log(err))


    // Add your API call here to save the link
    setShowModal(false);
    setData(initialData);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setData(initialData);
  };

  const viewEnrollment = (id) => {
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
                          onClick={() => addLink(enrollment._id, enrollment.meet?.time, enrollment.meet?.link)}
                          className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                        >
                          <Link2 className="w-4 h-4" />
                        </button>
                        <Link to={`/admin/dashboard/enrollments/${enrollment._id}`}
                          onClick={() => viewEnrollment(enrollment._id)}
                          className="p-2 rounded-lg bg-teal-50 text-primary hover:bg-teal-100 transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Link>
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
                    <div className="w-10 h-10 rounded-full bg-secondary bg-opacity-20 flex items-center justify-center text-white font-semibold">
                      {enrollment.student.name.charAt(0)}
                    </div>
                    <div className="ml-3">
                      <h3 className="text-white font-semibold">
                        {enrollment.student.name}
                      </h3>
                      <p className="text-white text-opacity-80 text-xs font-mono">
                        ID: {enrollment.student.id || 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 text-sm">Course</span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary bg-opacity-10 text-white">
                    {enrollment.course.name}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 text-sm flex items-center">
                    <Calendar className="w-4 h-4 mr-1 text-secondary" />
                    Days
                  </span>
                  <span className="text-gray-800 text-sm font-medium">
                    {enrollment.schedule.days.map(item  => item.substring(0, 3).padEnd(3, " ")).join(', ')}
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
                    onClick={() => addLink(enrollment._id, enrollment.meet.time, enrollment.meet.link)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors font-medium text-sm"
                  >
                    <Link2 className="w-4 h-4" />
                    Add Link
                  </button>
                  <Link to={`/admin/dashboard/enrollments/${enrollment._id}`}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-teal-50 text-primary hover:bg-teal-100 transition-colors font-medium text-sm"
                  >
                    <Edit2 className="w-4 h-4" />
                    Edit
                  </Link>
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

      {/* Add Link Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">Add Meeting Link</h2>
              <button
                onClick={handleCloseModal}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <div className='flex justify-between'>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meeting Link
                </label>
                <span className='block text-sm font-medium text-gray-700 mb-2'>Last Time Added: {data.time || "N/A"}</span>
                </div>
                <input
                  type="url"
                  value={data.link}
                  onChange={(e) => setData(prev => ({...prev, link: e.target.value}))}
                  placeholder="https://meet.google.com/..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                />
              </div>
            </div>

            <div className="flex gap-3 p-6 border-t border-gray-200">
              <button
                onClick={handleCloseModal}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveLink}
                className="flex-1 px-4 py-2 bg-teal-500 text-white rounded-lg font-medium hover:bg-teal-600 transition-colors"
              >
                Save Link
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}