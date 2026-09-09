import React from 'react';
import { Award, Shield, Star, Droplet, Crown, Heart, Moon, Zap } from 'lucide-react';

export interface BadgeItem {
  badgeId: string;
  title: string;
  tier: 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM';
  awardedAt?: string;
  pointsAwarded?: number;
  description?: string;
}

const TIER_STYLES: Record<string, { bg: string; border: string; text: string; glow: string }> = {
  BRONZE: {
    bg: 'bg-amber-50',
    border: 'border-amber-300',
    text: 'text-amber-800',
    glow: 'shadow-amber-100',
  },
  SILVER: {
    bg: 'bg-slate-50',
    border: 'border-slate-300',
    text: 'text-slate-800',
    glow: 'shadow-slate-100',
  },
  GOLD: {
    bg: 'bg-yellow-50',
    border: 'border-yellow-400',
    text: 'text-yellow-800',
    glow: 'shadow-yellow-100',
  },
  PLATINUM: {
    bg: 'bg-purple-50',
    border: 'border-purple-300',
    text: 'text-purple-900',
    glow: 'shadow-purple-100',
  },
};

function getBadgeIcon(badgeId: string) {
  switch (badgeId) {
    case 'FIRST_DROP':
      return <Droplet className="w-5 h-5 text-red-500" />;
    case 'LIFE_GUARDIAN_BRONZE':
      return <Shield className="w-5 h-5 text-amber-700" />;
    case 'LIFE_GUARDIAN_SILVER':
      return <Shield className="w-5 h-5 text-slate-500" />;
    case 'LIFE_GUARDIAN_GOLD':
      return <Star className="w-5 h-5 text-yellow-500" />;
    case 'CENTURION_HERO':
      return <Crown className="w-5 h-5 text-purple-600" />;
    case 'RARE_BLOOD_DEFENDER':
      return <Heart className="w-5 h-5 text-rose-500" />;
    case 'MIDNIGHT_SAVIOR':
      return <Moon className="w-5 h-5 text-indigo-500" />;
    case 'LIGHTNING_RESPONDER':
      return <Zap className="w-5 h-5 text-amber-500" />;
    default:
      return <Award className="w-5 h-5 text-primary-500" />;
  }
}

export const BadgeDisplay: React.FC<{ badge: BadgeItem }> = ({ badge }) => {
  const styles = TIER_STYLES[badge.tier] || TIER_STYLES.BRONZE;

  return (
    <div
      className={`inline-flex items-center space-x-3 px-3.5 py-2.5 rounded-xl border ${styles.bg} ${styles.border} shadow-sm transition hover:shadow-md`}
    >
      <div className="p-2 bg-white rounded-lg shadow-inner">{getBadgeIcon(badge.badgeId)}</div>
      <div>
        <div className="flex items-center space-x-2">
          <span className={`text-sm font-bold ${styles.text}`}>{badge.title}</span>
          <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-white/80 border border-black/5">
            {badge.tier}
          </span>
        </div>
        {badge.description && (
          <p className="text-xs text-slate-500 mt-0.5 max-w-[200px] truncate">
            {badge.description}
          </p>
        )}
        {badge.pointsAwarded && (
          <span className="text-[11px] font-semibold text-emerald-600">
            +{badge.pointsAwarded} pts
          </span>
        )}
      </div>
    </div>
  );
};
