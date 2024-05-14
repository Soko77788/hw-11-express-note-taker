const express = require('express');
// required in fs promises here after watching instructor demonstrate
// on express day 3 cloud recording.
const fs = require('fs').promises;
const path = require('path');
// ditched the uuid package and just wrote an id to the notes using math.random like we have before. Not having .floor made repeat numbers much more unlikely. 
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware

// first middleware is provided by ChatGPT but it fixed the program
// It confuses me but i know it parses data and makes the program able to process it. 
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

// Routes
app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/notes.html'));
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/index.html'));
});

app.get('/api/notes', async (req, res) => {
  try {
    const data = await fs.readFile(path.join(__dirname, '/db/db.json'), 'utf8');
    const notes = JSON.parse(data);
    res.json(notes);
  } catch (err) {
    console.error('Error reading notes:', err);
    res.status(500).json({ error: 'Failed to read notes' });
  }
});

app.post('/api/notes', async (req, res) => {
  try {
    const data = await fs.readFile(path.join(__dirname, '/db/db.json'), 'utf8');
    const notes = JSON.parse(data);
    const newNote = { ...req.body, id: Math.random().toString() };
    notes.push(newNote);
    await fs.writeFile(path.join(__dirname, '/db/db.json'), JSON.stringify(notes, null, 2));
    res.json(newNote);
  } catch (err) {
    console.error('Error saving note:', err);
    res.status(500).json({ error: 'Failed to save note' });
  }
});

app.delete('/api/notes/:id', async (req, res) => {
  try {
    const data = await fs.readFile(path.join(__dirname, '/db/db.json'), 'utf8');
    let notes = JSON.parse(data);
    const { id } = req.params;
    notes = notes.filter(note => note.id !== id);
    await fs.writeFile(path.join(__dirname, '/db/db.json'), JSON.stringify(notes, null, 2));
    res.sendStatus(204);
  } catch (err) {
    console.error('Error deleting note:', err);
    res.status(500).json({ error: 'Failed to delete note' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
