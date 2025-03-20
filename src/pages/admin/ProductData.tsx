import React, { useState, useEffect } from "react";
import { supabase } from "../../libs/createClient";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

interface Product {
  products_id: number;
  name: string;
  description: string;
  price: number;
  created_at: string;
}

function ProductsList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { user, role } = useAuth();
  const navigate = useNavigate();
  // Fetch products from Supabase
  useEffect(() => {
    if (!user) {
      // logout();
      navigate("/");
      return;
    } else if (role !== "admin") {
      navigate("/");
      return;
    }

    const fetchProducts = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase.from("products").select("*");

        if (error) throw error;

        setProducts(data || []);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to load products. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return <p>Loading products...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-[#805532] mb-6">Products List</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 border border-gray-200">ID</th>
              <th className="px-4 py-2 border border-gray-200">Name</th>
              <th className="px-4 py-2 border border-gray-200">Description</th>
              <th className="px-4 py-2 border border-gray-200">Price</th>
              {/* <th className="px-4 py-2 border border-gray-200">Created At</th> */}
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.products_id} className="hover:bg-gray-50">
                <td className="px-4 py-2 border border-gray-200">
                  {product.products_id}
                </td>
                <td className="px-4 py-2 border border-gray-200">
                  {product.name}
                </td>
                <td className="px-4 py-2 border border-gray-200">
                  {product.description}
                </td>
                <td className="px-4 py-2 border border-gray-200">
                  ${product.price}
                </td>
                {/* <td className="px-4 py-2 border border-gray-200">
                  {new Date(product.created_at).toLocaleString()}
                </td> */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ProductsList;
