require("dotenv").config();
const express = require("express");
const cors = require("cors");

// Load DB (this auto-creates tables in better-sqlite3 version)
require("./db");

const productsRouter = require("./routes/products.routes");
const historyRouter = require("./routes/history.routes");

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Product routes
app.use("/api/products", productsRouter);

// History routes (correct base route)
app.use("/api/products", historyRouter);

// Health check
app.get("/", (req, res) => res.json({ ok: true }));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
