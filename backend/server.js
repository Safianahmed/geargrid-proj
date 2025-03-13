const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
require('dotenv').config();
const bodyParser = require('body-parser');

//const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

//create a connection pool to the MySQL database
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_NAME:', process.env.DB_NAME);

pool.getConnection()
  .then(connection => {
    console.log('Database connected successfully!');
    connection.release();
  })
  .catch(err => {
    console.error('Database connection failed:', err);
    process.exit(1);
  });

//endpoint for signup
app.post('/api/signup', async (req, res) => {
  try {
    console.log('Received signup request:', req.body);
    console.log(`${req.body.username}, ${req.body.email}, ${req.body.password}`)

    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    console.log('Hashed password:', hashedPassword);

    if (!hashedPassword) {
      throw new Error("Hashed password is undefined");
    }
    
    //insert into database
    const [result] = await pool.execute(
      'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)',
      [req.body.username, req.body.email, hashedPassword]
    );

    console.log('User created successfully:', result);
    res.status(201).json({ success: true, message: 'User created successfully' });
  } catch (error) {
    console.error('Error during signup:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ success: false, message: 'Username or email already exists' });
    }
    res.status(500).json({ success: false, message: 'Registration failed' });
  }
});

app.get('/', async (req, res) => {
  res.send('Hello World!');
});

const PORT = process.env.SERVER_PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

//endpoint for Logging in a user
// app.post('/api/login', async (req, res) => {
//   try {
//     console.log('Received login request:', req.body); 
//     const { email, password } = req.body;
    
//     //find the user
//     const [users] = await pool.execute(
//       'SELECT * FROM users WHERE email = ?',
//       [email]
//     );
    
//     if (users.length === 0) {
//       return res.status(401).json({ success: false, message: 'Invalid credentials' });
//     }
    
//     const user = users[0];
    
//     //verify password
//     if (password !== user.password) {
//       return res.status(401).json({ success: false, message: 'Invalid credentials' });
//     }
    
//     res.json({ success: true, username: user.username });
//   } catch (error) {
//     console.error('Error during login:', error);
//     res.status(500).json({ success: false, message: 'Login failed' });
//   }
// });

app.get('/test-db', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT 1 + 1 AS result');
    res.json({ success: true, result: rows[0].result });
  } catch (err) {
    console.error('DB Test Error:', err);
    res.json({ success: false, error: err.message });
  }
});