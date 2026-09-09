import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting BloodBridge database seeding with synthetic demo data...');

  // Clean existing tables in correct order
  await prisma.auditLog.deleteMany();
  await prisma.requestStatusHistory.deleteMany();
  await prisma.escalationEvent.deleteMany();
  await prisma.verificationRecord.deleteMany();
  await prisma.donorMatch.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.bloodRequest.deleteMany();
  await prisma.donorProfile.deleteMany();
  await prisma.hospitalProfile.deleteMany();
  await prisma.user.deleteMany();

  const salt = await bcrypt.genSalt(10);
  const defaultPasswordHash = await bcrypt.hash('Password123!', salt);

  // 1. Admin User
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@demo.bloodbridge.org',
      passwordHash: defaultPasswordHash,
      fullName: 'Sarah Jenkins (Chief Coordinator)',
      phone: '+1-555-0199',
      role: 'ADMIN',
      status: 'ACTIVE',
    },
  });

  // 2. Hospitals
  const hospitalUser1 = await prisma.user.create({
    data: {
      email: 'hospital@demo.bloodbridge.org',
      passwordHash: defaultPasswordHash,
      fullName: 'Dr. Michael Rivera',
      phone: '+1-555-0120',
      role: 'HOSPITAL',
      status: 'ACTIVE',
    },
  });

  const hospitalProfile1 = await prisma.hospitalProfile.create({
    data: {
      userId: hospitalUser1.id,
      hospitalName: 'Metro General Hospital & Trauma Center',
      licenseNumber: 'LIC-METRO-98214',
      address: '742 Healthcare Expressway, Central District',
      latitude: 28.6139,
      longitude: 77.2090,
      contactNumber: '+1-555-0120',
      isVerified: true,
      totalVerifiedRequests: 48,
    },
  });

  const hospitalUser2 = await prisma.user.create({
    data: {
      email: 'stjudes@demo.bloodbridge.org',
      passwordHash: defaultPasswordHash,
      fullName: 'Dr. Anita Desai',
      phone: '+1-555-0130',
      role: 'HOSPITAL',
      status: 'ACTIVE',
    },
  });

  const hospitalProfile2 = await prisma.hospitalProfile.create({
    data: {
      userId: hospitalUser2.id,
      hospitalName: 'St. Jude Children & Research Hospital',
      licenseNumber: 'LIC-STJUDE-45120',
      address: '108 Memorial Avenue, North Campus',
      latitude: 28.6280,
      longitude: 77.2180,
      contactNumber: '+1-555-0130',
      isVerified: true,
      totalVerifiedRequests: 32,
    },
  });

  // 3. Requesters
  const requesterUser1 = await prisma.user.create({
    data: {
      email: 'requester@demo.bloodbridge.org',
      passwordHash: defaultPasswordHash,
      fullName: 'David Chen',
      phone: '+1-555-0144',
      role: 'REQUESTER',
      status: 'ACTIVE',
    },
  });

  const requesterUser2 = await prisma.user.create({
    data: {
      email: 'emily.r@demo.bloodbridge.org',
      passwordHash: defaultPasswordHash,
      fullName: 'Emily Rodriguez',
      phone: '+1-555-0155',
      role: 'REQUESTER',
      status: 'ACTIVE',
    },
  });

  // 4. Donors
  const donorData = [
    {
      email: 'donor1@demo.bloodbridge.org',
      fullName: 'Marcus Vance',
      bloodGroup: 'O-', // Universal donor
      availabilityStatus: 'AVAILABLE',
      addressCity: 'Central Metro (Downtown)',
      lat: 28.6180,
      lon: 77.2120, // ~1.8 km from hospital 1
      totalDonations: 8,
      reliabilityScore: 98.5,
    },
    {
      email: 'donor2@demo.bloodbridge.org',
      fullName: 'Sophia Patel',
      bloodGroup: 'A+',
      availabilityStatus: 'AVAILABLE',
      addressCity: 'West Riverfront',
      lat: 28.6300,
      lon: 77.2250, // ~2.8 km
      totalDonations: 5,
      reliabilityScore: 95.0,
    },
    {
      email: 'donor3@demo.bloodbridge.org',
      fullName: 'Liam O\'Connor',
      bloodGroup: 'B+',
      availabilityStatus: 'AVAILABLE',
      addressCity: 'South Square',
      lat: 28.5980,
      lon: 77.1950, // ~3.5 km
      totalDonations: 12,
      reliabilityScore: 99.0,
    },
    {
      email: 'donor4@demo.bloodbridge.org',
      fullName: 'Aisha Al-Mansoor',
      bloodGroup: 'O+',
      availabilityStatus: 'AVAILABLE_LATER',
      addressCity: 'Tech Corridor East',
      lat: 28.6450,
      lon: 77.2400, // ~5.1 km
      totalDonations: 4,
      reliabilityScore: 92.0,
    },
    {
      email: 'donor5@demo.bloodbridge.org',
      fullName: 'Elena Rostova',
      bloodGroup: 'A-',
      availabilityStatus: 'AVAILABLE',
      addressCity: 'North Hills',
      lat: 28.6500,
      lon: 77.1900, // ~4.6 km
      totalDonations: 6,
      reliabilityScore: 96.0,
    },
    {
      email: 'donor6@demo.bloodbridge.org',
      fullName: 'Kevin Washington',
      bloodGroup: 'AB+',
      availabilityStatus: 'AVAILABLE',
      addressCity: 'Harbor Gate',
      lat: 28.5800,
      lon: 77.2500, // ~7.8 km
      totalDonations: 3,
      reliabilityScore: 88.0,
    },
  ];

  const createdDonors = [];
  for (const d of donorData) {
    const u = await prisma.user.create({
      data: {
        email: d.email,
        passwordHash: defaultPasswordHash,
        fullName: d.fullName,
        phone: '+1-555-0188',
        role: 'DONOR',
        status: 'ACTIVE',
      },
    });

    const dp = await prisma.donorProfile.create({
      data: {
        userId: u.id,
        bloodGroup: d.bloodGroup,
        availabilityStatus: d.availabilityStatus,
        addressCity: d.addressCity,
        latitude: d.lat,
        longitude: d.lon,
        totalDonations: d.totalDonations,
        reliabilityScore: d.reliabilityScore,
        lastDonationDate: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000), // 45 days ago
      },
    });

    createdDonors.push({ user: u, profile: dp });
  }

  // 5. Sample Requests
  // Request 1: Pending Hospital Verification
  const req1 = await prisma.bloodRequest.create({
    data: {
      id: 'BB-2026-000101',
      requesterId: requesterUser1.id,
      hospitalId: hospitalProfile1.id,
      patientInitials: 'M.K.',
      bloodGroup: 'A+',
      unitsRequired: 2,
      urgency: 'CRITICAL',
      status: 'PENDING_VERIFICATION',
      requiredBy: new Date(Date.now() + 4 * 60 * 60 * 1000), // in 4 hours
      notes: 'Emergency thoracic surgery scheduled at 4 PM. Urgent blood units required.',
      latitude: hospitalProfile1.latitude,
      longitude: hospitalProfile1.longitude,
      currentEscalationStage: 1,
    },
  });

  await prisma.requestStatusHistory.create({
    data: {
      requestId: req1.id,
      fromStatus: 'INITIAL_DRAFT',
      toStatus: 'PENDING_VERIFICATION',
      changedByUserId: requesterUser1.id,
      reason: 'Emergency request submitted by family attendant.',
    },
  });

  // Request 2: Hospital Verified & Matching in progress (Donors Notified!)
  const req2 = await prisma.bloodRequest.create({
    data: {
      id: 'BB-2026-000102',
      requesterId: requesterUser2.id,
      hospitalId: hospitalProfile1.id,
      patientInitials: 'R.S.',
      bloodGroup: 'O-',
      unitsRequired: 1,
      urgency: 'URGENT',
      status: 'DONORS_NOTIFIED',
      requiredBy: new Date(Date.now() + 8 * 60 * 60 * 1000), // in 8 hours
      notes: 'Severe trauma admission in ICU Room 302.',
      latitude: hospitalProfile1.latitude,
      longitude: hospitalProfile1.longitude,
      currentEscalationStage: 1,
    },
  });

  // Add verification record for req2
  await prisma.verificationRecord.create({
    data: {
      requestId: req2.id,
      hospitalId: hospitalProfile1.id,
      verifiedByUserId: hospitalUser1.id,
      status: 'VERIFIED',
      reviewNotes: 'Patient admission confirmed in ICU 302. Genuine emergency verified.',
    },
  });

  await prisma.requestStatusHistory.create({
    data: {
      requestId: req2.id,
      fromStatus: 'PENDING_VERIFICATION',
      toStatus: 'HOSPITAL_VERIFIED',
      changedByUserId: hospitalUser1.id,
      reason: 'Hospital chief resident verified emergency.',
    },
  });

  // Match donor 1 (Marcus Vance - O-) with req2
  const donor1Profile = createdDonors[0].profile;
  await prisma.donorMatch.create({
    data: {
      requestId: req2.id,
      donorId: donor1Profile.id,
      matchScore: 98.0,
      distanceKm: 1.8,
      status: 'NOTIFIED',
      notifiedAt: new Date(),
    },
  });

  // Request 3: Completed Request
  const req3 = await prisma.bloodRequest.create({
    data: {
      id: 'BB-2026-000098',
      requesterId: requesterUser1.id,
      hospitalId: hospitalProfile2.id,
      patientInitials: 'J.T.',
      bloodGroup: 'B+',
      unitsRequired: 2,
      urgency: 'NORMAL',
      status: 'COMPLETED',
      requiredBy: new Date(Date.now() - 24 * 60 * 60 * 1000),
      notes: 'Scheduled orthopedic procedure.',
      latitude: hospitalProfile2.latitude,
      longitude: hospitalProfile2.longitude,
      currentEscalationStage: 1,
    },
  });

  const donor3Profile = createdDonors[2].profile;
  await prisma.donorMatch.create({
    data: {
      requestId: req3.id,
      donorId: donor3Profile.id,
      matchScore: 95.0,
      distanceKm: 3.2,
      status: 'ACCEPTED',
      notifiedAt: new Date(Date.now() - 28 * 60 * 60 * 1000),
      respondedAt: new Date(Date.now() - 27 * 60 * 60 * 1000),
      responseTimeSeconds: 180,
    },
  });

  await prisma.requestStatusHistory.create({
    data: {
      requestId: req3.id,
      fromStatus: 'DONOR_CONFIRMED',
      toStatus: 'COMPLETED',
      changedByUserId: hospitalUser2.id,
      reason: 'Blood units received and safely infused. Request closed.',
    },
  });

  // 6. Initial Notifications
  await prisma.notification.create({
    data: {
      userId: createdDonors[0].user.id,
      category: 'EMERGENCY_REQUEST',
      title: '🚨 Urgent Blood Request: O- Needed Nearby',
      message: 'Emergency request BB-2026-000102 at Metro General Hospital (1.8 km away). Can you donate?',
      linkUrl: `/donor/dashboard?request=${req2.id}`,
      isRead: false,
    },
  });

  await prisma.notification.create({
    data: {
      userId: hospitalUser1.id,
      category: 'EMERGENCY_REQUEST',
      title: '🏥 Action Required: Verify Emergency BB-2026-000101',
      message: 'A new emergency blood request for A+ (2 units) has been submitted for Patient M.K.',
      linkUrl: `/hospital/dashboard?request=${req1.id}`,
      isRead: false,
    },
  });

  // 7. Audit Logs
  await prisma.auditLog.create({
    data: {
      userId: adminUser.id,
      action: 'SYSTEM_INITIALIZATION',
      entityType: 'System',
      detailsJson: JSON.stringify({ environment: 'development', version: '1.0.0' }),
    },
  });

  console.log('✅ Database seeded successfully with realistic demo accounts:');
  console.log('   - Admin:      admin@demo.bloodbridge.org      (Password: Password123!)');
  console.log('   - Hospital:   hospital@demo.bloodbridge.org   (Password: Password123!)');
  console.log('   - Requester:  requester@demo.bloodbridge.org  (Password: Password123!)');
  console.log('   - Donor 1:    donor1@demo.bloodbridge.org     (Password: Password123! - Blood: O-)');
  console.log('   - Donor 2:    donor2@demo.bloodbridge.org     (Password: Password123! - Blood: A+)');
  console.log('========================================================================');
}

main()
  .catch((e) => {
    console.error('Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
