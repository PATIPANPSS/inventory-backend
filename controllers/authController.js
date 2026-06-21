const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "กรอกข้อมูลไม่ครบ" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const sql = "INSERT INTO users (username, password) VALUES (?, ?)";

    const result = await db.query(sql, [username, hashedPassword]);

    res.status(201).json({ message: "สมัครสมาชิกสำเร็จ" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Register Error" });
  }
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const sql = "SELECT * FROM users WHERE username = ?";

    const [users] = await db.query(sql, [username]);

    if (users.length === 0) {
      return res.status(401).json({ message: "ไม่พบบัญชีผู้ใช้" });
    }

    const user = users[0];

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "รหัสผ่านไม่ถูกต้อง" });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      "SECRET_KEY_1234",
      { expiresIn: "1h" },
    );

    res.status(200).json({ message: "ล็อคอินสำเร็จ", token: token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Login Error" });
  }
};

module.exports = {
    register,
    login
}