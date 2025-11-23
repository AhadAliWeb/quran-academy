import { useState } from 'react';

// Loader component you can use in your search button
const SearchLoader = ({ size = "md" }) => {
  const sizeClasses = {
    sm: "w-4 h-4 border-2",
    md: "w-5 h-5 border-2",
    lg: "w-6 h-6 border-3"
  };

  return (
    <div 
      className={`inline-block rounded-full animate-spin border-white border-t-transparent ${sizeClasses[size]}`}
    />
  );
};


export default SearchLoader;