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
    ]
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
      { id: 'b1', title: 'Platinum Lifesaver', icon: '🎖️', desc: 'Over 4,500 meals safely rescued' }
    ]
  }
];

export const INITIAL_DONORS = [
  {
    id: 'donor-01',
    name: 'Rohit Sharma',
    username: 'rohit',
    password: 'password123',
    phone: '+91 98765 43210',
    address: 'Indiranagar 100ft Road, Bengaluru',
    organization: 'Royal Orchid Banquet Hall',
    donorType: 'Banquet & Event Host'
  },
  {
    id: 'donor-02',
    name: 'Ananya Deshmukh',
    username: 'ananya',
    password: 'password123',
    phone: '+91 98111 22334',
    address: 'Whitefield Main Road, Bengaluru',
    organization: 'ITC Gardenia Caterers',
    donorType: 'Catering Service'
  }
];

export const INITIAL_DONATIONS = [
  {
    id: 'dn-01',
    publicReference: 'AS-828',
    foodDescription: 'Veg Dum Biryani, Mixed Veg Curry, 150 Fresh Phulkas',
    foodType: 'Cooked Meal (Perishable)',
    quantityMeals: 140,
    eventType: 'Wedding Reception',
    makingTime: '1:30 PM (Freshly prepared)',
    safeConsumptionDeadline: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
    pickupAddress: 'Grand Palace Hall, 100ft Road, Indiranagar, Bengaluru',
    pickupLandmark: 'Opposite BDA Complex',
    donorName: 'Rohit Sharma',
    donorPhone: '+91 98765 43210',
    donorOrg: 'Royal Orchid Banquet',
    donorLiveLocation: '12.9784° N, 77.6408° E (Indiranagar)',
    foodPhoto: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=600&auto=format&fit=crop&q=80',
    status: 'SUBMITTED',
    createdAt: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
    timeline: [
      {
        status: 'SUBMITTED',
        timestamp: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
        actor: 'Donor (Rohit Sharma)',
        note: 'Reported 140 fresh meals from wedding reception.'
      }
    ]
  },
  {
    id: 'dn-02',
    publicReference: 'AS-452',
    foodDescription: 'Paneer Makhani, Jeera Rice, Dal Tadka, 80 Chapatis',
    foodType: 'Cooked Meal (Perishable)',
    quantityMeals: 85,
    eventType: 'Corporate Dinner',
    makingTime: '4:00 PM',
    safeConsumptionDeadline: new Date(Date.now() + 3.5 * 60 * 60 * 1000).toISOString(),
    pickupAddress: 'Tech Mahindra Cafeteria, ITPL Main Road, Whitefield, Bengaluru',
    pickupLandmark: 'Gate 3 Visitor Reception',
    donorName: 'Ananya Deshmukh',
    donorPhone: '+91 98111 22334',
    donorOrg: 'ITC Caterers',
    foodPhoto: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&auto=format&fit=crop&q=80',
    status: 'ACCEPTED',
    assignedVolunteerId: 'vol-01',
    assignedVolunteerName: 'Aarav Patel',
    destinationId: 'dest-01',
    destinationName: 'Pragati Shelter Kitchen (Ward 4)',
    createdAt: new Date(Date.now() - 55 * 60 * 1000).toISOString(),
    timeline: [
      {
        status: 'SUBMITTED',
        timestamp: new Date(Date.now() - 55 * 60 * 1000).toISOString(),
        actor: 'Donor (Ananya Deshmukh)',
        note: 'Reported 85 corporate dinner meals.'
      },
      {
        status: 'ASSIGNED_AWAITING_ACCEPTANCE',
        timestamp: new Date(Date.now() - 35 * 60 * 1000).toISOString(),
        actor: 'Admin',
        note: 'Admin approved. Matched with Aarav Patel along Indiranagar-Domlur corridor.'
      },
      {
        status: 'ACCEPTED',
        timestamp: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
        actor: 'Volunteer (Aarav Patel)',
        note: 'Aarav accepted offer. Navigating to pickup with two-wheeler insulated box.'
      }
    ]
  },
  {
    id: 'dn-03',
    publicReference: 'AS-910',
    foodDescription: 'South Indian Meals, Sambar, Rasam, Curd Rice, 200 Poori',
    foodType: 'Cooked Meal (Perishable)',
    quantityMeals: 200,
    eventType: 'Temple Festival',
    makingTime: '11:00 AM',
    safeConsumptionDeadline: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    pickupAddress: 'Community Center, Shivaji Nagar, Bengaluru',
    donorName: 'Vikram Rao',
    donorPhone: '+91 98450 99887',
    foodPhoto: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=600&auto=format&fit=crop&q=80',
    status: 'COMPLETED',
    assignedVolunteerId: 'vol-03',
    assignedVolunteerName: 'Vikram Joshi',
    destinationId: 'dest-02',
    destinationName: 'Hope NGO Children Home',
    completedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    timeline: [
      {
        status: 'SUBMITTED',
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        actor: 'Donor',
        note: 'Surplus food reported.'
      },
      {
        status: 'COMPLETED',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        actor: 'Admin',
        note: 'Distribution verified and 200 children nourished.'
      }
    ]
  }
];

