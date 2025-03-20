import React, { useState, useEffect } from "react";
import { MessageCircle, Send } from "lucide-react";
import { supabase } from "../libs/createClient";
import { useAuth } from "../contexts/AuthContext";
import { useParams, useNavigate } from "react-router-dom";

// TypeScript Interfaces
interface Product {
  products_id: number;
  name: string;
  description: string;
  seller_id: string;
}

interface ChatMessage {
  id: number;
  product_id: number;
  receiver_id: string;
  sender_id: string;
  message: string;
  timestamp: string;
}

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState<string>("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [productsWithMessages, setProductsWithMessages] = useState<Product[]>([]);
  const { user } = useAuth();
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();

  // Fetch products with messages from Supabase
  useEffect(() => {
    if (!user) return; // Ensure user is defined

    const fetchProductsWithMessages = async () => {
      try {
        // Fetch distinct product_ids from chat_messages where the user is involved
        const { data: messagesData, error: messagesError } = await supabase
          .from("chat_messages")
          .select("product_id")
          .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`); // Use user.id as a value

        if (messagesError) throw messagesError;

        // Extract unique product_ids
        const productIds = Array.from(
          new Set(messagesData.map((msg) => msg.product_id))
        );

        // Fetch products corresponding to these product_ids
        const { data: productsData, error: productsError } = await supabase
          .from("products")
          .select("*")
          .in("products_id", productIds);

        if (productsError) throw productsError;

        setProductsWithMessages(productsData || []);

        // If productId is in the URL, select the corresponding product
        if (productId) {
          const product = productsData.find(
            (p) => p.products_id === parseInt(productId)
          );
          if (product) {
            setSelectedProduct(product);
          }
        }
      } catch (err) {
        console.error("Error fetching products with messages:", err);
      }
    };

    fetchProductsWithMessages();
  }, [productId, user]);

  // Fetch messages for the selected product
  useEffect(() => {
    if (!selectedProduct || !user) return;

    const fetchMessages = async () => {
      try {
        const { data, error } = await supabase
          .from("chat_messages")
          .select("*")
          .eq("product_id", selectedProduct.products_id)
          .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`) // Use user.id as a value
          .order("timestamp", { ascending: true });

        if (error) throw error;

        setMessages(data || []);
      } catch (err) {
        console.error("Error fetching messages:", err);
      }
    };

    fetchMessages();

    // Set up real-time subscription for messages
    const subscription = supabase
      .channel(`chat_messages:product_id=eq.${selectedProduct.products_id}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "chat_messages" },
        (payload) => {
          setMessages((prev) => [...prev, payload.new as ChatMessage]);
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [selectedProduct, user]);

  // Send Message
  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedProduct || !user) return;

    try {
      const { error } = await supabase
        .from("chat_messages")
        .insert([
          {
            product_id: selectedProduct.products_id,
            receiver_id: selectedProduct.seller_id,
            sender_id: user.id,
            message: newMessage.trim(),
            timestamp: new Date().toISOString(),
          },
        ]);

      if (error) throw error;

      setNewMessage("");
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  // Handle product selection
  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product);
    navigate(`/chat/${product.products_id}`);
  };

  return (
    <div className="container mx-auto px-4 py-8 pt-28">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="flex h-[calc(100vh-12rem)]">
          {/* Sidebar - Products with Messages */}
          <div className="w-1/3 border-r border-amber-100">
            <div className="p-4 border-b border-amber-100">
              <h2 className="text-xl font-semibold text-amber-900">Products</h2>
            </div>
            <div className="overflow-y-auto h-full">
              {productsWithMessages.length > 0 ? (
                productsWithMessages.map((product) => (
                  <div
                    key={product.products_id}
                    className={`p-4 cursor-pointer border-b border-amber-100 ${
                      selectedProduct?.products_id === product.products_id
                        ? "bg-amber-200"
                        : "hover:bg-amber-50"
                    }`}
                    onClick={() => handleProductSelect(product)}
                  >
                    <h3 className="font-medium text-amber-900">{product.name}</h3>
                    <p className="text-sm text-amber-700 truncate">
                      {product.description}
                    </p>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center">
                  <p className="text-amber-700">No chat history found.</p>
                  <p className="text-amber-700 mt-2">
                    Start a new chat by selecting a product.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Chat Window */}
          <div className="flex-1 flex flex-col">
            {selectedProduct ? (
              <>
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4">
                  {messages.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center">
                        <MessageCircle className="w-16 h-16 text-amber-300 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-amber-900">
                          No messages yet
                        </h3>
                        <p className="text-amber-700 mt-2">
                          Start the conversation now!
                        </p>
                      </div>
                    </div>
                  ) : (
                    messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`mb-3 ${
                          msg.sender_id === user?.id ? "text-right" : "text-left"
                        }`}
                      >
                        <p
                          className={`font-semibold ${
                            msg.sender_id === user?.id
                              ? "text-blue-500"
                              : "text-amber-900"
                          }`}
                        >
                          {msg.sender_id === user?.id ? "You" : "Seller"}
                        </p>
                        <p
                          className={`inline-block p-2 rounded-lg ${
                            msg.sender_id === user?.id
                              ? "bg-blue-100 text-blue-900"
                              : "bg-amber-100 text-amber-900"
                          }`}
                        >
                          {msg.message}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(msg.timestamp).toLocaleString()}
                        </p>
                      </div>
                    ))
                  )}
                </div>

                {/* Message Input */}
                <div className="p-4 border-t border-amber-100 flex items-center">
                  <input
                    type="text"
                    className="flex-1 p-2 border border-amber-200 rounded-lg outline-none"
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                  />
                  <button
                    className="ml-2 bg-amber-500 text-white px-4 py-2 rounded-lg hover:bg-amber-600"
                    onClick={sendMessage}
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <MessageCircle className="w-16 h-16 text-amber-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-amber-900">
                    Select a product
                  </h3>
                  <p className="text-amber-700 mt-2">
                    Choose a product to start chatting with the owner.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;