import mongoose from 'mongoose';

const DestinationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    type: { type: String, default: 'Night Shelter & Community Kitchen' },
    address: { type: String, required: true },
    contactPerson: { type: String, required: true },
    contactPhone: { type: String, required: true },
    capacityMeals: { type: Number, default: 200 },
    active: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export const DestinationModel = mongoose.models.Destination || mongoose.model('Destination', DestinationSchema);