export const INITIAL_CORRIDORS = [
  {
    id: 'corridor-01',
    name: 'Indiranagar ➔ Domlur ➔ Koramangala ➔ Silk Board',
    shortName: 'Central-East Tech Artery',
    lengthKm: 11.4,
    trafficLevel: 'LOW',
    trafficStatusText: 'Optimal Flow • Green Transit Corridor',
    typicalDelayMins: 4,
    keyWaypoints: ['Indiranagar 100ft Rd', 'Domlur Flyover', 'Sony World Signal', 'Silk Board Jn'],
    recommendedTransport: 'Two-Wheeler (Agile Insulated Crate)',
    bypassRouteName: 'Inner Ring Rd via 80ft Road Link',
    assignedVolunteerNames: ['Aarav Patel', 'Rohan Joshi']
  },
  {
    id: 'corridor-02',
    name: 'Whitefield ➔ Marathahalli ➔ Bellandur ➔ Sarjapur Rd',
    shortName: 'Eastern IT & Outer Ring Corridor',
    lengthKm: 14.8,
    trafficLevel: 'MODERATE',
    trafficStatusText: 'Moderate Peak • Outer Ring Road Volume',
    typicalDelayMins: 14,
    keyWaypoints: ['ITPL Main Gate', 'Hope Farm Jn', 'Marathahalli Underpass', 'Bellandur EcoSpace'],
    recommendedTransport: 'Four-Wheeler / Utility Van',
    bypassRouteName: 'Varthur Kodi Rd bypass avoiding Marathahalli flyover',
    assignedVolunteerNames: ['Priya Nair', 'Meera Iyer']
  },
  {
    id: 'corridor-03',
    name: 'Shivaji Nagar ➔ Frazer Town ➔ MG Road ➔ Ulsoor',
    shortName: 'Central Heritage Corridor',
    lengthKm: 7.2,
    trafficLevel: 'LOW',
    trafficStatusText: 'Fast Clearance • Steady Transit',
    typicalDelayMins: 3,
    keyWaypoints: ['Shivaji Nagar Bus Stand', 'Coles Park', 'MG Road Metro', 'Ulsoor Gurudwara'],
    recommendedTransport: 'Two-Wheeler or Utility Van',
    bypassRouteName: 'Cubbon Road straight link to Halasuru',
    assignedVolunteerNames: ['Vikram Joshi']
  },
  {
    id: 'corridor-04',
    name: 'Jayanagar ➔ JP Nagar ➔ Banashankari ➔ Kanakapura Rd',
    shortName: 'South Bengaluru Metro Artery',
    lengthKm: 9.6,
    trafficLevel: 'LOW',
    trafficStatusText: 'Smooth Transit • Elevated Metro Corridor',
    typicalDelayMins: 5,
    keyWaypoints: ['Jayanagar 4th Block', 'JP Nagar 15th Cross', 'Banashankari Temple', 'Sarakki Jn'],
    recommendedTransport: 'Two-Wheeler or Four-Wheeler',
    bypassRouteName: 'Ring Road underpass straight link',
    assignedVolunteerNames: ['Kavita Menon']
  }
];
