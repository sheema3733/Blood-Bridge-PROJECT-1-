import { Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../prisma';
import { processHospitalVerification } from '../services/verificationService';
import { VerificationStatus } from '../../../shared/types';

export async function listHospitals(req: Request, res: Response) {
  try {
    const hospitals = await prisma.hospitalProfile.findMany({
      where: { isVerified: true },
      select: {
        id: true,
        hospitalName: true,
        licenseNumber: true,
        address: true,
        contactNumber: true,
        latitude: true,
        longitude: true,
        totalVerifiedRequests: true,
      },
      orderBy: { hospitalName: 'asc' },
    });

    return res.json({ success: true, hospitals });
  } catch (error) {
    console.error('listHospitals error:', error);
    return res.status(500).json({ success: false, message: 'Failed to retrieve hospitals.' });
  }
}

export async function getHospitalDashboard(req: Request, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required.' });
    }

    const hospital = await prisma.hospitalProfile.findUnique({
      where: { userId: req.user.id },
    });

    if (!hospital) {
      return res.status(404).json({ success: false, message: 'Hospital profile not found.' });
    }

    // Pending verifications queue
    const pendingVerification = await prisma.bloodRequest.findMany({
      where: {
        hospitalId: hospital.id,
        status: 'PENDING_VERIFICATION',
      },
      include: {
        requester: {
          select: {
            fullName: true,
            phone: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Active emergencies at this hospital
    const activeEmergencies = await prisma.bloodRequest.findMany({
      where: {
        hospitalId: hospital.id,
        status: {
          in: ['HOSPITAL_VERIFIED', 'MATCHING_IN_PROGRESS', 'DONORS_NOTIFIED', 'DONOR_CONFIRMED'],
        },
      },
      include: {
        requester: { select: { fullName: true, phone: true } },
        matches: {
          include: {
            donor: {
              include: { user: { select: { fullName: true, phone: true } } },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Completed requests
    const completedRequests = await prisma.bloodRequest.findMany({
      where: {
        hospitalId: hospital.id,
        status: 'COMPLETED',
      },
      take: 10,
      orderBy: { updatedAt: 'desc' },
    });

    return res.json({
      success: true,
      hospital,
      pendingVerification,
      activeEmergencies,
      completedRequests,
      metrics: {
        pendingCount: pendingVerification.length,
        activeCount: activeEmergencies.length,
        totalVerified: hospital.totalVerifiedRequests,
      },
    });
  } catch (error) {
    console.error('getHospitalDashboard error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch hospital dashboard.' });
  }
}

const verifySchema = z.object({
  status: z.enum(['VERIFIED', 'REJECTED', 'INFO_REQUESTED']),
  reviewNotes: z.string().optional(),
});

export async function verifyBloodRequest(req: Request, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required.' });
    }

    const { requestId } = req.params;
    const validated = verifySchema.parse(req.body);

    const hospital = await prisma.hospitalProfile.findUnique({
      where: { userId: req.user.id },
    });

    if (!hospital) {
      return res.status(403).json({ success: false, message: 'Only registered hospitals can verify requests.' });
    }

    const result = await processHospitalVerification({
      requestId,
      hospitalId: hospital.id,
      verifiedByUserId: req.user.id,
      status: validated.status as VerificationStatus,
      reviewNotes: validated.reviewNotes,
      ipAddress: req.ip,
    });

    return res.json({
      success: true,
      message: `Request verification updated to ${validated.status}.`,
      ...result,
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ success: false, message: error.errors[0]?.message || 'Validation error' });
    }
    console.error('verifyBloodRequest error:', error);
    return res.status(500).json({ success: false, message: 'Failed to process verification.' });
  }
}
