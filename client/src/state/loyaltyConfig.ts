import { LoyaltyLevel } from "./api";

export const calculateLevel = (points: number, tiers: LoyaltyLevel[] | undefined) => {
    // Default fallback if DB is empty or loading
    const defaultLevel: LoyaltyLevel = { 
        id: 0, name: "Member", minPoints: 0, discount: 0,
        color: "from-gray-400 to-gray-500", badgeColor: "bg-gray-50", updatedAt: new Date() 
    };

    if (!tiers || tiers.length === 0) return { current: defaultLevel, next: null };
    
    // 1. Sort tiers by points (Highest first) to find current level
    const sortedDesc = [...tiers].sort((a, b) => b.minPoints - a.minPoints);
    const current = sortedDesc.find(tier => points >= tier.minPoints) || tiers[0];
    
    // 2. Sort tiers by points (Lowest first) to find next level
    const sortedAsc = [...tiers].sort((a, b) => a.minPoints - b.minPoints);
    const next = sortedAsc.find(tier => tier.minPoints > points) || null;

    return { current, next };
};