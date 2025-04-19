const { Product } = require('../models/Product');

// Simple console logger (replace with Winston/Bunyan in production)
const logger = {
  info: (message, meta) => console.log(`[INFO] ${message}`, meta),
  error: (message, meta) => console.error(`[ERROR] ${message}`, meta),
  warn: (message, meta) => console.warn(`[WARN] ${message}`, meta)
};

// Product input validator
const validateProductInput = (data, isUpdate = false) => {
  const errors = {};
  const requiredFields = ['name', 'description', 'basePrice'];
  const numericFields = ['basePrice'];
  const arrayFields = ['options'];

  // For updates, only validate fields that are actually being updated
  if (isUpdate) {
    for (const field of requiredFields) {
      if (data[field] === '') {
        errors[field] = `${field} cannot be empty`;
      }
    }
  } else {
    // For creates, validate all required fields
    for (const field of requiredFields) {
      if (!data[field]) {
        errors[field] = `${field} is required`;
      } else if (data[field] === '') {
        errors[field] = `${field} cannot be empty`;
      }
    }
  }

  // Validate numeric fields
  for (const field of numericFields) {
    if (data[field] !== undefined && isNaN(Number(data[field]))) {
      errors[field] = `${field} must be a number`;
    }
  }

  // Validate array fields
  for (const field of arrayFields) {
    if (data[field] && !Array.isArray(data[field])) {
      errors[field] = `${field} must be an array`;
    }
  }

  // Validate basePrice is positive
  if (data.basePrice !== undefined && Number(data.basePrice) <= 0) {
    errors.basePrice = 'Price must be greater than 0';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors
  };
};

// Constants
const DEFAULT_PAGE_LIMIT = 100;
const MAX_PAGE_LIMIT = 1000;

/**
 * @desc Get all products with pagination and filtering
 * @route GET /api/products
 * @access Public
 */
const getAllProducts = async (req, res) => {
  try {
    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(
      parseInt(req.query.limit) || DEFAULT_PAGE_LIMIT,
      MAX_PAGE_LIMIT
    );
    const skip = (page - 1) * limit;

    // Basic filtering
    const filter = {};
    if (req.query.name) {
      filter.name = { $regex: req.query.name, $options: 'i' };
    }
    if (req.query.minPrice) {
      filter.basePrice = { ...filter.basePrice, $gte: Number(req.query.minPrice) };
    }
    if (req.query.maxPrice) {
      filter.basePrice = { ...filter.basePrice, $lte: Number(req.query.maxPrice) };
    }

    // Query execution
    const [products, total] = await Promise.all([
      Product.find(filter)
        .skip(skip)
        .limit(limit)
        .lean(),
      Product.countDocuments(filter)
    ]);

    // Response
    res.status(200).json({
      success: true,
      data: products,
      meta: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    logger.error('Failed to fetch products', { error: error.message, stack: error.stack });
    res.status(500).json({
      success: false,
      message: 'Internal server error while fetching products'
    });
  }
};

/**
 * @desc Get a single product by ID
 * @route GET /api/products/:id
 * @access Public
 */
const getProductById = async (req, res) => {
  try {
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid product ID format'
      });
    }

    const product = await Product.findById(req.params.id).lean();

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    logger.error('Failed to fetch product by ID', { 
      id: req.params.id, 
      error: error.message,
      stack: error.stack
    });
    res.status(500).json({
      success: false,
      message: 'Internal server error while fetching product'
    });
  }
};

/**
 * @desc Create a new product
 * @route POST /api/products
 * @access Private/Admin
 */
const createProduct = async (req, res) => {
  try {
    // Validate input
    const { valid, errors } = validateProductInput(req.body);
    if (!valid) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      });
    }

    // Check for duplicate product name
    const existingProduct = await Product.findOne({ name: req.body.name });
    if (existingProduct) {
      return res.status(409).json({
        success: false,
        message: 'Product with this name already exists'
      });
    }

    // Create product
    const newProduct = new Product({
      ...req.body,
      createdBy: req.user?.id // Assuming user is attached to request
    });

    await newProduct.save();

    logger.info(`Product created: ${newProduct._id}`, { productId: newProduct._id });

    res.status(201).json({
      success: true,
      data: newProduct.toObject()
    });
  } catch (error) {
    logger.error('Failed to create product', { 
      error: error.message,
      stack: error.stack,
      body: req.body
    });
    res.status(500).json({
      success: false,
      message: 'Internal server error while creating product'
    });
  }
};

/**
 * @desc Normalize product specifications
 * @param {Object} specs - Product specifications
 * @returns {Object} Normalized specifications
 */
const normalizeSpecs = (specs) => {
  if (!specs) return specs;
  
  const normalized = { ...specs };
  
  if (specs.defaultSpecs) {
    normalized.defaultSpecs = { ...specs.defaultSpecs };
    
    // Normalize RAM specification
    if (normalized.defaultSpecs.ram) {
      normalized.defaultSpecs.ram = normalized.defaultSpecs.ram.replace(' RAM', '');
    }
  }
  
  return normalized;
};

/**
 * @desc Update an existing product
 * @route PUT /api/products/:id
 * @access Private/Admin
 */
const updateProduct = async (req, res) => {
  try {
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid product ID format'
      });
    }

    // Validate input
    const { valid, errors } = validateProductInput(req.body, true); // isUpdate flag
    if (!valid) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      });
    }

    // Prepare update data
    const updateData = { 
      ...req.body,
      updatedBy: req.user?.id,
      updatedAt: new Date()
    };

    // Normalize specs if provided
    if (updateData.specs) {
      updateData.specs = normalizeSpecs(updateData.specs);
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { 
        new: true,
        runValidators: true,
        context: 'query'
      }
    ).lean();

    if (!updatedProduct) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    logger.info(`Product updated: ${req.params.id}`, { productId: req.params.id });

    res.status(200).json({
      success: true,
      data: updatedProduct
    });
  } catch (error) {
    logger.error('Failed to update product', { 
      id: req.params.id,
      error: error.message,
      stack: error.stack,
      body: req.body
    });
    res.status(500).json({
      success: false,
      message: 'Internal server error while updating product'
    });
  }
};

/**
 * @desc Delete a product
 * @route DELETE /api/products/:id
 * @access Private/Admin
 */
const deleteProduct = async (req, res) => {
  try {
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid product ID format'
      });
    }

    const deletedProduct = await Product.findByIdAndDelete(req.params.id);

    if (!deletedProduct) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    logger.info(`Product deleted: ${req.params.id}`, { productId: req.params.id });

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    logger.error('Failed to delete product', { 
      id: req.params.id,
      error: error.message,
      stack: error.stack
    });
    res.status(500).json({
      success: false,
      message: 'Internal server error while deleting product'
    });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};