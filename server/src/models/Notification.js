import mongoose from 'mongoose';

const NotificationSchema = new mongoose.Schema(
  {
    forRole: { type: String, enum: ['DONOR', 'VOLUNTEER', 'ADMIN'] },
    recipientId: { type: String },
    title: { type: String, required: true },
    message: { type: String, required: true },
    read: { type: Boolean, default: false },
    donationId: { type: String },
    volunteerId: { type: String },
    timestamp: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

export const NotificationModel = mongoose.models.Notification || mongoose.model('Notification', NotificationSchema);
