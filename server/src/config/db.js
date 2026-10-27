import mongoose from 'mongoose';
import { fileDb } from '../data/fileDb.js';

let dbMode = 'FILE_DB'; // 'MONGODB' or 'FILE_DB'

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (uri) {
    try {
      console.log(`[Database] Attempting connection to MongoDB at: ${uri.replace(/\/\/([^:]+):([^@]+)@/, '//$1:****@')}`);
      // Connect with a 4 second timeout so it doesn't hang if local mongod is not started
      await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 4000
      });
      dbMode = 'MONGODB';
      console.log('✓ [Database] Connected successfully to MongoDB!');
      return { mode: 'MONGODB', status: 'connected' };
    } catch (err) {
      console.warn(`[Database] MongoDB connection failed (${err.message}).`);
      console.warn('[Database] Seamlessly falling back to embedded persistent database (server/data/store.json).');
    }
  }

  // Fallback to FileDB
  fileDb.init();
  dbMode = 'FILE_DB';
  console.log('✓ [Database] Persistent local database store initialized and ready!');
  return { mode: 'FILE_DB', status: 'active', path: 'server/data/store.json' };
};

export const getDBMode = () => dbMode;
