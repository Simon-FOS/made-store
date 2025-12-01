import db from '../../../models/index.cjs';
import { v4 as uuidv4 } from 'uuid';
import * as productService from '../../product/services/Product.service.js';

/**
 * Create guest order after successful Paystack payment
 * @param {Object} customerData - { name, email, phone }
 * @param {Array} cartItems - [{ productId, quantity, price }]
 * @param {Object} paymentData - { provider, transactionReference, amount, raw }
 */
export async function createOrder(customerData, cartItems, paymentData) {
    const transaction = await db.sequelize.transaction();

    try {
        if (!Array.isArray(cartItems) || cartItems.length === 0) {
            throw new Error('Cart is empty or invalid');
        }

        // --------------- Create Order ----------------
        const order = await db.Order.create({
            tracking_id: uuidv4(),
            customer_email: customerData.email,
            customer_name: customerData.name,
            customer_phone: customerData.phone,
            total_amount: paymentData.amount,
            status: 'completed',
            payment_provider: paymentData.provider,
            payment_reference: paymentData.transactionReference,
            paid_at: new Date(),
        }, { transaction });

        const orderItems = [];

        for (const item of cartItems) {
            const product = await productService.findById(item.productId);
            if (!product) throw new Error(`Product not found: ID ${item.productId}`);

            orderItems.push({
                order_id: order.id,
                product_id: item.productId,
                quantity: item.quantity,
                price: product.price,
                total_price: product.price * item.quantity,
            });
        }

        await db.OrderItem.bulkCreate(orderItems, { transaction });

        // --------------- Create Payment Record ----------------
        await db.Payment.create({
            order_id: order.id,
            payment_provider: paymentData.provider,
            transaction_reference: paymentData.transactionReference,
            amount: paymentData.amount,
            status: 'success',
            metadata: paymentData.raw || null,
        }, { transaction });

        await transaction.commit();

        return { success: true, order_id: order.id, tracking_id: order.tracking_id };

    } catch (error) {
        await transaction.rollback();
        console.error('Order creation failed:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Get all orders with pagination
 */
export const getOrders = async (page = 1, limit = 20) => {
    const offset = (page - 1) * limit;
    const { rows: orders, count: totalOrders } = await db.Order.findAndCountAll({
        include: [
            { model: db.OrderItem, as: 'items', attributes: ['product_id', 'quantity', 'price'] },
            { model: db.Payment, as: 'payment', attributes: ['transaction_reference', 'status', 'amount'] }
        ],
        limit,
        offset,
        order: [['createdAt', 'DESC']],
    });

    return {
        orders,
        totalPages: Math.ceil(totalOrders / limit),
        totalOrders,
        currentPage: page,
    };
};

/**
 * Get order by ID
 */
export const getOrderById = async (id) => {
    const order = await db.Order.findByPk(id, {
        include: [
            { model: db.OrderItem, as: 'items', attributes: ['product_id', 'quantity', 'price'] },
            { model: db.Payment, as: 'payment', attributes: ['transaction_reference', 'status', 'amount'] },
        ],
    });
    if (!order) return null;
    return order;
};

/**
 * Get order details by tracking ID
 */
export const getOrderByTrackingId = async (trackingId) => {
    const order = await db.Order.findOne({
        where: { tracking_id: trackingId },
        include: [
            { model: db.OrderItem, as: 'items', attributes: ['product_id', 'quantity', 'price'] },
            { model: db.Payment, as: 'payment', attributes: ['transaction_reference', 'status', 'amount'] },
        ],
    });

    if (!order) return null;

    return {
        tracking_id: order.tracking_id,
        status: order.status,
        payment_status: order.payment_status,
        items: order.items.map(item => ({
            product_id: item.product_id,
            quantity: item.quantity,
            price: item.price,
        })),
        payment: order.payment || null,
    };
};
