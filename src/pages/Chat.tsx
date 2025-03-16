import React, { useState, useEffect } from "react";
import { MessageCircle, Send } from "lucide-react";

// TypeScript Interfaces
interface Message {
  id: string;
  content: string;
  sender_id: string;
  receiver_id: string;
  created_at: string;
}

interface Conversation {
  id: string;
  name: string;
  lastMessage: string;
  lastUpdated: string;
}

const dummyConversations: Conversation[] = [
  {
    id: "user-001",
    name: "John Doe",
    lastMessage: "Hey, how's it going?",
    lastUpdated: "2024-03-15T10:00:00Z",
  },
  {
    id: "user-002",
    name: "Alice Smith",
    lastMessage: "Let's meet tomorrow!",
    lastUpdated: "2024-03-14T14:30:00Z",
  },
  {
    id: "user-003",
    name: "Bob Johnson",
    lastMessage: "I'll check on that and update you.",
    lastUpdated: "2024-03-13T18:15:00Z",
  },
];

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>("");
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  
  const userId = "current-user"; // Simulated logged-in user

  // Load messages from localStorage
  useEffect(() => {
    const storedMessages = JSON.parse(localStorage.getItem("messages") || "[]");
    setMessages(storedMessages);
  }, []);

  // Save messages to localStorage whenever messages update
  useEffect(() => {
    localStorage.setItem("messages", JSON.stringify(messages));
  }, [messages]);

  // Send Message
  const sendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return;

    const newMsg: Message = {
      id: Math.random().toString(36).substring(2, 15),
      content: newMessage,
      sender_id: userId,
      receiver_id: selectedConversation.id,
      created_at: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, newMsg]);
    setNewMessage("");
  };

  return (
    <div className="container mx-auto px-4 py-8 pt-28">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="flex h-[calc(100vh-12rem)]">
          {/* Sidebar - Conversations List */}
          <div className="w-1/3 border-r border-amber-100">
            <div className="p-4 border-b border-amber-100">
              <h2 className="text-xl font-semibold text-amber-900">Chats</h2>
            </div>
            <div className="overflow-y-auto h-full">
              {dummyConversations.map((chat) => (
                <div
                  key={chat.id}
                  className={`p-4 cursor-pointer border-b border-amber-100 ${
                    selectedConversation?.id === chat.id ? "bg-amber-200" : "hover:bg-amber-50"
                  }`}
                  onClick={() => setSelectedConversation(chat)}
                >
                  <h3 className="font-medium text-amber-900">{chat.name}</h3>
                  <p className="text-sm text-amber-700 truncate">{chat.lastMessage}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Chat Window */}
          <div className="flex-1 flex flex-col">
            {selectedConversation ? (
              <>
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4">
  {messages.length === 0 ||
  messages.filter(
    (msg) =>
      (msg.sender_id === userId && msg.receiver_id === selectedConversation?.id) ||
      (msg.sender_id === selectedConversation?.id && msg.receiver_id === userId)
  ).length === 0 ? (
    // No Messages UI
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
    // Display messages
    messages
      .filter(
        (msg) =>
          (msg.sender_id === userId && msg.receiver_id === selectedConversation?.id) ||
          (msg.sender_id === selectedConversation?.id && msg.receiver_id === userId)
      )
      .map((msg) => (
        <div key={msg.id} className="mb-3">
          <p
            className={`font-semibold ${
              msg.sender_id === userId ? "text-blue-500" : "text-amber-900"
            }`}
          >
            {msg.sender_id === userId ? "You" : selectedConversation?.name}
          </p>
          <p className="text-amber-700">{msg.content}</p>
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
                    Select a conversation
                  </h3>
                  <p className="text-amber-700 mt-2">
                    Choose a chat from the list to view messages.
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
