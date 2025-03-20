import React, { useState, useEffect } from "react";
import { Package, ShoppingBag, Trash2, ToggleLeft, ToggleRight } from "lucide-react";
import { supabase } from "../libs/createClient";
import { useAuth } from "../contexts/AuthContext";

interface Product {
  products_id: string;
  name: string;
  price: number;
  description: string;
  images: string[];
  availability: boolean; // Updated to boolean
  seller_id: string;
}

function MyAccount() {
  const [myProducts, setMyProducts] = useState<Product[]>([]);
  const [rentedItems, setRentedItems] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  // Fetch user's products
  useEffect(() => {
    const fetchMyProducts = async () => {
      if (!user) return;

      try {
        setIsLoading(true);
        console.log("user", user);
        // Query products where seller_id matches the current user's ID
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .eq("seller_id", user.id);

        if (error) throw error;

        setMyProducts(data || []);
      } catch (err: any) {
        console.error("Error fetching products:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchMyProducts();
    }
  }, [user]);

  // Delete product handler
  const handleDeleteProduct = async (productId: string) => {
    if (!confirm("Are you sure you want to delete this item?")) return;

    try {
      // Delete the product from Supabase
      const { error } = await supabase
        .from("products")
        .delete()
        .eq("products_id", productId);

      if (error) throw error;

      // Remove the deleted product from state
      setMyProducts(
        myProducts.filter((product) => product.products_id !== productId)
      );
    } catch (err) {
      console.error("Error deleting product:", err);
      alert("Failed to delete product. Please try again.");
    }
  };

  // Toggle availability handler
  const toggleAvailability = async (productId: string, currentAvailability: boolean) => {
    try {
      // Update the availability in Supabase
      const { error } = await supabase
        .from("products")
        .update({ availability: !currentAvailability })
        .eq("products_id", productId);

      if (error) throw error;

      // Update the local state to reflect the new availability
      setMyProducts((prev) =>
        prev.map((product) =>
          product.products_id === productId
            ? { ...product, availability: !currentAvailability }
            : product
        )
      );
    } catch (err) {
      console.error("Error toggling availability:", err);
      alert("Failed to update availability. Please try again.");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 pt-28">
      <h1 className="text-3xl font-bold text-amber-900 mb-8">My Account</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <ShoppingBag className="w-6 h-6 text-amber-700" />
            <h2 className="text-xl font-semibold text-amber-900">
              Rented Items
            </h2>
          </div>
          <div className="space-y-4">
            {rentedItems.length > 0 ? (
              rentedItems.map((item) => (
                <div
                  key={item.products_id}
                  className="bg-white p-4 rounded-lg shadow-md flex gap-4"
                >
                  <img
                    src={
                      item.images && item.images[0]
                        ? item.images[0]
                        : "/placeholder-image.jpg"
                    }
                    alt={item.name}
                    className="w-24 h-24 object-cover rounded-md"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-amber-900">
                      {item.name}
                    </h3>
                    <p className="text-amber-700">${item.price}/day</p>
                    <p className="text-gray-600 text-sm">{item.description}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 italic">
                You haven't rented any items yet.
              </p>
            )}
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-4">
            <Package className="w-6 h-6 text-amber-700" />
            <h2 className="text-xl font-semibold text-amber-900">My Items</h2>
          </div>

          {isLoading ? (
            <p>Loading your items...</p>
          ) : error ? (
            <p className="text-red-500">Error: {error}</p>
          ) : (
            <div className="space-y-4">
              {myProducts.length > 0 ? (
                myProducts.map((product) => (
                  <div
                    key={product.products_id}
                    className="bg-white p-4 rounded-lg shadow-md flex gap-4"
                  >
                    <img
                      src={
                        product.images && product.images[0]
                          ? product.images[0]
                          : "/placeholder-image.jpg"
                      }
                      alt={product.name}
                      className="w-24 h-24 object-cover rounded-md"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-amber-900">
                        {product.name}
                      </h3>
                      <p className="text-amber-700">${product.price}/day</p>
                      <p className="text-gray-600 text-sm truncate">
                        {product.description}
                      </p>
                      <span
                        className={`inline-block px-2 py-1 rounded-full text-sm mt-2 ${
                          product.availability
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {product.availability ? "Available" : "Not Available"}
                      </span>
                    </div>
                    <div className="flex flex-col gap-2">
                      <button
                        className="p-2 text-blue-600 hover:text-blue-800 transition-colors"
                        onClick={() =>
                          toggleAvailability(
                            product.products_id,
                            product.availability
                          )
                        }
                      >
                        {product.availability ? (
                          <ToggleRight className="w-5 h-5" />
                        ) : (
                          <ToggleLeft className="w-5 h-5" />
                        )}
                      </button>
                      <button
                        className="p-2 text-red-600 hover:text-red-800 transition-colors"
                        onClick={() => handleDeleteProduct(product.products_id)}
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 italic">
                  You haven't listed any items for rent yet.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MyAccount;