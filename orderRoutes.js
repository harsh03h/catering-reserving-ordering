const express = require('express');
const router = express.Router();
const Order = require('../models/order');
const nodemailer = require('nodemailer');

// Create a transporter for email notifications
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// POST request to create a new order
router.post('/', async (req, res) => {
  try {
    const { eventName, eventDate, numGuests, items, totalPrice } = req.body;

    // Create a new order document in MongoDB
    const newOrder = new Order({
      eventName,
      eventDate,
      numGuests,
      items,
      totalPrice,
    });

    await newOrder.save();

    // Send a confirmation email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.CUSTOMER_EMAIL,
      subject: `Order Confirmation for ${eventName}`,
      text: `Thank you for your order for ${eventName} on ${eventDate}.\nTotal: $${totalPrice}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.status(500).json({ message: 'Error sending confirmation email', error });
      }
      console.log('Email sent:', info.response);
    });

    res.status(201).json({
      message: 'Order placed successfully',
      order: newOrder,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: 'Failed to place order',
      error: err,
    });
  }
});

module.exports = router;
