
export enum Rarity {
  COMMON = 'Common',
  UNCOMMON = 'Uncommon',
  RARE = 'Rare',
  EPIC = 'Epic',
  LEGENDARY = 'Legendary',
  MYTHIC = 'Mythic',
  GODLIKE = 'Godlike',
  SECRET = 'Secret',
  ADMIN = 'Admin'
}

export interface Flavor {
  id: string;
  name: string;
  rarity: Rarity;
  baseCPS: number;
  color: string;
  borderColor: string;
  glowColor: string;
}

export interface Upgrade {
  id: string;
  name: string;
  description: string;
  baseCost: number;
  multiplier: number;
  type: 'click' | 'automation' | 'boost';
}

export interface PlayerStats {
  mep: number;
  totalMepEarned: number;
  cps: number;
  clickPower: number;
  critChance: number;
  inventory: string[];
  equippedIds: string[];
  rebirths: number;
  upgrades: Record<string, number>;
  saveStatus: 'Saved' | 'Saving' | 'Offline';
  
  // Admin Flags
  isAdminEnabled: boolean;
  isFrozen: boolean;
  infiniteMep: boolean;
  adminCpsMultiplier: number;
  adminClickPowerMultiplier: number;
  adminCpsFlatBonus: number;
  noUpgradeCost: boolean;
  forcedRarity: Rarity | null;
  autoOpenCrates: boolean;
}

export interface Crate {
  id: string;
  name: string;
  price: number;
  rarities: Rarity[];
  description: string;
}
