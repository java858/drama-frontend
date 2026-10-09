import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// Components
import Header from './components/Header';
import Footer from './components/Footer';
import BottomNav from './components/BottomNav';

// Pages
import Home from './pages/Home';
import Search from './pages/Search';
import DramaDetail from './pages/DramaDetail';
import Player from './pages/Player';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Favorites from './pages/Favorites';
import History from './pages/History';

import { useAuthStore, useGenreStore } from './stores';

// Styles
import './App.css';

// 私有路由组件
const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

function App() {
  const initAuth = useAuthStore((state) => state.init);
  const fetchGenres = useGenreStore((state) => state.fetchGenres);

  useEffect(() => {
    initAuth();
    fetchGenres();
  }, [initAuth, fetchGenres]);

  return (
    <div className="app">
      <Header />
      <main className="main-content">
        <Routes>
          {/* 公开路由 */}
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/drama/:id" element={<DramaDetail />} />
          <Route path="/player/:episodeId" element={<Player />} />
          <Route path="/login" element={<Login />} />

          {/* 私有路由（需要登录） */}
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />
          <Route
            path="/favorites"
            element={
              <PrivateRoute>
                <Favorites />
              </PrivateRoute>
            }
          />
          <Route
            path="/history"
            element={
              <PrivateRoute>
                <History />
              </PrivateRoute>
            }
          />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <BottomNav />
    </div>
  );
}

// 404 页面组件
const NotFound: React.FC = () => {
  const { t } = useTranslation();
  return (
    <div className="not-found">
      <h1>404</h1>
      <p>{t('common.notFound') || '页面不存在'}</p>
    </div>
  );
};

export default App;