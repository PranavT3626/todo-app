const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

let notes = [];
let nextId = 1;

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = './uploads';
    if (!fs.existsSync(dir)){
      fs.mkdirSync(dir);
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

// Create a new to-do note
app.post('/notes', upload.single('image'), (req, res) => {
  const { title, content } = req.body;
  const newNote = {
    id: nextId++,
    title,
    content,
    image: req.file ? req.file.path : null
  };
  notes.push(newNote);
  res.status(201).json(newNote);
});

// Create multiple to-do notes
app.post('/notes/bulk', (req, res) => {
  const { newNotes } = req.body;
  newNotes.forEach(note => {
    notes.push({
      id: nextId++,
      title: note.title,
      content: note.content,
      image: null
    });
  });
  res.status(201).json(newNotes);
});

// Update an existing to-do note
app.put('/notes/:id', (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;
  const note = notes.find(note => note.id === parseInt(id));

  if (note) {
    note.title = title || note.title;
    note.content = content || note.content;
    res.status(200).json(note);
  } else {
    res.status(404).json({ message: 'Note not found' });
  }
});

// Get the existing to-do notes list (with pagination)
app.get('/notes', (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + parseInt(limit);

  const resultNotes = notes.slice(startIndex, endIndex);
  res.status(200).json({
    page: parseInt(page),
    limit: parseInt(limit),
    totalNotes: notes.length,
    notes: resultNotes
  });
});

// Delete an existing to-do note
app.delete('/notes/:id', (req, res) => {
  const { id } = req.params;
  const noteIndex = notes.findIndex(note => note.id === parseInt(id));

  if (noteIndex !== -1) {
    const [deletedNote] = notes.splice(noteIndex, 1);
    if (deletedNote.image) {
      fs.unlinkSync(deletedNote.image);
    }
    res.status(200).json(deletedNote);
  } else {
    res.status(404).json({ message: 'Note not found' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
