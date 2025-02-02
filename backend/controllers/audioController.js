import Note from '../models/Note.js';

export const createAudioNote = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Audio file is required' });
    }

    const note = await Note.create({
      userId: req.user._id,
      title: req.body.title || 'Audio Note',
      content: req.body.content || 'Audio content',
      type: 'audio',
      audio: req.file.path.replace(/\\/g, '/')
    });

    res.status(201).json(note);
  } catch (error) {
    console.error('Error creating audio note:', error);
    res.status(500).json({ error: 'Failed to create audio note' });
  }
};

export const transcribeAudio = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Audio file is required' });
    }

    // For testing purposes, return a mock transcription
    const mockTranscription = "This is a test transcription.";
    
    res.json({ 
      success: true,
      transcription: mockTranscription,
      audioFile: req.file.path.replace(/\\/g, '/')
    });
  } catch (error) {
    console.error('Transcription error:', error);
    res.status(500).json({ error: 'Transcription failed' });
  }
};
