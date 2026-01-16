
import React from 'react';
import { Rarity, Flavor, Crate, Upgrade } from './types';

export const FLAVORS: Flavor[] = [
  // Common (1–1.5 CPS)
  { id: 'm-orig', name: 'Monster Energy Original', rarity: Rarity.COMMON, baseCPS: 1.0, color: '#000000', borderColor: '#32CD32', glowColor: '#32CD32' },
  { id: 'm-zero', name: 'Monster Energy Zero Sugar', rarity: Rarity.COMMON, baseCPS: 1.0, color: '#1a1a1a', borderColor: '#00ccff', glowColor: '#00ccff' },
  { id: 'm-locarb', name: 'Monster Energy Lo‑Carb', rarity: Rarity.COMMON, baseCPS: 1.0, color: '#000000', borderColor: '#3366ff', glowColor: '#3366ff' },
  { id: 'u-white', name: 'Monster Ultra White', rarity: Rarity.COMMON, baseCPS: 1.2, color: '#f5f5f5', borderColor: '#cccccc', glowColor: '#ffffff' },
  { id: 'u-blue', name: 'Monster Ultra Blue', rarity: Rarity.COMMON, baseCPS: 1.2, color: '#1e40af', borderColor: '#60a5fa', glowColor: '#60a5fa' },
  { id: 'u-red', name: 'Monster Ultra Red', rarity: Rarity.COMMON, baseCPS: 1.2, color: '#991b1b', borderColor: '#ef4444', glowColor: '#ef4444' },
  { id: 'u-black', name: 'Monster Ultra Black', rarity: Rarity.COMMON, baseCPS: 1.0, color: '#171717', borderColor: '#991b1b', glowColor: '#991b1b' },
  { id: 'u-paradise', name: 'Monster Ultra Paradise', rarity: Rarity.COMMON, baseCPS: 1.3, color: '#32CD32', borderColor: '#ffffff', glowColor: '#32CD32' },
  { id: 'u-sunrise', name: 'Monster Ultra Sunrise', rarity: Rarity.COMMON, baseCPS: 1.3, color: '#f97316', borderColor: '#ffffff', glowColor: '#f97316' },
  { id: 'u-watermelon', name: 'Monster Ultra Watermelon', rarity: Rarity.COMMON, baseCPS: 1.2, color: '#dc2626', borderColor: '#16a34a', glowColor: '#dc2626' },
  { id: 'u-gold', name: 'Monster Ultra Gold', rarity: Rarity.COMMON, baseCPS: 1.3, color: '#ca8a04', borderColor: '#ffffff', glowColor: '#eab308' },
  { id: 'u-rosa', name: 'Monster Ultra Rosá', rarity: Rarity.COMMON, baseCPS: 1.5, color: '#db2777', borderColor: '#ffffff', glowColor: '#db2777' },

  // Uncommon (2–3 CPS)
  { id: 'u-violet', name: 'Monster Ultra Violet', rarity: Rarity.UNCOMMON, baseCPS: 2.0, color: '#7c3aed', borderColor: '#ffffff', glowColor: '#7c3aed' },
  { id: 'u-fiesta', name: 'Monster Ultra Fiesta Mango', rarity: Rarity.UNCOMMON, baseCPS: 2.2, color: '#0891b2', borderColor: '#f97316', glowColor: '#0891b2' },
  { id: 'u-peachy', name: 'Monster Ultra Peachy Keen', rarity: Rarity.UNCOMMON, baseCPS: 2.2, color: '#f59e0b', borderColor: '#ffffff', glowColor: '#f59e0b' },
  { id: 'u-strawberry', name: 'Monster Ultra Strawberry Dreams', rarity: Rarity.UNCOMMON, baseCPS: 2.5, color: '#ec4899', borderColor: '#ffffff', glowColor: '#ec4899' },
  { id: 'u-ruby', name: 'Monster Ultra Fantasy Ruby Red', rarity: Rarity.UNCOMMON, baseCPS: 2.5, color: '#be123c', borderColor: '#ffffff', glowColor: '#be123c' },
  { id: 'j-mean', name: 'Java Monster Mean Bean', rarity: Rarity.UNCOMMON, baseCPS: 2.3, color: '#b45309', borderColor: '#fef3c7', glowColor: '#b45309' },
  { id: 'j-loca', name: 'Java Monster Loca Moca', rarity: Rarity.UNCOMMON, baseCPS: 2.3, color: '#78350f', borderColor: '#fef3c7', glowColor: '#78350f' },
  { id: 'jm-pacific', name: 'Juice Monster Pacific Punch', rarity: Rarity.UNCOMMON, baseCPS: 2.5, color: '#0369a1', borderColor: '#ffffff', glowColor: '#0369a1' },
  { id: 'jm-mango', name: 'Juice Monster Mango Loco', rarity: Rarity.UNCOMMON, baseCPS: 2.5, color: '#ea580c', borderColor: '#ffffff', glowColor: '#ea580c' },
  { id: 'jm-khaos', name: 'Juice Monster Khaos', rarity: Rarity.UNCOMMON, baseCPS: 3.0, color: '#f97316', borderColor: '#ffffff', glowColor: '#f97316' },
  { id: 'r-tea', name: 'Rehab Monster Tea + Lemonade', rarity: Rarity.UNCOMMON, baseCPS: 2.2, color: '#facc15', borderColor: '#000000', glowColor: '#facc15' },
  { id: 'r-green', name: 'Rehab Monster Green Tea', rarity: Rarity.UNCOMMON, baseCPS: 2.2, color: '#16a34a', borderColor: '#000000', glowColor: '#16a34a' },
  { id: 'r-peach', name: 'Rehab Monster Peach Tea', rarity: Rarity.UNCOMMON, baseCPS: 2.3, color: '#f59e0b', borderColor: '#000000', glowColor: '#f59e0b' },
  { id: 'r-berry', name: 'Rehab Monster Wild Berry Tea', rarity: Rarity.UNCOMMON, baseCPS: 2.3, color: '#7e22ce', borderColor: '#000000', glowColor: '#7e22ce' },

  // Rare (5–6 CPS)
  { id: 'u-guava', name: 'Monster Ultra Vice Guava', rarity: Rarity.RARE, baseCPS: 5.0, color: '#e11d48', borderColor: '#14b8a6', glowColor: '#e11d48' },
  { id: 'm-import', name: 'Monster Super‑Premium Import', rarity: Rarity.RARE, baseCPS: 5.5, color: '#171717', borderColor: '#ca8a04', glowColor: '#ca8a04' },
  { id: 'm-shot-straw', name: 'Monster Strawberry Shot', rarity: Rarity.RARE, baseCPS: 5.5, color: '#dc2626', borderColor: '#ffffff', glowColor: '#dc2626' },
  { id: 'jm-viking', name: 'Juice Monster Viking Berry', rarity: Rarity.RARE, baseCPS: 5.5, color: '#4338ca', borderColor: '#ffffff', glowColor: '#4338ca' },
  { id: 'jm-rio', name: 'Juice Monster Rio Punch', rarity: Rarity.RARE, baseCPS: 6.0, color: '#0d9488', borderColor: '#fbbf24', glowColor: '#0d9488' },
  { id: 'jm-pipeline', name: 'Juice Monster Pipeline Punch', rarity: Rarity.RARE, baseCPS: 6.0, color: '#f43f5e', borderColor: '#ffffff', glowColor: '#f43f5e' },

  // Epic (10–12 CPS)
  { id: 'm-nitro', name: 'Monster Nitro Super Dry', rarity: Rarity.EPIC, baseCPS: 10.0, color: '#171717', borderColor: '#32CD32', glowColor: '#32CD32' },
  { id: 'm-electric', name: 'Monster Electric Blue', rarity: Rarity.EPIC, baseCPS: 10.0, color: '#1d4ed8', borderColor: '#00ccff', glowColor: '#1d4ed8' },
  { id: 'm-orange', name: 'Monster Orange Dreamsicle', rarity: Rarity.EPIC, baseCPS: 11.0, color: '#f97316', borderColor: '#ffffff', glowColor: '#f97316' },
  { id: 'm-peaches', name: 'Monster Peaches n’ Crème', rarity: Rarity.EPIC, baseCPS: 11.0, color: '#fdba74', borderColor: '#ffffff', glowColor: '#fdba74' },
  { id: 'm-ranch', name: 'Monster Ranch Water', rarity: Rarity.EPIC, baseCPS: 12.0, color: '#4b5563', borderColor: '#ffffff', glowColor: '#9ca3af' },

  // Legendary (20–25 CPS)
  { id: 'm-lando', name: 'Monster Lando Norris Zero', rarity: Rarity.LEGENDARY, baseCPS: 20.0, color: '#171717', borderColor: '#facc15', glowColor: '#facc15' },
  { id: 'u-ruby-rouge', name: 'Ultra Ruby Red Rouge Rubis', rarity: Rarity.LEGENDARY, baseCPS: 22.0, color: '#9f1239', borderColor: '#ffffff', glowColor: '#e11d48' },
  { id: 'jm-aussie', name: 'Juice Aussie Style Lemonade', rarity: Rarity.LEGENDARY, baseCPS: 24.0, color: '#1e3a8a', borderColor: '#facc15', glowColor: '#facc15' },
  { id: 'm-bad-apple', name: 'Monster Juice Bad Apple', rarity: Rarity.LEGENDARY, baseCPS: 25.0, color: '#111827', borderColor: '#dc2626', glowColor: '#dc2626' },

  // Secret (250–300 CPS)
  { id: 's-phantom', name: 'Phantom Punch', rarity: Rarity.SECRET, baseCPS: 250, color: '#1e293b', borderColor: '#a855f7', glowColor: '#a855f7' },
  { id: 's-starlight', name: 'Starlight Berry', rarity: Rarity.SECRET, baseCPS: 260, color: '#0f172a', borderColor: '#ec4899', glowColor: '#ec4899' },
  { id: 's-cyber', name: 'Cyber Shock', rarity: Rarity.SECRET, baseCPS: 270, color: '#020617', borderColor: '#22d3ee', glowColor: '#22d3ee' },
  { id: 's-eclipse', name: 'Eclipse Rush', rarity: Rarity.SECRET, baseCPS: 280, color: '#000000', borderColor: '#ffffff', glowColor: '#ffffff' },
  { id: 's-mystic', name: 'Mystic Mango', rarity: Rarity.SECRET, baseCPS: 290, color: '#451a03', borderColor: '#facc15', glowColor: '#facc15' },
  { id: 's-void', name: 'Void Citrus', rarity: Rarity.SECRET, baseCPS: 300, color: '#171717', borderColor: '#32CD32', glowColor: '#32CD32' },

  // Admin
  { id: 'admin-monster', name: 'ADMIN MONSTER', rarity: Rarity.ADMIN, baseCPS: 10000000000, color: '#ff0000', borderColor: '#ffffff', glowColor: '#ff0000' }
];

