import db from '../../../models/index.cjs';

const { Order, OrderItem, Payment } = db;

/**
 * Fetch all orders with order items + payment record
 */
export const findAll = async ({ limit, offset }) => {
  try {
    const { rows: orders, count: totalItems } = await Order.findAndCountAll({
      limit,
      offset,
      distinct: true,
      order: [
        ['createdAt', 'DESC'],
        ['updatedAt', 'DESC']
      ]
    });

    return {
      orders,
      totalItems,
      totalPages: Math.ceil(totalItems / limit)
    };

  } catch (error) {
    console.log(error);
    throw new Error('Error fetching records: ' + error.message);
  }
};


/**
 * Fetch single order with items + payment record
 */
export const findById = async (id) => {
  try {
    const item = await Order.findByPk(id, {
      include: [
        {
          model: OrderItem,
          as: 'items',
        },
        {
          model: Payment,
          as: 'payment'
        }
      ]
    });

    if (!item) throw new Error('Not found');
    return item;

  } catch (error) {
    console.log(error);
    throw new Error('Error fetching record: ' + error.message);
  }
};


/**
 * Create new order
 */
export const create = async (data) => {
  try {
    return await Order.create(data);
  } catch (error) {
    console.log(error);
    throw new Error('Error creating record: ' + error.message);
  }
};


/**
 * Update order
 */
export const update = async (id, data) => {
  try {
    const item = await Order.findByPk(id);
    if (!item) throw new Error('Not found');
    return await item.update(data);

  } catch (error) {
    console.log(error);
    throw new Error('Error updating record: ' + error.message);
  }
};


/**
 * Remove order
 */
export const destroy = async (id) => {
  try {
    const item = await Order.findByPk(id);
    if (!item) throw new Error('Not found');
    return await item.destroy();

  } catch (error) {
    console.log(error);
    throw new Error('Error deleting record: ' + error.message);
  }
};
