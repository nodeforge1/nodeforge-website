const { Product } = require("../models/Product");
const Order = require("../models/Order");

// Hardcoded admin credentials (For production, store in a database or use environment variables)
const ADMIN_CREDENTIALS = {
  email: process.env.ADMIN_EMAIL || "",
  password: process.env.ADMIN_PASSWORD || "",
};

// Admin login
const adminLogin = (req, res) => {
  const { email, password } = req.body;
  console.log(email, password);

  if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
    req.session.admin = true;
    return res.json({ message: "Login successful", redirect: "/admin/dashboard" });
  } else {
    return res.status(401).json({ message: "Invalid email or password" });
  }
};

// Admin logout
const adminLogout = (req, res) => {
  req.session.destroy(() => {
    res.json({ message: "Logged out successfully", redirect: "/admin/login" });
  });
};

// Get Admin Dashboard
const getDashboard = (req, res) => {
  if (!req.session.admin) {
    return res.status(401).json({ message: "Unauthorized, please log in." });
  }
  res.json({ message: "Welcome to the admin dashboard!" });
};

// Fetch all products
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find(); // Fetch products from the database
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Error fetching products", error });
  }
};

// Add a new product
const addProduct = async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    await newProduct.save();
    const updatedProducts = await Product.find(); // Fetch updated product list
    res.status(201).json({ message: "Product added successfully", products: updatedProducts });
  } catch (error) {
    res.status(500).json({ message: "Error adding product", error });
  }
};

// Edit a product by custom ID
const editProduct = async (req, res) => {
  try {
    const { id } = req.params; // Get custom product ID
    const updatedProduct = await Product.findByIdAndUpdate(id , req.body, { new: true });

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    const updatedProducts = await Product.find(); // Fetch updated product list
    res.json({ message: "Product updated successfully", products: updatedProducts });
  } catch (error) {
    res.status(500).json({ message: "Error updating product", error });
  }
};

// Delete a product by custom ID
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params; // Get custom product ID
    const deletedProduct = await Product.findByIdAndDelete( id );

    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    const updatedProducts = await Product.find(); // Fetch updated product list
    res.json({ message: "Product deleted successfully", products: updatedProducts });
  } catch (error) {
    res.status(500).json({ message: "Error deleting product", error });
  }
};

// Get all orders
const getOrders = async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (error) {
    console.error("Database query error:", error);
    res.status(500).json({ message: "Error fetching orders", error: error.message });
  }
};

module.exports = {
  adminLogin,
  adminLogout,
  getDashboard,
  getAllProducts,
  addProduct,
  editProduct,
  deleteProduct,
  getOrders,
};
