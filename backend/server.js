require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { init } = require('./db');
const productsRouter = require('./routes/products.routes');
const historyRouter = require('./routes/history.routes');
const app = express();
const PORT = process.env.PORT || 4000;

init();

app.use(cors());
app.use(express.json());

app.use('/api/products', productsRouter);
app.use('/api/products', historyRouter);

app.get('/', (req, res) => res.json({ ok: true }));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
