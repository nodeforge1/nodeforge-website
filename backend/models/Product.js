const mongoose = require('mongoose');

// Define the product schema
const productSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  basePrice: {  // Base price without any upgrades
    type: Number,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  specs: {
    software: {
      type: String,
      required: true
    },
    defaultSpecs: {
      processor: {
        type: String,
        required: true
      },
      ram: {
        type: String,
        required: true
      },
      storage: {
        type: String,
        required: true
      }
    }
  },
  options: {
    software: [
      {
        name: {
          type: String,
          enum: ['Dappnode', 'Stereum', 'Sedge', 'Coincashew', 'Blockops'],
          required: true
        },
        price: {
          type: Number,
          required: true
        }
      }
    ],
    ram: [
      {
        size: {
          type: String,
          enum: ['16GB', '32GB', '64GB'],
          required: true
        },
        price: {
          type: Number,
          required: true
        }
      }
    ],
    storage: [
      {
        type: {
          type: String,
          enum: ['2TB SSD', '4TB SSD'],
          required: true
        },
        price: {
          type: Number,
          required: true
        }
      }
    ],
    processor: [
      {
        model: {
          type: String,
          enum: ['Core i3', 'Core i5', 'Core i7', 'Core i9'],
          required: true
        },
        price: {
          type: Number,
          required: true
        }
      }
    ]
  }
});

// Create and export the Product model
const Product = mongoose.model('Product', productSchema);
module.exports = { Product };