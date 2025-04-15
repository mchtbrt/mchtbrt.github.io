import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="bg-gradient-to-r from-purple-600 to-pink-600 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
              </svg>
              <span className="text-white text-xl font-bold">Dizi Takip</span>
            </Link>
          </div>
          <div className="flex space-x-4">
            <Link
              to="/"
              className="text-white hover:bg-white/10 px-3 py-2 rounded-md text-sm font-medium transition duration-200"
            >
              Ana Sayfa
            </Link>
            <Link
              to="/series"
              className="text-white hover:bg-white/10 px-3 py-2 rounded-md text-sm font-medium transition duration-200"
            >
              Diziler
            </Link>
            <Link
              to="/series/add"
              className="bg-white text-purple-600 hover:bg-white/90 px-4 py-2 rounded-md text-sm font-medium transition duration-200 flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Yeni Dizi
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar; 