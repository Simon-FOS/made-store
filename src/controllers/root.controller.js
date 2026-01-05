import { check, validationResult } from 'express-validator';
import dotenv from 'dotenv';
import * as productService from '../modules/product/services/Product.service.js';

// Derive the equivalent of __dirname
import { fileURLToPath } from 'url';
import path from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


dotenv.config();


const page_logo = process.env.PAGELOGO

const index_view = async (req, res) => {
    try {

        const products = await productService.findAll({ limit: 8, offset: 0 });

        res.render('index', {
            pageTitle: "Home",
            pageLogo: page_logo,
            products: products.products
        });
    } catch (err) {
        res.status(500).render('./errors/500', { message: 'Internal Server Error', error: err.message });
    }
};

const about_view = async (req, res) => {
    try {


        //console.log(result.rows)
        res.render('about', {
            pageTitle: "About Us",
            pageLogo: page_logo
        });
    } catch (err) {
        res.status(500).render('./errors/500', { message: 'Internal Server Error', error: err.message });
    }
};

const contact_view = async (req, res) => {
    try {


        //console.log(result.rows)
        res.render('contact', {
            pageTitle: "Contact Us",
            pageLogo: page_logo
        });
    } catch (err) {
        res.status(500).render('./errors/500', { message: 'Internal Server Error', error: err.message });
    }
};

const add_to_cart = async (req, res) => {
    try {
        const { productId } = req.body;

        if (!productId) {
            return res.status(400).json({ success: false, message: "Product ID missing" });
        }

        // =============================
        //  SESSION CART (with quantity)
        // =============================
        if (!req.session.cart) {
            req.session.cart = [];
        }

        // Check if product exists in session cart
        const sessionIndex = req.session.cart.findIndex(p => p.productId === productId);
        if (sessionIndex === -1) {
            req.session.cart.push({ productId, quantity: 1 }); // default quantity = 1
        }

        // =============================
        //  COOKIE CART (with quantity)
        // =============================
        let cookieCart = [];
        if (req.cookies.cart) {
            try {
                cookieCart = JSON.parse(req.cookies.cart);
                if (!Array.isArray(cookieCart)) cookieCart = [];
            } catch (error) {
                cookieCart = [];
            }
        }

        const cookieIndex = cookieCart.findIndex(p => p.productId === productId);
        if (cookieIndex === -1) {
            cookieCart.push({ productId, quantity: 1 }); // default quantity = 1
        }

        // Save cookie
        res.cookie("cart", JSON.stringify(cookieCart), {
            maxAge: 900000,
            httpOnly: true,
        });

        const count = req.session.cart.length;

        return res.status(200).json({
            success: true,
            message: "Product added to cart",
            cart: req.session.cart,
            cartCount: count
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: err.message,
        });
    }
};


// ===============================
//  GET CART COUNT
// ===============================
const get_cart_count = async (req, res) => {
    try {
        let cookieCart = [];

        // Read cookie
        if (req.cookies.cart) {
            try {
                cookieCart = JSON.parse(req.cookies.cart);

                // Ensure it's always an array
                if (!Array.isArray(cookieCart)) {
                    cookieCart = [];
                }

            } catch (error) {
                cookieCart = []; // fallback if cookie is corrupted
            }
        }

        return res.status(200).json({
            success: true,
            count: cookieCart.length
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: err.message
        });
    }
};

const checkout_view = async (req, res) => {
    try {
        // -------------------------
        //  Read cart from cookie
        // -------------------------
        let cart = [];
        if (req.cookies.cart) {
            try {
                cart = JSON.parse(req.cookies.cart);
                if (!Array.isArray(cart)) cart = [];
            } catch (error) {
                cart = [];
            }
        }

        // -------------------------
        //  Fetch products with quantity
        // -------------------------
        const products = [];
        for (const item of cart) {
            const product = await productService.findById(item.productId);
            if (product) {
                products.push({
                    name: product.name,
                    price: product.price,
                    id: product.id,
                    image_url: product.image_url,
                    quantity: item.quantity || 1 // default 1 if somehow missing
                });
            }
        }

        // -------------------------
        //  Render checkout page
        // -------------------------
        res.render('checkout', {
            pageTitle: "Checkout",
            pageLogo: page_logo,
            products // now each product has a quantity field
        });

    } catch (err) {
        console.error("Checkout error:", err);
        res.status(500).render('./errors/500', {
            message: 'Internal Server Error',
            error: err.message
        });
    }
};

//=============================
const prices_view = async (req, res) => {
    try {

        const products = await productService.findAll({ limit: 8, offset: 0 });

        res.render('prices', {
            pageTitle: "Price List",
            pageLogo: page_logo,
            products: products.products
        });
    } catch (err) {
        res.status(500).render('./errors/500', { message: 'Internal Server Error', error: err.message });
    }
};

const consent_view = async (req, res) => {
    try {

        const products = await productService.findAll({ limit: 8, offset: 0 });

        res.render('consent', {
            pageTitle: "Client Consent",
            pageLogo: page_logo,
            products: products.products
        });
    } catch (err) {
        res.status(500).render('./errors/500', { message: 'Internal Server Error', error: err.message });
    }
};

const policy_view = async (req, res) => {
    try {

        const products = await productService.findAll({ limit: 8, offset: 0 });

        res.render('policy', {
            pageTitle: "Privacy Policy",
            pageLogo: page_logo,
            products: products.products
        });
    } catch (err) {
        res.status(500).render('./errors/500', { message: 'Internal Server Error', error: err.message });
    }
};

export { index_view, about_view, contact_view, add_to_cart, get_cart_count, checkout_view, prices_view, consent_view, policy_view };