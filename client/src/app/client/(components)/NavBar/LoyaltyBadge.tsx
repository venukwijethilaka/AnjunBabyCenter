"use client";
import React from 'react';

type Props = { points: number; };

const getTierInfo = (points: number) => {
  if (points >= 500) return { name: "Platinum", nextTier: null, color: "text-purple-600", bg: "bg-purple-50" };
  if (points >= 200) return { name: "Gold", nextTier: 500, color: "text-amber-600", bg: "bg-amber-50" };
  if (points >= 50)  return { name: "Silver", nextTier: 200, color: "text-gray-500", bg: "bg-gray-50" };
  return { name: "Bronze", nextTier: 50, color: "text-orange-700", bg: "bg-orange-50" };
};

const LoyaltyBadge = ({ points }: Props) => {
  const tier = getTierInfo(points);
  const progress = tier.nextTier ? Math.min((points / tier.nextTier) * 100, 100) : 100;

  return (
    <div className="relative group flex items-center gap-2 cursor-pointer p-2 rounded-xl hover:bg-gray-50">
      <div className="text-right hidden sm:block">
        <p className="text-[10px] uppercase text-gray-400 font-bold">Rewards</p>
        <p className={`text-sm font-bold ${tier.color}`}>{tier.name}</p>
      </div>
      <div className="relative w-9 h-9 rounded-full border border-gray-100 flex items-center justify-center bg-white shadow-sm">
         <div className="absolute inset-0 rounded-full border-2 border-blue-500 transition-all" style={{ clipPath: `inset(${100 - progress}% 0 0 0)` }} />
         <span className={`text-xs font-bold ${tier.color}`}>{points}</span>
      </div>
      {/* Hover Tooltip */}
      <div className="absolute top-full right-0 mt-2 w-64 bg-white p-4 rounded-xl shadow-xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
        <h3 className="font-bold text-gray-800 border-b pb-2 mb-2">{tier.name} Member</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between"><span>Points</span><span className="font-bold">{points}</span></div>
          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
             <div className="h-full bg-blue-500" style={{ width: `${progress}%` }} />
          </div>
          {tier.nextTier && <p className="text-xs text-blue-500">Need {(tier.nextTier - points) * 1000} Rs more for next tier.</p>}
        </div>
      </div>
    </div>
  );
};
export default LoyaltyBadge;