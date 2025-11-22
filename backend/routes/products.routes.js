const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const ctrl = require('../controllers/products.controller');

router.get('/', ctrl.getAll);
router.get('/search', ctrl.search);
router.post('/', ctrl.createProduct);      // <---- ADD THIS
router.put('/:id', ctrl.updateProduct);
router.delete('/:id', ctrl.deleteProduct);
router.post('/import', upload.single('csvFile'), ctrl.importCSV);
router.get('/export', ctrl.exportCSV);


module.exports = router;
