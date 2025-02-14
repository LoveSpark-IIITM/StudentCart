import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, User, Home, Package, Menu, X } from "lucide-react";
import { useCartStore } from "../stores/cartStore";
import { supabase } from "../lib/supabase";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const cartItems = useCartStore((state) => state.items);
  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const user = supabase.auth.getUser();

  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16 md:hidden">
          {/* Mobile Menu Button - Left */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>

          {/* Logo - Centered in Mobile */}
          <div className="absolute left-1/2 transform -translate-x-1/2">
            <Link to="/" className="flex items-center space-x-2">
              <Package className="h-8 w-8 text-green-600" />
              <span className="text-xl font-bold text-gray-800">GroceryGo</span>
            </Link>
          </div>

          {/* Cart Icon - Right */}
          <Link to="/cart" className="relative">
            <ShoppingCart className="h-6 w-6" />
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </Link>
        </div>

        {/* Desktop Navigation (Unchanged) */}
        <div className="hidden md:flex justify-between items-center h-16">
          {/* Logo - Left */}
          <Link to="/" className="flex items-center space-x-2">
            <Package className="h-8 w-8 text-green-600" />
            <span className="text-xl font-bold text-gray-800">GroceryGo</span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-6">
            <Link to="/" className="nav-link flex items-center space-x-2">
              <Home className="h-5 w-5" />
              <span>Home</span>
            </Link>
            <Link to="/products" className="nav-link flex items-center space-x-2">
              <Package className="h-5 w-5" />
              <span>Products</span>
            </Link>
            <Link to="/cart" className="nav-link flex items-center space-x-2">
              <ShoppingCart className="h-5 w-5" />
              {itemCount > 0 && (
                <span className="bg-green-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
              <span>Cart</span>
            </Link>
            <Link to="/login" className="nav-link flex items-center space-x-2">
              <User className="h-5 w-5" />
              <span>Account</span>
            </Link>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden fixed inset-y-0 left-0 transform ${
            isMenuOpen ? "translate-x-0" : "-translate-x-full"
          } w-64 bg-white shadow-lg transition-transform duration-200 ease-in-out z-50`}
        >
          <div className="p-6 space-y-4">
            <Link
              to="/"
              className="flex items-center space-x-2 text-gray-700 hover:text-green-600"
              onClick={() => setIsMenuOpen(false)}
            >
              <Home className="h-5 w-5" />
              <span>Home</span>
            </Link>
            <Link
              to="/products"
              className="flex items-center space-x-2 text-gray-700 hover:text-green-600"
              onClick={() => setIsMenuOpen(false)}
            >
              <Package className="h-5 w-5" />
              <span>Products</span>
            </Link>
            <Link
              to="/login"
              className="flex items-center space-x-2 text-gray-700 hover:text-green-600"
              onClick={() => setIsMenuOpen(false)}
            >
              <User className="h-5 w-5" />
              <span>Account</span>
            </Link>
          </div>
        </div>

        {/* Overlay */}
        {isMenuOpen && (
          <div
            className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setIsMenuOpen(false)}
          />
        )}
      </div>
    </nav>
  );
}
