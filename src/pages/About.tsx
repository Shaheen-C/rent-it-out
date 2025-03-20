  import React, { useState } from 'react';
import { Bell, Lock, User, ArrowLeft, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function About() {
  const navigate = useNavigate();
  const [showEmailChange, setShowEmailChange] = useState(false);
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(false);

  return (
    <div className="container mx-auto px-4 py-8">
      <button
        onClick={() => navigate(-1)}
        className="text-amber-700 hover:text-amber-600 mb-6 flex items-center gap-2"
      >
        <ArrowLeft className="w-6 h-6" />
      </button>

      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-amber-900 mb-8">Settings</h1>
        
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-md relative">
            <div className="flex items-center gap-4 mb-4">
              <User className="w-6 h-6 text-amber-700" />
              <h2 className="text-xl font-semibold text-amber-900">Account Details</h2>
            </div>
            
              <div>
                <div>
                  <label className="block text-amber-700 mb-2">Email</label>
                  <input
                  disabled={true}
                    type="email"
                    className="w-full px-3 py-2 border border-amber-200 rounded-md"
                    value="user@example.com"
                    readOnly
                  />
                </div>
                {/* <button 
                  className="text-amber-700 hover:text-amber-600 mt-4"
                  onClick={() => setShowEmailChange(true)}
                >
                  Change Email
                </button> */}
              </div>
          </div>

          {/* <div className="bg-white p-6 rounded-lg shadow-md relative">
            <div className="flex items-center gap-4 mb-4">
              <Lock className="w-6 h-6 text-amber-700" />
              <h2 className="text-xl font-semibold text-amber-900">Password</h2>
            </div>
            {showPasswordChange ? (
              <div className="space-y-4">
                <button
                  onClick={() => setShowPasswordChange(false)}
                  className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                >
                  <X className="w-5 h-5" />
                </button>
                <div>
                  <label className="block text-amber-700 mb-2">Current Password</label>
                  <input
                    type="password"
                    className="w-full px-3 py-2 border border-amber-200 rounded-md"
                    placeholder="Enter current password"
                  />
                </div>
                <div>
                  <label className="block text-amber-700 mb-2">New Password</label>
                  <input
                    type="password"
                    className="w-full px-3 py-2 border border-amber-200 rounded-md"
                    placeholder="Enter new password"
                  />
                </div>
                <div>
                  <label className="block text-amber-700 mb-2">Confirm New Password</label>
                  <input
                    type="password"
                    className="w-full px-3 py-2 border border-amber-200 rounded-md"
                    placeholder="Confirm new password"
                  />
                </div>
                <button className="bg-amber-700 text-white px-4 py-2 rounded-md hover:bg-amber-600">
                  Update Password
                </button>
              </div>
            ) : (
              <button 
                className="text-amber-700 hover:text-amber-600"
                onClick={() => setShowPasswordChange(true)}
              >
                Change Password
              </button>
            )}
          </div> */}

          {/* <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center gap-4 mb-4">
              <Bell className="w-6 h-6 text-amber-700" />
              <h2 className="text-xl font-semibold text-amber-900">Notifications</h2>
            </div>
            <div className="space-y-4">
              <label className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  className="rounded text-amber-700"
                  checked={emailNotifications}
                  onChange={(e) => setEmailNotifications(e.target.checked)}
                />
                <span className="text-amber-900">Email notifications</span>
              </label>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
}

export default About;