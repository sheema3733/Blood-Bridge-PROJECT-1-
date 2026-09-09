import { describe, it, expect, beforeEach } from 'vitest';
import {
  cancelBloodRequest,
  getCancellationDetails,
  isRequestCancellable,
  generateStandDownMessage,
  resetCancellationStore,
} from '../services/cancellationService';

describe('Request Cancellation & Stand-Down Workflow Service', () => {
  beforeEach(() => {
    resetCancellationStore();
  });

  it('should identify cancellable and non-cancellable statuses correctly', () => {
    expect(isRequestCancellable('PENDING')).toBe(true);
    expect(isRequestCancellable('MATCHING')).toBe(true);
    expect(isRequestCancellable('PARTIALLY_FULFILLED')).toBe(true);

    expect(isRequestCancellable('COMPLETED')).toBe(false);
    expect(isRequestCancellable('REJECTED')).toBe(false);
  });

  it('should successfully cancel an active request and persist cancellation record', () => {
    const result = cancelBloodRequest({
      requestId: 'req_cancel_1',
      currentStatus: 'MATCHING',
      cancelledByUserId: 'usr_coordinator',
      cancelledByRole: 'HOSPITAL',
      reason: 'FOUND_DONOR_EXTERNAL',
      notes: 'Patient family arranged directed donor.',
      activeDonorIds: ['donor_1', 'donor_2', 'donor_3'],
    });

    expect(result.success).toBe(true);
    expect(result.record).toBeDefined();
    expect(result.record?.notifiedDonorIds.length).toBe(3);

    const stored = getCancellationDetails('req_cancel_1');
    expect(stored?.reason).toBe('FOUND_DONOR_EXTERNAL');
    expect(stored?.notes).toContain('directed donor');
  });

  it('should reject cancellation of already completed requests', () => {
    const result = cancelBloodRequest({
      requestId: 'req_already_done',
      currentStatus: 'COMPLETED',
      cancelledByUserId: 'usr_coordinator',
      cancelledByRole: 'HOSPITAL',
      reason: 'ENTERED_IN_ERROR',
      activeDonorIds: [],
    });

    expect(result.success).toBe(false);
    expect(result.error).toContain('cannot be cancelled');
  });

  it('should generate appropriate stand-down messages based on cancellation reason', () => {
    const externalMsg = generateStandDownMessage('FOUND_DONOR_EXTERNAL');
    expect(externalMsg).toContain('matching donor has arrived on-site');

    const stockMsg = generateStandDownMessage('HOSPITAL_STOCK_FULFILLED');
    expect(stockMsg).toContain('hospital emergency reserves');

    const dischargedMsg = generateStandDownMessage('PATIENT_DISCHARGED');
    expect(dischargedMsg).toContain('condition has stabilized');
  });
});