export const CRATES: Crate[] = [
  { id: 'basic', name: 'Basic Crate', price: 50, rarities: [Rarity.COMMON, Rarity.UNCOMMON], description: 'A starter crate containing common and uncommon flavors.' },
  { id: 'rare', name: 'Rare Crate', price: 500, rarities: [Rarity.UNCOMMON, Rarity.RARE, Rarity.EPIC], description: 'A better chance at finding rare and epic flavors.' },
  { id: 'legendary', name: 'Legendary Crate', price: 5000, rarities: [Rarity.EPIC, Rarity.LEGENDARY, Rarity.MYTHIC], description: 'High quality flavors for pro clickers.' },
  { id: 'secret', name: 'Secret Crate', price: 50000, rarities: [Rarity.GODLIKE, Rarity.SECRET], description: 'The ultimate crate containing the rarest flavors known.' },
];

export const UPGRADES: Upgrade[] = [
  { id: 'click-1', name: 'Heavy Grip', description: 'Increases clicking power by 2x.', baseCost: 10, multiplier: 2, type: 'click' },
  { id: 'click-crit', name: 'Critical Slap', description: 'Increases crit chance by 5%.', baseCost: 100, multiplier: 1.5, type: 'click' },
  { id: 'auto-fingers', name: 'Caffeinated Fingers', description: 'Your fingers move on their own! Automatically taps for you.', baseCost: 500, multiplier: 1.8, type: 'automation' },
  { id: 'auto-speed', name: 'Turbo Engines', description: 'Increases automation speed by 10%.', baseCost: 1000, multiplier: 1.2, type: 'automation' },
  { id: 'boost-slot', name: 'Extra Cup Holder', description: 'Unlocks an extra flavor slot.', baseCost: 5000, multiplier: 2.5, type: 'boost' },
  { id: 'boost-perc', name: 'Synergy Boost', description: 'Increases total CPS by 5%.', baseCost: 2500, multiplier: 1.5, type: 'boost' },
];

export const REBIRTH_STAGES = [
  { level: 1, milestone: 1e12, bonus: 2 }, // 1T (Sx in notation requested below)
  { level: 2, milestone: 1e15, bonus: 5 },
  { level: 3, milestone: 1e18, bonus: 10 },
  { level: 4, milestone: 1e21, bonus: 25 },
  { level: 5, milestone: 1e24, bonus: 50 },
];
