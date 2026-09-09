export const SOCKET_EVENTS = {
  // Connection
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  JOIN_ROOM: 'room:join',
  LEAVE_ROOM: 'room:leave',

  // Request Lifecycle
  REQUEST_CREATED: 'request:created',
  REQUEST_VERIFIED: 'request:verified',
  REQUEST_REJECTED: 'request:rejected',
  REQUEST_UPDATED: 'request:updated',
  REQUEST_COMPLETED: 'request:completed',
  BLOOD_RECEIVED: 'blood:received',

  // Matching & Donor Responses
  DONOR_MATCHED: 'donor:matched',
  DONOR_NOTIFIED: 'donor:notified',
  DONOR_ACCEPTED: 'donor:accepted',
  DONOR_DECLINED: 'donor:declined',

  // Escalation
  RADIUS_EXPANDED: 'matching:radius_expanded',
  REQUEST_ESCALATED: 'request:escalated',

  // Notifications
  NOTIFICATION_NEW: 'notification:new',
  
  // Platform / Metrics
  METRICS_UPDATED: 'platform:metrics_updated',
} as const;
