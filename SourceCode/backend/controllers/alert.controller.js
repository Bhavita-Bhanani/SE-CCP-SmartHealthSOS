const SOSAlert = require('../models/SOSAlert');
const HealthProfile = require('../models/HealthProfile');

// ── FR-06: Patient sends SOS alert ───────────────────────────────────────────
const sendAlert = async (req, res, next) => {
  try {
    const { latitude, longitude } = req.body;

    if (!latitude || !longitude) {
      return res
        .status(422)
        .json({ message: 'Latitude and longitude are required' });
    }

    // Fetch patient health summary to attach to the alert broadcast
    const healthProfile = await HealthProfile.findOne({
      userId: req.user._id,
    });

    const alert = await SOSAlert.create({
      patientId: req.user._id,
      latitude,
      longitude,
    });

    // Build the payload broadcast to all Responders via Socket.IO (NFR-01)
    const alertPayload = {
      alertId: alert._id,
      patientId: req.user._id,
      patientName: req.user.name,
      patientPhone: req.user.phone,
      latitude,
      longitude,
      mapsLink: alert.mapsLink,
      bloodType: healthProfile?.bloodType || 'Unknown',
      allergies: healthProfile?.allergies || [],
      status: alert.status,
      timestamp: alert.createdAt,
    };

    // Emit to the 'responders' Socket.IO room
    const io = req.app.locals.io;
    io.to('responders').emit('new-alert', alertPayload);

    res.status(201).json({ message: 'SOS alert sent', alert: alertPayload });
  } catch (err) {
    next(err);
  }
};

// ── FR-07: Get all active alerts (for Responder dashboard) ───────────────────
const getActiveAlerts = async (req, res, next) => {
  try {
    const alerts = await SOSAlert.find({
      status: { $in: ['pending', 'in-progress'] },
    })
      .populate('patientId', 'name phone')
      .populate('responderId', 'name')
      .sort({ createdAt: -1 });

    res.status(200).json(alerts);
  } catch (err) {
    next(err);
  }
};

// ── FR-07: Accept an alert ────────────────────────────────────────────────────
const acceptAlert = async (req, res, next) => {
  try {
    const { alertId } = req.params;
    const alert = await SOSAlert.findById(alertId);

    if (!alert) {
      return res.status(404).json({ message: 'Alert not found' });
    }

    // Concurrency guard — only one responder can accept (TC-21)
    if (alert.status !== 'pending') {
      return res
        .status(409)
        .json({ message: 'Alert already being handled' });
    }

    alert.status = 'in-progress';
    alert.responderId = req.user._id;
    await alert.save();

    // Notify all clients of the status change
    const io = req.app.locals.io;
    io.emit('alert-updated', { alertId: alert._id, status: alert.status });

    res.status(200).json({ message: 'Alert accepted', alert });
  } catch (err) {
    next(err);
  }
};

// ── FR-07: Resolve an alert ───────────────────────────────────────────────────
const resolveAlert = async (req, res, next) => {
  try {
    const { alertId } = req.params;
    const alert = await SOSAlert.findById(alertId);

    if (!alert) {
      return res.status(404).json({ message: 'Alert not found' });
    }

    if (alert.status === 'resolved') {
      return res.status(400).json({ message: 'Alert already resolved' });
    }

    alert.status = 'resolved';
    alert.resolvedAt = new Date();
    await alert.save();

    const io = req.app.locals.io;
    io.emit('alert-updated', { alertId: alert._id, status: alert.status });

    res.status(200).json({ message: 'Alert resolved', alert });
  } catch (err) {
    next(err);
  }
};

// ── Patient: view own alert history ──────────────────────────────────────────
const getMyAlerts = async (req, res, next) => {
  try {
    const alerts = await SOSAlert.find({ patientId: req.user._id }).sort({
      createdAt: -1,
    });
    res.status(200).json(alerts);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  sendAlert,
  getActiveAlerts,
  acceptAlert,
  resolveAlert,
  getMyAlerts,
};
