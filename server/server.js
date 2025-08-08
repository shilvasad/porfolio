require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// DB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected successfully.'))
.catch(err => console.error('MongoDB connection error:', err));

// Basic Route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// API Routes
const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes');
const blogRoutes = require('./routes/blogRoutes');
const contributionRoutes = require('./routes/contributionRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/contributions', contributionRoutes);

// Admin tool routes
const todoRoutes = require('./routes/todoRoutes');
const habitRoutes = require('./routes/habitRoutes');
const goalRoutes = require('./routes/goalRoutes');
app.use('/api/todos', todoRoutes);
app.use('/api/habits', habitRoutes);
app.use('/api/goals', goalRoutes);

const mindMapRoutes = require('./routes/mindMapRoutes');
app.use('/api/mindmaps', mindMapRoutes);

const futurePlanRoutes = require('./routes/futurePlanRoutes');
app.use('/api/futureplans', futurePlanRoutes);

const cvRoutes = require('./routes/cvRoutes');
app.use('/api/cv', cvRoutes);

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
