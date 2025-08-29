require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authenticateKey = require('./middleware/auth');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Connected...'))
    .catch(err => console.error('MongoDB Connection Error:', err));

// Public route for health check
app.get('/', (req, res) => {
    res.send('CRM MiniBot API is running.');
});

// API Routes
app.use('/api/leads', authenticateKey, require('./api/leads'));
app.use('/api/stats', authenticateKey, require('./api/stats'));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`));

module.exports = app;