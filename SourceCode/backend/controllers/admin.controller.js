const User = require('../models/User');
const SOSAlert = require('../models/SOSAlert');

// ── FR-08: Get all users (paginated) ─────────────────────────────────────────
const getAllUsers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 20;
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      User.find().select('-password').skip(skip).limit(limit).sort({ createdAt: -1 }),
      User.countDocuments(),
    ]);

    res.status(200).json({
      users,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    next(err);
  }
};

// ── FR-08: Deactivate / reactivate user ──────────────────────────────────────
const setUserActiveStatus = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { isActive } = req.body;

    if (typeof isActive !== 'boolean') {
      return res.status(422).json({ message: 'isActive must be a boolean' });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { isActive },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res
      .status(200)
      .json({ message: `User ${isActive ? 'activated' : 'deactivated'}`, user });
  } catch (err) {
    next(err);
  }
};

// ── FR-08: Change user role ───────────────────────────────────────────────────
const changeUserRole = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    const allowedRoles = ['patient', 'responder', 'admin'];
    if (!allowedRoles.includes(role)) {
      return res.status(422).json({ message: 'Invalid role' });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'Role updated', user });
  } catch (err) {
    next(err);
  }
};

// ── FR-08: Delete user ────────────────────────────────────────────────────────
const deleteUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User deleted' });
  } catch (err) {
    next(err);
  }
};

// ── FR-09: Get all alerts with filters ───────────────────────────────────────
const getAllAlerts = async (req, res, next) => {
  try {
    const { status, from, to, patientId } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (patientId) filter.patientId = patientId;
    if (from || to) {
      filter.createdAt = {};
      if (from) filter.createdAt.$gte = new Date(from);
      if (to) filter.createdAt.$lte = new Date(to);
    }

    const alerts = await SOSAlert.find(filter)
      .populate('patientId', 'name email phone')
      .populate('responderId', 'name')
      .sort({ createdAt: -1 });

    // Aggregate stats for the dashboard
    const totalToday = await SOSAlert.countDocuments({
      createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) },
    });

    res.status(200).json({ alerts, totalToday });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllUsers,
  setUserActiveStatus,
  changeUserRole,
  deleteUser,
  getAllAlerts,
};
