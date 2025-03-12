import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Crown, BellRing as Ring, Shovel as Shoe, ArrowLeft } from 'lucide-react';

const categories = {
  bride: [
    { 
      name: 'Jewelry', 
      icon: Ring, 
      path: '/products/jewelry',
      image: 'https://images.unsplash.com/photo-1602752250015-52934bc45613?auto=format&fit=crop&w=800&q=80'
    },
    { 
      name: 'Dress', 
      icon: Crown, 
      path: '/products/bride-dress',
      image: 'https://images.unsplash.com/photo-1594552072238-b8a33785b261?auto=format&fit=crop&w=800&q=80'
    },
    { 
      name: 'Shoes', 
      icon: Shoe, 
      path: '/products/bride-shoes',
      image: 'https://images.unsplash.com/photo-1595341595379-cf1cd0ed7ad1?auto=format&fit=crop&w=800&q=80'
    }
  ],
  groom: [
    { 
      name: 'Accessories', 
      icon: Ring, 
      path: '/products/accessories',
      image: 'https://images.unsplash.com/photo-1594223274512-ad4803739b7c?auto=format&fit=crop&w=800&q=80'
    },
    { 
      name: 'Dress', 
      icon: Crown, 
      path: '/products/groom-dress',
      image: 'https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?auto=format&fit=crop&w=800&q=80'
    },
    { 
      name: 'Shoes', 
      icon: Shoe, 
      path: '/products/groom-shoes',
      image: 'https://images.unsplash.com/photo-1578116922645-3976907a7671?auto=format&fit=crop&w=800&q=80'
    }
  ]
};

function Home() {
  const [selectedType, setSelectedType] = React.useState<'bride' | 'groom' | null>(null);
  const navigate = useNavigate();

  return (
    <div 
      className="container mx-auto px-4 py-8 min-h-screen"
      style={{ 
        backgroundImage: "url('https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=2000&q=80')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      {selectedType && (
        <button
          onClick={() => setSelectedType(null)}
          className="text-[#805532] hover:text-[#805532]/80 mb-8 bg-white/80 p-2 rounded-full"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
      )}

      {!selectedType ? (
        <div className="flex flex-col items-center space-y-8">
          <h1 className="text-4xl font-bold text-[#805532] bg-white/80 px-6 py-3 rounded-lg">Welcome to Rent It Out</h1>
          <p className="text-xl text-[#805532] bg-white/80 px-4 py-2 rounded-lg">Choose your category</p>
          <div className="flex space-x-8">
            <button
              onClick={() => setSelectedType('bride')}
              className="p-8 bg-[#805532] text-white rounded-lg hover:bg-[#805532]/80 transition"
            >
              <h2 className="text-2xl font-semibold">Bride</h2>
            </button>
            <button
              onClick={() => setSelectedType('groom')}
              className="p-8 bg-[#805532] text-white rounded-lg hover:bg-[#805532]/80 transition"
            >
              <h2 className="text-2xl font-semibold">Groom</h2>
            </button>
          </div>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-[#805532] mb-8 capitalize bg-white/80 px-6 py-3 rounded-lg inline-block">
            {selectedType} Categories
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {categories[selectedType].map((category) => (
              <Link
                key={category.name}
                to={category.path}
                className="relative overflow-hidden rounded-lg h-64 group"
              >
                <img 
                  src={category.image} 
                  alt={category.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-[#805532]/40 flex items-center justify-center">
                  <h3 className="text-2xl font-semibold text-white">{category.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;