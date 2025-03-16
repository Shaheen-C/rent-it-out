import { supabase } from "../libs/createClient";
import React, { useState, useEffect } from "react";
import { MessageCircle, Send } from "lucide-react";

// TypeScript Interfaces
interface Message {
  id: string;
  content: string;
  sender_id: string;
  created_at: string;
}

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [userId, setUserId] = useState<string | null>('550e8400-e29b-41d4-a716-446655440000');

  // Get logged-in user's UUID
  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        console.error("Error fetching user:", error);
      } else {
        setUserId(data?.user?.id || null);
      }
    };
    fetchUser();
  }, []);

  // Fetch Messages from Supabase
  useEffect(() => {
    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .order("created_at", { ascending: true });

      if (error) console.error("Error fetching messages:", error);
      else setMessages(data || []);

      setLoading(false);
    };

    fetchMessages();

    // Real-time Listener
    const subscription = supabase
      .channel("messages")
      .on<Message>(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        (payload) => {
          setMessages((prev) => {
            if (!prev.some((msg) => msg.id === payload.new.id)) {
              return [...prev, payload.new];
            }
            return prev;
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  // Send Message
  const sendMessage = async () => {
    if (!newMessage.trim() || !userId) return;

    const { error } = await supabase
      .from("messages")
      .insert([{ content: newMessage, sender_id: userId ,receiver_id: '550e8400-e29b-41d4-a716-446655440000'}]);

    if (error) console.error("Error sending message:", error);
    else setNewMessage("");
  };

  return (
    <div className="container mx-auto px-4 py-8 pt-28">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="flex h-[calc(100vh-12rem)]">
          {/* Chat Sidebar */}
          <div className="w-1/3 border-r border-amber-100">
            <div className="p-4 border-b border-amber-100">
              <h2 className="text-xl font-semibold text-amber-900">Messages</h2>
            </div>
            <div className="overflow-y-auto h-full">
              <div className="p-4 hover:bg-amber-50 cursor-pointer border-b border-amber-100">
                <h3 className="font-medium text-amber-900">John Doe</h3>
                <p className="text-sm text-amber-700 truncate">
                  Latest message preview...
                </p>
              </div>
            </div>
          </div>

          {/* Chat Window */}
          <div className="flex-1 flex flex-col">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4">
              {loading ? (
                <p className="text-center text-amber-700">Loading messages...</p>
              ) : messages.length > 0 ? (
                messages.map((msg) => (
                  <div key={msg.id} className="mb-3">
                    <p
                      className={`font-semibold ${
                        msg.sender_id === userId ? "text-blue-500" : "text-amber-900"
                      }`}
                    >
                      {msg.sender_id === userId ? "You" : "User"}
                    </p>
                    <p className="text-amber-700">{msg.content}</p>
                  </div>
                ))
              ) : (
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
