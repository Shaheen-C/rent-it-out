import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import AdminLayout from './components/AdminLayout';
import Home from './pages/Home';
import Login from './pages/Login';
import Products from './pages/Products';
import Chat from './pages/Chat';
import About from './pages/About';
import MyAccount from './pages/MyAccount';
import Dashboard from './pages/admin/Dashboard';
import ProductData from './pages/admin/ProductData'

function App() {
  return (
    <Router>
      <Routes>
        {/* Admin routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="products" element={<ProductData />} />
        </Route>

        {/* User routes */}
        <Route
          path="*"
          element={
            <div className="min-h-screen bg-[#805532] bg-opacity-10">
              <Navbar />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/products/:category" element={<Products />} />
                <Route path="/chat" element={<Chat />} />
                <Route path="/chat/:id" element={<Chat />} />
                <Route path="/about" element={<About />} />
                <Route path="/my-account" element={<MyAccount />} />
              </Routes>
            </div>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;