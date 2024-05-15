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

// lands on the notes page tested in insomnia and browser
app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/notes.html'));
});

// home page or landing page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/index.html'));
});

// scrapped previous commits and switched to async await because the files weren't reading fast enough and there were alot of console errors.

// reads the db.json file and retrieves notes data.
app.get('/api/notes', async (req, res) => {
  try {
    const data = await fs.readFile(path.join(__dirname, '/db/db.json'), 'utf8');
    const notes = JSON.parse(data);
    res.json(notes);
  } catch (err) {
    console.error('Error reading notes:', err);
    // the status 500 codes indicates something was wrong on the server side. ChatGPT provided the status. I would have tried responding with just a console.log.
    res.status(500).json({ error: 'Failed to read notes' });
  }
});

// posting the retrieved data. I couldn't figure out the syntax alone so AI cleaned it up. We didn't really learn the 'try' part but im assuming if the try fails it catches the err. 

app.post('/api/notes', async (req, res) => {
  try {
    const data = await fs.readFile(path.join(__dirname, '/db/db.json'), 'utf8');
    const notes = JSON.parse(data);
    // create new note with the data which is the req.body and how it gets the id for the delete request later. 
    const newNote = { ...req.body, id: Math.random().toString() };
    notes.push(newNote);
    // null and 2 are optional arguments. from ChatGPT. 2 is for spacing. null is a 'replacer' if null passes nothing changes in the strigification 
    await fs.writeFile(path.join(__dirname, '/db/db.json'), JSON.stringify(notes, null, 2));
    res.json(newNote);
  } catch (err) {
    console.error('Error saving note:', err);
    res.status(500).json({ error: 'Failed to save note' });
  }
});

// Bonus Delete path. Similar to the post path except it's looking for the id of the note against existing notes and rewriting the db.json file.
// Needed help with the :id endpoint and req.params id deconstruct. 

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
