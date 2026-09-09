import React, { useState } from 'react';
import { CheckCircle2, AlertTriangle, HelpCircle, HeartPulse } from 'lucide-react';

export interface HealthScreeningQuizProps {
  onComplete?: (eligible: boolean) => void;
}

export const HealthScreeningQuiz: React.FC<HealthScreeningQuizProps> = ({ onComplete }) => {
  const [age, setAge] = useState<number>(25);
  const [weight, setWeight] = useState<number>(65);
  const [feelsHealthy, setFeelsHealthy] = useState<boolean>(true);
  const [hasFever, setHasFever] = useState<boolean>(false);
  const [takingAntibiotics, setTakingAntibiotics] = useState<boolean>(false);
  const [recentTattoo, setRecentTattoo] = useState<boolean>(false);
  const [recentSurgery, setRecentSurgery] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);

  const disqualifiers: string[] = [];
  if (age < 18 || age > 65) disqualifiers.push('Age must be between 18 and 65 years.');
  if (weight < 50) disqualifiers.push('Minimum weight for whole blood donation is 50 kg.');
  if (!feelsHealthy) disqualifiers.push('You must feel healthy and well on donation day.');
  if (hasFever) disqualifiers.push('Cannot donate with active fever or cold symptoms.');
  if (takingAntibiotics) disqualifiers.push('Must finish antibiotic course prior to donating.');
  if (recentTattoo) disqualifiers.push('Requires a 6-month deferral following tattoo or piercing.');
  if (recentSurgery) disqualifiers.push('Major surgery requires a 6-month post-operative recovery window.');

  const isEligible = disqualifiers.length === 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    if (onComplete) {
      onComplete(isEligible);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6 shadow-sm">
      <div className="flex items-center space-x-3">
        <div className="p-3 bg-red-100 text-red-600 rounded-xl">
          <HeartPulse className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-900">Pre-Donation Health Self-Screening</h3>
          <p className="text-xs text-slate-500">Quick 60-second medical safety check prior to donation center travel.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 text-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Your Age (Years)</label>
            <input
              type="number"
              min={15}
              max={99}
              value={age}
              onChange={(e) => setAge(Number(e.target.value))}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Your Weight (kg)</label>
            <input
              type="number"
              min={30}
              max={250}
              value={weight}
              onChange={(e) => setWeight(Number(e.target.value))}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500"
            />
          </div>
        </div>

        <div className="space-y-2 pt-2 border-t border-slate-100">
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={feelsHealthy}
              onChange={(e) => setFeelsHealthy(e.target.checked)}
              className="rounded text-red-600 focus:ring-red-500"
            />
            <span className="text-slate-700">I feel healthy, well, and symptom-free today</span>
          </label>

          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={hasFever}
              onChange={(e) => setHasFever(e.target.checked)}
              className="rounded text-red-600 focus:ring-red-500"
            />
            <span className="text-slate-700">I currently have fever, sore throat, or respiratory infection</span>
          </label>

          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={takingAntibiotics}
              onChange={(e) => setTakingAntibiotics(e.target.checked)}
              className="rounded text-red-600 focus:ring-red-500"
            />
            <span className="text-slate-700">I am currently taking antibiotic medication</span>
          </label>

          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={recentTattoo}
              onChange={(e) => setRecentTattoo(e.target.checked)}
              className="rounded text-red-600 focus:ring-red-500"
            />
            <span className="text-slate-700">I got a tattoo or piercing within the last 6 months</span>
          </label>

          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={recentSurgery}
              onChange={(e) => setRecentSurgery(e.target.checked)}
              className="rounded text-red-600 focus:ring-red-500"
            />
            <span className="text-slate-700">I had major surgical procedure within the last 6 months</span>
          </label>
        </div>

        <button
          type="submit"
          className="w-full py-2.5 px-4 text-sm font-bold text-white bg-red-600 rounded-xl hover:bg-red-700 transition shadow-md shadow-red-200"
        >
          Evaluate Clinical Eligibility
        </button>
      </form>

      {submitted && (
        <div
          className={`p-4 rounded-xl border ${
            isEligible ? 'bg-emerald-50 border-emerald-200' : 'bg-amber-50 border-amber-200'
          }`}
        >
          <div className="flex items-center space-x-2 font-bold text-base">
            {isEligible ? (
              <>
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span className="text-emerald-900">Pre-Screening Cleared: Eligible to Donate</span>
              </>
            ) : (
              <>
                <AlertTriangle className="w-5 h-5 text-amber-600" />
                <span className="text-amber-900">Temporary Medical Deferral Advised</span>
              </>
            )}
          </div>

          {!isEligible && (
            <ul className="mt-2 space-y-1 text-xs text-amber-800 list-disc list-inside">
              {disqualifiers.map((reason, idx) => (
                <li key={idx}>{reason}</li>
              ))}
            </ul>
          )}

          {isEligible && (
            <p className="mt-1 text-xs text-emerald-800">
              Please drink 500ml water and eat a healthy meal before arriving at the hospital!
            </p>
          )}
        </div>
      )}
    </div>
  );
};
