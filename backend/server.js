require("dotenv").config();
const express = require("express");
const cors = require("cors");

// Initialize DB
require("./db");

const productsRouter = require("./routes/products.routes");
const historyRouter = require("./routes/history.routes");

const app = express();

// Render assigns PORT dynamically — MUST use only process.env.PORT
const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/products", productsRouter);
app.use("/api/products", historyRouter);

// Health check
app.get("/", (req, res) => res.json({ ok: true }));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
