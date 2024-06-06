// server.js
const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
require('dotenv').config();
require('./config/passport');

const app = express();

// server.js
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

// Middleware
app.use(express.json());
app.use(passport.initialize());

// Routes
const authRoutes = require('./routes/auth');
app.use('/auth', authRoutes);

// Basic route
app.get('/', (req, res) => {
    res.send('Welcome to SocialNet API');
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
