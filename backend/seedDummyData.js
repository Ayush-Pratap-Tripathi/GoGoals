import mongoose from 'mongoose';
import dotenv from 'dotenv';
import dns from 'dns';
import User from './models/User.js';
import Goal from './models/Goal.js';

// Windows DNS workaround for MongoDB Atlas SRV records
dns.setServers(['8.8.8.8', '8.8.4.4']);

// Load local environmental bindings natively mapping DB Strings
dotenv.config();

const seedData = async () => {
  try {
    // Initiate DB connection outside of server flow
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Test Session Connected Successfully...');

    const user = await User.findOne({ email: 'ayushprince110@gmail.com' });
    if (!user) {
      console.error('CRITICAL: User ayushprince110@gmail.com not found in Database!');
      process.exit(1);
    }

    // Capture identical native OS Time limits bypassing drift calculations natively
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = String(today.getMonth() + 1).padStart(2, '0');
    const currentDay = String(today.getDate()).padStart(2, '0');
    const todayStr = `${currentYear}-${currentMonth}-${currentDay}`;

    const dummyGoals = [];
    for (let i = 1; i <= 50; i++) {
        dummyGoals.push({
            user: user._id,
            title: `Stress Test Database Payload #${i}`,
            description: `Auto-generated execution limit testing node.`,
            category: 'daily',
            scheduledDate: todayStr,
            isCompleted: i % 4 === 0, // Simulates a 25% completed ratio artificially mimicking UI checking states
            isDeleted: false
        });
    }

    // Flush batch directly binding Array
    await Goal.insertMany(dummyGoals);
    console.log(`SUCCESS: 50 generic payloads explicitly bound to ${todayStr} for User: ${user.email}`);

    process.exit(0);
  } catch (error) {
    console.error('SERVER ERROR during testing map:', error);
    process.exit(1);
  }
};

seedData();
