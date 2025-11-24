const express = require("express");
const router = express.Router();
const products = require("./controllers/products.controller");
const history = require("./controllers/history.controller");

const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const csvParser = require("csv-parser");
const fs = require("fs");
const csvService = require("./services/csv.service");

// 🔍 Add this search route
router.get("/products/search", products.searchProducts);

// Products
router.get("/products", products.getProducts);
router.post("/products", products.createProduct);
router.put("/products/:id", products.updateProduct);
router.delete("/products/:id", products.deleteProduct);

// History
router.get("/products/:id/history", history.getHistory);

// CSV Import
router.post("/products/import", upload.single("csvFile"), (req, res) => {
  const rows = [];
  fs.createReadStream(req.file.path)
    .pipe(csvParser())
    .on("data", (row) => rows.push(row))
    .on("end", async () => {
      const result = await csvService.importProducts(rows);
      fs.unlinkSync(req.file.path);
      res.json(result);
    });
});

module.exports = router;
