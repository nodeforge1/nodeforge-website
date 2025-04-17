const { Product } = require('../models/Product');

// Get all products
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products', error });
  }
};

// Get a single product by `id`
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id );
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching product', error });
  }
};

// Create a new product with a unique `id`
const createProduct = async (req, res) => {
  try {
    const { name, description, basePrice, image, specs, options } = req.body;
    console.log(req.body)
    if (!name || !description || !basePrice || !image || !specs || !options) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Generate a unique ID if not provided
    const productId = req.body.id ? Number(req.body.id) : Date.now();

    const newProduct = new Product({
      id: productId,
      name,
      description,
      basePrice,
      image,
      specs,
      options
    });

    await newProduct.save();
    res.status(201).json({ message: 'Product created successfully', product: newProduct });
  } catch (error) {
    res.status(500).json({ message: 'Error creating product', error });
  }
};

// Normalize product specifications before update
const normalizeSpec = (specs) => {
  if (!specs) return specs;
  
  return {
    ...specs,
    defaultSpecs: {
      ...specs.defaultSpecs,
      // Remove any unwanted suffixes if needed
      ram: specs.defaultSpecs?.ram?.replace(' RAM', '') || specs.defaultSpecs?.ram
    }
  };
};

// Update an existing product by `id`
const updateProduct = async (req, res) => {
  try {
    const updateData = { ...req.body };
    
    // Normalize spec if it exists in the update data
    if (updateData.spec) {
      updateData.spec = normalizeSpec(updateData.spec);
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id ,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json({ message: 'Product updated successfully', product: updatedProduct });
  } catch (error) {
    res.status(500).json({ message: 'Error updating product', error });
  }
};

// Delete a product by `id`
const deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete( req.params.id );
    if (!deletedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting product', error });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};