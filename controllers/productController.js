const db = require("../config/db");

const getAllProducts = async (req, res) => {
  try {
    const { search, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;
    const limitNumber = parseInt(limit);
    const offsetNumber = parseInt(offset);

    let sql =
      "SELECT products.*, categories.name AS category_name FROM products LEFT JOIN categories ON products.category_id = categories.id";

    const params = [];

    if (search) {
      sql += " WHERE products.name LIKE ?";
      params.push("%" + search + "%");
    }

    sql += " LIMIT ? OFFSET ?";
    params.push(limitNumber, offsetNumber);

    const [results] = await db.query(sql, params);
    res.json(results);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

const createProduct = async (req, res) => {
  try {
    const { name, price, quantity, category_id } = req.body;  

    const sql =
      "INSERT INTO products (name, price, quantity, category_id) VALUES (?, ?, ?, ?)";

    await db.query(sql, [name, price, quantity, category_id]);

    res.status(201).json({ message: "สร้างข้อมูลสำเร็จ" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Create Error" });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, quantity, category_id } = req.body;

    const sql =
      "UPDATE products SET name = ?, price = ?, quantity = ?, category_id = ? WHERE id = ?";

    const [result] = await db.query(sql, [
      name,
      price,
      quantity,
      category_id,
      id,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "ไม่พบสินค้าในระบบ" });
    }

    res.json({ message: "อัปเดตข้อมูลสำเร็จ" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Update Error" });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const sql = "DELETE FROM products WHERE id = ?";

    const [result] = await db.query(sql, [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "ไม่พบสินค้าในระบบ" });
    }

    res.json({ message: "ลบข้อมูลสำเร็จ" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Delete Error" });
  }
};

module.exports = {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
};
