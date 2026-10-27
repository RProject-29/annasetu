import { DONATION_STATUS, ROLES, VOLUNTEER_STATUS } from '../constants/roles';

// Realistic food photos (high quality Unsplash food images representing Indian event & community meals)
export const SAMPLE_FOOD_PHOTOS = [
  'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=600&auto=format&fit=crop&q=80', // Biryani
  'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&auto=format&fit=crop&q=80', // Indian Curry & Rice
  'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600&auto=format&fit=crop&q=80', // Samosas & Snacks
  'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=600&auto=format&fit=crop&q=80', // Roti & Dal
  'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=600&auto=format&fit=crop&q=80'  // Community Distribution / Meal Trays
];

export const SAMPLE_DISTRIBUTION_PROOFS = [
  'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=600&auto=format&fit=crop&q=80', // Shelter food service
  'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&auto=format&fit=crop&q=80', // Meal trays distributed
  'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=600&auto=format&fit=crop&q=80', // Food container packages
  'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=600&auto=format&fit=crop&q=80'  // Served warm meals
];

export const INITIAL_DESTINATIONS = [
  {
    id: 'dest-01',
    name: 'Pragati Shelter Kitchen (Ward 4)',
    type: 'Night Shelter & Community Kitchen',
    address: '14, 2nd Main, Indiranagar, Bengaluru',
    contactPerson: 'Sister Mary / Raju',
    contactPhone: '+91 98450 11223',
    capacityMeals: 250,
    active: true
  },
  {
    id: 'dest-02',
    name: 'Hope NGO Children Home',
    type: 'Registered Care Home',
    address: '88, Shivaji Nagar Circular Rd, Bengaluru',
    contactPerson: 'Farhan Sheikh',
    contactPhone: '+91 98450 44556',
    capacityMeals: 140,
    active: true
  },
  {
    id: 'dest-03',
    name: 'Annapurna Relief Distribution Point',
    type: 'Admin-Approved Need Zone',
    address: 'Under Flyover Junction, Old Airport Road',
    contactPerson: 'Kavita M. (Coordinator)',
    contactPhone: '+91 98450 77889',
    capacityMeals: 300,
    active: true
  }
];

