import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Dizi Takip Uygulaması
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Mücahit ve Beyza için özel olarak tasarlanmış dizi takip uygulaması. Birlikte veya ayrı ayrı izlediğiniz dizileri kolayca takip edin.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Link
            to="/series"
            className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition duration-300 transform hover:-translate-y-1"
          >
            <div className="p-6">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-purple-500 text-white mb-4 mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-800 text-center mb-2">Dizileri Görüntüle</h2>
              <p className="text-gray-600 text-center">
                İzlediğiniz tüm dizileri görüntüleyin ve takip edin.
              </p>
            </div>
          </Link>

          <Link
            to="/series/add"
            className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition duration-300 transform hover:-translate-y-1"
          >
            <div className="p-6">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-pink-500 text-white mb-4 mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-800 text-center mb-2">Yeni Dizi Ekle</h2>
              <p className="text-gray-600 text-center">
                İzlemeye başladığınız yeni dizileri ekleyin.
              </p>
            </div>
          </Link>
        </div>

        <div className="mt-12 text-center">
          <div className="inline-flex items-center space-x-2 text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <span>Mücahit ve Beyza için özel olarak tasarlanmıştır</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home; 