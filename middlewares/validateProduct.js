const validateProduct = (req, res, next) => {
  const { name, price, quantity, category_id } = req.body;

  if (!name || name.length < 3) {
    return res
      .status(400)
      .json({ message: "ชื่อสินค้าต้องมีอย่างน้อย 3 ตัวอักษร" });
  } else if (price === undefined || price < 0) {
    return res.status(400).json({ message: "ราคาต้องเป็นตัวเลขและห้ามติดลบ" });
  } else if (quantity === undefined || quantity < 0) {
    return res.status(400).json({ message: "จำนวนสินค้าห้ามติดลบ" });
  } else if (!category_id) {
    return res.status(400).json({ message: "กรุณาระบุหมวดหมู่สินค้า" });
  }

  next();
};

module.exports = validateProduct;
