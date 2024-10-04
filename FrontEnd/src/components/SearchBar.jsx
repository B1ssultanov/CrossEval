// components/SearchBar.js
import React from 'react';

const SearchBar = () => {
  return (
    <div className="flex items-center w-80 max-w-md mx-auto bg-gray-200 rounded-full shadow-md">
      <input
        type="text"
        placeholder="Search courses..."
        className="w-full py-2 px-4 bg-transparent outline-none rounded-full text-gray-700"
      />
      <button className="p-2">
        <svg
          className="w-5 h-5 text-gray-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M21 21l-4.35-4.35m1.74-6.4a7.5 7.5 0 11-15 0 7.5 7.5 0 0115 0z"
          ></path>
        </svg>
      </button>
    </div>
  );
};

export default SearchBar;
