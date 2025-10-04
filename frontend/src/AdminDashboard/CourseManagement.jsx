import { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, BookOpen, Image, FileText, X, Loader2 } from 'lucide-react';
import axios from "axios";

const CourseManagement = () => {
  const [courses, setCourses] = useState([]);
  const [courseName, setCourseName] = useState('');
  const [courseImageUrl, setCourseImageUrl] = useState('');
  const [coursePdfUrl, setCoursePdfUrl] = useState('');
  const [coursePdfName, setCoursePdfName] = useState('');
  const [imageUploading, setImageUploading] = useState(false);
  const [pdfUploading, setPdfUploading] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);

  const getAllCourses = () => {
    axios.get("/api/v1/courses").then(res => setCourses(res.data.courses)).catch(err => console.log(err));
  };

  useEffect(() => {
    getAllCourses();
  }, []);

  const uploadImage = async (file) => {

    if(courseImageUrl) {
      clearImage(courseImageUrl)
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB');
      return;
    }

    setImageUploading(true);
    const formData = new FormData();
    formData.append('image', file); 

    try {
      const res = await axios.post('/api/v1/upload/image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setCourseImageUrl(res.data.url);
    } catch (err) {
      console.log(err);
      alert('Error uploading image');
    } finally {
      setImageUploading(false);
    }
  };

  const uploadPdf = async (file) => {

    if(coursePdfUrl) {
      clearPdf(coursePdfUrl)
    }

    if (file.type !== 'application/pdf') {
      alert('Please upload only PDF files');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      alert('PDF size should be less than 10MB');
      return;
    }

    setPdfUploading(true);
    const formData = new FormData();
    formData.append('pdf', file);

    console.log(formData)

    try {
      const res = await axios.post('/api/v1/upload/pdf', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setCoursePdfUrl(res.data.url);
      setCoursePdfName(file.name);
    } catch (err) {
      console.log(err);
      alert('Error uploading PDF');
    } finally {
      setPdfUploading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      uploadImage(file);
    }
  };

  const handlePdfChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      uploadPdf(file);
    }
  };

  const clearImage = () => {

    if(courseImageUrl) {

      const extractPublicId = (courseImageUrl) => {

      const parts = courseImageUrl.split("/");
      // last element is filename with extension (e.g. abc123.png)
      const fileWithExt = parts.pop();
      const fileName = fileWithExt.split(".")[0];

      // second last element is usually the folder (e.g. uploads)
      const folder = parts.pop();

      return `${folder}/${fileName}`

      }



      
      const publicId = extractPublicId(courseImageUrl);

      axios.delete(`/api/v1/upload/image/${encodeURIComponent(publicId)}`).then(res => console.log(res)).catch(err => console.log(err))

    }

    setCourseImageUrl('');
  };

  const clearPdf = () => {

    const extractPublicId = (pdfUrl) => {
    // Example: https://res.cloudinary.com/demo/raw/upload/v1234567/pdfs/myFile_abc123.pdf
    const parts = pdfUrl.split("/");
    const fileWithExt = parts[parts.length - 1]; // myFile_abc123.pdf
    const folder = parts[parts.length - 2];      // pdfs
    const fileName = fileWithExt.split(".")[0];  // myFile_abc123

    return `${folder}/${fileName}`; // pdfs/myFile_abc123
  }

  try {
    const publicId = extractPublicId(coursePdfUrl);
    const response = axios.delete(`/api/v1/upload/pdf/${encodeURIComponent(publicId)}`);
    console.log("Deleted:", response.data);
    return response.data;
  } catch (error) {
    console.error("Delete failed:", error.response?.data || error.message);
    throw error;
  }


};

  const handleSubmit = () => {
    if (!courseName.trim()) {
      alert('Please enter a course name');
      return;
    }

    const courseData = {
      name: courseName,
      image: courseImageUrl,
      pdf: coursePdfUrl
    };

    if (editingCourse) {
      axios.put(`/api/v1/courses/${editingCourse._id}`, courseData)
        .then(res => {
          getAllCourses();
          resetForm();
        }).catch(err => {
          console.log(err);
          alert('Error updating course');
        });
    } else {
      axios.post("/api/v1/courses", courseData)
        .then(res => {
          console.log(res.data);
          getAllCourses();
          resetForm();
        }).catch(err => {
          console.log(err);
          alert('Error creating course');
        });
    }
  };

  const resetForm = () => {
    setCourseName('');
    setCourseImageUrl('');
    setCoursePdfUrl('');
    setCoursePdfName('');
    setEditingCourse(null);
  };

  const handleEdit = (course) => {
    setCourseName(course.name);
    setEditingCourse(course);
    if (course.image) {
      setCourseImageUrl(course.image);
    }
    if (course.pdf) {
      setCoursePdfUrl(course.pdf);
      setCoursePdfName('PDF');
    }
  };

  const handleDelete = (courseId) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      axios.delete(`/api/v1/courses/${courseId}`).then(res => {
        getAllCourses();
      }).catch(err => {
        console.log(err);
        alert('Error deleting course');
      });
    }
  };

  const handleCancelEdit = () => {
    resetForm();
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="px-4 py-8 rounded-t-xl bg-gradient-to-r from-primary to-secondary">
          <div className="flex items-center gap-3 mb-2">
            <BookOpen className="w-8 h-8 text-white" />
            <h1 className="text-3xl font-bold text-white">Course Management</h1>
          </div>
          <p className="text-white opacity-90">Add and manage your courses</p>
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Course Image
              </label>
              <div className="flex items-start gap-4">
                <label className="flex-shrink-0 cursor-pointer inline-flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-3 rounded-lg font-medium transition-colors border border-gray-300">
                  <Image className="w-4 h-4" />
                  Choose Image
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    disabled={imageUploading}
                  />
                </label>
                
                {imageUploading && (
                  <div className="flex items-center justify-center h-20 w-20 rounded-lg border-2 border-dashed border-blue-300 bg-blue-50">
                    <Loader2 className="w-6 h-6 text-secondary animate-spin" />
                  </div>
                )}
                
                {!imageUploading && courseImageUrl && (
                  <div className="relative">
                    <img 
                      src={courseImageUrl} 
                      alt="Preview" 
                      className="h-20 w-20 object-cover rounded-lg border border-gray-300"
                    />
                    <button
                      onClick={clearImage}
                      className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 transition-colors"
                      title="Remove image"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-1">Max size: 5MB</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Course Book (PDF)
              </label>
              <div className="flex items-center gap-4">
                <label className="flex-shrink-0 cursor-pointer inline-flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-3 rounded-lg font-medium transition-colors border border-gray-300">
                  <FileText className="w-4 h-4" />
                  Choose PDF
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handlePdfChange}
                    className="hidden"
                    disabled={pdfUploading}
                  />
                </label>
                
                {pdfUploading && (
                  <div className="flex items-center gap-2 bg-blue-50 px-3 py-2 rounded-lg border border-blue-200">
                    <Loader2 className="w-4 h-4 text-secondary animate-spin" />
                    <span className="text-sm text-primary">Uploading...</span>
                  </div>
                )}
                
                {!pdfUploading && coursePdfUrl && (
                  <div className="flex items-center gap-2 bg-blue-50 px-3 py-2 rounded-lg border border-blue-200">
                    <FileText className="w-4 h-4 text-primary" />
                    <span className="text-sm text-blue-700 max-w-xs truncate">{coursePdfName}</span>
                    <button
                      onClick={clearPdf}
                      className="ml-2 text-red-500 hover:text-red-700"
                      title="Remove PDF"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-1">Max size: 10MB</p>
            </div>
            
            <div className="flex gap-3 flex-wrap pt-2">
              <button
                onClick={handleSubmit}
                disabled={imageUploading || pdfUploading}
                className="inline-flex items-center gap-2 bg-primary hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
                    <tr key={course._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {course.image ? (
                            <img 
                              src={course.image} 
                              alt={course.name}
                              className="w-10 h-10 rounded-lg object-cover mr-3"
                            />
                          ) : (
                            <div className="flex-shrink-0 w-2 h-2 bg-primary rounded-full mr-3"></div>
                          )}
                          <div>
                            <div className="text-sm font-medium text-gray-900 flex items-center gap-2">
                              {course.name}
                              {course.pdf && (
                                <FileText className="w-4 h-4 text-primary" title="Has PDF" />
                              )}
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
                            className="inline-flex items-center p-2 text-primary hover:bg-primary hover:text-white rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-1"
                            title="Edit course"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(course._id)}
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
};

export default CourseManagement;