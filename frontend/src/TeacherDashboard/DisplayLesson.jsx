import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Book, FileText, Brain, Hash, X, ZoomIn } from 'lucide-react';
import axios from 'axios';
import { useParams } from 'react-router';

const DataDisplayPage = () => {

    const {enrollmentId } = useParams();

    const [loading, setLoading] = useState(false)

  // Sample data - replace with your actual data
  const [data, setData] = useState({
    chapterNumber: '',
    pageNumber: '',
    memorizationLessonNumber: '',
    ayahLineNumber: '',
    imageUrls: [],
  });

  const getLesson = () => {

    setLoading(true)

    axios.get(`/api/v1/lesson/latest/${enrollmentId}`).then(res => {
        const {chapterNumber, pageNumber, memorizationLessonNumber, ayahLineNumber, imageUrls } = res.data.lesson
        setData({chapterNumber, pageNumber, memorizationLessonNumber, ayahLineNumber, imageUrls})
    }).catch(err => console.log(err)).finally(() => setLoading(false))
  }

  useEffect(() => {

    getLesson()

  }, [])

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === data.imageUrls.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? data.imageUrls.length - 1 : prev - 1
    );
  };

  const goToImage = (index) => {
    setCurrentImageIndex(index);
  };

  const openFullScreen = (index = currentImageIndex) => {
    setCurrentImageIndex(index);
    setIsFullScreen(true);
  };

  const closeFullScreen = () => {
    setIsFullScreen(false);
  };

  const nextImageFullScreen = () => {
    setCurrentImageIndex((prev) => 
      prev === data.imageUrls.length - 1 ? 0 : prev + 1
    );
  };

  const prevImageFullScreen = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? data.imageUrls.length - 1 : prev - 1
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 via-slate-900 to-gray-900 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-primary/20 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-primary/30">
          <h1 className="text-2xl md:text-3xl font-bold text-primary mb-2">
            Lesson Data Overview
          </h1>
          <p className="text-slate-300 text-sm md:text-base">
            Current lesson information and associated images
          </p>
        </div>

        {/* Data Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {/* Chapter Number */}
          <div className="bg-primary/10 backdrop-blur-sm rounded-xl p-6 hover:bg-primary/15 transition-all duration-300 border border-primary/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm font-medium">Chapter</p>
                <p className="text-2xl md:text-3xl font-bold text-primary mt-1">
                  {data.chapterNumber}
                </p>
              </div>
              <Book className="h-8 w-8 text-secondary" />
            </div>
          </div>

          {/* Page Number */}
          <div className="bg-primary/10 backdrop-blur-sm rounded-xl p-6 hover:bg-primary/15 transition-all duration-300 border border-primary/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm font-medium">Page</p>
                <p className="text-2xl md:text-3xl font-bold text-primary mt-1">
                  {data.pageNumber}
                </p>
              </div>
              <FileText className="h-8 w-8 text-secondary" />
            </div>
          </div>

          {/* Memorization Lesson */}
          <div className="bg-primary/10 backdrop-blur-sm rounded-xl p-6 hover:bg-primary/15 transition-all duration-300 border border-primary/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm font-medium">Memorization Lesson</p>
                <p className="text-2xl md:text-3xl font-bold text-primary mt-1">
                  {data.memorizationLessonNumber}
                </p>
              </div>
              <Brain className="h-8 w-8 text-secondary" />
            </div>
          </div>

          {/* Ayah Line Number */}
          <div className="bg-primary/10 backdrop-blur-sm rounded-xl p-6 hover:bg-primary/15 transition-all duration-300 border border-primary/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm font-medium">Ayah Line</p>
                <p className="text-2xl md:text-3xl font-bold text-primary mt-1">
                  {data.ayahLineNumber}
                </p>
              </div>
              <Hash className="h-8 w-8 text-secondary" />
            </div>
          </div>
        </div>

        {/* Image Gallery */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-slate-700">
          <h2 className="text-xl md:text-2xl font-bold text-slate-200 mb-6">
            Associated Images ({data.imageUrls.length})
          </h2>
          
          {data.imageUrls.length > 0 ? (
            <div className="space-y-6">
              {/* Main Image Display */}
              <div className="relative bg-slate-800/30 rounded-xl overflow-hidden border border-slate-600 group">
                <img
                  src={data.imageUrls[currentImageIndex]}
                  alt={`Image ${currentImageIndex + 1}`}
                  className="w-full h-64 md:h-96 object-cover cursor-pointer"
                  onClick={() => openFullScreen()}
                />
                
                {/* Zoom Overlay */}
                <div 
                  className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer flex items-center justify-center"
                  onClick={() => openFullScreen()}
                >
                  <ZoomIn className="h-12 w-12 text-white drop-shadow-lg" />
                </div>
                
                {/* Navigation Arrows */}
                {data.imageUrls.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-primary/80 hover:bg-primary text-white p-2 rounded-full transition-all duration-200 shadow-lg z-10"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-primary/80 hover:bg-primary text-white p-2 rounded-full transition-all duration-200 shadow-lg z-10"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </>
                )}

                {/* Image Counter */}
                <div className="absolute bottom-4 left-4 bg-primary/90 text-white px-3 py-1 rounded-full text-sm font-medium">
                  {currentImageIndex + 1} / {data.imageUrls.length}
                </div>
              </div>

              {/* Thumbnail Navigation */}
              {data.imageUrls.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {data.imageUrls.map((url, index) => (
                    <button
                      key={index}
                      onClick={() => goToImage(index)}
                      className={`flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 cursor-pointer ${
                        index === currentImageIndex
                          ? 'border-secondary shadow-lg scale-105'
                          : 'border-slate-600 hover:border-slate-500'
                      }`}
                    >
                      <img
                        src={url}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                        onClick={(e) => {
                          e.stopPropagation();
                          openFullScreen(index);
                        }}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-slate-400 text-lg mb-2">No images available</div>
              <div className="text-slate-500 text-sm">Images will appear here when available</div>
            </div>
          )}
        </div>

        {/* Full Screen Modal */}
        {isFullScreen && (
          <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
            <div className="relative w-full h-full flex items-center justify-center p-4">
              {/* Close Button */}
              <button
                onClick={closeFullScreen}
                className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all duration-200 z-10"
              >
                <X className="h-6 w-6" />
              </button>

              {/* Full Screen Image */}
              <img
                src={data.imageUrls[currentImageIndex]}
                alt={`Full screen image ${currentImageIndex + 1}`}
                className="max-w-full max-h-full object-contain"
              />

              {/* Navigation in Full Screen */}
              {data.imageUrls.length > 1 && (
                <>
                  <button
                    onClick={prevImageFullScreen}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-primary/80 hover:bg-primary text-white p-3 rounded-full transition-all duration-200 shadow-lg"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </button>
                  <button
                    onClick={nextImageFullScreen}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-primary/80 hover:bg-primary text-white p-3 rounded-full transition-all duration-200 shadow-lg"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>
                </>
              )}

              {/* Full Screen Counter */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-full text-sm font-medium">
                {currentImageIndex + 1} / {data.imageUrls.length}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DataDisplayPage;