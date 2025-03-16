import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";
import BrideImg from "../assets/bride.jpg";
import GroomImg from "../assets/groom.jpg";
import { BellRing as Ring, Crown, Shovel as Shoe } from "lucide-react";
import { Link } from "react-router-dom";
import BG from "../assets/bg.jpg";
// Category Type
type CategoryType = "bride" | "groom";

const categories = {
  bride: [
    {
      name: "Jewelry",
      icon: Ring,
      path: "/products/jewellery",
      image:
        "https://images.unsplash.com/photo-1602752250015-52934bc45613?auto=format&fit=crop&w=800&q=80",
    },
    {
      name: "Dress",
      icon: Crown,
      path: "/products/dress",
      image:
        "https://images.unsplash.com/photo-1594552072238-b8a33785b261?auto=format&fit=crop&w=800&q=80",
    },
    {
      name: "Shoes",
      icon: Shoe,
      path: "/products/shoes",
      image:
        "https://images.pexels.com/photos/10351168/pexels-photo-10351168.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    },
  ],
  groom: [
    {
      name: "Accessories",
      icon: Ring,
      path: "/products/accessories",
      image:
        "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?auto=format&fit=crop&w=800&q=80",
    },
    {
      name: "Dress",
      icon: Crown,
      path: "/products/groom-dress",
      image:
        "https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?auto=format&fit=crop&w=800&q=80",
    },
    {
      name: "Shoes",
      icon: Shoe,
      path: "/products/groom-shoes",
      image:
        "https://images.unsplash.com/photo-1578116922645-3976907a7671?auto=format&fit=crop&w=800&q=80",
    },
  ],
};

const Home: React.FC = () => {
  const [selectedType, setSelectedType] = useState<CategoryType | null>(null);

  return (
    <div
      className="mx-auto px-4 py-8 min-h-screen pt-20 select-none"
      style={{
        backgroundImage: `url(${BG})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
       <div
    className="absolute inset-0 bg-black/20 z-0" />
      {/* Back Button */}
      {selectedType && (
        <button
          onClick={() => setSelectedType(null)}
          className="text-white hover:text-white/80 mb-8  p-2 rounded-full relative !z-10 cursor-pointer"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
      )}

      {/* Selection Screen */}
      {!selectedType ? (
        <div className="flex flex-col items-center space-y-8">
          <h1 className="text-4xl font-bold text-white  px-6 py-3 rounded-lg">
            Welcome to Rent It Out
          </h1>
          <p className="text-xl text-white  px-4 py-2 rounded-lg">
            Choose your category
          </p>

          {/* Category Selection Cards */}
          <div className="flex space-x-8">
            {/* Bride Card */}
            <div
              onClick={() => setSelectedType("bride")}
              className="relative w-64 h-80 rounded-xl shadow-lg overflow-hidden cursor-pointer transform transition duration-300 hover:scale-105"
            >
              <img
                src={BrideImg}
                alt="Bride"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <h2 className="text-3xl font-semibold text-white">Bride</h2>
              </div>
            </div>

            {/* Groom Card */}
            <div
              onClick={() => setSelectedType("groom")}
              className="relative w-64 h-80 rounded-xl shadow-lg overflow-hidden cursor-pointer transform transition duration-300 hover:scale-105"
            >
              <img
                src={
                  "https://images.pexels.com/photos/14450286/pexels-photo-14450286.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                }
                alt="Groom"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <h2 className="text-3xl font-semibold text-white">Groom</h2>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-8 capitalize  px-6 py-3 rounded-lg inline-block">
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
                  <h3 className="text-2xl font-semibold text-white">
                    {category.name}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
