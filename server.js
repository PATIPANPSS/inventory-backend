const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const productRoutes = require('./routes/productRoutes');
const authRoutes = require('./routes/authRoutes');
const orderRoutes = require('./routes/orderRoutes');

app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/order', orderRoutes);

app.get("/", (req, res) => {
  res.json({
    status: "success",
    message: "Welcome to Inventory Management API",
    version: "1.0.0",
  });
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
