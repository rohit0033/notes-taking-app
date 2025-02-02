import express from 'express';
import multer from 'multer';
import path from 'path';
import { protect } from '../middleware/authMiddleware.js';
import { 
  getNotes, 
  createNote,
  updateNote,
  updateNoteWithImage,
  deleteNote, 
  toggleFavorite 
} from '../controllers/noteController.js';

const router = express.Router();

// Configure multer for audio uploads
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

const upload = multer({ storage });

router.use(protect);

router.route('/')
  .get(getNotes)
  // Allow file upload for both audio and images
  .post(upload.single('file'), createNote);

router.route('/:id')
  .put(updateNote)
  .delete(deleteNote);

router.patch('/:id/favorite', toggleFavorite);

// New route for image uploads
router.put('/:id/image', upload.single('file'), updateNoteWithImage);

export default router;
