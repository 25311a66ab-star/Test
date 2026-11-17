import React from 'react';
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { LandingPage } from './pages/public/LandingPage';
import { AboutPage } from './pages/public/AboutPage';
import { FeaturesPage } from './pages/public/FeaturesPage';
import { PricingPage } from './pages/public/PricingPage';
import { BusinessPage } from './pages/public/BusinessPage';
import { ContactPage } from './pages/public/ContactPage';
import { ForgotPasswordPage, LoginPage, RegisterPage, ResetPasswordPage } from './pages/auth/AuthPages';
import { OverviewPage } from './pages/dashboard/OverviewPage';
import { InsightsPage } from './pages/dashboard/InsightsPage';
import { CompetitorsPage } from './pages/dashboard/CompetitorsPage';
import { CampaignDetailPage, CampaignsPage } from './pages/dashboard/CampaignsPage';
import { ReportsPage } from './pages/dashboard/ReportsPage';
import { SettingsPage } from './pages/dashboard/SettingsPage';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useApp();
  const location = useLocation();
  if (!isAuthenticated) {
    return <Navigate to={`/login?next=${encodeURIComponent(location.pathname)}`} replace />;
  }
  return <>{children}</>;
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/features" element={<FeaturesPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/business" element={<BusinessPage />} />
          <Route path="/contact" element={<ContactPage />} />

          {/* Auth Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />

          {/* Protected Dashboard Routes */}
          <Route path="/dashboard" element={<ProtectedRoute><OverviewPage /></ProtectedRoute>} />
          <Route path="/dashboard/insights" element={<ProtectedRoute><InsightsPage /></ProtectedRoute>} />
          <Route path="/dashboard/competitors" element={<ProtectedRoute><CompetitorsPage /></ProtectedRoute>} />
          <Route path="/dashboard/campaigns" element={<ProtectedRoute><CampaignsPage /></ProtectedRoute>} />
          <Route path="/dashboard/campaigns/:id" element={<ProtectedRoute><CampaignDetailPage /></ProtectedRoute>} />
          <Route path="/dashboard/reports" element={<ProtectedRoute><ReportsPage /></ProtectedRoute>} />
          <Route path="/dashboard/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}
