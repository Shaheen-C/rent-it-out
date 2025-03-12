import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Heart, Settings, MessageCircle, PlusCircle, User, X } from 'lucide-react';

function AddProductModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X className="w-5 h-5" />
        </button>
        <h2 className="text-2xl font-bold text-[#805532] mb-4">Add New Product</h2>
        <form className="space-y-4">
          <div>
            <label className="block text-[#805532] mb-1">Product Name</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-[#805532]/20 rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-[#805532] mb-1">Description</label>
            <textarea
              className="w-full px-3 py-2 border border-[#805532]/20 rounded-md"
              rows={3}
              required
            />
          </div>
          <div>
            <label className="block text-[#805532] mb-1">Price (per day)</label>
            <input
              type="number"
              className="w-full px-3 py-2 border border-[#805532]/20 rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-[#805532] mb-1">Location</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-[#805532]/20 rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-[#805532] mb-1">Images (up to 4)</label>
            <input
              type="file"
              accept="image/*"
              multiple
              className="w-full px-3 py-2 border border-[#805532]/20 rounded-md"
              required
            />
          </div>
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              className="flex-1 bg-[#805532] text-white py-2 rounded-md hover:bg-[#805532]/80 transition"
            >
              Add Product
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-md hover:bg-gray-300 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Navbar() {
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const location = useLocation();
  
  // Make navbar transparent only on home page
  const isTransparent = location.pathname === '/';

  return (
    <nav className={`text-white sticky top-0 z-50 ${
      isTransparent ? 'bg-transparent' : 'bg-[#805532]'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <Link to="/" className="text-2xl font-bold">Rent It Out</Link>
          </div>
          
          <div className="flex items-center space-x-6">
            <button
              onClick={() => setIsAddProductOpen(true)}
              className="hover:text-white/80 flex items-center gap-2"
            >
              <PlusCircle className="w-6 h-6" />
              <span>Sell</span>
            </button>
            <Link to="/favorites" className="hover:text-white/80">
              <Heart className="w-6 h-6" />
            </Link>
            <Link to="/chat" className="hover:text-white/80">
              <MessageCircle className="w-6 h-6" />
            </Link>
            <Link to="/about" className="hover:text-white/80">
              <Settings className="w-6 h-6" />
            </Link>
            <Link to="/my-account" className="hover:text-white/80">
              <User className="w-6 h-6" />
            </Link>
            <Link 
              to="/login" 
              className="bg-[#805532] px-4 py-2 rounded-md hover:bg-[#805532]/80 transition border border-white"
            >
              Login
            </Link>
          </div>
        </div>
      </div>
      <AddProductModal isOpen={isAddProductOpen} onClose={() => setIsAddProductOpen(false)} />
    </nav>
  );
}

export default Navbar;