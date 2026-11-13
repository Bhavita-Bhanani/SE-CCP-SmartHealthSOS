const mongoose = require('mongoose');

// Emergency contacts are embedded inside the health profile
const emergencyContactSchema = new mongoose.Schema({
  name: { type: String, required: [true, 'Contact name is required'] },
  phone: { type: String, required: [true, 'Contact phone is required'] },
  relationship: { type: String, default: '' },
});

const healthProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true, // One profile per user
    },
    bloodType: {
      type: String,
      enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Unknown'],
      default: 'Unknown',
    },
    allergies: { type: [String], default: [] },
    chronicConditions: { type: [String], default: [] },
    medications: { type: [String], default: [] },
    emergencyContacts: {
      type: [emergencyContactSchema],
      validate: {
        validator: function (arr) {
          return arr.length <= 5; // FR-05: max 5 contacts
        },
        message: 'Maximum 5 emergency contacts allowed',
      },
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('HealthProfile', healthProfileSchema);
