/**
 * BloodBridge Emergency Regional Broadcast Controller
 */

import { Request, Response } from 'express';
import {
  issueEmergencyBroadcast,
  getActiveBroadcasts,
  revokeEmergencyBroadcast,
  BroadcastLevel,
} from '../services/emergencyBroadcastService';

export function getActiveBroadcastsHandler(_req: Request, res: Response): void {
  try {
    const broadcasts = getActiveBroadcasts();
    res.json({
      success: true,
      data: broadcasts,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
}

export function issueBroadcastHandler(req: Request, res: Response): void {
  try {
    const authorAdminId = req.user?.id;
    const { level, title, incidentDescription, affectedRegion, targetBloodGroups, durationHours } = req.body;

    if (!authorAdminId || !level || !title || !incidentDescription || !affectedRegion) {
      res.status(400).json({
        success: false,
        error: 'Missing required broadcast fields (level, title, incidentDescription, affectedRegion)',
      });
      return;
    }

    const broadcast = issueEmergencyBroadcast({
      level: level as BroadcastLevel,
      title,
      incidentDescription,
      affectedRegion,
      targetBloodGroups: Array.isArray(targetBloodGroups) ? targetBloodGroups : [],
      authorAdminId,
      durationHours: durationHours ? Number(durationHours) : undefined,
    });

    res.status(201).json({
      success: true,
      data: broadcast,
      message: 'Regional emergency broadcast dispatched successfully',
    });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
}

export function revokeBroadcastHandler(req: Request, res: Response): void {
  try {
    const { id } = req.params;
    const ok = revokeEmergencyBroadcast(id);

    if (!ok) {
      res.status(404).json({ success: false, error: 'Broadcast not found' });
      return;
    }

    res.json({ success: true, message: 'Broadcast alert revoked successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
}
