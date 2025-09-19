// This is the backend server for the inventory management system.
// It uses Node.js, Express, and the 'pg' library to connect to a PostgreSQL database.

const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const port = process.env.PORT || 3000; // Use environment variable for port or default to 3000

app.use(cors());
app.use(express.json());

// --- DATABASE CONNECTION ---
// This configuration is now ready for both local development and deployment on Render.
// For local development, create an environment variable for DATABASE_URL, e.g.,
// postgresql://inventory_user:your_secure_password@localhost:5432/inventory_db
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // If deploying to a service that requires SSL, but doesn't provide a CA certificate
  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false,
});


// --- API ROUTES ---

// Health check route
app.get('/', (req, res) => {
    res.send('Inventory Management API is running...');
});

// GET /api/products - Fetch all products from the database
app.get('/api/products', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM products ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// GET /api/products/:id - Fetch a single product by its ID
app.get('/api/products/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const { rows } = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error(`Error fetching product ${id}:`, err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// POST /api/products - Add a new product to the database
app.post('/api/products', async (req, res) => {
  const { name, description, quantity, price } = req.body;
  if (!name || quantity === undefined || price === undefined) {
    return res.status(400).json({ error: 'Name, quantity, and price are required fields.' });
  }
  try {
    const result = await pool.query(
      'INSERT INTO products (name, description, quantity, price) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, description, quantity, price]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error adding product:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// PUT /api/products/:id - Update an existing product
app.put('/api/products/:id', async (req, res) => {
  const { id } = req.params;
  const { name, description, quantity, price } = req.body;
  if (!name || quantity === undefined || price === undefined) {
    return res.status(400).json({ error: 'Name, quantity, and price are required fields.' });
  }
  try {
    const result = await pool.query(
      'UPDATE products SET name = $1, description = $2, quantity = $3, price = $4 WHERE id = $5 RETURNING *',
      [name, description, quantity, price, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found.' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(`Error updating product ${id}:`, err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// DELETE /api/products/:id - Delete a product from the database
app.delete('/api/products/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM products WHERE id = $1 RETURNING *', [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Product not found.' });
    }
    res.status(204).send(); // 204 No Content for successful deletion
  } catch (err) {
    console.error(`Error deleting product ${id}:`, err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// --- START SERVER ---
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

