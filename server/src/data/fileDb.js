import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  INITIAL_DESTINATIONS,
  INITIAL_VOLUNTEERS,
  INITIAL_DONORS,
  INITIAL_DONATIONS,
  INITIAL_CORRIDORS
} from './initialData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const STORE_DIR = path.join(__dirname, '..', '..', 'data');
const STORE_FILE = path.join(STORE_DIR, 'store.json');

// Ensure directory exists
if (!fs.existsSync(STORE_DIR)) {
  fs.mkdirSync(STORE_DIR, { recursive: true });
}

// In-memory cache + file sync
let store = {
  donations: [],
  volunteers: [],
  donors: [],
  destinations: [],
  notifications: [],
  corridors: []
};

// Load or initialize store
export const loadStore = () => {
  try {
    if (fs.existsSync(STORE_FILE)) {
      const raw = fs.readFileSync(STORE_FILE, 'utf-8');
      store = JSON.parse(raw);
    } else {
      store = {
        donations: [...INITIAL_DONATIONS],
        volunteers: [...INITIAL_VOLUNTEERS],
        donors: [...INITIAL_DONORS],
        destinations: [...INITIAL_DESTINATIONS],
        notifications: [
          {
            id: 'notif-01',
            forRole: 'ADMIN',
            title: 'Welcome to AnnaSetu Operational Command',
            message: 'All 4 Bengaluru transit corridors flowing. 3 verified distribution points active.',
            timestamp: new Date().toISOString(),
            read: false
          }
        ],
        corridors: [...INITIAL_CORRIDORS]
      };
      saveStore();
    }
  } catch (err) {
    console.warn('[FileDB] Failed to parse store.json, using defaults:', err.message);
    store = {
      donations: [...INITIAL_DONATIONS],
      volunteers: [...INITIAL_VOLUNTEERS],
      donors: [...INITIAL_DONORS],
      destinations: [...INITIAL_DESTINATIONS],
      notifications: [],
      corridors: [...INITIAL_CORRIDORS]
    };
  }
  return store;
};

export const saveStore = () => {
  try {
    fs.writeFileSync(STORE_FILE, JSON.stringify(store, null, 2), 'utf-8');
  } catch (err) {
    console.error('[FileDB] Failed to write store.json:', err.message);
  }
};

// Database helper functions
export const fileDb = {
  init() {
    return loadStore();
  },

  get(collectionName) {
    if (!store[collectionName]) store[collectionName] = [];
    return store[collectionName];
  },

  findById(collectionName, id) {
    const list = this.get(collectionName);
    return list.find(item => item.id === id || item._id === id);
  },

  insert(collectionName, data) {
    const list = this.get(collectionName);
    const id = data.id || `rec-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    const record = { ...data, id, _id: id, createdAt: data.createdAt || new Date().toISOString() };
    list.unshift(record);
    saveStore();
    return record;
  },

  update(collectionName, id, updateFields) {
    const list = this.get(collectionName);
    const index = list.findIndex(item => item.id === id || item._id === id);
    if (index === -1) return null;
    list[index] = { ...list[index], ...updateFields, updatedAt: new Date().toISOString() };
    saveStore();
    return list[index];
  },

  replace(collectionName, fullList) {
    store[collectionName] = fullList;
    saveStore();
    return fullList;
  }
};
