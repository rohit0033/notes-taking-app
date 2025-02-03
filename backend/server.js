import express from 'express';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import noteRoutes from './routes/noteRoutes.js';
import audioRoutes from './routes/audioRoutes.js';
import { errorHandler } from './utils/errorHandler.js';

// Load env vars - this must be before importing any code that uses env vars
dotenv.config();

// Ensure MONGODB_URI exists
if (!process.env.MONGODB_URI) {
  console.error('Fatal Error: MONGODB_URI is not defined in environment variables');
  process.exit(1);
}

connectDB();

const app = express();
app.use(cors());
app.use(express.json());
app.get('/', (req, res) => res.send('API is running...'));

app.use('/api/auth', authRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/audio', audioRoutes);

// Serve uploaded files with proper headers
app.use('/uploads', (req, res, next) => {
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  next();
}, express.static(path.join(process.cwd(), 'uploads')));

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
