const db = require("../config/db");
const Joi = require("joi");

const createOrder = async (req, res) => {
  const orderSchema = Joi.object({
    user_id: Joi.number().required(),
    items: Joi.array()
      .items(
        Joi.object({
          product_id: Joi.number().required(),
          quantity: Joi.number().min(1).required(),
        }),
      )
      .min(1)
      .required(),
  });

  const { error } = orderSchema.validate(req.body);

  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const connection = await db.getConnection();

  try {
    const { user_id, items } = req.body;

    await connection.beginTransaction();

    for (const item of items) {
      const { product_id, quantity } = item;

      const sqlUpdate =
        "UPDATE products SET quantity = quantity - ? WHERE id = ? AND quantity >= ?";
      const [updateResult] = await connection.query(sqlUpdate, [
        quantity,
        product_id,
        quantity,
      ]);

      if (updateResult.affectedRows === 0) {
        throw new Error(`สินค้า ID ${product_id} หมด หรือสต็อกไม่พอ`);
      }

      const sqlInsert =
        "INSERT INTO orders (user_id, product_id, quantity) VALUES (?, ?, ?)";
      await connection.query(sqlInsert, [user_id, product_id, quantity]);
    }

    await connection.commit();

    res.status(201).json({ message: "ทำรายการสั่งซื้อและตัดสต็อกสำเร็จ" });
  } catch (error) {
    console.log(error);

    await connection.rollback();

    res
      .status(400)
      .json({ error: error.message || "เกิดข้อผิดพลาดในการสั่งซื้อ" });
  } finally {
    connection.release();
  }
};

const orderHistory =async(req,res) => {
    try{
        const sql = `
            SELECT 
                orders.id AS order_id, 
                products.name AS product_name, 
                orders.quantity, 
                products.price 
            FROM orders 
            JOIN products ON orders.product_id = products.id
            ORDER BY orders.id DESC
        `;

        const [result] = await db.query(sql)

        res.status(200).json(result);
    }catch(error){
        console.log(error);
        res.status(500).json({ message: 'Server Error'});
    }
}

module.exports = {
  createOrder,
  orderHistory
};
