const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const validateProduct = require("../middlewares/validateProduct");
const verifyToken = require("../middlewares/verifyToken");

router.get("/", productController.getAllProducts);
router.post("/", verifyToken, validateProduct, productController.createProduct);
router.put(
  "/:id",
  verifyToken,
  validateProduct,
  productController.updateProduct,
);
router.delete("/:id", verifyToken, productController.deleteProduct);

module.exports = router;