export const INITIAL_VOLUNTEERS = [
  {
    id: 'vol-01',
    name: 'Aarav Patel',
    username: 'aarav',
    password: 'aarav123',
    phone: '+91 98123 45678',
    email: 'aarav.patel@gmail.com',
    age: 26,
    gender: 'Male',
    workingSuitableTime: 'Evening (4:00 PM – 8:00 PM)',
    preferableRoute: 'Indiranagar ➔ Domlur ➔ Koramangala ➔ Silk Board',
    status: 'VERIFIED_ACTIVE',
    transportType: 'Two-Wheeler (with insulated crate)',
    maximumDistanceKm: 12,
    serviceAreas: ['Indiranagar', 'Koramangala', 'Domlur'],
    isAvailable: true,
    idDocumentType: 'Driving License',
    idDocumentNumber: 'KA-03-2022-0045612',
    idDocumentPreview: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400&auto=format&fit=crop&q=60',
    completedRescues: 18,
    mealsDistributed: 2150,
    hoursVolunteered: 36,
    rating: 4.9,
    rewardPoints: 920,
    tier: 'Gold Star Courier',
    joinedDate: '2026-03-15',
    badges: [
      { id: 'b1', title: 'Golden Hunger Hero', icon: '🏆', desc: 'Over 2,000 community meals safely delivered' },
      { id: 'b2', title: 'Speedy Delivery Star', icon: '⚡', desc: 'Rescued meals within 25 min of assignment' },
      { id: 'b3', title: 'Hygiene & Safety Certified', icon: '🛡️', desc: '100% verified temperature & insulated transport' },
      { id: 'b4', title: 'Community Pillar', icon: '🌟', desc: 'Consistently active for 8+ consecutive weeks' }
    ],
    awards: [
      { id: 'a1', title: 'AnnaSetu Lifesaver of the Month', issuer: 'AnnaSetu Central Operations', date: 'October 2026' },
      { id: 'a2', title: 'Zero Food Waste Ambassador', issuer: 'Bengaluru Civic Food Coalition', date: 'August 2026' }
    ]
  },
  {
    id: 'vol-02',
    name: 'Priya Nair',
    username: 'priya',
    password: 'priya123',
    phone: '+91 98234 56789',
    email: 'priya.nair@outlook.com',
    age: 23,
    gender: 'Female',
    workingSuitableTime: 'Night (8:00 PM – 11:30 PM)',
    preferableRoute: 'Whitefield ➔ Marathahalli ➔ Bellandur Corridor',
    status: 'PENDING',
    transportType: 'Four-Wheeler (Car)',
    maximumDistanceKm: 8,
    serviceAreas: ['Whitefield', 'Marathahalli'],
    isAvailable: false,
    idDocumentType: 'Aadhaar Card',
    idDocumentNumber: '9842-1123-4567',
    idDocumentPreview: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400&auto=format&fit=crop&q=60',
    completedRescues: 0,
    mealsDistributed: 0,
    hoursVolunteered: 0,
    rating: 5.0,
    rewardPoints: 50,
    tier: 'New Recruiter (Novice)',
    joinedDate: '2026-10-24',
    badges: [
      { id: 'b0', title: 'Registered Volunteer', icon: '🌱', desc: 'Completed background registration & ID upload' }
    ],
    awards: []
  },
  {
    id: 'vol-03',
    name: 'Vikram Joshi',
    username: 'vikram',
    password: 'vikram123',
    phone: '+91 98345 67890',
    email: 'vikram.j@gmail.com',
    age: 31,
    gender: 'Male',
    workingSuitableTime: 'Flexible / Full Day',
    preferableRoute: 'Shivaji Nagar ➔ Frazer Town ➔ MG Road Corridor',
    status: 'VERIFIED_ACTIVE',
    transportType: 'Four-Wheeler (Utility Van)',
    maximumDistanceKm: 25,
    serviceAreas: ['Shivaji Nagar', 'Frazer Town', 'MG Road'],
    isAvailable: true,
    idDocumentType: 'Driving License',
    idDocumentNumber: 'KA-04-2018-0091823',
    idDocumentPreview: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400&auto=format&fit=crop&q=60',
    completedRescues: 34,
    mealsDistributed: 4600,
    hoursVolunteered: 72,
    rating: 5.0,
    rewardPoints: 1450,
    tier: 'Platinum Lifesaver',
    joinedDate: '2026-01-10',
    badges: [
      { id: 'b1', title: 'Golden Hunger Hero', icon: '🏆', desc: 'Over 4,500 community meals safely delivered' },
      { id: 'b5', title: 'Heavy Hauler', icon: '🚐', desc: 'Large batch cargo deliveries' }
    ],
    awards: [
      { id: 'a3', title: 'Community Hero of the Year', issuer: 'Municipal Food Safety Board', date: '2026' }
    ]
  }
];

// Helper to calculate future deadline timestamps
const hoursFromNow = (h) => new Date(Date.now() + h * 3600 * 1000).toISOString();
const hoursAgo = (h) => new Date(Date.now() - h * 3600 * 1000).toISOString();

