import React from 'react';
import { MessageCircle } from 'lucide-react';

function Chat() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="flex h-[calc(100vh-12rem)]">
          {/* Chat list sidebar */}
          <div className="w-1/3 border-r border-amber-100">
            <div className="p-4 border-b border-amber-100">
              <h2 className="text-xl font-semibold text-amber-900">Messages</h2>
            </div>
            <div className="overflow-y-auto h-full">
              {/* Placeholder chat items */}
              <div className="p-4 hover:bg-amber-50 cursor-pointer border-b border-amber-100">
                <h3 className="font-medium text-amber-900">John Doe</h3>
                <p className="text-sm text-amber-700 truncate">Latest message preview...</p>
              </div>
            </div>
          </div>

          {/* Chat window */}
          <div className="flex-1 flex flex-col">
            {/* Empty state */}
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <MessageCircle className="w-16 h-16 text-amber-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-amber-900">Your Messages</h3>
                <p className="text-amber-700 mt-2">Select a conversation to start chatting</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chat;