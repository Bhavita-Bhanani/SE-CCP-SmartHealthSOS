const HealthProfile = require('../models/HealthProfile');

// ── FR-04: Get health profile ─────────────────────────────────────────────────
const getProfile = async (req, res, next) => {
  try {
    const profile = await HealthProfile.findOne({ userId: req.user._id });
    if (!profile) {
      return res.status(404).json({ message: 'Health profile not found' });
    }
    res.status(200).json(profile);
  } catch (err) {
    next(err);
  }
};

// ── FR-04: Create or update health profile ────────────────────────────────────
const upsertProfile = async (req, res, next) => {
  try {
    const { bloodType, allergies, chronicConditions, medications } = req.body;

    const profile = await HealthProfile.findOneAndUpdate(
      { userId: req.user._id },
      { bloodType, allergies, chronicConditions, medications },
      { new: true, upsert: true, runValidators: true }
    );

    res.status(200).json({ message: 'Profile saved', profile });
  } catch (err) {
    next(err);
  }
};

// ── FR-05: Add emergency contact ──────────────────────────────────────────────
const addContact = async (req, res, next) => {
  try {
    const { name, phone, relationship } = req.body;

    if (!name || !phone) {
      return res
        .status(422)
        .json({ message: 'Contact name and phone are required' });
    }

    const profile = await HealthProfile.findOne({ userId: req.user._id });
    if (!profile) {
      return res
        .status(404)
        .json({ message: 'Create a health profile first' });
    }

    if (profile.emergencyContacts.length >= 5) {
      return res
        .status(400)
        .json({ message: 'Maximum 5 emergency contacts allowed' });
    }

    profile.emergencyContacts.push({ name, phone, relationship });
    await profile.save();

    res
      .status(201)
      .json({ message: 'Contact added', contacts: profile.emergencyContacts });
  } catch (err) {
    next(err);
  }
};

// ── FR-05: Remove emergency contact ──────────────────────────────────────────
const removeContact = async (req, res, next) => {
  try {
    const { contactId } = req.params;

    const profile = await HealthProfile.findOne({ userId: req.user._id });
    if (!profile) {
      return res.status(404).json({ message: 'Health profile not found' });
    }

    profile.emergencyContacts = profile.emergencyContacts.filter(
      (c) => c._id.toString() !== contactId
    );
    await profile.save();

    res
      .status(200)
      .json({ message: 'Contact removed', contacts: profile.emergencyContacts });
  } catch (err) {
    next(err);
  }
};

// ── Responder: view any patient's health profile ──────────────────────────────
const getProfileByUserId = async (req, res, next) => {
  try {
    const profile = await HealthProfile.findOne({
      userId: req.params.userId,
    }).populate('userId', 'name email phone');

    if (!profile) {
      return res.status(404).json({ message: 'Health profile not found' });
    }
    res.status(200).json(profile);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getProfile,
  upsertProfile,
  addContact,
  removeContact,
  getProfileByUserId,
};
