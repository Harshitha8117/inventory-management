const fs = require('fs');
const { db } = require('../db');
const { parseCSVToArray, arrayToCSV } = require('../services/csv.service');

/**
 * GET /api/products
 */
exports.getAll = (req, res) => {
  db.all('SELECT * FROM products', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
};

/**
 * GET /api/products/search?name=...
 * supports partial, case-insensitive search
 * optional ?exact=true will perform exact case-insensitive match
 */
exports.search = (req, res) => {
  const q = (req.query.name || '').trim();
  const exact = req.query.exact === 'true';

  if (!q) {
    // return all
    return db.all('SELECT * FROM products', [], (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    });
  }

  if (exact) {
    db.get('SELECT * FROM products WHERE LOWER(name)=?', [q.toLowerCase()], (err, row) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(row ? [row] : []);
    });
  } else {
    db.all('SELECT * FROM products WHERE LOWER(name) LIKE ?', ['%' + q.toLowerCase() + '%'], (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    });
  }
};

/**
 * PUT /api/products/:id
 * update product and create inventory_history if stock changed
 */
exports.updateProduct = (req, res) => {
  const id = req.params.id;
  const { name, unit, category, brand, stock, status, image } = req.body;

  if (stock == null || Number.isNaN(Number(stock)) || Number(stock) < 0) {
    return res.status(400).json({ error: 'stock must be a number >= 0' });
  }

  db.get('SELECT * FROM products WHERE id = ?', [id], (err, existing) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!existing) return res.status(404).json({ error: 'Not found' });

    // check name uniqueness (case-insensitive) excluding this id
    db.get('SELECT id FROM products WHERE LOWER(name)=? AND id<>?', [String(name).toLowerCase(), id], (err2, dup) => {
      if (err2) return res.status(500).json({ error: err2.message });
      if (dup) return res.status(400).json({ error: 'name must be unique' });

      const oldStock = existing.stock;

      db.run(
        'UPDATE products SET name=?, unit=?, category=?, brand=?, stock=?, status=?, image=? WHERE id=?',
        [name, unit, category, brand, Number(stock), status, image, id],
        function (err3) {
          if (err3) return res.status(500).json({ error: err3.message });

          // create history if stock changed
          if (Number(oldStock) !== Number(stock)) {
            db.run(
              'INSERT INTO inventory_history (product_id, old_quantity, new_quantity, change_date, user_info) VALUES (?, ?, ?, ?, ?)',
              [id, oldStock, Number(stock), new Date().toISOString(), 'admin'],
              (err4) => {
                if (err4) console.error('Failed to insert inventory history:', err4);
                // continue regardless of history insert result
                db.get('SELECT * FROM products WHERE id = ?', [id], (err5, row) => {
                  if (err5) return res.status(500).json({ error: err5.message });
                  res.json(row);
                });
              }
            );
          } else {
            // no stock change
            db.get('SELECT * FROM products WHERE id = ?', [id], (err5, row) => {
              if (err5) return res.status(500).json({ error: err5.message });
              res.json(row);
            });
          }
        }
      );
    });
  });
};

/**
 * DELETE /api/products/:id
 */
exports.deleteProduct = (req, res) => {
  const id = req.params.id;
  db.run('DELETE FROM products WHERE id=?', [id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ deleted: this.changes });
  });
};

/**
 * POST /api/products/import
 * multipart/form-data with field 'csvFile'
 * uses parseCSVToArray (which should handle/skips header rows)
 * returns { added, skipped, duplicates: [{name, existingId}] }
 */
exports.importCSV = async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'csvFile required' });

  try {
    const results = await parseCSVToArray(req.file.path);
    const added = [];
    const skipped = [];
    const duplicates = [];

    for (const p of results) {
      const name = (p.name || '').trim();
      if (!name) {
        skipped.push(p);
        continue;
      }

      // check duplicate by name case-insensitive
      const existing = await new Promise((resolve, reject) => {
        db.get('SELECT id FROM products WHERE LOWER(name)=?', [name.toLowerCase()], (err, row) => {
          if (err) reject(err);
          else resolve(row);
        });
      });

      if (existing) {
        duplicates.push({ name, existingId: existing.id });
        continue;
      }

      // insert product
      await new Promise((resolve, reject) => {
        db.run(
          'INSERT INTO products (name, unit, category, brand, stock, status, image) VALUES (?, ?, ?, ?, ?, ?, ?)',
          [name, p.unit || '', p.category || '', p.brand || '', Number(p.stock) || 0, p.status || '', p.image || ''],
          function (err) {
            if (err) reject(err);
            else {
              added.push({ id: this.lastID, name });
              resolve();
            }
          }
        );
      });
    }

    // cleanup temp file
    try { fs.unlinkSync(req.file.path); } catch (e) { /* ignore */ }

    res.json({ added: added.length, skipped: skipped.length, duplicates });
  } catch (err) {
    console.error('Import error:', err);
    return res.status(500).json({ error: String(err) });
  }
};

/**
 * GET /api/products/export
 * returns CSV with proper headers
 */
exports.exportCSV = (req, res) => {
  db.all('SELECT * FROM products', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    const csv = arrayToCSV(rows);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="products.csv"');
    res.status(200).send(csv);
  });
};

/**
 * POST /api/products
 * Create new product with duplicate detection (case-insensitive).
 * Returns 201 with created product on success.
 * Returns 409 with { error: 'duplicate', existingId } if duplicate found.
 */
exports.createProduct = (req, res) => {
  const { name = '', unit = '', category = '', brand = '', stock = 0, status = '', image = '' } = req.body;
  if (name.trim() === '') return res.status(400).json({ error: 'name required' });
  if (Number.isNaN(Number(stock)) || Number(stock) < 0) return res.status(400).json({ error: 'invalid stock' });

  const lowerName = name.trim().toLowerCase();

  // check duplicate case-insensitive
  db.get('SELECT id FROM products WHERE LOWER(name)=?', [lowerName], (err, existing) => {
    if (err) return res.status(500).json({ error: err.message });
    if (existing) {
      // Tell frontend it's a duplicate, include existingId for optional "edit existing" prompt
      return res.status(409).json({ error: 'duplicate', existingId: existing.id, name });
    }

    // insert new product
    db.run(
      'INSERT INTO products (name, unit, category, brand, stock, status, image) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [name.trim(), unit, category, brand, Number(stock), status, image],
      function (err2) {
        if (err2) return res.status(500).json({ error: err2.message });
        db.get('SELECT * FROM products WHERE id = ?', [this.lastID], (err3, row) => {
          if (err3) return res.status(500).json({ error: err3.message });
          res.status(201).json(row);
        });
      }
    );
  });
};
