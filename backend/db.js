const path = require("path");
const Database = require("better-sqlite3");

// ALWAYS USE ABSOLUTE PATH ON RENDER
const dbPath = path.join(__dirname, "inventory.sqlite");

console.log("Using SQLite DB at:", dbPath);

const db = new Database(dbPath);

// Create products table
db.prepare(`
  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL,
    unit TEXT,
    category TEXT,
    brand TEXT,
    stock INTEGER NOT NULL,
    status TEXT,
    image TEXT
  )
`).run();

// Create inventory history table
db.prepare(`
  CREATE TABLE IF NOT EXISTS inventory_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id INTEGER,
    old_quantity INTEGER,
    new_quantity INTEGER,
    change_date TEXT,
    user_info TEXT,
    FOREIGN KEY(product_id) REFERENCES products(id)
  )
`).run();

module.exports = db;
