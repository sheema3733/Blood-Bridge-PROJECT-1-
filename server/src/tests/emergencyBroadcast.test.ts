import { describe, it, expect, beforeEach } from 'vitest';
import {
  issueEmergencyBroadcast,
  getActiveBroadcasts,
  revokeEmergencyBroadcast,
  recordBroadcastAudience,
  resetBroadcastStore,
} from '../services/emergencyBroadcastService';

describe('Regional Emergency Broadcast Dispatcher Service', () => {
  beforeEach(() => {
    resetBroadcastStore();
  });

  it('should issue a new emergency broadcast and dispatch through configured channels', () => {
    const broadcast = issueEmergencyBroadcast({
      level: 'LEVEL_2_METRO_ALERT',
      title: 'Citywide Trauma Emergency',
      incidentDescription: 'Transit accident requiring immediate emergency blood reserves.',
      affectedRegion: 'North Metro District',
      targetBloodGroups: ['O-', 'A-'],
      authorAdminId: 'admin_sys',
      durationHours: 12,
    });

    expect(broadcast.id).toBeDefined();
    expect(broadcast.isActive).toBe(true);
    expect(broadcast.channelsDispatched).toContain('PUSH');
    expect(broadcast.channelsDispatched).toContain('SMS');
    expect(broadcast.channelsDispatched).toContain('IN_APP_BANNER');
  });

  it('should include partner hospitals and public API channels for regional disasters', () => {
    const disaster = issueEmergencyBroadcast({
      level: 'LEVEL_3_REGIONAL_DISASTER',
      title: 'Earthquake Regional Catastrophe',
      incidentDescription: 'State-level multi-hospital mass-casualty disaster response.',
      affectedRegion: 'Western Zone',
      targetBloodGroups: ['ALL'],
      authorAdminId: 'admin_director',
    });

    expect(disaster.channelsDispatched).toContain('PARTNER_HOSPITALS');
    expect(disaster.channelsDispatched).toContain('PUBLIC_API');
  });

  it('should track audience reached and allow revocation by administrators', () => {
    const b = issueEmergencyBroadcast({
      level: 'LEVEL_1_FACILITY_URGENT',
      title: 'General Hospital Deficit',
      incidentDescription: 'Shortage of B- units.',
      affectedRegion: 'District 4',
      targetBloodGroups: ['B-'],
      authorAdminId: 'admin_1',
    });

    recordBroadcastAudience(b.id, 142);
    const active = getActiveBroadcasts();
    expect(active[0].totalDonorsAlerted).toBe(142);

    const revoked = revokeEmergencyBroadcast(b.id);
    expect(revoked).toBe(true);

    const postRevoke = getActiveBroadcasts();
    expect(postRevoke.length).toBe(0);
  });
});
