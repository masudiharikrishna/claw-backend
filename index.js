const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const todoRoutes = require('./routes/todoRoutes');
const authenticate = require('./middleware/authMiddleware');
const cors = require("cors")


dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI,{serverSelectionTimeoutMS: 30000})
  .then(() => console.log('Connected to MongoDB'))
  .catch(error => console.error(error));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
})

app.use(cors())
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api', authenticate, todoRoutes);