export const INITIAL_DONATIONS = [
  {
    id: 'AS-2026-101',
    publicReference: 'AS-101',
    donorName: 'Rajesh Sharma',
    donorOrg: 'Grand Celebrations Banquet Hall',
    donorPhone: '+91 98765 43210',
    eventType: 'Wedding Reception',
    foodDescription: 'Veg Biryani, Paneer Butter Masala, Fresh Rotis, Gulab Jamun',
    quantityMeals: 140,
    handlingNotes: 'Packed in clean aluminum commercial trays. Kept hot on warmers.',
    preparedAt: hoursAgo(2),
    safeConsumptionDeadline: hoursFromNow(2.5), // Urgency amber!
    foodPhoto: SAMPLE_FOOD_PHOTOS[0],
    pickupAddress: 'Grand Celebrations Hall, 80 Feet Road, Indiranagar',
    pickupLandmark: 'Opposite BDA Complex',
    status: 'SUBMITTED', // Under review by Admin
    destinationId: null,
    assignedVolunteerId: null,
    assignmentResponseBy: null,
    createdAt: hoursAgo(0.5),
    timeline: [
      {
        status: 'SUBMITTED',
        timestamp: hoursAgo(0.5),
        actor: 'Donor (Rajesh Sharma)',
        note: 'Report submitted with safe consumption deadline 2h 30m.'
      }
    ]
  },
  {
    id: 'AS-2026-102',
    publicReference: 'AS-102',
    donorName: 'Kaveri Caterers',
    donorOrg: 'Tech Summit Convention',
    donorPhone: '+91 99887 76655',
    eventType: 'Corporate Event',
    foodDescription: 'Lunch Combos: Jeera Rice, Dal Tadka, Mixed Vegetable Poriyal',
    quantityMeals: 85,
    handlingNotes: 'Sealed individual biodegradable meal boxes.',
    preparedAt: hoursAgo(3),
    safeConsumptionDeadline: hoursFromNow(1.5),
    foodPhoto: SAMPLE_FOOD_PHOTOS[1],
    pickupAddress: 'Embassy TechVillage, Tower 3 Ground Entrance, Outer Ring Rd',
    pickupLandmark: 'Gate 2 Security Booth',
    status: 'ASSIGNED_AWAITING_ACCEPTANCE', // Offered to Aarav Patel!
    destinationId: 'dest-01',
    destinationName: 'Pragati Shelter Kitchen (Ward 4)',
    assignedVolunteerId: 'vol-01',
    assignedVolunteerName: 'Aarav Patel',
    assignmentResponseBy: hoursFromNow(0.25), // 15 mins to accept
    createdAt: hoursAgo(1.5),
    timeline: [
      {
        status: 'SUBMITTED',
        timestamp: hoursAgo(1.5),
        actor: 'Donor',
        note: 'Submitted 85 packed meals.'
      },
      {
        status: 'APPROVED_FOR_MATCHING',
        timestamp: hoursAgo(1.2),
        actor: 'Admin',
        note: 'Admin verified safe time and selected Pragati Shelter Kitchen.'
      },
      {
        status: 'ASSIGNED_AWAITING_ACCEPTANCE',
        timestamp: hoursAgo(0.1),
        actor: 'Admin',
        note: 'Offer dispatched to nearby volunteer Aarav Patel.'
      }
    ]
  },
  {
    id: 'AS-2026-103',
    publicReference: 'AS-103',
    donorName: 'Mehra Family',
    donorOrg: 'Private Residence (Anniversary)',
    donorPhone: '+91 97654 32109',
    eventType: 'Ceremony / Party',
    foodDescription: 'Vegetable Pulao, Mirchi Salan, Raita, Boondi Ladoo',
    quantityMeals: 110,
    handlingNotes: 'Food packed in 5 large food-grade stainless containers.',
    preparedAt: hoursAgo(4),
    safeConsumptionDeadline: hoursFromNow(3.5),
    foodPhoto: SAMPLE_FOOD_PHOTOS[2],
    pickupAddress: '42, Defence Colony, 100 Feet Road, Indiranagar',
    pickupLandmark: 'Near Metro Station Pillar 104',
    status: 'VOLUNTEER_AT_PICKUP', // Aarav Patel is at pickup!
    destinationId: 'dest-01',
    destinationName: 'Pragati Shelter Kitchen (Ward 4)',
    assignedVolunteerId: 'vol-01',
    assignedVolunteerName: 'Aarav Patel',
    createdAt: hoursAgo(2),
    timeline: [
      {
        status: 'SUBMITTED',
        timestamp: hoursAgo(2),
        actor: 'Donor',
        note: 'Reported 110 surplus meals.'
      },
      {
        status: 'ACCEPTED',
        timestamp: hoursAgo(1),
        actor: 'Volunteer (Aarav Patel)',
        note: 'Rescue accepted. En route to pickup.'
      },
      {
        status: 'VOLUNTEER_AT_PICKUP',
        timestamp: hoursAgo(0.1),
        actor: 'Volunteer (Aarav Patel)',
        note: 'Checkpoint recorded: Arrived at donor premises.'
      }
    ]
  },
  {
    id: 'AS-2026-104',
    publicReference: 'AS-104',
    donorName: 'Hotel Royal Orchid Kitchen',
    donorOrg: 'Hotel / Restaurant',
    donorPhone: '+91 96543 21098',
    eventType: 'Hotel Buffet Surplus',
    foodDescription: 'Steamed Rice, Sambar, Cabbage Kootu, Curd Rice',
    quantityMeals: 120,
    handlingNotes: 'Food kept in temperature-controlled cambro boxes.',
    preparedAt: hoursAgo(5),
    safeConsumptionDeadline: hoursFromNow(1),
    foodPhoto: SAMPLE_FOOD_PHOTOS[3],
    pickupAddress: '1, Golf Avenue, HAL Old Airport Road',
    pickupLandmark: 'Service gate rear entry',
    status: 'PROOF_SUBMITTED', // Waiting for Admin proof review!
    destinationId: 'dest-02',
    destinationName: 'Hope NGO Children Home',
    assignedVolunteerId: 'vol-03',
    assignedVolunteerName: 'Vikram Joshi',
    createdAt: hoursAgo(4),
    proofDetails: {
      distributionPhoto: SAMPLE_FOOD_PHOTOS[4],
      peopleServed: 115,
      actualMealsDistributed: 120,
      distributionTime: hoursAgo(0.3),
      distributionLocationCheckpoint: 'Hope NGO Children Home, Shivaji Nagar (GPS 12.9856, 77.6054)',
      notes: 'Meals served warm to all children and community elders. Clean distribution completed.'
    },
    timeline: [
      {
        status: 'SUBMITTED',
        timestamp: hoursAgo(4),
        actor: 'Donor',
        note: 'Reported 120 buffet meals.'
      },
      {
        status: 'PICKED_UP',
        timestamp: hoursAgo(2),
        actor: 'Volunteer (Vikram Joshi)',
        note: 'Collected from hotel kitchen.'
      },
      {
        status: 'PROOF_SUBMITTED',
        timestamp: hoursAgo(0.3),
        actor: 'Volunteer (Vikram Joshi)',
        note: 'Distribution proof and photos submitted. Awaiting Admin review.'
      }
    ]
  },
  {
    id: 'AS-2026-105',
    publicReference: 'AS-105',
    donorName: 'Sagar Sweets & Caterers',
    donorOrg: 'Community Festival',
    donorPhone: '+91 95432 10987',
    eventType: 'Community Function',
    foodDescription: 'Puri, Chana Masala, Halwa',
    quantityMeals: 200,
    handlingNotes: 'Food handled under strict hygiene standards.',
    preparedAt: hoursAgo(24),
    safeConsumptionDeadline: hoursAgo(18),
    foodPhoto: SAMPLE_FOOD_PHOTOS[0],
    pickupAddress: 'Malleshwaram 8th Cross',
    pickupLandmark: 'Opposite Temple',
    status: 'COMPLETED',
    destinationId: 'dest-03',
    destinationName: 'Annapurna Relief Distribution Point',
    assignedVolunteerId: 'vol-03',
    assignedVolunteerName: 'Vikram Joshi',
    createdAt: hoursAgo(26),
    completedAt: hoursAgo(19),
    timeline: [
      { status: 'SUBMITTED', timestamp: hoursAgo(26), actor: 'Donor', note: 'Reported 200 meals.' },
      { status: 'COMPLETED', timestamp: hoursAgo(19), actor: 'Admin', note: 'Proof reviewed and verified. Rescue successfully closed.' }
    ]
  }
];

