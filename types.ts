
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
  inventory: string[]; // Flavor IDs
  equippedIds: string[];
  rebirths: number;
  upgrades: Record<string, number>; // Upgrade ID -> Level
  saveStatus: 'Saved' | 'Saving' | 'Offline';
}

export interface Crate {
  id: string;
  name: string;
  price: number;
  rarities: Rarity[];
  description: string;
}
