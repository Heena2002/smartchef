const express=require('express');
const mongoose=require('mongoose');
const cors = require('cors');
const dotenv=require('dotenv');
  
dotenv.config();


// Import Routes
const authRoutes = require('./routes/authRoutes');
const favoriteRoutes = require('./routes/favoriteRoutes');

 const app=express();
app.use(cors());
app.use(express.json());// 🔥 Missing this = backend can't read JSON body



//Routes
app.use('/api/auth', authRoutes);
app.use('/api/favorites', favoriteRoutes);
//connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(process.env.PORT || 4002, () => {
      console.log(`Server is running on port ${process.env.PORT || 4002}`);
    });
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });

