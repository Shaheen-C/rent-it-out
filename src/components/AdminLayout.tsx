import React from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Package, 
  MessageSquare, 
  Activity,
  LogOut
} from 'lucide-react';

function AdminLayout() {
  const location = useLocation();

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' },
    { icon: Package, label: 'Products', path: '/admin/products' },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="w-64 bg-[#805532] text-white">
        <div className="p-4">
          <h1 className="text-xl font-bold">Admin Panel</h1>
        </div>
        <nav className="mt-8">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 text-sm hover:bg-white/10 ${
                location.pathname === item.path ? 'bg-white/20' : ''
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </Link>
          ))}
          <Link
            to="/login"
            className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-white/10 mt-auto absolute bottom-4"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </Link>
        </nav>
      </aside>
      
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;