export const INITIAL_NOTIFICATIONS = [
  {
    id: 'notif-1',
    forRole: 'DONOR',
    title: 'Volunteer At Pickup',
    message: 'Volunteer Aarav Patel has arrived at Grand Celebrations Hall for rescue AS-103.',
    timestamp: hoursAgo(0.1),
    read: false,
    donationId: 'AS-2026-103'
  },
  {
    id: 'notif-2',
    forRole: 'VOLUNTEER',
    title: 'New Rescue Offer Available',
    message: '85 meals at Embassy TechVillage need rescue before 1h 30m. Tap to view and accept.',
    timestamp: hoursAgo(0.2),
    read: false,
    donationId: 'AS-2026-102'
  },
  {
    id: 'notif-3',
    forRole: 'ADMIN',
    title: 'New Food Report Submitted',
    message: '140 meals reported at Grand Celebrations Hall. Please review and match.',
    timestamp: hoursAgo(0.5),
    read: false,
    donationId: 'AS-2026-101'
  },
  {
    id: 'notif-4',
    forRole: 'ADMIN',
    title: 'Distribution Proof Awaiting Review',
    message: 'Volunteer Vikram Joshi submitted distribution photos for AS-104 (120 meals).',
    timestamp: hoursAgo(0.3),
    read: false,
    donationId: 'AS-2026-104'
  }
];
