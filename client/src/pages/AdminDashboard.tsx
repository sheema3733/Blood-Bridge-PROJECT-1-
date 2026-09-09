import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useSocket } from '../contexts/SocketContext';
import { useNotifications } from '../contexts/NotificationContext';
import {
  ShieldAlert,
  Activity,
  Users,
  Building2,
  Heart,
  AlertTriangle,
  CheckCircle2,
  Lock,
  Unlock,
  FileText,
  RefreshCw,
  Search,
} from 'lucide-react';
import { PlatformMetrics, BloodGroup } from '@shared/types';

export const AdminDashboard: React.FC = () => {
  const { socket } = useSocket();
  const { showToast } = useNotifications();

  const [isLoading, setIsLoading] = useState(true);
  const [metrics, setMetrics] = useState<PlatformMetrics | null>(null);
  const [recentEmergencies, setRecentEmergencies] = useState<any[]>([]);
  const [duplicateQueue, setDuplicateQueue] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);

  const [activeTab, setActiveTab] = useState<'overview' | 'duplicates' | 'users' | 'audit'>('overview');
  const [userRoleFilter, setUserRoleFilter] = useState('');
  const [userSearch, setUserSearch] = useState('');

  const loadAdminData = async () => {
    setIsLoading(true);
    try {
      const [overviewRes, dupRes, usersRes, auditRes] = await Promise.all([
        api.getAdminOverview(),
        api.getDuplicateQueue(),
        api.getUsersList({ role: userRoleFilter, search: userSearch }),
        api.getAuditLogs({ limit: '20' }),
      ]);

      if (overviewRes.success) {
        setMetrics(overviewRes.metrics);
        setRecentEmergencies(overviewRes.recentEmergencies);
      }
      if (dupRes.success) {
        setDuplicateQueue(dupRes.flaggedRequests);
      }
      if (usersRes.success) {
        setUsers(usersRes.users);
      }
      if (auditRes.success) {
        setAuditLogs(auditRes.logs);
      }
    } catch (err: any) {
      console.error('Failed to load admin command center:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, [userRoleFilter]);

  // Real-time socket events for admin command center
  useEffect(() => {
    if (!socket) return;

    const handleRealtimeEvent = () => {
      loadAdminData();
    };

    socket.on('request:created', handleRealtimeEvent);
    socket.on('request:verified', handleRealtimeEvent);
    socket.on('donor:matched', handleRealtimeEvent);
    socket.on('donor:accepted', handleRealtimeEvent);
    socket.on('request:escalated', handleRealtimeEvent);
    socket.on('request:completed', handleRealtimeEvent);

    return () => {
      socket.off('request:created', handleRealtimeEvent);
      socket.off('request:verified', handleRealtimeEvent);
      socket.off('donor:matched', handleRealtimeEvent);
      socket.off('donor:accepted', handleRealtimeEvent);
      socket.off('request:escalated', handleRealtimeEvent);
      socket.off('request:completed', handleRealtimeEvent);
    };
  }, [socket]);

  const handleToggleUserStatus = async (userId: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    try {
      const res = await api.updateUserStatus(userId, nextStatus);
      if (res.success) {
        showToast('Status Updated', `User status updated to ${nextStatus}.`, 'info');
        loadAdminData();
      }
    } catch (err: any) {
      showToast('Error', err.message || 'Could not update user status.', 'error');
    }
  };

  if (isLoading && !metrics) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="flex items-center space-x-3 text-crimson-700 font-bold text-sm">
          <RefreshCw className="w-5 h-5 animate-spin" />
          <span>Connecting to Admin Command Center...</span>
        </div>
      </div>
    );
  }

  const bloodGroups: BloodGroup[] = ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Admin Title & Command Bar */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <ShieldAlert className="w-6 h-6 text-purple-600" />
            <h2 className="text-xl font-black text-slate-900">Platform Command Center</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Global emergency oversight, duplicate triage, user governance, and security audit logs.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center space-x-1 p-1 rounded-xl bg-slate-100 border border-slate-200 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-1.5 rounded-lg transition ${
              activeTab === 'overview' ? 'bg-white shadow text-slate-900' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('duplicates')}
            className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1 ${
              activeTab === 'duplicates' ? 'bg-white shadow text-slate-900' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>Duplicate Triage</span>
            {duplicateQueue.length > 0 && (
              <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-1.5 rounded-full">
                {duplicateQueue.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-3 py-1.5 rounded-lg transition ${
              activeTab === 'users' ? 'bg-white shadow text-slate-900' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Users ({users.length})
          </button>
          <button
            onClick={() => setActiveTab('audit')}
            className={`px-3 py-1.5 rounded-lg transition ${
              activeTab === 'audit' ? 'bg-white shadow text-slate-900' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Audit Trail
          </button>
        </div>
      </div>

      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-soft">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Active Cases</span>
              <span className="text-2xl font-black text-crimson-700 block mt-1">
                {metrics?.activeEmergencies || 0}
              </span>
            </div>
            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-soft">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Critical STAT</span>
              <span className="text-2xl font-black text-red-600 block mt-1">
                {metrics?.criticalEmergencies || 0}
              </span>
            </div>
            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-soft">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Available Donors</span>
              <span className="text-2xl font-black text-slate-900 block mt-1">
                {metrics?.availableDonors || 0}
              </span>
            </div>
            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-soft">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Hospitals</span>
              <span className="text-2xl font-black text-slate-900 block mt-1">
                {metrics?.registeredHospitals || 0}
              </span>
            </div>
            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-soft">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Match Success</span>
              <span className="text-2xl font-black text-emerald-600 block mt-1">
                {metrics?.matchSuccessRate || 92}%
              </span>
            </div>
            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-soft">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Avg Response</span>
              <span className="text-2xl font-black text-blue-600 block mt-1">
                {metrics?.averageMatchingTimeMinutes || 8.5}m
              </span>
            </div>
          </div>

          {/* Blood Group Distribution Chart */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-card">
            <h3 className="text-sm font-bold text-slate-900 mb-1">
              Live Emergency Demands by Blood Group
            </h3>
            <p className="text-xs text-slate-500 mb-6">Database aggregated emergency requests</p>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
              {bloodGroups.map((bg) => {
                const count = metrics?.requestsByBloodGroup ? metrics.requestsByBloodGroup[bg] || 0 : 0;
                return (
                  <div
                    key={bg}
                    className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 text-center"
                  >
                    <span className="text-sm font-black text-crimson-800 block">{bg}</span>
                    <span className="text-lg font-bold text-slate-900 block mt-1">{count}</span>
                    <span className="text-[10px] text-slate-400 uppercase">Requests</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Live Emergencies Table */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-card space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Active Live Emergencies Stream</h3>
            <div className="divide-y divide-slate-100 overflow-x-auto text-xs">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-[10px] font-bold uppercase text-slate-400 border-b border-slate-200">
                    <th className="pb-2">Request ID</th>
                    <th className="pb-2">Hospital</th>
                    <th className="pb-2">Group</th>
                    <th className="pb-2">Units</th>
                    <th className="pb-2">Urgency</th>
                    <th className="pb-2">Status</th>
                    <th className="pb-2">Contacted Donors</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recentEmergencies.map((req) => (
                    <tr key={req.id} className="hover:bg-slate-50">
                      <td className="py-3 font-bold text-slate-900">{req.id}</td>
                      <td className="py-3 text-slate-700">{req.hospital?.hospitalName}</td>
                      <td className="py-3 font-black text-crimson-700">{req.bloodGroup}</td>
                      <td className="py-3 text-slate-700">{req.unitsRequired}</td>
                      <td className="py-3">
                        <span className="px-2 py-0.5 rounded-full font-bold bg-red-100 text-red-800 text-[10px]">
                          {req.urgency}
                        </span>
                      </td>
                      <td className="py-3 font-semibold text-slate-800">
                        {req.status.replace(/_/g, ' ')}
                      </td>
                      <td className="py-3 text-slate-500">{req.matches?.length || 0} notified</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Duplicate Triage Tab */}
      {activeTab === 'duplicates' && (
        <div className="space-y-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Duplicate Request Review Queue ({duplicateQueue.length})
            </h3>
            <p className="text-xs text-slate-500">
              Submissions flagged with similarity scores &ge; 70% to protect hospital staff from alarm fatigue.
            </p>
          </div>

          {duplicateQueue.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-2xl border border-dashed border-slate-200 text-xs text-slate-400">
              <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
              No duplicate flags currently pending review.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {duplicateQueue.map((item) => (
                <div
                  key={item.id}
                  className="p-5 rounded-2xl bg-amber-50/50 border border-amber-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-slate-900 text-sm">{item.id}</span>
                      <span className="px-2 py-0.5 rounded-full font-bold bg-amber-200 text-amber-900 text-[10px]">
                        {item.duplicateSimilarityScore}% Similarity Match
                      </span>
                    </div>
                    <p className="text-slate-700">
                      Target: <strong>{item.bloodGroup}</strong> ({item.unitsRequired} Units) at{' '}
                      <strong>{item.hospital?.hospitalName}</strong>
                    </p>
                    <p className="text-slate-500 text-[11px]">
                      Requester: {item.requester?.fullName} ({item.requester?.phone})
                    </p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className="text-[11px] font-bold text-slate-500">
                      Status: {item.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <h3 className="text-base font-bold text-slate-900">Platform User Governance</h3>
            <div className="flex items-center space-x-2 text-xs">
              <select
                value={userRoleFilter}
                onChange={(e) => setUserRoleFilter(e.target.value)}
                className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white"
              >
                <option value="">All Roles</option>
                <option value="DONOR">Donors</option>
                <option value="REQUESTER">Requesters</option>
                <option value="HOSPITAL">Hospitals</option>
                <option value="ADMIN">Admins</option>
              </select>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-x-auto text-xs">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[10px] font-bold uppercase text-slate-400 border-b border-slate-100 bg-slate-50/50">
                  <th className="p-3">User</th>
                  <th className="p-3">Role</th>
                  <th className="p-3">Specific Details</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50">
                    <td className="p-3">
                      <span className="font-bold text-slate-900 block">{u.fullName}</span>
                      <span className="text-[11px] text-slate-500">{u.email}</span>
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded font-bold uppercase bg-slate-100 text-slate-700 text-[10px]">
                        {u.role}
                      </span>
                    </td>
                    <td className="p-3 text-slate-600">
                      {u.role === 'DONOR' && u.donorProfile && (
                        <span>
                          Blood: <strong>{u.donorProfile.bloodGroup}</strong> ({u.donorProfile.availabilityStatus})
                        </span>
                      )}
                      {u.role === 'HOSPITAL' && u.hospitalProfile && (
                        <span>{u.hospitalProfile.hospitalName}</span>
                      )}
                    </td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                          u.status === 'ACTIVE'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {u.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      {u.role !== 'ADMIN' && (
                        <button
                          onClick={() => handleToggleUserStatus(u.id, u.status)}
                          className={`p-1.5 rounded-lg border transition ${
                            u.status === 'ACTIVE'
                              ? 'text-red-600 border-red-200 hover:bg-red-50'
                              : 'text-emerald-600 border-emerald-200 hover:bg-emerald-50'
                          }`}
                          title={u.status === 'ACTIVE' ? 'Suspend Account' : 'Activate Account'}
                        >
                          {u.status === 'ACTIVE' ? (
                            <Lock className="w-3.5 h-3.5" />
                          ) : (
                            <Unlock className="w-3.5 h-3.5" />
                          )}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Audit Logs Tab */}
      {activeTab === 'audit' && (
        <div className="space-y-4">
          <h3 className="text-base font-bold text-slate-900">Security & Operational Audit Trail</h3>
          <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100 overflow-hidden text-xs font-mono">
            {auditLogs.map((log) => (
              <div key={log.id} className="p-3.5 flex items-center justify-between hover:bg-slate-50">
                <div>
                  <span className="font-bold text-purple-700">{log.action}</span>
                  <span className="text-slate-500 block text-[11px] font-sans mt-0.5">
                    Actor: {log.user?.fullName || 'System Event'} • Entity: {log.entityType} (
                    {log.entityId || 'N/A'})
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 font-sans">
                  {new Date(log.timestamp).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
