import { useEffect, useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import './App.css';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';

const STORAGE_KEY = 'fitness-tracker-auth';

function loadStoredAuth() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

function AppRoutes({ auth, setAuth }) {
  const navigate = useNavigate();

  function handleAuth(payload) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    setAuth(payload);
    navigate('/dashboard');
  }

  function handleLogout() {
    localStorage.removeItem(STORAGE_KEY);
    setAuth(null);
    navigate('/login');
  }

  return (
    <Routes>
      <Route path="/" element={<Navigate to={auth ? '/dashboard' : '/login'} replace />} />
      <Route path="/login" element={auth ? <Navigate to="/dashboard" replace /> : <AuthPage mode="login" onAuth={handleAuth} />} />
      <Route path="/register" element={auth ? <Navigate to="/dashboard" replace /> : <AuthPage mode="register" onAuth={handleAuth} />} />
      <Route path="/dashboard" element={auth ? <DashboardPage auth={auth} onLogout={handleLogout} /> : <Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to={auth ? '/dashboard' : '/login'} replace />} />
    </Routes>
  );
}

export default function App() {
  const [auth, setAuth] = useState(() => loadStoredAuth());

  useEffect(() => {
    if (!auth) {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [auth]);

  return (
    <BrowserRouter>
      <AppRoutes auth={auth} setAuth={setAuth} />
    </BrowserRouter>
  );
}