import React, { useState, useEffect } from 'react';
import axios from 'axios';

// TMDB API anahtarınızı buraya ekleyin
const TMDB_API_KEY = '89ac2e30bf113c90fa3e661683c4c3c4';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

function SeriesRecommendations({ currentSeries }) {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecommendations = async () => {
      if (!currentSeries) return;

      try {
        setLoading(true);
        
        // Önce dizinin TMDB ID'sini bul
        const searchResponse = await axios.get(`${TMDB_BASE_URL}/search/tv`, {
          params: {
            api_key: TMDB_API_KEY,
            query: currentSeries.title,
            language: 'tr-TR'
          }
        });

        if (searchResponse.data.results.length === 0) {
          setError('Dizi bulunamadı');
          setLoading(false);
          return;
        }

        const tmdbId = searchResponse.data.results[0].id;

        // Benzer dizileri getir
        const recommendationsResponse = await axios.get(`${TMDB_BASE_URL}/tv/${tmdbId}/recommendations`, {
          params: {
            api_key: TMDB_API_KEY,
            language: 'tr-TR'
          }
        });

        setRecommendations(recommendationsResponse.data.results.slice(0, 5));
        setLoading(false);
      } catch (error) {
        console.error('Dizi önerileri alınırken hata oluştu:', error);
        setError('Dizi önerileri alınırken bir hata oluştu');
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [currentSeries]);

  if (loading) {
    return (
      <div className="p-4 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-purple-500 border-t-transparent mx-auto"></div>
        <p className="mt-2 text-gray-600">Öneriler yükleniyor...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  if (recommendations.length === 0) {
    return (
      <div className="p-4 text-center text-gray-600">
        <p>Bu dizi için öneri bulunamadı.</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Benzer Diziler</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {recommendations.map((series) => (
          <div key={series.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            {series.poster_path ? (
              <img
                src={`https://image.tmdb.org/t/p/w500${series.poster_path}`}
                alt={series.name}
                className="w-full h-48 object-cover"
              />
            ) : (
              <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                <span className="text-gray-400">Görsel yok</span>
              </div>
            )}
            <div className="p-3">
              <h4 className="font-medium text-gray-800">{series.name}</h4>
              <p className="text-sm text-gray-600 mt-1">
                {series.first_air_date ? new Date(series.first_air_date).getFullYear() : 'Yıl bilgisi yok'}
              </p>
              <div className="mt-2 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="ml-1 text-sm text-gray-600">{series.vote_average.toFixed(1)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SeriesRecommendations; 