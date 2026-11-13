const mongoose = require('mongoose');

const sosAlertSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    responderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    mapsLink: { type: String },
    status: {
      type: String,
      enum: ['pending', 'in-progress', 'resolved'],
      default: 'pending',
    },
    resolvedAt: { type: Date, default: null },
  },
  { timestamps: true } // createdAt acts as the alert timestamp
);

// Auto-generate Google Maps link from coordinates
sosAlertSchema.pre('save', function (next) {
  if (this.latitude && this.longitude) {
    this.mapsLink = `https://www.google.com/maps?q=${this.latitude},${this.longitude}`;
  }
  next();
});

module.exports = mongoose.model('SOSAlert', sosAlertSchema);
