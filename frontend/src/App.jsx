import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { FormProvider } from './context/FormContext';
import { LanguageProvider } from './context/LanguageContext';
import PrivateRoute from './components/PrivateRoute';

// Pages
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import VerifyOTPPage from './pages/VerifyOTPPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import FormWizard from './pages/FormWizard';
import Dashboard from './pages/Dashboard';
import BusinessAgreement from './pages/BusinessAgreement';

function App() {
  return (
    <LanguageProvider>
      <Router>
        <AuthProvider>
          <FormProvider>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/verify-otp" element={<VerifyOTPPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

              {/* Private Routes */}
              <Route
                path="/agreement"
                element={
                  <PrivateRoute>
                    <BusinessAgreement />
                  </PrivateRoute>
                }
              />
              <Route
                path="/wizard"
                element={
                  <PrivateRoute>
                    <FormWizard />
                  </PrivateRoute>
                }
              />
              <Route
                path="/dashboard"
                element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                }
              />

              {/* Catch all - redirect to home */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </FormProvider>
        </AuthProvider>
      </Router>
    </LanguageProvider>
  );
}

export default App;
