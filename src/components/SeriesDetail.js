import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ref, onValue, update } from 'firebase/database';
import { db } from '../firebase';
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import SeriesRecommendations from './SeriesRecommendations';
import SeriesAIChatbot from './SeriesAIChatbot';

function SeriesDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedUser, setSelectedUser] = useState('beyza');
  const [series, setSeries] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [continuousEpisodeNumbers, setContinuousEpisodeNumbers] = useState(false);

  useEffect(() => {
    const seriesRef = ref(db, `series/${id}`);
    const unsubscribe = onValue(seriesRef, (snapshot) => {
      if (snapshot.exists()) {
        const seriesData = snapshot.val();
        setSeries(seriesData);
        // Veritabanından bölüm numaralandırma tercihini al
        setContinuousEpisodeNumbers(seriesData.continuousEpisodeNumbers || false);
      } else {
        setError('Dizi bulunamadı');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [id]);

  const toggleEpisodeWatched = async (season, episode) => {
    if (!series) return;

    const episodeKey = `${season}-${episode}`;
    const currentUserWatched = series.watchedEpisodes?.[selectedUser] || {};
    const currentValue = currentUserWatched[episodeKey] || false;

    try {
      const updates = {};
      
      // Birlikte izleme durumunda her iki kullanıcı için de aynı değeri ayarla
      if (series.watchingTogether) {
        updates[`/series/${id}/watchedEpisodes/beyza/${episodeKey}`] = !currentValue;
        updates[`/series/${id}/watchedEpisodes/mucahit/${episodeKey}`] = !currentValue;
      } else {
        // Tek kullanıcı seçiliyse sadece o kullanıcı için güncelle
        updates[`/series/${id}/watchedEpisodes/${selectedUser}/${episodeKey}`] = !currentValue;
      }
      
      await update(ref(db), updates);
    } catch (error) {
      console.error('Bölüm güncelleme hatası:', error);
    }
  };

  const toggleSeasonWatched = async (season) => {
    if (!series || !series.seasonsData) return;

    const episodeCount = series.seasonsData[season]?.episodeCount || 0;
    const allEpisodes = Array.from({ length: episodeCount }, (_, i) => i + 1);
    const currentUserWatched = series.watchedEpisodes?.[selectedUser] || {};
    
    // Sezonun tüm bölümlerinin izlenme durumunu kontrol et
    const allWatched = allEpisodes.every(ep => currentUserWatched[`${season}-${ep}`]);
    
    try {
      const updates = {};
      
      // Birlikte izleme durumunda her iki kullanıcı için de aynı değeri ayarla
      if (series.watchingTogether) {
        allEpisodes.forEach(episode => {
          updates[`/series/${id}/watchedEpisodes/beyza/${season}-${episode}`] = !allWatched;
          updates[`/series/${id}/watchedEpisodes/mucahit/${season}-${episode}`] = !allWatched;
        });
      } else {
        // Tek kullanıcı seçiliyse sadece o kullanıcı için güncelle
        allEpisodes.forEach(episode => {
          updates[`/series/${id}/watchedEpisodes/${selectedUser}/${season}-${episode}`] = !allWatched;
        });
      }
      
      await update(ref(db), updates);
    } catch (error) {
      console.error('Sezon güncelleme hatası:', error);
    }
  };

  // Bölüm numaralandırma tercihini değiştir ve veritabanına kaydet
  const toggleContinuousEpisodeNumbers = async () => {
    const newValue = !continuousEpisodeNumbers;
    setContinuousEpisodeNumbers(newValue);
    
    try {
      await update(ref(db, `series/${id}`), {
        continuousEpisodeNumbers: newValue
      });
    } catch (error) {
      console.error('Bölüm numaralandırma tercihi güncellenirken hata oluştu:', error);
    }
  };

  // Bölüm numarasını hesapla (sürekli veya sezon başına)
  const getEpisodeNumber = (season, episode) => {
    if (continuousEpisodeNumbers) {
      // Sürekli numaralandırma için önceki sezonların bölüm sayılarını topla
      let totalEpisodes = 0;
      for (let s = 1; s < season; s++) {
        totalEpisodes += series.seasonsData[s]?.episodeCount || 0;
      }
      return totalEpisodes + episode;
    } else {
      // Her sezon 1'den başla
      return episode;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"></div>
      </div>
    );
  }

  if (error || !series) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Hata</h2>
          <p className="text-gray-600 mb-4">{error || 'Dizi bulunamadı'}</p>
          <button
            onClick={() => navigate('/series')}
            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition duration-200"
          >
            Dizilere Dön
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="min-h-screen relative">
              {/* Yarı saydam arka plan */}
              <div 
                className="fixed inset-0 opacity-20"
                style={{
                  backgroundImage: `url(/images/background.jpg)`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                  width: '100vw',
                  height: '100vh',
                  zIndex: -1
                }}
              />
              
              {/* Gradient overlay */}
              <div 
                className="fixed inset-0 bg-gradient-to-br from-purple-50/90 to-pink-50/90"
                style={{ 
                  zIndex: -1,
                  width: '100vw',
                  height: '100vh'
                }}
              />

              <div className="relative py-8 px-4">
                <div className="max-w-4xl mx-auto">
                  <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden">
                    {/* Dizi Başlığı ve Kapak */}
                    <div className="relative h-64 bg-gradient-to-r from-purple-600 to-pink-600">
                      {series?.coverImage && (
                        <img
                          src={series.coverImage}
                          alt={series.title}
                          className="absolute inset-0 w-full h-full object-cover opacity-30"
                        />
                      )}
                      <div className="absolute inset-0 flex items-center justify-between p-8">
                        <div className="flex-1">
                          <h1 className="text-4xl font-bold text-white mb-2">{series?.title}</h1>
                          <p className="text-white/90">
                            {series?.totalSeasons} Sezon
                          </p>
                        </div>
                        {series?.coverImage && (
                          <img
                            src={series.coverImage}
                            alt={series.title}
                            className="h-48 w-32 object-cover rounded-lg shadow-lg"
                          />
                        )}
                      </div>
                    </div>

                    {/* Kullanıcı Seçimi - Sadece birlikte izleme seçeneği işaretli değilse göster */}
                    {series && !series.watchingTogether && (
                      <div className="p-6 border-b border-gray-200">
                        <div className="flex space-x-4">
                          <button
                            onClick={() => setSelectedUser('beyza')}
                            className={`px-6 py-3 rounded-lg font-medium transition duration-200 ${
                              selectedUser === 'beyza'
                                ? 'bg-pink-600 text-white'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                          >
                            Beyza
                          </button>
                          <button
                            onClick={() => setSelectedUser('mucahit')}
                            className={`px-6 py-3 rounded-lg font-medium transition duration-200 ${
                              selectedUser === 'mucahit'
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                          >
                            Mücahit
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Birlikte İzleme Bilgisi */}
                    {series && series.watchingTogether && (
                      <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-purple-100 to-pink-100">
                        <div className="flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-purple-600" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                          </svg>
                          <span className="text-purple-700 font-medium">Birlikte İzliyoruz</span>
                        </div>
                      </div>
                    )}

                    {/* Bölüm Numaralandırma Seçeneği */}
                    <div className="p-4 border-b border-gray-200 bg-gray-50">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">Bölüm Numaralandırma</span>
                        <div className="flex items-center">
                          <span className="text-xs text-gray-500 mr-2">Her sezon 1'den başla</span>
                          <button
                            onClick={toggleContinuousEpisodeNumbers}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                              continuousEpisodeNumbers ? 'bg-purple-600' : 'bg-gray-300'
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                continuousEpisodeNumbers ? 'translate-x-6' : 'translate-x-1'
                              }`}
                            />
                          </button>
                          <span className="text-xs text-gray-500 ml-2">Sürekli artan</span>
                        </div>
                      </div>
                    </div>

                    {/* Sezonlar ve Bölümler */}
                    <div className="p-6">
                      <div className="space-y-8">
                        {series && Array.from({ length: series.totalSeasons }, (_, i) => i + 1).map((season) => {
                          const currentUserWatched = series.watchedEpisodes?.[selectedUser] || {};
                          const episodeCount = series.seasonsData[season]?.episodeCount || 0;
                          const allEpisodes = Array.from({ length: episodeCount }, (_, i) => i + 1);
                          const isSeasonWatched = allEpisodes.every(ep => currentUserWatched[`${season}-${ep}`]);

                          return (
                            <div key={season} className="space-y-4">
                              <div className="flex items-center justify-between">
                                <h2 className="text-xl font-semibold text-gray-800">
                                  Sezon {season}
                                </h2>
                                <button
                                  onClick={() => toggleSeasonWatched(season)}
                                  className={`px-4 py-2 rounded-lg font-medium transition duration-200 ${
                                    series.watchingTogether
                                      ? 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                                      : selectedUser === 'beyza'
                                        ? 'bg-pink-100 text-pink-700 hover:bg-pink-200'
                                        : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                                  }`}
                                >
                                  Tüm Bölümleri {isSeasonWatched ? 'İzlenmiyor' : 'İzlendi'} Yap
                                </button>
                              </div>

                              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                                {allEpisodes.map((episode) => (
                                  <button
                                    key={episode}
                                    onClick={() => toggleEpisodeWatched(season, episode)}
                                    className={`
                                      p-3 rounded-lg font-medium transition duration-200
                                      ${currentUserWatched[`${season}-${episode}`]
                                        ? series.watchingTogether
                                          ? 'bg-purple-600 text-white'
                                          : selectedUser === 'beyza'
                                            ? 'bg-pink-600 text-white'
                                            : 'bg-blue-600 text-white'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                      }
                                    `}
                                  >
                                    Bölüm {getEpisodeNumber(season, episode)}
                                  </button>
                                ))}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Alt Butonlar */}
                    <div className="p-6 bg-gray-50/50 border-t border-gray-200">
                      <div className="flex justify-between">
                        <button
                          onClick={() => navigate('/series')}
                          className="px-4 py-2 text-gray-600 hover:text-gray-800 transition duration-200"
                        >
                          ← Dizilere Dön
                        </button>
                        <div className="space-x-4">
                          <button
                            onClick={() => navigate(`/series/${id}/edit`)}
                            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition duration-200"
                          >
                            Düzenle
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Dizi Önerileri */}
              <div className="max-w-4xl mx-auto mt-8">
                <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden">
                  <SeriesRecommendations currentSeries={series} />
                </div>
              </div>
            </div>
          </div>
          <div className="lg:col-span-1">
            <SeriesAIChatbot />
          </div>
        </div>
      </div>
    </div>
  );
}

export default SeriesDetail; 