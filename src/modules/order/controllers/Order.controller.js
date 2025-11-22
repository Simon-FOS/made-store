import * as orderService from '../services/Order.service.js';
import * as productService from '../../product/services/Product.service.js';

import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();
const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
const page_logo = process.env.PAGELOGO;

/**
 * Initiate Paystack payment
 */
export const initiatePayment = async (req, res) => {
  try {
    // -------------------------------
    // Read cart directly from cookies
    // -------------------------------
    let cart = [];
    if (req.cookies.cart) {
      try {
        cart = JSON.parse(req.cookies.cart);
        if (!Array.isArray(cart)) cart = [];
      } catch {
        cart = [];
      }
    }

    if (cart.length === 0) {
      return res.status(400).json({ success: false, message: 'Cart is empty' });
    }

    // -------------------------------
    // Calculate total amount
    // -------------------------------
    let totalAmount = 0;
    for (const item of cart) {
      const product = await productService.findById(item.productId);
      if (!product) continue;
      totalAmount += (product.price * (item.quantity || 1));
    }

    if (totalAmount <= 0) {
      return res.status(400).json({ success: false, message: 'Cart total invalid' });
    }

    // -------------------------------
    // Initialize Paystack transaction
    // -------------------------------
    const response = await axios.post(
      'https://api.paystack.co/transaction/initialize',
      {
        email: req.body.email,        // customer's email from form
        amount: totalAmount * 100,    // convert to kobo
        currency: 'NGN',
        metadata: { cartItems: cart }, // store full cart
        callback_url: `${req.protocol}://${req.get('host')}/order/verify`
      },
      {
        headers: { Authorization: `Bearer ${PAYSTACK_SECRET_KEY}` }
      }
    );

    const { authorization_url, reference } = response.data.data;

    // -------------------------------
    // Redirect URL returned to frontend
    // -------------------------------
    return res.json({ success: true, authorization_url, reference });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};


/**
 * Verify Paystack payment and create guest order
 */
export const verifyPaystackTransaction = async (req, res) => {
  const { reference } = req.query;

  if (!reference) {
    return res.status(400).json({ success: false, error: 'Transaction reference is required.' });
  }

  try {
    // --------------- Read cart from cookie ----------------
    const cartCookie = req.cookies?.cart;
    if (!cartCookie) return res.status(400).json({ success: false, error: 'Cart is empty.' });

    let cartItems = [];
    try {
      cartItems = JSON.parse(cartCookie); // [{ productId, quantity, price }]
      if (!Array.isArray(cartItems) || cartItems.length === 0) {
        return res.status(400).json({ success: false, error: 'Cart is empty or invalid.' });
      }
    } catch (err) {
      return res.status(400).json({ success: false, error: 'Invalid cart format.' });
    }

    // --------------- Verify transaction with Paystack ----------------
    const response = await axios.get(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: { Authorization: `Bearer ${PAYSTACK_SECRET_KEY}` }
    });

    const paymentData = response.data.data;
    if (!paymentData.status || paymentData.status !== 'success') {
      return res.status(400).json({ success: false, error: 'Payment not successful.' });
    }

    // --------------- Extract customer info ----------------
    const customerData = {
      email: paymentData.customer.email,
      phone: paymentData.customer.phone || null,
      name: paymentData.customer.name || 'Guest',
    };

    // --------------- Create order ----------------
    const result = await orderService.createOrder(customerData, cartItems, {
      provider: 'paystack',
      transactionReference: reference,
      amount: paymentData.amount / 100, // Paystack sends amount in kobo
    });

    if (!result.success) {
      return res.status(500).json({ success: false, error: result.error });
    }

    // --------------- Clear cart ----------------
    res.clearCookie('cart', { httpOnly: true });
    if (req.session?.cart) delete req.session.cart;

    return res.status(200).render('order_complete', {
      success: true,
      message: 'Order created successfully!',
      order_id: result.order_id,
      tracking_id: result.tracking_id,
      pageTitle: 'Order Complete',
      pageLogo: page_logo
    });

  } catch (err) {
    console.error('Paystack verification error:', err.message);
    return res.status(500).json({ success: false, error: 'Failed to verify transaction.' });
  }
};

