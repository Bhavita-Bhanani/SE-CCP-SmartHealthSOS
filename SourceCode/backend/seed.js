require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const HealthProfile = require('./models/HealthProfile');

const MONGO_URI =
  process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/smart_health_sos';

const seedDatabase = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('[Seed] Connected to MongoDB');

    await User.deleteMany({});
    await HealthProfile.deleteMany({});

    // Pass plain password — User.js pre('save') hook hashes it once
    const users = await User.create([
      {
        name: 'Ali Hassan (Patient)',
        email: 'patient@test.com',
        password: 'Test@1234',
        phone: '03001111111',
        role: 'patient',
        isActive: true,
      },
      {
        name: 'Dr. Sara Khan (Responder)',
        email: 'responder@test.com',
        password: 'Test@1234',
        phone: '03002222222',
        role: 'responder',
        isActive: true,
      },
      {
        name: 'Admin User',
        email: 'admin@test.com',
        password: 'Test@1234',
        phone: '03003333333',
        role: 'admin',
        isActive: true,
      },
    ]);

    console.log(
      '[Seed] Users created:',
      users.map((u) => u.email)
    );

    const patientUser = users.find((u) => u.role === 'patient');
    await HealthProfile.create({
      userId: patientUser._id,
      bloodType: 'B+',
      allergies: ['Penicillin', 'Peanuts'],
      chronicConditions: ['Diabetes Type 2'],
      medications: ['Metformin 500mg'],
      emergencyContacts: [
        {
          name: 'Ahmed Hassan',
          phone: '03004444444',
          relationship: 'Brother',
        },
      ],
    });

    console.log('[Seed] Health profile created for patient');
    console.log(
      '[Seed] Done. Test credentials: patient@test.com / responder@test.com / admin@test.com — password: Test@1234'
    );
    process.exit(0);
  } catch (err) {
    console.error('[Seed] Error:', err.message);
    process.exit(1);
  }
};

seedDatabase();