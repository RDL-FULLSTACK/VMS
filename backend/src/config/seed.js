// seed.js

require('dotenv').config(); // Load environment variables from .env
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

const predefinedUsers = [
  { username: 'admin1', role: 'admin', password: 'AdminPass2023!' },
  { username: 'receptionist1', role: 'receptionist', password: 'ReceptPass101' },
  { username: 'receptionist2', role: 'receptionist', password: 'ReceptPass202' },
  { username: 'security1', role: 'security', password: 'SecureGuard01' },
  { username: 'security2', role: 'security', password: 'SecureGuard02' },
  { username: 'host1', role: 'host', password: 'HostWelcome1' },
  { username: 'host2', role: 'host', password: 'HostWelcome2' },
  { username: 'host3', role: 'host', password: 'HostWelcome3' },
  { username: 'host4', role: 'host', password: 'HostWelcome4' },
  { username: 'host5', role: 'host', password: 'HostWelcome5' },
];

// Connect to MongoDB using the URI from .env
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const seedUsers = async () => {
  try {
    await User.deleteMany();
    for (const user of predefinedUsers) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(user.password, salt);
      await User.create({ username: user.username, password: hashedPassword, role: user.role });
    }
    console.log('Users seeded successfully');
    console.log('Predefined Users and Passwords:');
    predefinedUsers.forEach(user => {
      console.log(`Username: ${user.username}, Role: ${user.role}, Password: ${user.password}`);
    });
    mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding users:', error);
    mongoose.connection.close();
  }
};

seedUsers();