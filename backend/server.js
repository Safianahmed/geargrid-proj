const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
require('dotenv').config();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();

app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000', 
  credentials: true, 
}));
app.use(bodyParser.json());
app.use(cookieParser());

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

// console.log('DB_HOST:', process.env.DB_HOST);
// console.log('DB_USER:', process.env.DB_USER);
// console.log('DB_NAME:', process.env.DB_NAME);

pool.getConnection()
  .then(connection => {
    console.log('Database connected successfully!');
    connection.release();
  })
  .catch(err => {
    console.error('Database connection failed:', err);
    process.exit(1);
});

const authenticateToken = (req, res, next) => {
    const token = req.cookies.token;
  
    if (!token) return res.status(401).json({ success: false, message: 'Token required' });
  
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) return res.status(403).json({ success: false, message: 'Invalid or expired token' });
      req.user = user;
      next();
    });
};

app.get('/api/events', authenticateToken, async (req, res) => {
  try {
    const [events] = await pool.execute('SELECT * FROM Events');
    res.json({ success: true, events });
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch events' });
  }
});

app.get('/api/businesses', async (req, res) => {
  try {
    const [businesses] = await pool.execute('SELECT * FROM businesses');
    res.json({ success: true, businesses });
  } catch (error) {
    console.error('Error fetching businesses:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch businesses' });
  }
});

app.get('/api/businesses/:name', async (req, res) => {
  try {
    const { name } = req.params;
    const [businesses] = await pool.execute('SELECT * FROM businesses WHERE name = ?', [name]);

    if (businesses.length === 0) {
      return res.status(404).json({ success: false, message: 'Business not found' });
    }

    res.json({ success: true, business: businesses[0] });
  } catch (error) {
    console.error('Error fetching business:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch business' });
  }
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

app.post('/api/logout', (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  });
  res.json({ success: true, message: 'Logged out successfully' });
});

const PORT = process.env.SERVER_PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

//endpoint for Logging in a user
app.post('/api/login', async (req, res) => {
  try {
    console.log('Received login request:', req.body); 
    const { email, password } = req.body;
    
    //find the user
    const [users] = await pool.execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    
    if (users.length === 0) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    
    const user = users[0];
    console.log('Retrieved user:', user);
    
    // verify password
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    
    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '1h' } //expiration time
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 3600000, // 1 hour 
      sameSite: 'Strict', 
    });

    res.json({ success: true, username: user.username, userId: user.id });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ success: false, message: 'Login failed' });
  }
});



app.get('/test-db', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT 1 + 1 AS result');
    res.json({ success: true, result: rows[0].result });
  } catch (err) {
    console.error('DB Test Error:', err);
    res.json({ success: false, error: err.message });
  }
});

console.log('JWT_SECRET:', process.env.JWT_SECRET);

//-----------------------CAR BUILD ROUTES-----------------------//
const createCarBuildRoutes = require('./routes/carBuilds');
// Registering the custom car builds routes at `/api/builds`
app.use('/api/builds', createCarBuildRoutes(pool));