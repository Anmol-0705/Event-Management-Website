require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/eventdb';

async function run(){
  await mongoose.connect(MONGODB_URI);
  const email = process.env.ADMIN_EMAIL || 'admin@example.com';
  const password = process.env.ADMIN_PASSWORD || 'Admin@123';
  let user = await User.findOne({ email });
  if (!user){
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    user = new User({ name: 'Admin', email, passwordHash, role: 'admin' });
    await user.save();
    console.log('Admin created:', email, password);
  } else {
    console.log('Admin already exists:', email);
  }
  process.exit(0);
}

run().catch(err => { console.error(err); process.exit(1); });
