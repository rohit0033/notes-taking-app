import Note from '../models/Note.js';
import fs from 'fs/promises';

export const getNotes = async (req, res) => {
  const notes = await Note.find({ userId: req.user._id }).sort({ createdAt: -1 });
  res.json(notes);
};

export const createNote = async (req, res) => {
  try {
    // Handle form data
    const title = req.body.title || 'Untitled';
    const content = req.body.content || '';
    const type = req.body.type || 'text';

    // Create note object
    const noteData = {
      userId: req.user._id,
      title: title.trim(),
      content: content.trim(),
      type
    };

    // Handle file upload
    if (req.file) {
      const filePath = req.file.path.replace(/\\/g, '/');
      if (req.file.mimetype.startsWith('image/')) {
        noteData.image = filePath;
      } else if (req.file.mimetype.startsWith('audio/')) {
        noteData.audio = filePath;
      }
    }

    const note = await Note.create(noteData);
    res.status(201).json(note);
  } catch (error) {
    console.error('Error creating note:', error);
    res.status(500).json({ 
      error: 'Error creating note', 
      details: error.message 
    });
  }
};

export const createAudioNote = async (req, res) => {
  try {
    const { audioBlob } = req.body;
    const transcription = await transcribeAudio(audioBlob);
    
    const note = await Note.create({
      userId: req.user._id,
      title: 'Audio Note',
      content: transcription,
      type: 'audio',
      audio: req.file?.path
    });
    
    res.status(201).json(note);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateNote = async (req, res) => {
  const note = await Note.findById(req.params.id);
  if (!note) {
    return res.status(404).json({ message: 'Note not found' });
  }
  
  if (note.userId.toString() !== req.user._id.toString()) {
    return res.status(401).json({ message: 'Not authorized' });
  }

  const updatedNote = await Note.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(updatedNote);
};

export const deleteNote = async (req, res) => {
  const note = await Note.findById(req.params.id);
  if (!note || note.userId.toString() !== req.user._id.toString()) {
    return res.status(404).json({ message: 'Note not found' });
  }
  await note.deleteOne(); // Updated line: use deleteOne() instead of remove()
  res.json({ message: 'Note removed' });
};

export const toggleFavorite = async (req, res) => {
  const note = await Note.findById(req.params.id);
  if (!note || note.userId.toString() !== req.user._id.toString()) {
    return res.status(404).json({ message: 'Note not found' });
  }
  note.isFavorite = !note.isFavorite;
  await note.save();
  res.json(note);
};

export const updateNoteWithImage = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ message: 'Note not found' });
    if (!req.file) return res.status(400).json({ message: 'No image file provided' });

    // Create the full URL for the uploaded file
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const imagePath = req.file.path.replace(/\\/g, '/');
    const imageUrl = `${baseUrl}/${imagePath}`;

    console.log('Generated image URL:', imageUrl); // Debug log

    const updatedNote = await Note.findByIdAndUpdate(
      req.params.id,
      {
        $push: { images: imageUrl },
        image: imageUrl,
      },
      { new: true }
    );

    console.log('Updated note:', updatedNote); // Debug log
    res.json(updatedNote);
  } catch (error) {
    console.error('Error updating note with image:', error);
    res.status(500).json({ error: 'Error updating note', details: error.message });
  }
};
