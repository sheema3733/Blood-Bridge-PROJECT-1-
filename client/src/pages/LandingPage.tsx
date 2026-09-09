import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';
import {
  Heart,
  ShieldCheck,
  Zap,
  Activity,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Building2,
  Users,
  Radio,
  Clock,
  ChevronDown,
  Layers,
  HelpCircle,
} from 'lucide-react';
import { CLINICAL_DISCLAIMER } from '@shared/bloodRules';

export const LandingPage: React.FC = () => {
  const { isAuthenticated, user, switchDemoRole } = useAuth();
  const navigate = useNavigate();

  const [metrics, setMetrics] = useState({
    activeEmergencies: 2,
    availableDonors: 6,
    registeredHospitals: 2,
    matchSuccessRate: 94,
    averageMatchingTimeMinutes: 8.5,
  });

  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    // Attempt to load live metrics from backend
    api.getAdminOverview()
      .then((res) => {
        if (res.success && res.metrics) {
          setMetrics({
            activeEmergencies: res.metrics.activeEmergencies,
            availableDonors: res.metrics.availableDonors,
            registeredHospitals: res.metrics.registeredHospitals,
            matchSuccessRate: res.metrics.matchSuccessRate || 94,
            averageMatchingTimeMinutes: res.metrics.averageMatchingTimeMinutes || 8.5,
          });
        }
      })
      .catch(() => {
        // Fallback to initial realistic seed metrics
      });
  }, []);

  const handleQuickDemoRequester = async () => {
    await switchDemoRole('REQUESTER');
    navigate('/requester/dashboard');
  };

  const handleQuickDemoDonor = async () => {
    await switchDemoRole('DONOR');
    navigate('/donor/dashboard');
  };

  const faqs = [
    {
      q: 'Is BloodBridge a medical diagnosis or blood bank replacement?',
      a: 'No. BloodBridge is strictly an emergency coordination platform. It coordinates logistics and alerts nearby compatible donors. All pre-donation clinical assessments, serological testing, and cross-matching are conducted exclusively by accredited hospital and blood bank medical professionals.',
    },
    {
      q: 'How does Smart Donor Matching work?',
      a: 'Our coordination engine analyzes 4 key factors: ABO/Rh blood group compatibility, donor real-time availability status, Haversine geographic proximity to the hospital, and historical response reliability. The resulting score prioritizes high-probability matches.',
    },
    {
      q: 'What is Multi-Stage Radius Escalation?',
      a: 'If initial nearby donors are unavailable or in transit, the platform automatically expands the search radius in stages (3 km → 7 km → 15 km → Regional Volunteer Network → Platform Admin Incident) to ensure no request goes unanswered.',
    },
    {
      q: 'How does BloodBridge protect donor and patient privacy?',
      a: 'Patient phone numbers and full identities are never broadcasted publicly to unknown parties or chat channels. All coordination takes place within verified hospital facilities, with privacy-safe identifiers and controlled verification workflows.',
    },
    {
      q: 'How does duplicate request detection work?',
      a: 'When an emergency request is submitted, our algorithm checks active requests across the same hospital, blood group, requested volume, and time window. Potential duplicates are flagged for triage to prevent notification spam and alarm fatigue.',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-crimson-900 via-crimson-800 to-crimson-950 text-white py-2.5 px-4 text-center text-xs font-medium border-b border-crimson-950">
        <div className="max-w-7xl mx-auto flex items-center justify-center space-x-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-400"></span>
          </span>
          <span>
            BloodBridge Live Dispatch Network Active — End-to-End Real-Time Coordination
          </span>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 border-b border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-red-50 border border-red-200 text-crimson-700 text-xs font-bold uppercase tracking-wider mb-6">
              <Zap className="w-3.5 h-3.5 fill-crimson-700" />
              <span>Real-Time Emergency Blood Coordination Platform</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-tight sm:leading-none">
              Every Second <span className="text-crimson-700 underline decoration-red-200">Matters</span>.
            </h1>

            <p className="mt-6 text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
              Connect emergency blood requests with nearby available donors through a transparent,
              real-time coordination platform. Verified by hospitals, coordinated instantly, without
              social media chaos.
            </p>

            {/* CTAs */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={handleQuickDemoRequester}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-crimson-700 hover:bg-crimson-800 text-white font-bold text-sm shadow-md hover:shadow-lg transition flex items-center justify-center space-x-2"
              >
                <Heart className="w-4 h-4 fill-white" />
                <span>Request Blood (Demo)</span>
              </button>

              <button
                onClick={handleQuickDemoDonor}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-md hover:shadow-lg transition flex items-center justify-center space-x-2"
              >
                <Users className="w-4 h-4" />
                <span>Become a Donor (Demo)</span>
              </button>
            </div>

            {/* Fast login prompt */}
            <p className="mt-4 text-xs text-slate-400">
              Instant evaluation with pre-seeded synthetic data — zero registration required.
            </p>
          </div>

          {/* Live Network Statistics Dashboard Preview */}
          <div className="mt-14 max-w-5xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 sm:gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200 shadow-sm">
              <div className="p-3 bg-white rounded-xl border border-slate-100 text-center">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Active Emergencies</span>
                <span className="text-2xl font-black text-crimson-700">{metrics.activeEmergencies}</span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-slate-100 text-center">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Available Donors</span>
                <span className="text-2xl font-black text-slate-900">{metrics.availableDonors}</span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-slate-100 text-center">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Verified Hospitals</span>
                <span className="text-2xl font-black text-slate-900">{metrics.registeredHospitals}</span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-slate-100 text-center">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Match Success</span>
                <span className="text-2xl font-black text-emerald-600">{metrics.matchSuccessRate}%</span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-slate-100 text-center col-span-2 md:col-span-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Avg Response</span>
                <span className="text-2xl font-black text-blue-600">{metrics.averageMatchingTimeMinutes}m</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-xs font-bold text-crimson-700 uppercase tracking-wider">
              The BloodBridge Lifecycle
            </h2>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
              From Emergency Call to Confirmed Transfusion
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-2">
              Replacing scattered messaging threads with an orchestrated 4-step pipeline.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Step 1 */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-soft relative">
              <div className="w-10 h-10 rounded-xl bg-red-100 text-crimson-700 flex items-center justify-center font-bold text-sm mb-4">
                01
              </div>
              <h4 className="font-bold text-sm text-slate-900">1. Emergency Request</h4>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Family or patient attendants specify blood group, units, and hospital. Duplicate checks
                automatically flag potential double submissions.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-soft relative">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm mb-4">
                02
              </div>
              <h4 className="font-bold text-sm text-slate-900">2. Hospital Verification</h4>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Authorized hospital staff verify genuine patient admission in the emergency queue,
                preventing false alarms before matching fires.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-soft relative">
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-sm mb-4">
                03
              </div>
              <h4 className="font-bold text-sm text-slate-900">3. Smart Matching & Push</h4>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Algorithm computes compatibility, donor proximity, and reliability score. Compatible
                donors receive instant push notifications to Accept or Decline.
              </p>
            </div>

            {/* Step 4 */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-soft relative">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm mb-4">
                04
              </div>
              <h4 className="font-bold text-sm text-slate-900">4. Live Tracking & Receipt</h4>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Requesters follow the live 8-step status timeline in real time. Once donor arrives,
                hospital confirms blood receipt and completes the request safely.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Algorithmic Features Deep Dive */}
      <section className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-xs font-bold text-crimson-700 uppercase tracking-wider">
                Precision Coordination Engine
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2 leading-tight">
                Smart Matching & Dynamic Multi-Stage Escalation
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-4 leading-relaxed">
                BloodBridge eliminates uncertainty through transparent scoring and proactive
                automated escalation.
              </p>

              <div className="mt-6 space-y-4 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-bold text-slate-900">ABO / Rh Compatibility Matrix</h5>
                    <p className="text-slate-500 mt-0.5">
                      Validates strict antigen compatibility (e.g. O- universal donor, A- to A+/AB+,
                      universal AB+ recipient).
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start space-x-3">
                  <Activity className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-bold text-slate-900">Haversine Distance & Reliability</h5>
                    <p className="text-slate-500 mt-0.5">
                      Calculates exact road proximity and historical donor response speed to minimize
                      transit delays.
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start space-x-3">
                  <Layers className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-bold text-slate-900">5-Stage Smart Escalation</h5>
                    <p className="text-slate-500 mt-0.5">
                      Stage 1 (3 km) → Stage 2 (7 km) → Stage 3 (15 km) → Stage 4 (Volunteer & Blood
                      Bank Network) → Stage 5 (Platform Admin Incident).
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Visual Architecture Box */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-card border border-slate-700">
              <div className="flex items-center justify-between pb-4 border-b border-slate-700">
                <span className="text-xs font-mono text-emerald-400">● LIVE COORDINATION ARCHITECTURE</span>
                <span className="text-[10px] font-mono text-slate-400">WebSocket / Socket.IO</span>
              </div>

              <div className="mt-6 space-y-3 font-mono text-xs">
                <div className="p-3 rounded-lg bg-slate-800/80 border border-slate-700 text-slate-200">
                  <span className="text-red-400">EMERGENCY_REQUEST</span>: Blood A+ (2 Units) at Metro General
                </div>
                <div className="p-3 rounded-lg bg-slate-800/80 border border-slate-700 text-slate-200">
                  <span className="text-blue-400">HOSPITAL_VERIFIED</span>: Dr. Michael Rivera confirmed ICU necessity
                </div>
                <div className="p-3 rounded-lg bg-slate-800/80 border border-slate-700 text-slate-200">
                  <span className="text-emerald-400">SMART_MATCH</span>: 4 compatible donors alerted within 3.8 km
                </div>
                <div className="p-3 rounded-lg bg-slate-800/80 border border-slate-700 text-slate-200">
                  <span className="text-purple-400">DONOR_ACCEPTED</span>: Donor Marcus Vance en route to hospital
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-700 text-[11px] text-slate-400 flex items-center justify-between">
                <span>Synchronized across Requester, Donor, Hospital & Admin</span>
                <span className="text-emerald-400 font-bold">100% Zero-Latency</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-slate-50 border-b border-slate-200">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h3 className="text-2xl font-bold text-slate-900">Frequently Asked Questions</h3>
            <p className="text-xs text-slate-500 mt-1">Platform architecture and operation guidelines</p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={index}
                  className="rounded-xl border border-slate-200 bg-white overflow-hidden transition"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="w-full text-left p-4 flex items-center justify-between font-semibold text-xs text-slate-800 hover:bg-slate-50 transition"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 transition-transform ${
                        isOpen ? 'rotate-180 text-crimson-700' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="p-4 pt-0 text-xs text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/50">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Emergency Callout Banner */}
      <section className="py-12 bg-crimson-800 text-white text-center px-4">
        <div className="max-w-2xl mx-auto">
          <h3 className="text-2xl font-black">Facing a Blood Emergency Right Now?</h3>
          <p className="text-xs text-red-100 mt-2 leading-relaxed">
            Submit a request and our real-time network routes it immediately to the hospital
            verification queue.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <button
              onClick={handleQuickDemoRequester}
              className="px-6 py-3 rounded-xl bg-white text-crimson-800 font-bold text-xs shadow hover:bg-red-50 transition"
            >
              Start Emergency Request
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
