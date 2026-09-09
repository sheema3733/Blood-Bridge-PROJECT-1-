import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useNotifications } from '../contexts/NotificationContext';
import { UserRole, BloodGroup } from '@shared/types';
import { Mail, Lock, User, Phone, Droplets, Building2, Heart, ArrowRight } from 'lucide-react';

const BLOOD_GROUPS: BloodGroup[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export const RegisterPage: React.FC = () => {
  const { register } = useAuth();
  const { showToast } = useNotifications();
  const navigate = useNavigate();

  const [role, setRole] = useState<UserRole>('DONOR');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');

  // Role specifics
  const [bloodGroup, setBloodGroup] = useState<BloodGroup>('O+');
  const [addressCity, setAddressCity] = useState('');
  const [hospitalName, setHospitalName] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await register({
        role,
        fullName: fullName.trim(),
        email: email.trim(),
        password,
        phone: phone.trim() || undefined,
        bloodGroup: role === 'DONOR' ? bloodGroup : undefined,
        addressCity: role === 'DONOR' ? addressCity.trim() || 'Central City' : undefined,
        hospitalName: role === 'HOSPITAL' ? hospitalName.trim() : undefined,
        licenseNumber: role === 'HOSPITAL' ? licenseNumber.trim() : undefined,
      });

      showToast('Account Created', 'Registration successful. Welcome to BloodBridge!', 'success');
      if (role === 'DONOR') navigate('/donor/dashboard');
      else if (role === 'REQUESTER') navigate('/requester/dashboard');
      else if (role === 'HOSPITAL') navigate('/hospital/dashboard');
      else navigate('/admin/dashboard');
    } catch (err: any) {
      showToast('Registration Error', err.message || 'Could not register account.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full space-y-6 bg-white p-8 rounded-2xl shadow-card border border-slate-200">
        <div className="text-center">
          <Link to="/" className="inline-flex items-center space-x-2 mb-2">
            <img src="/logo.svg" alt="BloodBridge" className="w-8 h-8" />
            <span className="font-black text-xl text-slate-900 tracking-tight">
              Blood<span className="text-crimson-700">Bridge</span>
            </span>
          </Link>
          <h2 className="text-xl font-bold text-slate-900">Create Your Platform Account</h2>
          <p className="text-xs text-slate-500 mt-1">
            Choose your coordination role to access the relevant workflow tools.
          </p>
        </div>

        {/* Role Selector Tabs */}
        <div className="grid grid-cols-4 gap-1.5 p-1 bg-slate-100 rounded-xl text-xs font-bold text-slate-700">
          <button
            type="button"
            onClick={() => setRole('DONOR')}
            className={`py-2 rounded-lg transition ${
              role === 'DONOR' ? 'bg-white shadow text-crimson-700' : 'hover:bg-slate-200/60'
            }`}
          >
            Donor
          </button>
          <button
            type="button"
            onClick={() => setRole('REQUESTER')}
            className={`py-2 rounded-lg transition ${
              role === 'REQUESTER' ? 'bg-white shadow text-crimson-700' : 'hover:bg-slate-200/60'
            }`}
          >
            Requester
          </button>
          <button
            type="button"
            onClick={() => setRole('HOSPITAL')}
            className={`py-2 rounded-lg transition ${
              role === 'HOSPITAL' ? 'bg-white shadow text-crimson-700' : 'hover:bg-slate-200/60'
            }`}
          >
            Hospital
          </button>
          <button
            type="button"
            onClick={() => setRole('ADMIN')}
            className={`py-2 rounded-lg transition ${
              role === 'ADMIN' ? 'bg-white shadow text-crimson-700' : 'hover:bg-slate-200/60'
            }`}
          >
            Admin
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              {role === 'HOSPITAL' ? 'Coordinator Full Name *' : 'Full Name *'}
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Sarah Jenkins"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-crimson-600 text-slate-900"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Email Address *</label>
              <input
                type="email"
                required
                placeholder="name@example.org"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-crimson-600 text-slate-900"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Phone Number</label>
              <input
                type="tel"
                placeholder="+1-555-0100"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-crimson-600 text-slate-900"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Password *</label>
            <input
              type="password"
              required
              minLength={6}
              placeholder="Minimum 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-crimson-600 text-slate-900"
            />
          </div>

          {/* Role specific inputs */}
          {role === 'DONOR' && (
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">
                  Your Blood Group *
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {BLOOD_GROUPS.map((bg) => (
                    <button
                      type="button"
                      key={bg}
                      onClick={() => setBloodGroup(bg)}
                      className={`py-1.5 px-2 rounded-lg font-bold border transition ${
                        bloodGroup === bg
                          ? 'bg-crimson-700 border-crimson-700 text-white'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {bg}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">City / Region</label>
                <input
                  type="text"
                  placeholder="e.g. Metro Area Downtown"
                  value={addressCity}
                  onChange={(e) => setAddressCity(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-crimson-600 text-slate-900"
                />
              </div>
            </div>
          )}

          {role === 'HOSPITAL' && (
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Hospital Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. City General Hospital & Trauma Center"
                  value={hospitalName}
                  onChange={(e) => setHospitalName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-crimson-600 text-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  License / Registration Number *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. LIC-HOSP-94812"
                  value={licenseNumber}
                  onChange={(e) => setLicenseNumber(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-crimson-600 text-slate-900"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2.5 rounded-xl bg-crimson-700 hover:bg-crimson-800 text-white font-bold text-xs shadow-md transition flex items-center justify-center space-x-2 disabled:opacity-50 mt-4"
          >
            <span>{isSubmitting ? 'Creating Account...' : 'Complete Registration'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center pt-2 border-t border-slate-100 text-xs text-slate-500">
          Already registered?{' '}
          <Link to="/login" className="font-bold text-crimson-700 hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};
