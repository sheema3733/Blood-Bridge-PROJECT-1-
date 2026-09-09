import React, { useState } from 'react';
import { Star, Heart, X } from 'lucide-react';

export interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  requestId: string;
  donorName: string;
  onSubmit: (data: {
    ratingStars: number;
    punctualityScore: number;
    gratitudeMessage: string;
    anonymous: boolean;
  }) => Promise<void>;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({
  isOpen,
  onClose,
  donorName,
  onSubmit,
}) => {
  const [stars, setStars] = useState<number>(5);
  const [punctuality, setPunctuality] = useState<number>(5);
  const [message, setMessage] = useState<string>('');
  const [anonymous, setAnonymous] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit({
        ratingStars: stars,
        punctualityScore: punctuality,
        gratitudeMessage: message,
        anonymous,
      });
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 space-y-5 border border-slate-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-rose-100 text-rose-600 rounded-xl">
              <Heart className="w-5 h-5 fill-rose-600" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Thank Your Donor</h3>
              <p className="text-xs text-slate-500">Express gratitude to {donorName}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-sm">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Overall Experience Rating
            </label>
            <div className="flex items-center space-x-2">
              {[1, 2, 3, 4, 5].map((idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setStars(idx)}
                  className="p-1 text-slate-300 hover:scale-110 transition"
                >
                  <Star
                    className={`w-7 h-7 ${
                      idx <= stars ? 'text-amber-400 fill-amber-400' : 'text-slate-200'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Punctuality & Arrival Speed ({punctuality}/5)
            </label>
            <input
              type="range"
              min={1}
              max={5}
              value={punctuality}
              onChange={(e) => setPunctuality(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-red-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Gratitude Message / Note
            </label>
            <textarea
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="e.g. Thank you so much for arriving on time and saving my family member's life!"
              className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-red-500 text-xs"
            />
          </div>

          <label className="flex items-center space-x-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={anonymous}
              onChange={(e) => setAnonymous(e.target.checked)}
              className="rounded text-red-600 focus:ring-red-500 w-4 h-4"
            />
            <span className="text-xs text-slate-600">Submit testimonial anonymously</span>
          </label>

          <div className="flex items-center justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-xs font-bold text-white bg-red-600 rounded-xl hover:bg-red-700 transition shadow-md shadow-red-200 disabled:opacity-50"
            >
              {isSubmitting ? 'Submitting...' : 'Send Appreciation'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
