import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Home from './components/Home';
import SeriesList from './components/SeriesList';
import SeriesDetail from './components/SeriesDetail';
import AddSeries from './components/AddSeries';
import EditSeries from './components/EditSeries';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/series" element={<SeriesList />} />
            <Route path="/series/:id" element={<SeriesDetail />} />
            <Route path="/series/add" element={<AddSeries />} />
            <Route path="/series/:id/edit" element={<EditSeries />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App; 