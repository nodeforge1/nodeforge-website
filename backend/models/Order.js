const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    orderID: { 
      type: String, 
      required: true,
      unique: true 
    },
    customer: {
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String },
    },
    shippingInfo: {
      address: { type: String, required: true },
      address2: { type: String },
      city: { type: String, required: true },
      state: { type: String, required: true },
      zipCode: { type: String, required: true },
      country: { type: String, required: true, default: "Nigeria" },
    },
    billingInfo: {
      sameAsShipping: { type: Boolean, default: true },
      address: { type: String },
      address2: { type: String },
      city: { type: String },
      state: { type: String },
      zipCode: { type: String },
      country: { type: String },
    },
    products: [
      {
        productId: { type: String, required: true }, // Can be MongoDB ID or any unique product identifier
        name: { type: String, required: true },
        quantity: { type: Number, required: true, default: 1 },
        basePrice: { type: Number, required: true },
        configuration: {
          software: {
            name: { type: String },
            price: { type: Number }
          },
          ram: {
            size: { type: String },
            price: { type: Number }
          },
          storage: {
            type: { type: String },
            price: { type: Number }
          },
          processor: {
            model: { type: String },
            price: { type: Number }
          }
        },
        image: { type: String },
        warranty: { type: String }
      }
    ],
    subtotal: { type: Number, required: true },
    shippingCost: { type: Number, required: true, default: 0 },
    tax: { type: Number, required: true, default: 0 },
    discount: { type: Number, default: 0 },
    totalPrice: { type: Number, required: true },
    paymentMethod: { 
      type: String, 
      enum: ['card', 'paypal', 'crypto', 'bank_transfer'], 
      required: true 
    },
    paymentStatus: { 
      type: String, 
      enum: ['pending', 'completed', 'failed', 'refunded'], 
      default: 'pending' 
    },
    orderStatus: { 
      type: String, 
      enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'returned'], 
      default: 'pending' 
    },
    trackingInfo: {
      carrier: { type: String },
      trackingNumber: { type: String },
      trackingUrl: { type: String },
      estimatedDelivery: { type: Date }
    },
    notes: { type: String },
    stripe_session_id: { type: String },
    metadata: { type: mongoose.Schema.Types.Mixed }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual for formatted order date
orderSchema.virtual('formattedDate').get(function() {
  return this.createdAt.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
});

module.exports = mongoose.model("Order", orderSchema);