import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['DONOR', 'VOLUNTEER', 'ADMIN'], default: 'DONOR' },
    phone: { type: String, required: true },
    email: { type: String },
    address: { type: String },
    organization: { type: String },
    donorType: { type: String },
    
    // Volunteer specific fields
    status: {
      type: String,
      enum: ['PENDING', 'VERIFIED_ACTIVE', 'SUSPENDED', 'REJECTED'],
      default: 'PENDING'
    },
    transportType: { type: String },
    preferableRoute: { type: String },
    workingSuitableTime: { type: String },
    serviceAreas: [{ type: String }],
    maximumDistanceKm: { type: Number, default: 10 },
    isAvailable: { type: Boolean, default: false },
    idDocumentType: { type: String },
    idDocumentNumber: { type: String },
    idDocumentPreview: { type: String },
    completedRescues: { type: Number, default: 0 },
    mealsDistributed: { type: Number, default: 0 },
    rating: { type: Number, default: 5.0 },
    rewardPoints: { type: Number, default: 50 },
    tier: { type: String, default: 'Novice Courier' },
    badges: [{ id: String, title: String, icon: String, desc: String }]
  },
  { timestamps: true }
);

export const UserModel = mongoose.models.User || mongoose.model('User', UserSchema);
