'use client';

interface Badge {
  badge_code: string;
  badge_name: string;
  category: string;
  is_on_chain: boolean;
  earned_at: string;
}

export default function BadgeDisplay({ badges }: { badges: Badge[] }) {
  return (
    <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-xl space-y-4">
      <h4 className="text-sm font-semibold text-emerald-400 uppercase tracking-wider">
        Earned Credentials & Honors
      </h4>

      {badges.length === 0 ? (
        <p className="text-xs text-slate-500 italic">No badges unlocked yet. Complete pre-launch registration to claim your Genesis Pioneer status.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {badges.map((badge) => (
            <div 
              key={badge.badge_code}
              className={`p-3 rounded-lg border flex items-center space-x-3 ${
                badge.badge_code === 'genesis_pioneer' 
                  ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300' 
                  : 'bg-slate-950 border-slate-800 text-slate-300'
              }`}
            >
              <div className="text-xl">
                {badge.badge_code === 'genesis_pioneer' ? '🔥' : '⭐'}
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-bold text-white truncate">{badge.badge_name}</p>
                <p className="text-[10px] text-slate-400 capitalize">{badge.category} Tier</p>
                {badge.is_on_chain && (
                  <span className="inline-block mt-1 text-[9px] bg-purple-950 text-purple-400 border border-purple-800/50 px-1.5 py-0.5 rounded">
                    On-Chain Verified
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}