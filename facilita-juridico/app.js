
const express = require('express');
const bodyParser = require('body-parser');
const { Client } = require('pg');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
const port = 3000;
const secretKey = 'your_secret_key'; // Chave secreta para JWT

app.use(bodyParser.json());

const client = new Client({
  user: 'your_username',
  host: 'localhost',
  database: 'your_database',
  password: 'your_password',
  port: 5432,
});

client.connect();

// Middleware para autenticação de usuário
const authenticateUser = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) {
    return res.status(401).json({ error: 'Token not provided' });
  }

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Invalid token' });
    }
    req.userId = decoded.userId;
    next();
  });
};

// Rota para autenticação de usuário
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await client.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = result.rows[0];
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user.id }, secretKey);
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Rota para listar clientes
app.get('/clients', authenticateUser, async (req, res) => {
  try {
    const result = await client.query('SELECT * FROM clients WHERE user_id = $1', [req.userId]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Rota para cadastrar um novo cliente
app.post('/clients', authenticateUser, async (req, res) => {
  const { name, email, phone, x_coordinate, y_coordinate } = req.body;
  try {
    await client.query('INSERT INTO clients (name, email, phone, x_coordinate, y_coordinate, user_id) VALUES ($1, $2, $3, $4, $5, $6)', [name, email, phone, x_coordinate, y_coordinate, req.userId]);
    res.status(201).send('Client added successfully');
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Rota para calcular a rota otimizada
app.get('/optimize-route', authenticateUser, async (req, res) => {
  try {
    // Algoritmo para calcular a rota otimizada
    const optimizedRoute = calculateOptimizedRoute();
    res.json(optimizedRoute);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
