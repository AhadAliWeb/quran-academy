import React, { useState, useEffect } from 'react';
import { 
  Edit2, 
  Save, 
  X, 
  Calendar, 
  Clock, 
  User, 
  BookOpen, 
  Link as LinkIcon,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import axios from 'axios';
import { useParams } from 'react-router'

const EnrollmentDetailsEdit = () => {

  const { enrollmentId } = useParams()

  const [enrollment, setEnrollment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [alert, setAlert] = useState(null);
  
  // Edit form states
  const [editedDays, setEditedDays] = useState([]);
  const [editedTime, setEditedTime] = useState('');
  const [editedDuration, setEditedDuration] = useState('');
  const [editedMeetLink, setEditedMeetLink] = useState('');

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const classDurations = ['30', '45', '60'];

  // Mock data - replace with actual API call
  useEffect(() => {
    fetchEnrollmentData();
  }, []);

  const fetchEnrollmentData = () => {

    axios.get(`/api/v1/enrollment/${enrollmentId}`).then(res => setEnrollment(res.data.enrollment)).catch(err => console.log(err)).finally(() => setLoading(false))

  };

  const showAlert = (message, theme) => {
    setAlert({ message, theme });
    setTimeout(() => setAlert(null), 3000);
  };


  console.log(isEditing, editedDays)


  const handleEdit = () => {

    setIsEditing(true);

      // Cancel editing - reset to original values
      setEditedDays(enrollment.schedule.days);
      setEditedTime(enrollment.schedule.time);
      setEditedDuration(enrollment.schedule.duration.toString());
      setEditedMeetLink(enrollment.meet.link);
  };

  const handleDayToggle = (day) => {
    setEditedDays(prev =>
      prev.includes(day)
        ? prev.filter(d => d !== day)
        : [...prev, day]
    );
  };

  const handleSave = async () => {
    try {
      const updatedData = {
        schedule: {
          days: editedDays,
          time: editedTime,
          duration: parseInt(editedDuration)
        },
        meet: {
          link: editedMeetLink,
          time: new Date().toISOString()
        }
      };


      axios.put(`/api/v1/enrollment/update/${enrollmentId}`, updatedData).then(res => console.log(res)).catch(err => console.log(err))
      
      // Update local state
      setEnrollment({
        ...enrollment,
        schedule: updatedData.schedule,
        meet: updatedData.meet
      });
      
      setIsEditing(false);
      showAlert('Enrollment updated successfully', 'success');
    } catch (error) {
      showAlert('Failed to update enrollment', 'danger');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading enrollment details...</p>
        </div>
      </div>
    );
  }

  if (!enrollment) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 flex items-center justify-center p-4">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <p className="text-xl text-gray-700">Enrollment not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 p-4 md:p-6 lg:p-8">
      {/* Alert */}
      {alert && (
        <div className={`fixed top-4 right-4 z-50 ${
          alert.theme === 'success' ? 'bg-green-500' : 'bg-red-500'
        } text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-slideIn`}>
          {alert.theme === 'success' ? (
            <CheckCircle className="w-5 h-5" />
          ) : (
            <AlertCircle className="w-5 h-5" />
          )}
          <span>{alert.message}</span>
        </div>
      )}

      <div className="max-w-5xl mx-auto">
        {/* Header Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-primary to-secondary p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
                  <Calendar className="w-8 h-8" />
                  Enrollment Details
                </h1>
                <p className="text-white/90 mt-2">View and manage course schedule</p>
              </div>
              <button
                onClick={isEditing ? handleSave : handleEdit}
                className={`self-start md:self-center px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-all shadow-lg hover:shadow-xl ${
                  isEditing 
                    ? 'bg-white text-primary hover:bg-gray-50' 
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                {isEditing ? (
                  <>
                    <Save className="w-5 h-5" />
                    Save Changes
                  </>
                ) : (
                  <>
                    <Edit2 className="w-5 h-5" />
                    Edit Details
                  </>
                )}
              </button>
            </div>
            {isEditing && (
              <button
                onClick={() => setIsEditing(false)}
                className="mt-3 px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Student & Course Info */}
          <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
            <h2 className="text-xl font-bold text-gray-800 border-b-2 border-primary pb-2">
              Basic Information
            </h2>
            
            {/* Student */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-600 flex items-center gap-2">
                <User className="w-4 h-4 text-primary" />
                Student
              </label>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="font-semibold text-green-800 text-lg">{enrollment.student.name}</p>
                <p className="text-sm text-green-600">ID: {enrollment.student.id}</p>
              </div>
            </div>

            {/* Course */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-600 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-primary" />
                Course
              </label>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="font-semibold text-blue-800 text-lg">{enrollment.course.name}</p>
              </div>
            </div>

            {/* Teacher */}
            {enrollment.teacher && (
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-600 flex items-center gap-2">
                  <User className="w-4 h-4 text-primary" />
                  Teacher
                </label>
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <p className="font-semibold text-purple-800 text-lg">{enrollment.teacher.name}</p>
                </div>
              </div>
            )}
          </div>

          {/* Schedule Info */}
          <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
            <h2 className="text-xl font-bold text-gray-800 border-b-2 border-secondary pb-2">
              Schedule Details
            </h2>

            {/* Days */}
            <div className="space-y-3">
              <label className="text-sm font-semibold text-gray-600 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-secondary" />
                Class Days
              </label>
              {isEditing ? (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {daysOfWeek.map(day => (
                    <button
                      key={day}
                      onClick={() => handleDayToggle(day)}
                      className={`p-2 rounded-lg border-2 transition-all text-sm font-medium ${
                        editedDays.includes(day)
                          ? 'bg-primary text-white border-primary'
                          : 'bg-white text-gray-700 border-gray-200 hover:border-primary'
                      }`}
                    >
                      {day.slice(0, 3)}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {enrollment.schedule.days.map(day => (
                    <span
                      key={day}
                      className="bg-primary text-white px-4 py-2 rounded-full text-sm font-medium"
                    >
                      {day}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Time */}
            <div className="space-y-3">
              <label className="text-sm font-semibold text-gray-600 flex items-center gap-2">
                <Clock className="w-4 h-4 text-secondary" />
                Class Time
              </label>
              {isEditing ? (
                <input
                  type="time"
                  value={editedTime}
                  onChange={(e) => setEditedTime(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent transition-all"
                />
              ) : (
                <div className="bg-secondary/10 border border-secondary/30 rounded-lg p-4">
                  <p className="font-bold text-secondary text-2xl">{enrollment.schedule.time}</p>
                </div>
              )}
            </div>

            {/* Duration */}
            <div className="space-y-3">
              <label className="text-sm font-semibold text-gray-600">
                Class Duration
              </label>
              {isEditing ? (
                <div className="grid grid-cols-3 gap-2">
                  {classDurations.map(duration => (
                    <button
                      key={duration}
                      onClick={() => setEditedDuration(duration)}
                      className={`p-3 rounded-lg border-2 transition-all font-medium ${
                        editedDuration === duration
                          ? 'bg-secondary text-white border-secondary'
                          : 'bg-white text-gray-700 border-gray-200 hover:border-secondary'
                      }`}
                    >
                      {duration} min
                    </button>
                  ))}
                </div>
              ) : (
                <div className="bg-secondary/10 border border-secondary/30 rounded-lg p-4">
                  <p className="font-bold text-secondary text-xl">{enrollment.schedule.duration} Minutes</p>
                </div>
              )}
            </div>
          </div>

          {/* Meet Link - Full Width */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6 space-y-4">
            <h2 className="text-xl font-bold text-gray-800 border-b-2 border-primary pb-2 flex items-center gap-2">
              <LinkIcon className="w-5 h-5 text-primary" />
              Meeting Link
            </h2>

            {isEditing ? (
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-600">
                  Meet Link URL
                </label>
                <input
                  type="url"
                  value={editedMeetLink}
                  onChange={(e) => setEditedMeetLink(e.target.value)}
                  placeholder="https://meet.google.com/..."
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                />
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-primary/10 to-secondary/10 border-2 border-primary/30 rounded-lg p-4">
                  <a
                    href={enrollment.meet?.link || ''}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:text-secondary font-semibold text-lg break-all underline decoration-2 underline-offset-4"
                  >
                    {enrollment.meet?.link || ''}
                  </a>
                </div>
                
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-sm text-gray-600 bg-gray-50 rounded-lg p-4">
                  <span className="font-medium">Last Updated:</span>
                  <span className="font-semibold text-gray-800">{formatDate(enrollment.meet?.time) || 'N/A'}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnrollmentDetailsEdit;