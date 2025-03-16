import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MessageCircle, Heart, ArrowLeft, X } from 'lucide-react';
import { supabase } from '../libs/createClient';  // Import the supabase client

interface ProductDetails {
  id: string;
  name: string;
  description: string;
  price: number;
  location: string;
  availability: boolean;
  images: string[];
  category: string;
  variation: string;
  seller?: {
    name: string;
    rating: number;
  };
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'seller';
  message: string;
  timestamp: Date;
}

function ProductModal({ product, onClose }: { product: ProductDetails; onClose: () => void }) {
  const [showChat, setShowChat] = useState(false);
  const [message, setMessage] = useState('');
  const [isLiked, setIsLiked] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);

  const sendMessage = () => {
    if (message.trim()) {
      // Add user message
      const userMessage: ChatMessage = {
        id: Date.now().toString(),
        sender: 'user',
        message: message.trim(),
        timestamp: new Date(),
      };
      
      // Simulate seller response
      const sellerResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'seller',
        message: `Thank you for your interest! I'll get back to you shortly regarding "${message.trim()}"`,
        timestamp: new Date(),
      };

      setChatMessages([...chatMessages, userMessage, sellerResponse]);
      setMessage('');
    }
  };

  return (
    <div className="fixed min-h-screen inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#805532] hover:text-[#805532]/80"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            {product.images && product.images.length > 0 ? (
              <>
                <div className="aspect-square rounded-lg overflow-hidden mb-4">
                  <img 
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {product.images.slice(1).map((img, idx) => (
                    <div key={idx} className="aspect-square rounded-lg overflow-hidden">
                      <img 
                        src={img}
                        alt={`${product.name} ${idx + 2}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="aspect-square rounded-lg overflow-hidden mb-4 bg-gray-200 flex items-center justify-center">
                <p className="text-gray-500">No image available</p>
              </div>
            )}
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <h2 className="text-2xl font-bold text-[#805532]">{product.name}</h2>
              <button 
                onClick={() => setIsLiked(!isLiked)}
                className={`p-2 rounded-full ${isLiked ? 'text-red-500' : 'text-gray-400'} hover:bg-gray-100`}
              >
                <Heart className="w-6 h-6" fill={isLiked ? "currentColor" : "none"} />
              </button>
            </div>
            <p className="text-xl font-semibold text-[#805532]">${product.price}/day</p>
            
            <div className="space-y-2">
              <p className="font-semibold text-[#805532]">Category</p>
              <p className="text-[#805532] capitalize">{product.category} - {product.variation}</p>
            </div>
            
            <div className="space-y-2">
              <p className="font-semibold text-[#805532]">Location</p>
              <p className="text-[#805532]">{product.location}</p>
            </div>
            
            <div className="space-y-2">
              <p className="font-semibold text-[#805532]">Availability</p>
              <p className={`font-semibold ${product.availability ? 'text-green-600' : 'text-red-600'}`}>
                {product.availability ? 'Available' : 'Not Available'}
              </p>
            </div>
            
            <div className="space-y-2">
              <p className="font-semibold text-[#805532]">Description</p>
              <p className="text-[#805532]">{product.description}</p>
            </div>
            
            {product.seller && (
              <div className="space-y-2">
                <p className="font-semibold text-[#805532]">Seller</p>
                <div className="flex items-center gap-2">
                  <span className="text-[#805532]">{product.seller.name}</span>
                  <span className="text-[#805532]">★ {product.seller.rating}</span>
                </div>
              </div>
            )}

            {showChat ? (
              <div className="space-y-4 border-t pt-4">
                <div className="h-40 bg-gray-50 rounded-md p-4 overflow-y-auto">
                  {chatMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`mb-2 ${
                        msg.sender === 'user' ? 'text-right' : 'text-left'
                      }`}
                    >
                      <div
                        className={`inline-block p-2 rounded-lg ${
                          msg.sender === 'user'
                            ? 'bg-[#805532] text-white'
                            : 'bg-gray-200 text-[#805532]'
                        }`}
                      >
                        {msg.message}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 px-3 py-2 border border-[#805532]/20 rounded-md"
                  />
                  <button
                    onClick={sendMessage}
                    className="bg-[#805532] text-white px-4 py-2 rounded-md hover:bg-[#805532]/80 transition"
                  >
                    Send
                  </button>
                </div>
                <button
                  onClick={() => setShowChat(false)}
                  className="w-full bg-gray-200 text-gray-800 py-2 rounded-md hover:bg-gray-300 transition"
                >
                  Close Chat
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowChat(true)}
                className="w-full bg-[#805532] text-white py-2 rounded-md hover:bg-[#805532]/80 transition flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-5 h-5" />
                Chat with Seller
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Products() {
  const { category } = useParams();  // Capture the category from the URL
  console.log(category)
  const navigate = useNavigate();  // Hook to navigate to other pages
  const [selectedProduct, setSelectedProduct] = useState<ProductDetails | null>(null);
  const [products, setProducts] = useState<ProductDetails[]>([]);  // State to hold products
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch products from Supabase filtered by variation
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Query products by variation that matches the URL parameter
        console.log(category)
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('variation', category);  // Filter by variation matching the category parameter
        console.log(data);
        if (error) {
          throw error;
        }

        // Set the fetched data in state
        setProducts(data || []);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (category) {
      fetchProducts();
    }
  }, [category]);  // Re-run when category changes

  return (
    <div className="container mx-auto px-4 py-8">
      <button 
        onClick={() => navigate(-1)} 
        className="text-[#805532] hover:text-[#805532]/80 mb-8"
      >
        <ArrowLeft className="w-6 h-6" />
      </button>

      <h1 className="text-3xl font-bold text-[#805532] mb-8 capitalize">
        {category?.replace('-', ' ')}
      </h1>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-[#805532]">Loading products...</p>
        </div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-[#805532] text-xl">No products found in this category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {products.map((product) => (
            <div 
              key={product.id}
              className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transform hover:scale-105 transition"
              onClick={() => setSelectedProduct(product)}
            >
              <div className="h-48 bg-gray-200 relative">
                {product.images && product.images.length > 0 ? (
                  <img 
                    src={product.images[0]} 
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <p className="text-gray-500">No image</p>
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-[#805532]">{product.name}</h3>
                <p className="text-[#805532] mt-2">${product.price}/day</p>
                <button className="mt-4 bg-[#805532] text-white px-4 py-2 rounded-md hover:bg-[#805532]/80 transition w-full">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedProduct && (
        <ProductModal 
          product={selectedProduct} 
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
}

export default Products;