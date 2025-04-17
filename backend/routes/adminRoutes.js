const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");

// Middleware to check admin authentication
const requireAdminAuth = (req, res, next) => {
  if (!req.session.admin) {
    return res.status(401).json({ message: "Unauthorized, please log in." });
  }
  next();
};

// Admin authentication routes
router.post("/login", adminController.adminLogin);
router.post("/logout", adminController.adminLogout);

// Admin dashboard (protected)
router.get("/dashboard", requireAdminAuth, adminController.getDashboard);

// Product management routes (protected)
router.get("/products", requireAdminAuth, adminController.getAllProducts); // Fetch all products
router.post("/products", requireAdminAuth, adminController.addProduct); // Add a new product
router.put("/products/:id", requireAdminAuth, adminController.editProduct); // Edit a product
router.delete("/products/:id", requireAdminAuth, adminController.deleteProduct); // Delete a product

// Order management route (protected)
router.get("/orders", requireAdminAuth, adminController.getOrders); // Fetch all orders

module.exports = router;
