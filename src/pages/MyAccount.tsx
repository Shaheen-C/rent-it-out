import React from 'react';
import { Package, ShoppingBag, Clock } from 'lucide-react';

interface RentalItem {
  id: string;
  name: string;
  image: string;
  status: 'active' | 'completed' | 'due';
  dueDate?: string;
  price: number;
}

function MyAccount() {
  const rentedItems: RentalItem[] = [
    {
      id: '1',
      name: 'Wedding Dress',
      image: 'https://images.unsplash.com/photo-1594552072238-b8a33785b261?auto=format&fit=crop&w=800&q=80',
      status: 'active',
      dueDate: '2024-04-01',
      price: 99
    }
  ];

  const soldItems: RentalItem[] = [
    {
      id: '2',
      name: 'Bridal Jewelry Set',
      image: 'https://images.unsplash.com/photo-1596436889106-be35e843f974?auto=format&fit=crop&w=800&q=80',
      status: 'active',
      price: 150
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8 pt-28">
      <h1 className="text-3xl font-bold text-amber-900 mb-8">My Account</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <ShoppingBag className="w-6 h-6 text-amber-700" />
            <h2 className="text-xl font-semibold text-amber-900">Rented Items</h2>
          </div>
          <div className="space-y-4">
            {rentedItems.map(item => (
              <div key={item.id} className="bg-white p-4 rounded-lg shadow-md flex gap-4">
                <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded-md" />
                <div className="flex-1">
                  <h3 className="font-semibold text-amber-900">{item.name}</h3>
                  <p className="text-amber-700">${item.price}/day</p>
                  {item.dueDate && (
                    <div className="flex items-center gap-1 text-red-600 mt-2">
                      <Clock className="w-4 h-4" />
                      <span>Due: {item.dueDate}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-4">
            <Package className="w-6 h-6 text-amber-700" />
            <h2 className="text-xl font-semibold text-amber-900">Items for Rent</h2>
          </div>
          <div className="space-y-4">
            {soldItems.map(item => (
              <div key={item.id} className="bg-white p-4 rounded-lg shadow-md flex gap-4">
                <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded-md" />
                <div className="flex-1">
                  <h3 className="font-semibold text-amber-900">{item.name}</h3>
                  <p className="text-amber-700">${item.price}/day</p>
                  <span className="inline-block px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm mt-2">
                    Active
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyAccount;