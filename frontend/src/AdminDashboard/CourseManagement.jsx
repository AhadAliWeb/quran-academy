import { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, BookOpen } from 'lucide-react';
import axios from "axios"

const CourseManagement = () => {
  const [courses, setCourses] = useState([]);



  const getAllCourses = () => {
    
    axios.get("/api/v1/courses").then(res => setCourses(res.data.courses)).catch(err => console.log(err))
  }


  useEffect(() => {

    getAllCourses()

  }, [])

  
  const [courseName, setCourseName] = useState('');
  const [editingCourse, setEditingCourse] = useState(null);

  const handleSubmit = () => {
    if (!courseName.trim()) return;

    if (editingCourse) {
      axios.put(`/api/v1/courses/${editingCourse._id}`, { name: courseName}).then(res => {                                   
        getAllCourses()
      }).catch(err => console.log(err))
      setEditingCourse(null);
    } else {
      
      axios.post("/api/v1/courses", {name: courseName}).then(res => {
        console.log(res.data)
        getAllCourses()
        
      }).catch(err => console.log(err))

    }
    setCourseName('');
  };

  const handleEdit = (course) => {
    setCourseName(course.name);
    setEditingCourse(course);
  };

  const handleDelete = (courseId) => {
    setCourses(courses.filter(course => course.id !== courseId));
  };

  const handleCancelEdit = () => {
    setCourseName('');
    setEditingCourse(null);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="px-4 py-8 rounded-t-xl bg-primary">
          <div className="flex items-center gap-3 mb-2">
            <BookOpen className="w-8 h-8 text-white" />
            <h1 className="text-3xl font-bold text-white">Course Management</h1>
          </div>
          <p className="text-white opacity-80">Add and manage your courses</p>
        </div>

        <div className="bg-white rounded-b-xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            {editingCourse ? 'Edit Course' : 'Add New Course'}
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Course Name
              </label>
              <input
                type="text"
                value={courseName}
                onChange={(e) => setCourseName(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter course name..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-secondary outline-none transition-colors"
              />
            </div>
            
            <div className="flex gap-3 flex-wrap">
              <button
                onClick={handleSubmit}
                className="inline-flex items-center gap-2 bg-secondary hover:opacity-90 text-white px-6 py-3 rounded-lg font-medium transition-opacity focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2"
              >
                <Plus className="w-4 h-4" />
                {editingCourse ? 'Update Course' : 'Add Course'}
              </button>
              
              {editingCourse && (
                <button
                  onClick={handleCancelEdit}
                  className="inline-flex items-center gap-2 bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">All Courses</h2>
            <p className="text-gray-600 mt-1">{courses.length} course{courses.length !== 1 ? 's' : ''} total</p>
          </div>

          {courses.length === 0 ? (
            <div className="p-12 text-center">
              <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-500 mb-2">No courses yet</h3>
              <p className="text-gray-400">Add your first course to get started</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Course Name
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                      Created Date
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {courses.map((course) => (
                    <tr key={course.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 w-2 h-2 bg-secondary rounded-full mr-3"></div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {course.name}
                            </div>
                            <div className="text-sm text-gray-500 sm:hidden">
                              Created: {new Date(course.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden sm:table-cell">
                        {new Date(course.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleEdit(course)}
                            className="inline-flex items-center p-2 text-primary hover:bg-primary hover:text-white rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1"
                            title="Edit course"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(course.id)}
                            className="inline-flex items-center p-2 text-red-600 hover:bg-red-600 hover:text-white rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1"
                            title="Delete course"
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
          )}
        </div>
      </div>
    </div>
  );
}

export default CourseManagement