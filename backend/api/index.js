import express from 'express';
import cors from 'cors';
import connectDB from '../config/db.js';
import authRoutes from './auth.js';
import noteRoutes from './notes.js';
import audioRoutes from './audio.js';
import { errorHandler } from '../utils/errorHandler.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/audio', audioRoutes);

app.use(errorHandler);

export default app;
