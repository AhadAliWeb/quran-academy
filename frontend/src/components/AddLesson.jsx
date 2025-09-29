import React, { useState, useRef, useEffect } from 'react';
import { X, Upload, Image, Plus } from 'lucide-react';
import axios from "axios"

const AddLesson = ({ open, onClose, selectedEnrollment }) => {
  const [isOpen, setIsOpen] = useState(open);
  const [formData, setFormData] = useState({
    chapterNumber: '',
    pageNumber: '',
    ayahLineNumber: '',
    memorizationLessonNumber: ''
  });
  const [uploadedImages, setUploadedImages] = useState([]);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);
  const modalRef = useRef(null);

  // Sync isOpen with open prop
  useEffect(() => {
    setIsOpen(open);
  }, [open]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle file selection
  const handleFileSelect = (files) => {
    const newImages = Array.from(files).map(file => ({
      id: Date.now() + Math.random(),
      file,
      url: URL.createObjectURL(file),
      name: file.name
    }));
    setUploadedImages(prev => [...prev, ...newImages]);
  };

  // Handle file input change
  const handleFileInputChange = (e) => {
    if (e.target.files.length > 0) {
      handleFileSelect(e.target.files);
    }
  };

  // Handle drag and drop
  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files);
    }
  };

  // Handle paste event
  const handlePaste = (e) => {
    const items = e.clipboardData.items;
    const files = [];
    
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        const file = items[i].getAsFile();
        files.push(file);
      }
    }
    
    if (files.length > 0) {
      handleFileSelect(files);
    }
  };

  // Remove image
  const removeImage = (imageId) => {
    setUploadedImages(prev => {
      const updated = prev.filter(img => img.id !== imageId);
      // Clean up object URLs to prevent memory leaks
      const removed = prev.find(img => img.id === imageId);
      if (removed) {
        URL.revokeObjectURL(removed.url);
      }
      return updated;
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

  
    try {
      // 1. Upload images first
      const formDataUpload = new FormData();
      uploadedImages.forEach(img => {
        formDataUpload.append("images", img.file); // key must match backend
      });
  
      const uploadRes = await fetch("/api/v1/upload/image", {
        method: "POST",
        body: formDataUpload,
      });

      
  
      const uploadData = await uploadRes.json();
      if (!uploadRes.ok) throw new Error(uploadData.error || "Upload failed");
  
      // 2. Now you have Cloudinary URLs
      const cloudinaryUrls = uploadData.urls;
  
      // 3. Send lesson data + image URLs to backend
      const { course, student, enrollment } = selectedEnrollment

      console.log(selectedEnrollment)

      axios.post("/api/v1/lesson", { ...formData, course, student, enrollment, imageUrls: cloudinaryUrls}).then(res => console.log(res)).catch(err => console.log(err))
      // const lessonRes = await fetch("/api/lessons", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({
      //     ...formData,
      //     images: cloudinaryUrls,
      //   }),
      // });
  
      // const lessonData = await lessonRes.json();
      // if (!lessonRes.ok) throw new Error(lessonData.error || "Lesson save failed");
  
      alert("Entry saved successfully!");
      handleClose();
    } catch (err) {
      console.error("Error:", err);
      alert(err.message);
    }
  };

  // Close modal and reset form
  const handleClose = () => {
    setIsOpen(false);
    setFormData({
      chapterNumber: '',
      pageNumber: '',
      ayahLineNumber: '',
      memorizationLessonNumber: ''
    });
    // Clean up image URLs
    uploadedImages.forEach(img => URL.revokeObjectURL(img.url));
    setUploadedImages([]);
    onClose()
  };


  // Add paste event listener
  useEffect(() => {
    if (isOpen) {
      document.addEventListener('paste', handlePaste);
      return () => {
        document.removeEventListener('paste', handlePaste);
      };
    }
  }, [isOpen]);

  return (
    <div className="p-4">
      {/* Trigger Button */}
      {/* <button
        onClick={() => setIsOpen(true)}
        className="bg-primary hover:bg-opacity-90 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl"
      >
        <Plus size={20} />
        Add Memorization Entry
      </button> */}

      {/* Modal Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div 
            ref={modalRef}
            className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-800">Add Memorization Entry</h2>
              <button
                onClick={handleClose}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Form */}
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Chapter Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Chapter Number
                  </label>
                  <input
                    type="number"
                    name="chapterNumber"
                    value={formData.chapterNumber}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                    placeholder="Enter chapter number"
                    required
                  />
                </div>

                {/* Page Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Page Number
                  </label>
                  <input
                    type="number"
                    name="pageNumber"
                    value={formData.pageNumber}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                    placeholder="Enter page number"
                    required
                  />
                </div>

                {/* Ayah/Line Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ayah/Line Number
                  </label>
                  <input
                    type="number"
                    name="ayahLineNumber"
                    value={formData.ayahLineNumber}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                    placeholder="Enter ayah/line number"
                    required
                  />
                </div>

                {/* Memorization Lesson Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Memorization Lesson Number
                  </label>
                  <input
                    type="number"
                    name="memorizationLessonNumber"
                    value={formData.memorizationLessonNumber}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                    placeholder="Enter lesson number"
                    required
                  />
                </div>
              </div>

              {/* Image Upload Section */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Upload Images
                </label>
                
                {/* Upload Area */}
                <div
                  className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 ${
                    dragOver 
                      ? 'border-primary bg-primary bg-opacity-5' 
                      : 'border-gray-300 hover:border-primary hover:bg-gray-50'
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileInputChange}
                    className="hidden"
                  />
                  
                  <Upload className="mx-auto mb-4 text-gray-400" size={48} />
                  <p className="text-gray-600 mb-2">
                    Drag and drop images here, or{' '}
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="text-primary hover:underline"
                    >
                      browse files
                    </button>
                  </p>
                  <p className="text-sm text-gray-500">
                    You can also paste images using Ctrl+V
                  </p>
                </div>

                {/* Uploaded Images Preview */}
                {uploadedImages.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm font-medium text-gray-700 mb-3">
                      Uploaded Images ({uploadedImages.length})
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {uploadedImages.map((image) => (
                        <div key={image.id} className="relative group">
                          <img
                            src={image.url}
                            alt={image.name}
                            className="w-full h-24 object-cover rounded-lg border border-gray-200"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(image.id)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                          >
                            <X size={14} />
                          </button>
                          <p className="text-xs text-gray-600 mt-1 truncate">
                            {image.name}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors order-2 sm:order-1"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  onClick={handleSubmit}
                  className="bg-primary hover:bg-opacity-90 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl order-1 sm:order-2"
                >
                  Save Entry
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddLesson;