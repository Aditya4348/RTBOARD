
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { UserRole } from './types';

import DashboardLayout from './components/DashboardLayout';
import LoginPage from './pages/Login';
import DashboardPage from './pages/Dashboard';
import DataWargaPage from './pages/DataWarga';
import SuratPengantarPage from './pages/SuratPengantar';
import KeuanganPage from './pages/Keuangan';
import IuranPage from './pages/Iuran';
import AgendaPage from './pages/Agenda';
import StrukturOrganisasiPage from './pages/StrukturOrganisasi';
import InventarisPage from './pages/Inventaris';
import PengumumanPage from './pages/Pengumuman';
import KotakSaranPage from './pages/KotakSaran';
import ProfilePage from './pages/Profile';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user && !allowedRoles.includes(user.role)) {
    // Redirect to a more appropriate page if needed, e.g., dashboard
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

const AppRoutes: React.FC = () => {
    const { isAuthenticated } = useAuth();

    return (
        <Routes>
            <Route path="/login" element={<LoginPage />} />
            
            <Route path="/" element={
                isAuthenticated ? <DashboardLayout /> : <Navigate to="/login" />
            }>
                <Route index element={<DashboardPage />} />
                <Route path="data-warga" element={<ProtectedRoute allowedRoles={[UserRole.KETUA, UserRole.SEKRETARIS]}><DataWargaPage /></ProtectedRoute>} />
                <Route path="surat-pengantar" element={<ProtectedRoute allowedRoles={[UserRole.KETUA, UserRole.SEKRETARIS]}><SuratPengantarPage /></ProtectedRoute>} />
                <Route path="keuangan" element={<ProtectedRoute allowedRoles={[UserRole.KETUA, UserRole.BENDAHARA]}><KeuanganPage /></ProtectedRoute>} />
                <Route path="iuran" element={<ProtectedRoute allowedRoles={[UserRole.KETUA, UserRole.BENDAHARA]}><IuranPage /></ProtectedRoute>} />
                <Route path="agenda" element={<ProtectedRoute allowedRoles={[UserRole.KETUA, UserRole.SEKRETARIS, UserRole.WARGA]}><AgendaPage /></ProtectedRoute>} />
                <Route path="struktur-organisasi" element={<ProtectedRoute allowedRoles={[UserRole.KETUA, UserRole.SEKRETARIS]}><StrukturOrganisasiPage /></ProtectedRoute>} />
                <Route path="inventaris" element={<ProtectedRoute allowedRoles={[UserRole.KETUA, UserRole.SEKRETARIS, UserRole.BENDAHARA]}><InventarisPage /></ProtectedRoute>} />
                <Route path="pengumuman" element={<PengumumanPage />} />
                <Route path="kotak-saran" element={<KotakSaranPage />} />
                <Route path="profile" element={<ProfilePage />} />
                <Route path="*" element={<Navigate to="/" />} />
            </Route>
        </Routes>
    );
}

const App: React.FC = () => {
  return (
    <AuthProvider>
      <DataProvider>
        <HashRouter>
            <AppRoutes />
        </HashRouter>
      </DataProvider>
    </AuthProvider>
  );
};

export default App;
