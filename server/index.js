import express from 'express';
import cors from "cors";
import 'dotenv/config';
import connectDB from './db/db.js';
import session from 'express-session';
import authRoutes from './routes/auth.js';
import uploadRoutes from './routes/upload.route.js';
import protectedRoutes from './routes/protected.js';
import { requireAuth } from './middleware/authMiddleware.js';
import passport from './config/passport.js';
import axios from 'axios';
import dashboardRoutes from './routes/dashboard.js';
import Image from './models/Image.js';
import mongoose from 'mongoose';
import { getRuntimeConfig } from './config/runtime.js';

const config = getRuntimeConfig();

const app = express();

app.set('trust proxy', 1);
app.use(express.json());

app.use(cors({
  origin: config.frontendOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Access-Control-Allow-Credentials']
}));

app.use(session({
  secret: config.sessionSecret,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: config.isProduction,
    maxAge: 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: 'lax'
  }
}));

app.use(passport.initialize());
app.use(passport.session());

// Communicating with flask Microservice
app.get('/home', async (req, res) => {
  try {
    const response = await axios.get(`${config.flaskServiceUrl}/flask`);
    res.send(response.data);
  } catch (error) {
    console.error('Error communicating with Flask server:', error);
    res.status(500).send('Error communicating with Flask server');
  }
});

// Get model information
app.get('/api/model-info', async (req, res) => {
  try {
    const response = await axios.get(`${config.flaskServiceUrl}/model_info`);
    res.json(response.data);
  } catch (error) {
    console.error('Error getting model info:', error);
    res.status(500).json({ error: 'Failed to get model information' });
  }
});

// Predict from uploaded image (protected)
app.post('/api/predict', requireAuth, async (req, res) => {
  try {
    const { imageId } = req.body;
    
    if (!imageId || !mongoose.isValidObjectId(imageId)) {
      return res.status(400).json({ error: 'A valid image ID is required' });
    }

    const image = await Image.findOne({ _id: imageId, userId: req.user._id });
    if (!image) {
      return res.status(404).json({ error: 'Image not found' });
    }

    const response = await axios.post(`${config.flaskServiceUrl}/predict_from_path`, {
      image_path: image.filePath
    });
    
    res.json(response.data);
  } catch (error) {
    console.error('Error making prediction:', error);
    if (error.response) {
      res.status(error.response.status).json(error.response.data);
    } else {
      res.status(500).json({ error: 'Failed to make prediction' });
    }
  }
});

// Auth routes
app.use('/auth', authRoutes);
app.use('/api/upload', requireAuth, uploadRoutes);
app.use('/api', protectedRoutes);

// Routes
app.use('/api/dashboard', dashboardRoutes);

// Connect to database 
connectDB().then(() => {
  app.listen(config.port, () => {
    console.log(`Server is running on port ${config.port}`);
  });
}).catch((error) => {
  console.error('Failed to connect to database:', error);
});


