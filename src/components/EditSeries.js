import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ref, update, onValue, set } from 'firebase/database';
import { db } from '../firebase';

function EditSeries() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    title: '',
    coverImage: '',
    totalSeasons: 1,
    seasonsData: {
      1: { episodeCount: 1 }
    },
    currentSeason: 1,
    currentEpisode: 1,
    watchingTogether: true,
    status: 'active'
  });

  useEffect(() => {
    const seriesRef = ref(db, `series/${id}`);
    const unsubscribe = onValue(seriesRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        setFormData(data);
        setPreviewImage(data.coverImage);
      } else {
        setError('Dizi bulunamadı');
      }
      setLoading(false);
    }, (error) => {
      setError('Dizi yüklenirken bir hata oluştu');
      setLoading(false);
    });

    return () => unsubscribe();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.startsWith('season_')) {
      const seasonNumber = parseInt(name.split('_')[1]);
      setFormData(prev => ({
        ...prev,
        seasonsData: {
          ...prev.seasonsData,
          [seasonNumber]: { episodeCount: parseInt(value) }
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : type === 'number' ? Number(value) : value,
        // Sezon değiştiğinde mevcut bölümü sıfırla
        ...(name === 'currentSeason' && {
          currentEpisode: 1
        })
      }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Dosya boyutu 5MB\'dan küçük olmalıdır.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
        setFormData(prev => ({
          ...prev,
          coverImage: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Mevcut sezon ve bölüme kadar olan tüm bölümleri izlendi olarak işaretle
      const watchedEpisodes = {
        beyza: {},
        mucahit: {}
      };

      // Mevcut sezon ve bölüme kadar olan tüm bölümleri izlendi olarak işaretle
      for (let season = 1; season <= formData.currentSeason; season++) {
        const episodeCount = season === formData.currentSeason 
          ? formData.currentEpisode 
          : formData.seasonsData[season]?.episodeCount || 0;
        
        for (let episode = 1; episode <= episodeCount; episode++) {
          const episodeKey = `${season}-${episode}`;
          watchedEpisodes.beyza[episodeKey] = true;
          watchedEpisodes.mucahit[episodeKey] = true;
        }
      }

      const seriesRef = ref(db, `series/${id}`);
      const updatedData = {
        ...formData,
        watchedEpisodes
      };

      await set(seriesRef, updatedData);
      navigate('/series');
    } catch (error) {
      console.error('Dizi güncelleme hatası:', error);
      setError('Dizi güncellenirken bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Hata</h2>
          <p className="text-gray-600 mb-4">{error}</p>
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
        <div className="max-w-2xl mx-auto">
          <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6">
              <h1 className="text-2xl font-bold text-white flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
                Dizi Düzenle
              </h1>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Dizi Adı
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200"
                  placeholder="Dizi adını girin"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Kapak Resmi
                </label>
                <div
                  onClick={() => fileInputRef.current.click()}
                  className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition duration-200 ${
                    previewImage
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-300 hover:border-purple-500 hover:bg-purple-50'
                  }`}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    accept="image/*"
                    className="hidden"
                  />
                  {previewImage ? (
                    <div className="relative">
                      <img
                        src={previewImage}
                        alt="Preview"
                        className="max-h-48 mx-auto rounded-lg"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition duration-200 rounded-lg flex items-center justify-center">
                        <p className="text-white text-sm">Resmi değiştirmek için tıklayın</p>
                      </div>
                    </div>
                  ) : (
                    <div className="py-8">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                      </svg>
                      <p className="text-sm text-gray-600">
                        Kapak resmi eklemek için tıklayın veya sürükleyin
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label htmlFor="totalSeasons" className="block text-sm font-medium text-gray-700 mb-1">
                    Toplam Sezon
                  </label>
                  <input
                    type="number"
                    id="totalSeasons"
                    name="totalSeasons"
                    value={formData.totalSeasons}
                    onChange={(e) => {
                      const newTotalSeasons = parseInt(e.target.value);
                      setFormData(prev => {
                        const newSeasonsData = { ...prev.seasonsData };
                        // Yeni sezonlar ekle
                        for (let i = 1; i <= newTotalSeasons; i++) {
                          if (!newSeasonsData[i]) {
                            newSeasonsData[i] = { episodeCount: 1 };
                          }
                        }
                        // Fazla sezonları sil
                        Object.keys(newSeasonsData).forEach(season => {
                          if (parseInt(season) > newTotalSeasons) {
                            delete newSeasonsData[season];
                          }
                        });
                        return {
                          ...prev,
                          totalSeasons: newTotalSeasons,
                          seasonsData: newSeasonsData,
                          currentSeason: Math.min(prev.currentSeason, newTotalSeasons)
                        };
                      });
                    }}
                    min="1"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200"
                  />
                </div>

                {/* Her sezon için bölüm sayısı girişi */}
                <div className="space-y-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Sezon Başına Bölüm Sayıları
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {Array.from({ length: formData.totalSeasons }, (_, i) => i + 1).map((season) => (
                      <div key={season}>
                        <label htmlFor={`season_${season}`} className="block text-sm text-gray-600 mb-1">
                          Sezon {season}
                        </label>
                        <input
                          type="number"
                          id={`season_${season}`}
                          name={`season_${season}`}
                          value={formData.seasonsData[season]?.episodeCount || 1}
                          onChange={handleChange}
                          min="1"
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="currentSeason" className="block text-sm font-medium text-gray-700 mb-1">
                      Mevcut Sezon
                    </label>
                    <input
                      type="number"
                      id="currentSeason"
                      name="currentSeason"
                      value={formData.currentSeason}
                      onChange={handleChange}
                      min="1"
                      max={formData.totalSeasons}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200"
                    />
                  </div>

                  <div>
                    <label htmlFor="currentEpisode" className="block text-sm font-medium text-gray-700 mb-1">
                      Mevcut Bölüm
                    </label>
                    <input
                      type="number"
                      id="currentEpisode"
                      name="currentEpisode"
                      value={formData.currentEpisode}
                      onChange={handleChange}
                      min="1"
                      max={formData.seasonsData[formData.currentSeason]?.episodeCount || 1}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="watchingTogether"
                  name="watchingTogether"
                  checked={formData.watchingTogether}
                  onChange={handleChange}
                  className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded transition duration-200"
                />
                <label htmlFor="watchingTogether" className="ml-2 block text-sm text-gray-700">
                  Birlikte İzliyoruz
                </label>
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => navigate(`/series/${id}`)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition duration-200"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition duration-200 flex items-center"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Güncelleniyor...
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Değişiklikleri Kaydet
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditSeries; 