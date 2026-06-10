/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { VisibilityProvider } from './context/ModuleVisibilityContext';
import { LanguageProvider } from './context/LanguageContext';
import { NotificationProvider } from './context/NotificationContext';
import { PrintPreferencesProvider } from './context/PrintPreferencesContext';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Login from './pages/Login';
import Home from './pages/Home';
import PlaceholderPage from './pages/PlaceholderPage';
import UserPermissions from './pages/UserPermissions';
import AccessLogs from './pages/AccessLogs';

import ProductsCatalogue from './pages/ProductsCatalogue';
import CustomerDirectory from './pages/CustomerDirectory';
import SaleRepDirectory from './pages/SaleRepDirectory';
import FactoryPO from './pages/FactoryPO';
import PriceBooks from './pages/PriceBooks';
import BookingRequest from './pages/BookingRequest';
import BookingConfirmation from './pages/BookingConfirmation';
import ShippingInstruction from './pages/ShippingInstruction';
import LoadingNotice from './pages/LoadingNotice';
import PackingList from './pages/PackingList';
import CommercialInvoice from './pages/CommercialInvoice';
import ProformaInvoice from './pages/ProformaInvoice';
import Quotations from './pages/Quotations';
import CompanyRegulations from './pages/CompanyRegulations';
import ContractsManagement from './pages/ContractsManagement';

export default function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
      <VisibilityProvider>
        <LanguageProvider>
          <PrintPreferencesProvider>
            <BrowserRouter>
            <Routes>
            <Route path="/login" element={<Login />} />
            
            <Route path="/" element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            } />

            {/* Protected Routes */}
            <Route element={<Layout />}>
              {/* General Modules (Read-only by default) */}
              <Route path="/company-regulations" element={
                <ProtectedRoute>
                  <CompanyRegulations />
                </ProtectedRoute>
              } />
              <Route path="/booking-request" element={
                <ProtectedRoute>
                   <BookingRequest />
                </ProtectedRoute>
              } />
              <Route path="/booking-confirmation" element={
                <ProtectedRoute>
                   <BookingConfirmation />
                </ProtectedRoute>
              } />
              <Route path="/shipping-instruction" element={
                <ProtectedRoute>
                   <ShippingInstruction />
                </ProtectedRoute>
              } />
              <Route path="/loading-notice" element={
                <ProtectedRoute>
                   <LoadingNotice />
                </ProtectedRoute>
              } />
              <Route path="/packing-list" element={
                <ProtectedRoute>
                   <PackingList />
                </ProtectedRoute>
              } />
              <Route path="/commercial-invoice" element={
                <ProtectedRoute>
                   <CommercialInvoice />
                </ProtectedRoute>
              } />
              <Route path="/proforma-invoice" element={
                <ProtectedRoute>
                   <ProformaInvoice />
                </ProtectedRoute>
              } />
              <Route path="/quotations" element={
                <ProtectedRoute>
                   <Quotations />
                </ProtectedRoute>
              } />
              <Route path="/catalogue" element={
                <ProtectedRoute>
                  <ProductsCatalogue />
                </ProtectedRoute>
              } />
              <Route path="/customer-directory" element={
                <ProtectedRoute>
                  <CustomerDirectory />
                </ProtectedRoute>
              } />
              <Route path="/sale-rep" element={
                <ProtectedRoute>
                  <SaleRepDirectory />
                </ProtectedRoute>
              } />
              <Route path="/contracts" element={
                <ProtectedRoute>
                  <ContractsManagement />
                </ProtectedRoute>
              } />
              <Route path="/factory-po" element={
                <ProtectedRoute>
                  <FactoryPO />
                </ProtectedRoute>
              } />
              <Route path="/price-books" element={
                <ProtectedRoute>
                  <PriceBooks />
                </ProtectedRoute>
              } />
              <Route path="/inbound" element={
                <ProtectedRoute>
                  <PlaceholderPage title="Inbound Control" />
                </ProtectedRoute>
              } />
              <Route path="/outbound" element={
                <ProtectedRoute>
                  <PlaceholderPage title="Outbound Control" />
                </ProtectedRoute>
              } />
              <Route path="/inventory" element={
                <ProtectedRoute>
                  <PlaceholderPage title="Inventory Core" />
                </ProtectedRoute>
              } />
              <Route path="/returns" element={
                <ProtectedRoute>
                  <PlaceholderPage title="Returns & QC" />
                </ProtectedRoute>
              } />

              {/* Confidential Modules */}
              <Route path="/settings" element={
                <ProtectedRoute isConfidential>
                  <PlaceholderPage title="WMS Settings" />
                </ProtectedRoute>
              } />
              <Route path="/permissions" element={
                <ProtectedRoute isConfidential>
                  <UserPermissions />
                </ProtectedRoute>
              } />
              <Route path="/access-logs" element={
                <ProtectedRoute isConfidential>
                  <AccessLogs />
                </ProtectedRoute>
              } />
              
              {/* Catch all */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
            </BrowserRouter>
          </PrintPreferencesProvider>
        </LanguageProvider>
      </VisibilityProvider>
      </NotificationProvider>
    </AuthProvider>
  );
}

