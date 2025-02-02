import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { createAudioNote, transcribeAudio } from '../controllers/audioController.js';
import upload, { handleUploadError } from '../utils/multer.js';

const router = express.Router();

router.use(protect);

router.post('/record', 
  upload.single('audio'),
  handleUploadError,
  createAudioNote
);

router.post('/transcribe', 
  upload.single('audio'),
  handleUploadError,
  transcribeAudio
);

export default router;
