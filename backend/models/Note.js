import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  title: { 
    type: String, 
    default: 'Untitled'  // Make title optional with default value
  },
  content: { 
    type: String, 
    required: [true, 'Content is required'],
    trim: true 
  },
  type: { 
    type: String, 
    enum: ['text', 'audio'], 
    default: 'text' 
  },
  isFavorite: { 
    type: Boolean, 
    default: false 
  },
  image: String,   // store single image URL
  images: [String], // store multiple image URLs
  audio: String,
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
}, {
  timestamps: true
});

export default mongoose.model('Note', noteSchema);
