const mongoose = require('mongoose');

// Define the Order schema
const orderSchema = new mongoose.Schema({
  eventName: {
    type: String,
    required: true,
  },
  eventDate: {
    type: String,
    required: true,
  },
  numGuests: {
    type: Number,
    required: true,
  },
  items: [{
    name: String,
    price: Number
  }],
  totalPrice: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create and export the model
const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
