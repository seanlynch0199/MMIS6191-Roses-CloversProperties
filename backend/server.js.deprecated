require('dotenv').config();
const express = require('express');
const cors = require('cors');
const pool = require('./db');

const app = express();

app.use(cors({ origin: ['http://localhost:5173', 'http://localhost:3000'], credentials: true }));
app.use(express.json());

app.get('/api/health', async (req, res) => {
  try {
    await pool.query('SELECT 1 AS ok');
    res.json({ ok: true, db: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      ok: false,
      db: false,
      code: err.code,
      message: err.message,
      address: err.address,
      port: err.port,
    });
  }
});

app.get('/api/properties', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM properties ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/properties', async (req, res) => {
  try {
    const {
      title, description, price, address, city, state, zip_code,
      property_type, bedrooms, bathrooms, square_feet, amenities, image_url,
    } = req.body;

    const amenitiesJson = JSON.stringify(amenities);

    const [result] = await pool.query(
      `INSERT INTO properties
        (title, description, price, address, city, state, zip_code,
         property_type, bedrooms, bathrooms, square_feet, amenities, image_url)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [title, description, price, address, city, state, zip_code,
       property_type, bedrooms, bathrooms, square_feet, amenitiesJson, image_url],
    );

    const [rows] = await pool.query('SELECT * FROM properties WHERE id = ?', [result.insertId]);
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/tenants', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM tenants ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/tenants', async (req, res) => {
  try {
    const { first_name, last_name, email, phone } = req.body;

    const [result] = await pool.query(
      'INSERT INTO tenants (first_name, last_name, email, phone) VALUES (?, ?, ?, ?)',
      [first_name, last_name, email, phone],
    );

    const [rows] = await pool.query('SELECT * FROM tenants WHERE id = ?', [result.insertId]);
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const LEASE_JOIN_QUERY = `
  SELECT l.*,
    p.title AS property_name,
    CONCAT(t.first_name, ' ', t.last_name) AS tenant_name
  FROM leases l
  JOIN properties p ON l.property_id = p.id
  JOIN tenants t ON l.tenant_id = t.id`;

app.get('/api/leases', async (req, res) => {
  try {
    const [rows] = await pool.query(`${LEASE_JOIN_QUERY} ORDER BY l.created_at DESC`);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/leases', async (req, res) => {
  try {
    const { property_id, tenant_id, start_date, end_date, monthly_rent } = req.body;

    if (new Date(end_date) <= new Date(start_date)) {
      return res.status(400).json({ error: 'end_date must be after start_date' });
    }

    const [result] = await pool.query(
      'INSERT INTO leases (property_id, tenant_id, start_date, end_date, monthly_rent) VALUES (?, ?, ?, ?, ?)',
      [property_id, tenant_id, start_date, end_date, monthly_rent],
    );

    const [rows] = await pool.query(`${LEASE_JOIN_QUERY} WHERE l.id = ?`, [result.insertId]);
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(4000, () => {
  console.log('API running at http://localhost:4000');
  console.log('DB config:', {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
  });
});
