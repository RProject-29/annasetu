import mongoose from 'mongoose';

const TimelineEntrySchema = new mongoose.Schema({
  status: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  actor: { type: String, default: 'System' },
  note: { type: String }
});

const ProofDetailsSchema = new mongoose.Schema({
  distributionPhoto: { type: String },
  peopleFedEstimate: { type: Number },
  cleanlinessRating: { type: String },
  notes: { type: String },
  submittedAt: { type: Date }
});

const DonationSchema = new mongoose.Schema(
  {
    publicReference: { type: String, required: true, unique: true },
    foodDescription: { type: String, required: true },
    foodType: { type: String, default: 'Cooked Meal' },
    eventType: { type: String },
    quantityMeals: { type: Number, required: true },
    makingTime: { type: String },
    freshnessHours: { type: Number },
    safeConsumptionDeadline: { type: Date, required: true },
    pickupAddress: { type: String, required: true },
    pickupLandmark: { type: String },
    pickupCoordinates: {
      lat: { type: Number },
      lng: { type: Number }
    },
    donorName: { type: String, required: true },
    donorPhone: { type: String, required: true },
    donorOrg: { type: String },
    donorLiveLocation: { type: String },
    foodPhoto: { type: String },
    
    // Status & Life cycle
    status: {
      type: String,
      enum: [
        'DRAFT',
        'SUBMITTED',
        'UNDER_REVIEW',
        'CLARIFICATION_REQUIRED',
        'APPROVED_FOR_MATCHING',
        'ASSIGNED_AWAITING_ACCEPTANCE',
        'ACCEPTED',
        'VOLUNTEER_AT_PICKUP',
        'PICKED_UP',
        'DISTRIBUTION_IN_PROGRESS',
        'PROOF_SUBMITTED',
        'COMPLETED',
        'REJECTED',
        'CANCELLED',
        'EXPIRED'
      ],
      default: 'SUBMITTED'
    },
    
    // Assignment
    assignedVolunteerId: { type: String },
    assignedVolunteerName: { type: String },
    destinationId: { type: String },
    destinationName: { type: String },
    
    // Proof & Audit
    timeline: [TimelineEntrySchema],
    proofDetails: ProofDetailsSchema,
    completedAt: { type: Date }
  },
  { timestamps: true }
);

export const DonationModel = mongoose.models.Donation || mongoose.model('Donation', DonationSchema);
