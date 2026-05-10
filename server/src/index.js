const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = 3001;

const DB_FILE = path.join(__dirname, '../data/db.json');
const UPLOADS_DIR = path.join(__dirname, '../uploads');

fs.mkdirSync(path.dirname(DB_FILE), { recursive: true });
fs.mkdirSync(UPLOADS_DIR, { recursive: true });
if (!fs.existsSync(DB_FILE)) {
  fs.writeFileSync(DB_FILE, JSON.stringify({ bookings: [] }, null, 2));
}

function readDB() {
  return JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
}

function writeDB(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOADS_DIR),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(UPLOADS_DIR));

// Get all bookings (admin)
app.get('/api/bookings', (req, res) => {
  const db = readDB();
  res.json(db.bookings);
});

// Get booked booth IDs (public)
app.get('/api/booked-booths', (req, res) => {
  const db = readDB();
  const bookedIds = db.bookings
    .filter(b => b.status !== 'rejected')
    .map(b => b.boothId);
  res.json(bookedIds);
});

// Create booking
app.post('/api/bookings', upload.single('receipt'), (req, res) => {
  const { boothId, boothName, price, name, email, phone, company } = req.body;
  if (!boothId || !name || !email || !phone) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  const db = readDB();
  const existing = db.bookings.find(b => b.boothId === boothId && b.status !== 'rejected');
  if (existing) {
    return res.status(409).json({ error: 'Booth already booked' });
  }
  const booking = {
    id: uuidv4(),
    boothId,
    boothName,
    price,
    name,
    email,
    phone,
    company: company || '',
    receiptFile: req.file ? req.file.filename : null,
    status: 'pending',
    createdAt: new Date().toISOString(),
    notes: '',
  };
  db.bookings.push(booking);
  writeDB(db);
  res.status(201).json(booking);
});

// Update booking status (admin)
app.patch('/api/bookings/:id', (req, res) => {
  const db = readDB();
  const idx = db.bookings.findIndex(b => b.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  db.bookings[idx] = { ...db.bookings[idx], ...req.body };
  writeDB(db);
  res.json(db.bookings[idx]);
});

// Delete booking (admin)
app.delete('/api/bookings/:id', (req, res) => {
  const db = readDB();
  const idx = db.bookings.findIndex(b => b.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  db.bookings.splice(idx, 1);
  writeDB(db);
  res.json({ success: true });
});

// Serve built React app in production
const clientDist = path.join(__dirname, '../../client/dist');
if (fs.existsSync(clientDist)) {
  app.use(express.static(clientDist));
  app.get('/{*path}', (req, res) => {
    res.sendFile(path.join(clientDist, 'index.html'));
  });
}

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
