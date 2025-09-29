import React, { useState, useEffect } from 'react';
import { ChevronRight, Book, FileText, Brain, AlignLeft, Loader2, AlertCircle } from 'lucide-react';
import axios from "axios"
import { Link, useParams } from 'react-router';

// You can install axios with: npm install axios
// For now, we'll create a mock axios-like function
// const axios = {
//   get: async (url) => {
//     // Mock API response - replace this with actual axios import and API call
//     await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
    
//     const urlParams = new URLSearchParams(url.split('?')[1]);
//     const page = parseInt(urlParams.get('page')) || 1;
    
//     const mockLessons = [
//       { _id: '1', chapterNumber: 1, pageNumber: 5, memorizationLessonNumber: 1, ayahLineNumber: 12, title: "Al-Fatiha Introduction", createdAt: '2024-01-15' },
//       { _id: '2', chapterNumber: 1, pageNumber: 6, memorizationLessonNumber: 2, ayahLineNumber: 15, title: "Verses 1-3 Analysis", createdAt: '2024-01-14' },
//       { _id: '3', chapterNumber: 2, pageNumber: 8, memorizationLessonNumber: 3, ayahLineNumber: 23, title: "Al-Baqarah Beginning", createdAt: '2024-01-13' },
//       { _id: '4', chapterNumber: 2, pageNumber: 12, memorizationLessonNumber: 4, ayahLineNumber: 35, title: "The Righteous Believers", createdAt: '2024-01-12' },
//       { _id: '5', chapterNumber: 3, pageNumber: 18, memorizationLessonNumber: 5, ayahLineNumber: 42, title: "Al-Imran Opening", createdAt: '2024-01-11' },
//       { _id: '6', chapterNumber: 3, pageNumber: 22, memorizationLessonNumber: 6, ayahLineNumber: 58, title: "Family of Imran", createdAt: '2024-01-10' }
//     ];
    
//     const startIndex = (page - 1) * 3;
//     const endIndex = startIndex + 3;
//     const paginatedLessons = mockLessons.slice(startIndex, endIndex);
    
//     return {
//       data: {
//         msg: "Lessons Found Successfully",
//         lessons: paginatedLessons,
//         pagination: {
//           currentPage: page,
//           totalPages: Math.ceil(mockLessons.length / 3),
//           totalLessons: mockLessons.length,
//           hasMore: endIndex < mockLessons.length,
//           limit: 3
//         }
//       }
//     };
//   }
// };

const LessonsDisplay = () => {
  const [lessons, setLessons] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 0,
    totalLessons: 0,
    hasMore: false,
    limit: 3
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [initialLoading, setInitialLoading] = useState(true);

  const { enrollmentId } = useParams()


  // Fetch lessons from API
  const fetchLessons = async (page = 1, append = false) => {
    try {
      if (page === 1) setInitialLoading(true);
      else setLoading(true);
      
      setError(null);
      
      // Replace with your actual API endpoint
      const response = await axios.get(`/api/v1/lesson/enrollment-lessons/${enrollmentId}?page=${page}&limit=3`);
      
      const { lessons: newLessons, pagination: newPagination } = response.data;
      
      if (append) {
        setLessons(prev => [...prev, ...newLessons]);
      } else {
        setLessons(newLessons);
      }
      
      setPagination(newPagination);
      
    } catch (err) {
      console.error('Error fetching lessons:', err);
      setError(err.response?.data?.msg || 'Failed to fetch lessons');
    } finally {
      setLoading(false);
      setInitialLoading(false);
    }
  };

  // Load initial lessons
  useEffect(() => {
    fetchLessons(1);
  }, [enrollmentId]);

  const handleSeeMore = () => {
    const nextPage = pagination.currentPage + 1;
    fetchLessons(nextPage, true);
  };

  const handleRefresh = () => {
    fetchLessons(1);
  };

  // Loading state for initial load
  if (initialLoading) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center">
        <div className="bg-white rounded-xl p-8 shadow-xl text-center">
          <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Loading Lessons</h2>
          <p className="text-gray-600">Please wait while we fetch your lessons...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error && lessons.length === 0) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center p-4">
        <div className="bg-white rounded-xl p-8 shadow-xl text-center max-w-md w-full">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Error Loading Lessons</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={handleRefresh}
            className="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2">
            Quran Lessons
          </h1>
          <p className="text-white/80 text-sm md:text-base">
            Track your memorization progress and study materials
          </p>
        </div>

        {/* Lessons Grid */}
        <div className="grid gap-4 md:gap-6">
          {lessons.map((lesson) => (
            <div
              key={lesson._id}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden"
            >
              <div className="p-4 md:p-6">

                {/* Lesson Details */}
                <div className="grid grid-cols-2 md:grid-cols-2 gap-3 md:gap-4 mb-4">
                  <div className="flex items-center space-x-2 bg-gray-50 rounded-lg p-3">
                    <Book className="w-4 h-4 text-primary" />
                    <div>
                      <p className="text-xs text-gray-500">Chapter</p>
                      <p className="text-sm font-semibold text-gray-800">{lesson.chapterNumber}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 bg-gray-50 rounded-lg p-3">
                    <FileText className="w-4 h-4 text-secondary" />
                    <div>
                      <p className="text-xs text-gray-500">Page</p>
                      <p className="text-sm font-semibold text-gray-800">{lesson.pageNumber}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 bg-gray-50 rounded-lg p-3">
                    <Brain className="w-4 h-4 text-primary" />
                    <div>
                      <p className="text-xs text-gray-500">Mem. Lesson</p>
                      <p className="text-sm font-semibold text-gray-800">{lesson.memorizationLessonNumber}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 bg-gray-50 rounded-lg p-3">
                    <AlignLeft className="w-4 h-4 text-secondary" />
                    <div>
                      <p className="text-xs text-gray-500">Ayah Line</p>
                      <p className="text-sm font-semibold text-gray-800">{lesson.ayahLineNumber}</p>
                    </div>
                  </div>
                </div>

                {/* Action Button */}
                <Link to={`/dashboard/lesson-details/${lesson._id}`} className="w-full bg-primary hover:bg-primary/90 text-white py-3 px-4 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-2 group">
                  <span>Study Lesson</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* See More Button */}
        <div className="flex justify-center mt-8">
          {pagination.hasMore && (
            <button
              onClick={handleSeeMore}
              disabled={loading}
              className="bg-secondary hover:bg-secondary/90 disabled:bg-secondary/50 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Loading...</span>
                </>
              ) : (
                <>
                  <span>See More Lessons</span>
                  <ChevronRight className="w-4 h-4 rotate-90" />
                </>
              )}
            </button>
          )}
        </div>

        {/* Statistics Bar */}
        {/* <div className="mt-12 bg-white/10 backdrop-blur-sm rounded-xl p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <p className="text-2xl md:text-3xl font-bold text-white">{pagination.totalLessons}</p>
              <p className="text-white/80 text-sm">Total Lessons</p>
            </div>
            <div>
              <p className="text-2xl md:text-3xl font-bold text-secondary">{lessons.length > 0 ? Math.max(...lessons.map(l => l.chapterNumber)) : 0}</p>
              <p className="text-white/80 text-sm">Chapters Covered</p>
            </div>
            <div>
              <p className="text-2xl md:text-3xl font-bold text-secondary">{lessons.length > 0 ? Math.max(...lessons.map(l => l.pageNumber)) : 0}</p>
              <p className="text-white/80 text-sm">Pages Studied</p>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default LessonsDisplay;