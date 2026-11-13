const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
const mongoSanitize = require('express-mongo-sanitize');
require('dotenv').config();

// Route imports
const authRoutes = require('./routes/auth.routes');
const healthRoutes = require('./routes/health.routes');
const alertRoutes = require('./routes/alert.routes');
const adminRoutes = require('./routes/admin.routes');

const app = express();
const httpServer = http.createServer(app);

// Socket.IO setup — attach to http server
const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

// Make io accessible in controllers via app.locals
app.locals.io = io;

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());
app.use(mongoSanitize()); // Sanitize inputs to prevent NoSQL injection (NFR-02)

// ── Routes ────────────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/health', healthRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/admin', adminRoutes);

// Health check
app.get('/api/ping', (req, res) => res.json({ message: 'Server is running' }));

// ── Global error handler ──────────────────────────────────────────────────────
// Prevents a single route failure from crashing the server (NFR-04)
app.use((err, req, res, next) => {
  console.error('[Error]', err.message);
  const status = err.status || 500;
  res.status(status).json({ message: err.message || 'Internal server error' });
});

// ── Socket.IO events ──────────────────────────────────────────────────────────
io.on('connection', (socket) => {
  console.log(`[Socket] Client connected: ${socket.id}`);

  // Responders join a dedicated room to receive SOS alerts
  socket.on('join-responder-room', () => {
    socket.join('responders');
    console.log(`[Socket] ${socket.id} joined responders room`);
  });

  socket.on('disconnect', () => {
    console.log(`[Socket] Client disconnected: ${socket.id}`);
  });
});

// ── Database connection & server start ───────────────────────────────────────
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('[DB] Connected to MongoDB');
    httpServer.listen(PORT, () => {
      console.log(`[Server] Running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('[DB] Connection failed:', err.message);
    process.exit(1);
  });
