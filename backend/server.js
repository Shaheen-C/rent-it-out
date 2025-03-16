const express = require("express");
const supabase = require("./supabase");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json()); // Middleware to parse JSON

// GET all products
app.get("/products", async (req, res) => {
  const { data, error } = await supabase.from("products").select("*");
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// GET a single product by ID
app.get("/products/:id", async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("products_id", id)
    .single(); // `single()` fetches a single record
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// POST a new product
app.post("/products", async (req, res) => {
  const { name, description, category, price, availability, seller_id, location } = req.body;
  
  const { data, error } = await supabase.from("products").insert([
    {
      name,
      description,
      category,
      price,
      availability,
      seller_id,
      location,
    },
  ]);
  
  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data);
});

// PUT (update) an existing product by ID
app.put("/products/:id", async (req, res) => {
  const { id } = req.params;
  const { name, description, category, price, availability, seller_id, location } = req.body;

  const { data, error } = await supabase
    .from("products")
    .update({
      name,
      description,
      category,
      price,
      availability,
      seller_id,
      location,
    })
    .eq("products_id", id); // `eq()` filters the records by product ID
  
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// DELETE a product by ID
app.delete("/products/:id", async (req, res) => {
  const { id } = req.params;
  
  const { data, error } = await supabase
    .from("products")
    .delete()
    .eq("products_id", id); // Filter by product ID to delete a specific record
  
  if (error) return res.status(500).json({ error: error.message });
  res.status(204).send(); // No content (successful deletion)
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
