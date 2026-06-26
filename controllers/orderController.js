const db = require("../config/db");

const createOrder = async (req, res) => {
  const connection = await db.getConnection();

  try {
    const { user_id, items } = req.body;

    await connection.beginTransaction();

    for (const item of items) {
      const {product_id, quantity} = item;

      const sqlUpdate =
        "UPDATE products SET quantity = quantity - ? WHERE id = ? AND quantity >= ?";
       const [updateResult] = await connection.query(sqlUpdate, [quantity, product_id, quantity]);

      if (updateResult.affectedRows === 0) {
        throw new Error("สินค้าหมด หรือสต็อกไม่พอ");
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

module.exports = {
  createOrder,
};
