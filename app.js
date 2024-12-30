const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');

// Initialize Express
const app = express();
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/catering', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Define models
const Order = mongoose.model('Order', {
  eventName: String,
  eventDate: String,
  numGuests: Number,
  items: Array,
  totalPrice: Number,
});

// Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'your-email@gmail.com',
    pass: 'your-email-password',
  },
});

// Route to handle order submissions
app.post('/api/order', (req, res) => {
  const orderData = req.body;

  const newOrder = new Order(orderData);
  newOrder.save()
    .then(() => {
      // Send email confirmation
      const mailOptions = {
        from: 'your-email@gmail.com',
        to: 'customer-email@example.com',
        subject: `Order Confirmation for ${orderData.eventName}`,
        text: `Thank you for your order! The total price is $${orderData.totalPrice}.`,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(error);
          return res.status(500).json({ success: false, message: 'Error sending confirmation email' });
        }
        console.log('Email sent: ' + info.response);
      });

      res.json({ success: true, message: 'Order placed successfully' });
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({ success: false, message: 'Error placing order' });
    });
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
