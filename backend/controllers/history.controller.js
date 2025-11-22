const { db } = require('../db');

exports.getHistory = (req, res) => {
  const id = req.params.id;
  db.all('SELECT * FROM inventory_history WHERE product_id = ? ORDER BY change_date DESC', [id], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
};
