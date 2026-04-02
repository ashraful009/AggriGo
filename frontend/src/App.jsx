import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { FormProvider } from './context/FormContext';
import { LanguageProvider } from './context/LanguageContext';
import PrivateRoute    from './components/PrivateRoute';
import AdminRoute     from './components/AdminRoute';
import SellerRoute    from './components/SellerRoute';
import ProtectedRoute from './components/ProtectedRoute';
import AdminLayout    from './components/layout/AdminLayout';

// Pages
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import VerifyOTPPage from './pages/VerifyOTPPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import FormWizard from './pages/FormWizard';
import UserDashboard from './pages/UserDashboard';
import BusinessAgreement from './pages/BusinessAgreement';
import AdminDashboard from './pages/AdminDashboard';
import BusinessDirectory from './pages/BusinessDirectory';
import BusinessDetail from './pages/BusinessDetail';
import ShopPage from './pages/ShopPage';
import TermsPage from './pages/TermsPage';
import PrivacyPage from './pages/PrivacyPage';
import BecomeSellerPage from './pages/seller/BecomeSellerPage';
import SellerDashboard  from './pages/seller/SellerDashboard';
import AddEditProduct   from './pages/seller/AddEditProduct';
import ProductDetail from './pages/ProductDetail';

import CartPage      from './pages/CartPage';
import CheckoutPage  from './pages/CheckoutPage';
import AdminSellers  from './pages/admin/AdminSellers';
import AdminProducts from './pages/admin/AdminProducts';
import PendingApprovalPage from './pages/PendingApprovalPage';
import OrderSuccess from './pages/OrderSuccess';
import OrderTracking from './pages/OrderTracking';
import SellerOrders from './pages/seller/SellerOrders';
import AdminOrders from './pages/admin/AdminOrders';
import AdminReviews from './pages/admin/AdminReviews';
import LiveProducts from './pages/admin/LiveProducts';

function App() {
  return (
    <LanguageProvider>
      <Router>
          <FormProvider>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/shop" element={<ShopPage />} />
              <Route path="/terms" element={<TermsPage />} />
              <Route path="/privacy" element={<PrivacyPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/verify-otp" element={<VerifyOTPPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

              {/* Private User Routes */}
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
                    <UserDashboard />
                  </PrivateRoute>
                }
              />
              <Route path="/become-seller" element={
  <PrivateRoute><BecomeSellerPage /></PrivateRoute>
} />

<Route path="/pending" element={<PendingApprovalPage />} />

<Route path="/seller/dashboard" element={
  <SellerRoute><SellerDashboard /></SellerRoute>
} />

<Route path="/seller/products/add" element={
  <SellerRoute><AddEditProduct /></SellerRoute>
} />

<Route path="/seller/products/edit/:id" element={
  <SellerRoute><AddEditProduct /></SellerRoute>
} />

<Route path="/product/:id" element={<ProductDetail />} />
<Route path="/cart" element={<CartPage />} />

<Route path="/checkout" element={<CheckoutPage />} />

<Route path="/order-success" element={<OrderSuccess />} />

              {/* ── Orders (both names resolve) ── */}
<Route path="/orders"    element={<PrivateRoute><OrderTracking /></PrivateRoute>} />
<Route path="/my-orders" element={<PrivateRoute><OrderTracking /></PrivateRoute>} />

              {/* ── Customer Dashboard ── */}
<Route path="/customer/dashboard" element={<PrivateRoute><OrderTracking /></PrivateRoute>} />

<Route path="/seller/orders" element={
  <SellerRoute><SellerOrders /></SellerRoute>
} />

              {/* ── Admin redirect aliases ── */}
              <Route path="/admin/dashboard" element={
                <AdminRoute>
                  <Navigate to="/manager/analytics" replace />
                </AdminRoute>
              } />

              {/* ── Admin Panel (nested routes, share AdminLayout sidebar) ── */}
              <Route
                path="/manager"
                element={
                  <AdminRoute>
                    <AdminLayout />
                  </AdminRoute>
                }
              >
                {/* /manager → redirect to /manager/analytics */}
                <Route index element={<Navigate to="analytics" replace />} />

                {/* /manager/analytics */}
                <Route path="analytics" element={<AdminDashboard />} />

                {/* /manager/directory */}
                <Route path="directory" element={<BusinessDirectory />} />

                {/* /manager/directory/:id */}
                <Route path="directory/:id" element={<BusinessDetail />} />
                
                {/* /manager/sellers */}
                <Route path="sellers" element={<AdminSellers />} />
                
                {/* /manager/products */}
                <Route path="products" element={<AdminProducts />} />

                {/* /manager/orders */}
                <Route path="orders" element={<AdminOrders />} />

                {/* /manager/reviews */}
                <Route path="reviews" element={<AdminReviews />} />

                {/* /manager/inventory */}
                <Route path="inventory" element={<LiveProducts />} />
              </Route>

              {/* Catch all - redirect to home */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </FormProvider>
      </Router>
    </LanguageProvider>
  );
}

export default App;
