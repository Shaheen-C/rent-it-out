import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Heart,
  Settings,
  MessageCircle,
  PlusCircle,
  User,
  X,
  Upload,
  Loader,
} from "lucide-react";
import { supabase } from "../libs/createClient";
import { useAuth } from "../contexts/AuthContext";

function AddProductModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [userType, setUserType] = useState<"bride" | "groom">("bride");

  const categoryOptions = {
    bride: ["jewellery", "shoes", "dress"],
    groom: ["accessories", "groom-shoes", "groom-dress"],
  };

  const [productName, setProductName] = useState("");
  const [variation, setVariation] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Handle image selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles) return;

    // Check if more than 2 files are selected
    if (selectedFiles.length > 2) {
      setError("You can only upload a maximum of 2 images");
      return;
    }

    // Check if any file is over 2MB
    const tooLargeFiles = Array.from(selectedFiles).filter(
      (file) => file.size > 2 * 1024 * 1024
    );
    if (tooLargeFiles.length > 0) {
      setError("Each image must be under 2MB");
      return;
    }

    setImages(Array.from(selectedFiles));
    setError("");
  };

  // Upload images to Supabase Storage
  // Upload images to Supabase Storage
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (variation === "") {
        throw new Error("Please select a variation");
      }

      let imageUrls = [] as String[];

      // Upload images first and get their URLs
      if (images.length > 0) {
        imageUrls = await uploadImagesToStorage(variation);
        console.log("Uploaded Image URLs:", imageUrls);
      }

      // Insert product with images in one request
      const { data, error: insertError } = await supabase
        .from("products")
        .insert([
          {
            name: productName,
            description,
            category: userType,
            variation: variation,
            price: parseFloat(price),
            location,
            images: imageUrls.length > 0 ? imageUrls : null, // Store images if available
          },
        ])
        .select();

      if (insertError) {
        throw new Error(insertError.message);
      }

      console.log("Product added successfully", data);
      onClose(); // Close modal after success
    } catch (err) {
      console.error("Error adding product:", err);
      setError(err instanceof Error ? err.message : "Unknown error occurred");
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  // Upload images to Supabase Storage - fixed bucket name typo
  const uploadImagesToStorage = async (
    productId: string
  ): Promise<string[]> => {
    const imageUrls: string[] = [];

    for (let i = 0; i < images.length; i++) {
      const file = images[i];
      const fileExt = file.name.split(".").pop();
      // Add timestamp to ensure filename uniqueness
      const timestamp = new Date().getTime();
      const fileName = `${productId}_${timestamp}_${i}.${fileExt}`;
      const filePath = `${fileName}`;

      // Upload file to Supabase Storage - fixed bucket name from 'prdocuts' to 'products'
      const { data, error: uploadError } = await supabase.storage
        .from("prdocuts") // Corrected bucket name
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: true, // Set to true to replace existing files
        });

      if (uploadError) {
        throw new Error(`Error uploading image: ${uploadError.message}`);
      }

      // Get the public URL - fixed bucket name
      const {
        data: { publicUrl },
      } = supabase.storage
        .from("prdocuts") // Corrected bucket name
        .getPublicUrl(filePath);

      imageUrls.push(publicUrl);
      setUploadProgress(Math.round(((i + 1) / images.length) * 100));
    }

    return imageUrls;
  };

  if (!isOpen) return null;

  return (
    <div className=" inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 overflow-auto">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X className="w-5 h-5" />
        </button>
        <h2 className="text-2xl font-bold text-[#805532] mb-4">
          Add New Product
        </h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-[#805532] mb-1">Product Name</label>
            <input
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              type="text"
              className="w-full px-3 py-2 border border-[#805532]/20 rounded-md text-black"
              required
            />
          </div>
          <div className="space-y-2">
            <p className="font-semibold text-[#805532] mb-2">Category</p>
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="userType"
                  value="bride"
                  checked={userType === "bride"}
                  onChange={(e) =>
                    setUserType(e.target.value as "bride" | "groom")
                  }
                  className="text-[#805532] focus:ring-[#805532]"
                />
                <span className="text-[#805532]">Bride</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="userType"
                  value="groom"
                  checked={userType === "groom"}
                  onChange={(e) =>
                    setUserType(e.target.value as "bride" | "groom")
                  }
                  className="text-[#805532] focus:ring-[#805532]"
                />
                <span className="text-[#805532]">Groom</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-[#805532] mb-1">Variation</label>
            <select
              className="w-full px-3 py-2 border border-[#805532]/20 rounded-md text-black"
              value={variation}
              onChange={(e) => setVariation(e.target.value)}
            >
              {categoryOptions[userType].map((category) => (
                <option key={category} value={category} className="capitalize">
                  {category}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-[#805532] mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-[#805532]/20 rounded-md text-black"
              rows={3}
              required
            />
          </div>
          <div>
            <label className="block text-[#805532] mb-1">Price (per day)</label>
            <input
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              type="number"
              className="w-full px-3 py-2 border border-[#805532]/20 rounded-md text-black"
              required
            />
          </div>
          <div>
            <label className="block text-[#805532] mb-1">Location</label>
            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              type="text"
              className="w-full px-3 py-2 border border-[#805532]/20 rounded-md text-black"
              required
            />
          </div>
          <div>
            <label className="block text-[#805532] mb-1">
              Images (max 2, up to 2MB each)
            </label>
            <div className="border border-dashed border-[#805532]/20 rounded-md p-4 text-center">
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                id="imageInput"
                onChange={handleImageChange}
              />
              <label
                htmlFor="imageInput"
                className="flex flex-col items-center justify-center cursor-pointer"
              >
                <Upload className="w-8 h-8 text-[#805532]" />
                <span className="mt-2 text-sm text-gray-500">
                  {images.length > 0
                    ? `${images.length} file${
                        images.length > 1 ? "s" : ""
                      } selected`
                    : "Click to select images"}
                </span>
              </label>
            </div>
            {images.length > 0 && (
              <div className="mt-2">
                <p className="text-sm text-gray-500">Selected files:</p>
                <ul className="text-sm text-gray-700">
                  {images.map((file, index) => (
                    <li
                      key={index}
                      className="flex justify-between items-center"
                    >
                      <span>{file.name}</span>
                      <span className="text-xs text-gray-500">
                        {(file.size / (1024 * 1024)).toFixed(2)} MB
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-[#805532] text-white py-2 rounded-md hover:bg-[#805532]/80 transition flex items-center justify-center"
            >
              {loading ? (
                <>
                  <Loader className="w-4 h-4 mr-2 animate-spin" />
                  {uploadProgress > 0
                    ? `Uploading... ${uploadProgress}%`
                    : "Adding..."}
                </>
              ) : (
                "Add Product"
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-md hover:bg-gray-300 transition"
            >
              Cancel
            </button>
          </div>
        </form>
        {error && <div className="text-red-500 mt-2">{error}</div>}
      </div>
    </div>
  );
}

function Navbar() {
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();
  // Make navbar transparent only on home page
  const isTransparent = location.pathname === "/";
  console.log(user);
  return (
    <nav
      className={`text-white fixed top-0 z-50 w-full  ${
        isTransparent ? "bg-transparent" : "bg-[#805532]"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <Link to="/" className="text-2xl font-bold">
              Rent It Out
            </Link>
          </div>
          {user ? (
          <div className="flex items-center space-x-6">
         
            <button
              onClick={() => setIsAddProductOpen(true)}
              className="hover:text-white/80 flex items-center gap-2"
            >
              <PlusCircle className="w-6 h-6" />
              <span>Sell</span>
            </button>
            {/* <Link to="/favorites" className="hover:text-white/80">
              <Heart className="w-6 h-6" />
            </Link> */}
            <Link to="/chat" className="hover:text-white/80">
              <MessageCircle className="w-6 h-6" />
            </Link>
            <Link to="/about" className="hover:text-white/80">
              <Settings className="w-6 h-6" />
            </Link>
            <Link to="/my-account" className="hover:text-white/80">
              <User className="w-6 h-6" />
            </Link>
           
              <button
                onClick={logout}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
              >
                Logout
              </button>
          </div>

            ) : (
              <Link
                to="/login"
                className="bg-[#805532] px-4 py-2 rounded-md hover:bg-[#805532]/80 transition border border-white"
              >
                Login
              </Link>
            )}
        </div>
      </div>
      <AddProductModal
        isOpen={isAddProductOpen}
        onClose={() => setIsAddProductOpen(false)}
      />
    </nav>
  );
}

export default Navbar;
