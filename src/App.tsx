import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Products from './pages/Products';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Checkout from './pages/Checkout';
import ProtectedRoute from './components/ProtectedRoute';
import { useCartStore } from './stores/cartStore';

function App() {
  const cartItems = useCartStore((state) => state.items);

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/products"
              element={
                <ProtectedRoute>
                  <Products />
                </ProtectedRoute>
              }
            />
            <Route path="/login" element={<Login />} />
            <Route
              path="/cart"
              element={
                <ProtectedRoute>
                  <Cart />
                </ProtectedRoute>
              }
            />
            <Route
              path="/checkout"
              element={
                cartItems.length > 0 ? (
                  <ProtectedRoute>
                    <Checkout />
                  </ProtectedRoute>
                ) : (
                  <Navigate to="/cart" replace />
                )
              }
            />
          </Routes>
        </main>
        <Toaster position="bottom-right" />
      </div>
    </BrowserRouter>
  );
}

export default App;
