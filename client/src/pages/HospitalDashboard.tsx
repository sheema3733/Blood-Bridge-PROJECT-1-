import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { useSocket } from '../contexts/SocketContext';
import { useNotifications } from '../contexts/NotificationContext';
import { VerifyRequestModal } from '../components/modals/VerifyRequestModal';
import {
  Building2,
  ShieldCheck,
  CheckCircle2,
  Clock,
  UserCheck,
  AlertTriangle,
  PackageCheck,
  RefreshCw,
  FileCheck,
} from 'lucide-react';

export const HospitalDashboard: React.FC = () => {
  const { user } = useAuth();
  const { socket } = useSocket();
  const { showToast } = useNotifications();

  const [isLoading, setIsLoading] = useState(true);
  const [hospital, setHospital] = useState<any | null>(null);
  const [pendingVerification, setPendingVerification] = useState<any[]>([]);
  const [activeEmergencies, setActiveEmergencies] = useState<any[]>([]);
  const [completedRequests, setCompletedRequests] = useState<any[]>([]);
  const [metrics, setMetrics] = useState<any | null>(null);

  const [selectedRequest, setSelectedRequest] = useState<any | null>(null);
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);

  const loadHospitalData = async () => {
    setIsLoading(true);
    try {
      const res = await api.getHospitalDashboard();
      if (res.success) {
        setHospital(res.hospital);
        setPendingVerification(res.pendingVerification);
        setActiveEmergencies(res.activeEmergencies);
        setCompletedRequests(res.completedRequests);
        setMetrics(res.metrics);
      }
    } catch (err: any) {
      console.error('Failed to load hospital dashboard:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadHospitalData();
  }, []);

  // Real-time socket updates for hospital queue
  useEffect(() => {
    if (!socket) return;

    const handleNewRequest = (data: any) => {
      showToast(
        '🏥 New Request for Verification',
        `Blood request ${data.id} (${data.bloodGroup}) arrived in verification queue.`,
        'error'
      );
      loadHospitalData();
    };

    const handleDonorAccepted = (data: any) => {
      showToast(
        'Donor En Route to Hospital',
        `Donor accepted request ${data.requestId}. Prepare for triage upon arrival.`,
        'success'
      );
      loadHospitalData();
    };

    socket.on('request:created', handleNewRequest);
    socket.on('donor:accepted', handleDonorAccepted);
    socket.on('blood:received', loadHospitalData);
    socket.on('request:completed', loadHospitalData);

    return () => {
      socket.off('request:created', handleNewRequest);
      socket.off('donor:accepted', handleDonorAccepted);
      socket.off('blood:received', loadHospitalData);
      socket.off('request:completed', loadHospitalData);
    };
  }, [socket, showToast]);

  const handleConfirmBlood = async (requestId: string) => {
    try {
      const res = await api.markBloodReceived(requestId, 'Hospital verified safe blood receipt.');
      if (res.success) {
        showToast('Success', 'Blood receipt confirmed and request completed.', 'success');
        loadHospitalData();
      }
    } catch (err: any) {
      showToast('Error', err.message || 'Could not complete receipt.', 'error');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="flex items-center space-x-3 text-crimson-700 font-bold text-sm">
          <RefreshCw className="w-5 h-5 animate-spin" />
          <span>Loading hospital verification command center...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Hospital Identity Card */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-card flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700 flex-shrink-0">
            <Building2 className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-black text-slate-900">{hospital?.hospitalName}</h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                <span>Verified Facility</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {hospital?.address} • License: <strong>{hospital?.licenseNumber}</strong>
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-4 text-center">
          <div className="px-4 py-2 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Pending Queue</span>
            <span className="text-xl font-black text-crimson-700">{metrics?.pendingCount || 0}</span>
          </div>
          <div className="px-4 py-2 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Active Admissions</span>
            <span className="text-xl font-black text-blue-600">{metrics?.activeCount || 0}</span>
          </div>
          <div className="px-4 py-2 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Verified</span>
            <span className="text-xl font-black text-emerald-600">{metrics?.totalVerified || 0}</span>
          </div>
        </div>
      </div>

      {/* Verification Queue Section */}
      <div className="space-y-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <span>🛡️ Pending Hospital Verification Queue</span>
            {pendingVerification.length > 0 && (
              <span className="text-xs bg-red-100 text-crimson-700 font-bold px-2 py-0.5 rounded-full">
                {pendingVerification.length} Action Needed
              </span>
            )}
          </h3>
          <p className="text-xs text-slate-500">
            Requests require hospital clinical confirmation before donor matching begins.
          </p>
        </div>

        {pendingVerification.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-2xl border border-dashed border-slate-200">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
            <h4 className="font-bold text-sm text-slate-800">Verification Queue Clear</h4>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              All incoming emergency blood requests have been reviewed and processed.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pendingVerification.map((req) => (
              <div
                key={req.id}
                className="p-5 rounded-2xl bg-white border-2 border-red-200 shadow-card flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-sm">{req.id}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-600 text-white uppercase animate-pulse">
                      {req.urgency}
                    </span>
                  </div>

                  <div className="flex items-center space-x-3">
                    <span className="text-xl font-black text-crimson-800 bg-red-50 px-2.5 py-1 rounded-lg border border-red-100">
                      {req.bloodGroup}
                    </span>
                    <div>
                      <span className="font-bold text-slate-900 text-xs block">
                        {req.unitsRequired} {req.unitsRequired === 1 ? 'Unit' : 'Units'} Required
                      </span>
                      <span className="text-[11px] text-slate-500">
                        Patient Initials: <strong>{req.patientInitials}</strong>
                      </span>
                    </div>
                  </div>

                  {req.notes && (
                    <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl italic">
                      "{req.notes}"
                    </p>
                  )}

                  {req.isDuplicateFlagged && (
                    <div className="p-2 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-[11px] font-semibold flex items-center space-x-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
                      <span>Potential duplicate request detected ({req.duplicateSimilarityScore}% match). Please review carefully.</span>
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400">
                    Awaiting Hospital Review
                  </span>
                  <button
                    onClick={() => {
                      setSelectedRequest(req);
                      setIsVerifyModalOpen(true);
                    }}
                    className="px-4 py-2 rounded-xl bg-crimson-700 hover:bg-crimson-800 text-white font-bold text-xs shadow-sm transition"
                  >
                    Review & Verify
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Active Emergencies Monitoring */}
      <div className="space-y-4">
        <div>
          <h3 className="text-base font-bold text-slate-900">Active Hospital Blood Coordination</h3>
          <p className="text-xs text-slate-500">
            Verified requests currently matching or with confirmed donors en route.
          </p>
        </div>

        {activeEmergencies.length === 0 ? (
          <div className="p-6 text-center bg-white rounded-xl border border-slate-200 text-xs text-slate-400">
            No active coordination cases at this facility.
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100 overflow-hidden text-xs">
            {activeEmergencies.map((req) => (
              <div
                key={req.id}
                className="p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-slate-900 text-sm">{req.id}</span>
                    <span className="px-2 py-0.5 rounded-full font-bold bg-blue-100 text-blue-800 text-[10px] uppercase">
                      {req.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <p className="text-slate-600">
                    Patient <strong>{req.patientInitials}</strong> • {req.bloodGroup} (
                    {req.unitsRequired} Units) • Requester: {req.requester?.fullName}
                  </p>
                  <p className="text-[11px] text-slate-400">
                    {req.matches?.length || 0} Donors Contacted
                  </p>
                </div>

                <div className="flex items-center space-x-3 self-end md:self-auto">
                  <button
                    onClick={() => handleConfirmBlood(req.id)}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition flex items-center space-x-1.5"
                  >
                    <PackageCheck className="w-4 h-4" />
                    <span>Confirm Blood Infused</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Completed Archive */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-slate-900">Completed Emergency Archives</h3>
        <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100 overflow-hidden text-xs">
          {completedRequests.map((req) => (
            <div key={req.id} className="p-4 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-900">{req.id}</span>
                <span className="text-slate-500 block text-[11px]">
                  {req.bloodGroup} ({req.unitsRequired} Units) • Patient {req.patientInitials}
                </span>
              </div>
              <span className="font-bold text-emerald-600 text-xs">Successfully Completed</span>
            </div>
          ))}
        </div>
      </div>

      {/* Verify Request Modal */}
      <VerifyRequestModal
        isOpen={isVerifyModalOpen}
        request={selectedRequest}
        onClose={() => {
          setIsVerifyModalOpen(false);
          setSelectedRequest(null);
        }}
        onVerified={loadHospitalData}
      />
    </div>
  );
};
