import React from "react";
import { Routes, Route } from "react-router-dom";
import SiteView from "./components/SiteView";
import BookingPage from "./components/BookingPage";
import ProductPage from "./components/ProductPage";
import ServicesPage from "./components/ServicesPage";
import ServiceDetailPage from "./components/ServiceDetailPage";
import CartPage from "./components/CartPage";
import CheckoutPage from "./components/CheckoutPage";
import GalleryPage from "./components/GalleryPage";
import ContactPage from "./components/ContactPage";
import AboutPage from "./components/AboutPage";
import FAQPage from "./components/FAQPage";
import PrivacyPolicyPage from "./components/PrivacyPolicyPage";
import TermsPage from "./components/TermsPage";
import RefundPolicyPage from "./components/RefundPolicyPage";
import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";
import AdminLoginPage from "./components/AdminLoginPage";
import { RequireAuth, RequireAdmin } from "./components/RouteGuards";
import AdminDashboard from "./components/AdminDashboard";
import AdminAppointmentsPage from "./components/AdminAppointmentsPage";
import MediaLibrary from "./components/MediaLibrary";
import PortalLayout from "./components/portal/PortalLayout";
import PortalDashboard from "./components/portal/PortalDashboard";
import MyAppointmentsPage from "./components/portal/MyAppointmentsPage";
import MyOrdersPage from "./components/portal/MyOrdersPage";
import ProfilePage from "./components/portal/ProfilePage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<SiteView />} />
      <Route path="/book" element={<RequireAuth><BookingPage /></RequireAuth>} />
      <Route path="/services" element={<ServicesPage />} />
      <Route path="/services/:id" element={<ServiceDetailPage />} />
      <Route path="/product/:id" element={<ProductPage />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/checkout" element={<RequireAuth><CheckoutPage /></RequireAuth>} />
      <Route path="/gallery" element={<GalleryPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/faqs" element={<FAQPage />} />
      <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
      <Route path="/terms" element={<TermsPage />} />
      <Route path="/refund-policy" element={<RefundPolicyPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/admin/login" element={<AdminLoginPage />} />

      <Route path="/account" element={<RequireAuth><PortalLayout /></RequireAuth>}>
        <Route index element={<PortalDashboard />} />
        <Route path="appointments" element={<MyAppointmentsPage />} />
        <Route path="orders" element={<MyOrdersPage />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>

      <Route path="/admin" element={<RequireAdmin><AdminDashboard /></RequireAdmin>} />
      <Route path="/admin/media" element={<RequireAdmin><MediaLibrary /></RequireAdmin>} />
      <Route path="/admin/appointments" element={<RequireAdmin><AdminAppointmentsPage /></RequireAdmin>} />
    </Routes>
  );
}