require('dotenv').config();
const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3001;

// ── Storage: Cloudinary (prod) or local disk (dev) ──────────────────────────
let upload;
if (process.env.CLOUDINARY_CLOUD_NAME) {
  const cloudinary = require('cloudinary').v2;
  const { CloudinaryStorage } = require('multer-storage-cloudinary');
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  const storage = new CloudinaryStorage({
    cloudinary,
    params: { folder: 'receipts', resource_type: 'auto' },
  });
  upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });
} else {
  const UPLOADS_DIR = path.join(__dirname, '../uploads');
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, UPLOADS_DIR),
    filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
  });
  upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });
  app.use('/uploads', express.static(UPLOADS_DIR));
}

// ── Database: MongoDB (prod) or JSON file (dev) ──────────────────────────────
let useMongoose = !!process.env.MONGODB_URI;
let Booking;

if (useMongoose) {
  const mongoose = require('mongoose');
  mongoose.connect(process.env.MONGODB_URI).then(() => console.log('MongoDB connected'));

  const bookingSchema = new mongoose.Schema({
    id: { type: String, default: () => uuidv4() },
    boothIds: [String],
    boothLabels: [String],
    boothName: String,
    totalPrice: Number,
    name: String,
    email: String,
    phone: String,
    company: String,
    receiptFile: String,
    status: { type: String, default: 'pending' },
    createdAt: { type: String, default: () => new Date().toISOString() },
    notes: { type: String, default: '' },
  });
  Booking = mongoose.model('Booking', bookingSchema);
} else {
  const DB_FILE = path.join(__dirname, '../data/db.json');
  fs.mkdirSync(path.dirname(DB_FILE), { recursive: true });
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify({ bookings: [] }, null, 2));
  }
  const readDB = () => JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
  const writeDB = (data) => fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));

  // Attach JSON helpers to app locals so routes can access them
  app.locals.readDB = readDB;
  app.locals.writeDB = writeDB;
}

app.use(cors());
app.use(express.json());

// ── Helper to get receipt URL/filename ──────────────────────────────────────
function getReceiptRef(file) {
  if (!file) return null;
  return process.env.CLOUDINARY_CLOUD_NAME ? file.path : file.filename;
}

// ── Routes ───────────────────────────────────────────────────────────────────

// Get all bookings (admin)
app.get('/api/bookings', async (req, res) => {
  if (useMongoose) {
    const bookings = await Booking.find().lean();
    return res.json(bookings);
  }
  res.json(app.locals.readDB().bookings);
});

// Get all booked booth IDs (public)
app.get('/api/booked-booths', async (req, res) => {
  if (useMongoose) {
    const bookings = await Booking.find({ status: { $ne: 'rejected' } }, 'boothIds boothId').lean();
    const ids = bookings.flatMap(b => b.boothIds || (b.boothId ? [b.boothId] : []));
    return res.json(ids);
  }
  const db = app.locals.readDB();
  const ids = db.bookings
    .filter(b => b.status !== 'rejected')
    .flatMap(b => b.boothIds || (b.boothId ? [b.boothId] : []));
  res.json(ids);
});

// Create booking
app.post('/api/bookings', upload.single('receipt'), async (req, res) => {
  const { boothIds, boothLabels, totalPrice, name, email, phone, company } = req.body;
  if (!boothIds || !name || !email || !phone) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const ids = JSON.parse(boothIds);
  const labels = JSON.parse(boothLabels);

  if (useMongoose) {
    const existing = await Booking.find({ status: { $ne: 'rejected' } }, 'boothIds boothId').lean();
    const takenIds = existing.flatMap(b => b.boothIds || (b.boothId ? [b.boothId] : []));
    const conflict = ids.find(id => takenIds.includes(id));
    if (conflict) return res.status(409).json({ error: 'Booth already booked', conflictBooth: conflict });

    const booking = await Booking.create({
      boothIds: ids,
      boothLabels: labels,
      boothName: labels.join(', '),
      totalPrice: Number(totalPrice),
      name, email, phone,
      company: company || '',
      receiptFile: getReceiptRef(req.file),
    });
    return res.status(201).json(booking);
  }

  const db = app.locals.readDB();
  const takenIds = db.bookings
    .filter(b => b.status !== 'rejected')
    .flatMap(b => b.boothIds || (b.boothId ? [b.boothId] : []));
  const conflict = ids.find(id => takenIds.includes(id));
  if (conflict) return res.status(409).json({ error: 'Booth already booked', conflictBooth: conflict });

  const booking = {
    id: uuidv4(),
    boothIds: ids, boothLabels: labels,
    boothName: labels.join(', '),
    totalPrice: Number(totalPrice),
    name, email, phone,
    company: company || '',
    receiptFile: getReceiptRef(req.file),
    status: 'pending',
    createdAt: new Date().toISOString(),
    notes: '',
  };
  db.bookings.push(booking);
  app.locals.writeDB(db);
  res.status(201).json(booking);
});

// Update booking (admin)
app.patch('/api/bookings/:id', async (req, res) => {
  if (useMongoose) {
    const booking = await Booking.findOneAndUpdate({ id: req.params.id }, req.body, { new: true }).lean();
    if (!booking) return res.status(404).json({ error: 'Not found' });
    return res.json(booking);
  }
  const db = app.locals.readDB();
  const idx = db.bookings.findIndex(b => b.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  db.bookings[idx] = { ...db.bookings[idx], ...req.body };
  app.locals.writeDB(db);
  res.json(db.bookings[idx]);
});

// Delete booking (admin)
app.delete('/api/bookings/:id', async (req, res) => {
  if (useMongoose) {
    const result = await Booking.deleteOne({ id: req.params.id });
    if (result.deletedCount === 0) return res.status(404).json({ error: 'Not found' });
    return res.json({ success: true });
  }
  const db = app.locals.readDB();
  const idx = db.bookings.findIndex(b => b.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  db.bookings.splice(idx, 1);
  app.locals.writeDB(db);
  res.json({ success: true });
});

// Serve built React app
const clientDist = path.join(__dirname, '../../client/dist');
if (fs.existsSync(clientDist)) {
  app.use(express.static(clientDist));
  app.get('/{*path}', (req, res) => {
    res.sendFile(path.join(clientDist, 'index.html'));
  });
}

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
