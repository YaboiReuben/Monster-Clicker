
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Archive, ShoppingBag, TrendingUp, Settings, Lock, CheckCircle, Database, ChevronRight, X, Info, Trophy } from 'lucide-react';
import { PlayerStats, Flavor, Rarity, Upgrade, Crate } from './types';
import { FLAVORS, CRATES, UPGRADES, REBIRTH_STAGES } from './constants';
import { formatNumber } from './Notation';

// --- Components ---

const TopBar: React.FC<{ stats: PlayerStats, onLogoClick: () => void }> = ({ stats, onLogoClick }) => {
  return (
    <div className="h-16 border-b border-slate-800 bg-black/80 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-50">
      <div className="flex items-center gap-4">
        <div onClick={onLogoClick} className="cursor-pointer group select-none">
          <h1 className="text-2xl font-black font-display tracking-tighter text-[#32CD32] group-hover:scale-105 transition-transform">
            MONSTER<span className="text-white">CLICKER</span>
          </h1>
        </div>
        <div className="hidden md:flex h-8 w-[1px] bg-slate-800" />
        <div className="flex flex-col">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Balance</span>
          <span className="text-xl font-display font-bold text-white leading-none">{formatNumber(stats.mep)} MEP</span>
        </div>
      </div>

      <div className="flex items-center gap-8">
        <div className="hidden lg:flex flex-col items-end">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Production</span>
          <span className="text-lg font-display font-bold text-[#32CD32] leading-none">+{formatNumber(stats.cps)}/s</span>
        </div>
        <div className="hidden lg:flex flex-col items-end">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Power</span>
          <span className="text-lg font-display font-bold text-blue-400 leading-none">{formatNumber(stats.clickPower)}/tap</span>
        </div>
        <div className="flex items-center gap-2 bg-slate-900/50 px-3 py-1 rounded-full border border-slate-800">
          <div className={`w-2 h-2 rounded-full ${stats.saveStatus === 'Saved' ? 'bg-[#32CD32]' : 'bg-yellow-500'} animate-pulse`} />
          <span className="text-[10px] font-bold text-slate-300">{stats.saveStatus}</span>
        </div>
      </div>
    </div>
  );
};

const ClickZone: React.FC<{ 
  equippedFlavor: Flavor, 
  onTap: (x: number, y: number) => void 
}> = ({ equippedFlavor, onTap }) => {
  const [isPressed, setIsPressed] = useState(false);

  const handleTap = (e: React.MouseEvent | React.TouchEvent) => {
    let x, y;
    if ('clientX' in e) {
      x = e.clientX;
      y = e.clientY;
    } else {
      x = e.touches[0].clientX;
      y = e.touches[0].clientY;
    }
    onTap(x, y);
    setIsPressed(true);
    setTimeout(() => setIsPressed(false), 100);
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center relative overflow-hidden p-8">
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#32CD32]/20 via-transparent to-transparent" />
      </div>

      <div className="text-center mb-8 space-y-2 z-10">
        <h2 className="text-4xl font-display font-black text-white tracking-tight uppercase">
          Tap the <span style={{ color: equippedFlavor.glowColor }}>Can</span>
        </h2>
        <p className="text-slate-400 font-medium">Generate Monster Energy Points</p>
      </div>

      <motion.div
        className="relative cursor-pointer select-none z-10"
        onMouseDown={handleTap}
        onTouchStart={handleTap}
        animate={{ scale: isPressed ? 0.92 : 1 }}
        whileHover={{ scale: 1.05 }}
      >
        {/* Realistic Can Placeholder (SVG) */}
        <div 
          className="w-48 h-80 rounded-3xl relative overflow-hidden border-4 shadow-2xl transition-colors duration-500"
          style={{ 
            backgroundColor: equippedFlavor.color,
            borderColor: equippedFlavor.borderColor,
            boxShadow: `0 0 40px ${equippedFlavor.glowColor}44`
          }}
        >
          <div className="absolute top-0 left-0 w-full h-1/4 bg-gradient-to-b from-white/20 to-transparent" />
          <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-black/40 to-transparent" />
          <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
             <div className="w-16 h-16 mb-4" style={{ fill: equippedFlavor.glowColor }}>
               <Zap className="w-full h-full" strokeWidth={3} />
             </div>
             <div className="text-center font-display font-black text-white uppercase break-words leading-tight text-xl">
               {equippedFlavor.name}
             </div>
          </div>
        </div>
        
        <AnimatePresence>
          {isPressed && (
            <motion.div
              initial={{ opacity: 1, y: 0 }}
              animate={{ opacity: 0, y: -100 }}
              exit={{ opacity: 0 }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
            >
              <Zap className="w-12 h-12 text-[#32CD32] filter blur-[1px]" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

const InventoryPanel: React.FC<{ 
  inventory: string[], 
  equippedIds: string[], 
  onEquip: (id: string) => void,
  onSell: (id: string) => void
}> = ({ inventory, equippedIds, onEquip, onSell }) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  
  const getFlavor = (id: string) => FLAVORS.find(f => f.id === id);

  return (
    <div className="w-80 bg-slate-900/50 border-r border-slate-800 flex flex-col p-4">
      <div className="flex items-center gap-2 mb-4">
        <Archive className="w-5 h-5 text-[#32CD32]" />
        <h3 className="font-display font-bold uppercase tracking-wider text-slate-200">Inventory</h3>
        <span className="ml-auto text-xs bg-slate-800 px-2 py-0.5 rounded font-bold text-slate-400">{inventory.length}</span>
      </div>

      <div className="flex-1 overflow-y-auto pr-2">
        <div className="grid grid-cols-2 gap-2">
          {inventory.map((fid, idx) => {
            const flavor = getFlavor(fid);
            if (!flavor) return null;
            const isEquipped = equippedIds.includes(fid);
            return (
              <motion.div
                key={`${fid}-${idx}`}
                whileHover={{ scale: 1.05 }}
                onClick={() => setSelectedId(fid)}
                className={`relative aspect-[3/4] rounded-lg border-2 cursor-pointer group flex flex-col items-center justify-center p-2 text-center transition-all ${isEquipped ? 'border-[#32CD32] ring-2 ring-[#32CD32]/20' : 'border-slate-800 bg-slate-800/40 hover:bg-slate-800'}`}
                style={{ backgroundColor: flavor.color + '22' }}
              >
                <div 
                  className="w-8 h-12 rounded bg-gradient-to-b from-slate-400 to-slate-600 mb-2"
                  style={{ backgroundColor: flavor.color }}
                />
                <div className="text-[10px] font-black uppercase text-white leading-tight line-clamp-2">{flavor.name}</div>
                <div className="text-[8px] font-bold text-[#32CD32] mt-1">{flavor.baseCPS} CPS</div>
                
                {isEquipped && (
                  <div className="absolute -top-1 -right-1 bg-[#32CD32] text-black text-[8px] font-black px-1 rounded shadow-lg">EQUIPPED</div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      <AnimatePresence>
        {selectedId && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4"
          >
            <div className="bg-slate-900 border border-slate-700 p-6 rounded-2xl w-full max-w-xs shadow-2xl relative overflow-hidden">
               {/* Detail Card */}
               {(() => {
                 const flavor = getFlavor(selectedId);
                 if (!flavor) return null;
                 return (
                   <div className="flex flex-col items-center gap-4">
                     <div className="w-24 h-40 rounded-xl border-2" style={{ backgroundColor: flavor.color, borderColor: flavor.borderColor }} />
                     <div className="text-center">
                       <h4 className="text-xl font-display font-black text-white uppercase">{flavor.name}</h4>
                       <p className="text-[#32CD32] font-bold">{flavor.rarity} - {flavor.baseCPS} CPS</p>
                     </div>
                     <div className="grid grid-cols-2 gap-2 w-full mt-4">
                       <button 
                         onClick={() => { onEquip(selectedId); setSelectedId(null); }}
                         className="bg-[#32CD32] hover:bg-[#28a428] text-black font-black py-2 rounded-lg transition-colors uppercase text-sm"
                       >
                         Equip
                       </button>
                       <button 
                         onClick={() => { onSell(selectedId); setSelectedId(null); }}
                         className="bg-red-600 hover:bg-red-700 text-white font-black py-2 rounded-lg transition-colors uppercase text-sm"
                       >
                         Sell
                       </button>
                     </div>
                     <button onClick={() => setSelectedId(null)} className="absolute top-4 right-4 text-slate-500 hover:text-white">
                       <X className="w-6 h-6" />
                     </button>
                   </div>
                 );
               })()}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const CratePanel: React.FC<{ mep: number, onOpenCrate: (cid: string) => void }> = ({ mep, onOpenCrate }) => {
  return (
    <div className="w-80 bg-slate-900/50 border-l border-slate-800 flex flex-col p-4">
      <div className="flex items-center gap-2 mb-4">
        <ShoppingBag className="w-5 h-5 text-[#32CD32]" />
        <h3 className="font-display font-bold uppercase tracking-wider text-slate-200">Store</h3>
      </div>

      <div className="space-y-3 overflow-y-auto pr-2">
        {CRATES.map(crate => (
          <div key={crate.id} className="bg-slate-800/40 border border-slate-700 p-3 rounded-xl hover:border-[#32CD32] transition-colors group">
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-bold text-white group-hover:text-[#32CD32] transition-colors">{crate.name}</h4>
              <span className="text-xs font-black text-[#32CD32]">{formatNumber(crate.price)} MEP</span>
            </div>
            <p className="text-xs text-slate-400 mb-4">{crate.description}</p>
            <div className="flex gap-2">
              <div className="flex-1 text-[10px] text-slate-500 font-bold uppercase py-1">Drops: {crate.rarities.join(', ')}</div>
              <button 
                disabled={mep < crate.price}
                onClick={() => onOpenCrate(crate.id)}
                className={`px-4 py-1.5 rounded-lg text-xs font-black uppercase transition-all ${mep >= crate.price ? 'bg-[#32CD32] text-black hover:scale-105 active:scale-95' : 'bg-slate-700 text-slate-500 cursor-not-allowed'}`}
              >
                Buy
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const UpgradePanel: React.FC<{ 
  stats: PlayerStats, 
  onUpgrade: (id: string) => void 
}> = ({ stats, onUpgrade }) => {
  const [activeTab, setActiveTab] = useState<'click' | 'automation' | 'boost'>('click');

  return (
    <div className="h-64 border-t border-slate-800 bg-black/80 flex flex-col">
      <div className="flex border-b border-slate-800">
        {(['click', 'automation', 'boost'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'text-[#32CD32] bg-[#32CD32]/5' : 'text-slate-500 hover:text-slate-300'}`}
          >
            {tab === 'click' ? 'Click Power' : tab === 'automation' ? 'Automation' : 'Flavor Boosts'}
          </button>
        ))}
      </div>
      
      <div className="flex-1 flex gap-4 p-4 overflow-x-auto overflow-y-hidden">
        {UPGRADES.filter(u => u.type === activeTab).map(upgrade => {
          const level = stats.upgrades[upgrade.id] || 0;
          const cost = Math.floor(upgrade.baseCost * Math.pow(upgrade.multiplier, level));
          return (
            <div 
              key={upgrade.id}
              onClick={() => stats.mep >= cost && onUpgrade(upgrade.id)}
              className={`min-w-[200px] bg-slate-900 border border-slate-800 p-4 rounded-xl cursor-pointer transition-all hover:border-slate-600 active:scale-95 group ${stats.mep < cost ? 'opacity-50 grayscale' : ''}`}
            >
              <div className="flex justify-between items-start mb-1">
                <h5 className="font-bold text-slate-200 text-sm">{upgrade.name}</h5>
                <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded font-black">Lvl {level}</span>
              </div>
              <p className="text-[10px] text-slate-400 mb-4 line-clamp-2">{upgrade.description}</p>
              <div className="mt-auto pt-2 border-t border-slate-800 flex justify-between items-center">
                 <span className="text-xs font-black text-[#32CD32]">{formatNumber(cost)} MEP</span>
                 <CheckCircle className={`w-4 h-4 ${stats.mep >= cost ? 'text-[#32CD32]' : 'text-slate-700'}`} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const AdminPanel: React.FC<{ 
  onClose: () => void, 
  stats: PlayerStats, 
  setStats: React.Dispatch<React.SetStateAction<PlayerStats>> 
}> = ({ onClose, stats, setStats }) => {
  const [password, setPassword] = useState('');
  const [isAuthed, setIsAuthed] = useState(false);

  const handleAuth = () => {
    if (password === 'reuben2026') setIsAuthed(true);
    else alert('Invalid Admin Key');
  };

  if (!isAuthed) {
    return (
      <div className="fixed inset-0 z-[200] bg-black flex items-center justify-center p-6">
        <div className="w-full max-w-md space-y-4">
          <div className="text-center mb-8">
            <Lock className="w-16 h-16 text-[#32CD32] mx-auto mb-4" />
            <h2 className="text-2xl font-display font-black text-white uppercase tracking-tighter">ACCESS RESTRICTED</h2>
          </div>
          <input 
            type="password" 
            placeholder="Admin Password"
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-[#32CD32] outline-none font-bold"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAuth()}
          />
          <button 
            onClick={handleAuth}
            className="w-full bg-[#32CD32] hover:bg-[#28a428] text-black font-black py-3 rounded-xl transition-all"
          >
            Authenticate
          </button>
          <button onClick={onClose} className="w-full text-slate-500 font-bold py-2 hover:text-white">Exit</button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[200] bg-slate-950 flex flex-col p-8 overflow-y-auto">
      <div className="flex justify-between items-center mb-12">
        <h2 className="text-4xl font-display font-black text-[#32CD32] uppercase tracking-tighter">SYSTEM CONTROL</h2>
        <button onClick={onClose} className="text-slate-400 hover:text-white"><X className="w-10 h-10" /></button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><TrendingUp className="text-[#32CD32]" /> Economy</h3>
          <button 
            onClick={() => setStats(prev => ({ ...prev, mep: prev.mep + 1e12 }))}
            className="w-full bg-slate-800 hover:bg-[#32CD32]/10 text-slate-300 font-bold py-2 rounded-lg"
          >
            Add +1T MEP
          </button>
          <button 
            onClick={() => setStats(prev => ({ ...prev, mep: prev.mep + 1e15 }))}
            className="w-full bg-slate-800 hover:bg-[#32CD32]/10 text-slate-300 font-bold py-2 rounded-lg"
          >
            Add +1Qa MEP
          </button>
        </div>

        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><Zap className="text-red-500" /> Admin Monster</h3>
          <div className="p-4 bg-black rounded-xl border border-red-900/50">
             <h4 className="font-black text-red-500 text-lg uppercase mb-1">THE OVERLORD</h4>
             <p className="text-xs text-slate-500 mb-4">Produces 10B CPS instantly.</p>
             <button 
                onClick={() => {
                  setStats(prev => ({
                    ...prev,
                    inventory: [...prev.inventory, 'admin-monster'],
                    equippedIds: [ 'admin-monster' ]
                  }));
                  onClose();
                }}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-black py-3 rounded-lg"
             >
               Inject & Equip
             </button>
          </div>
        </div>

        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><Settings className="text-blue-500" /> Game State</h3>
          <button 
            onClick={() => {
              localStorage.removeItem('monster-clicker-save');
              window.location.reload();
            }}
            className="w-full bg-slate-800 hover:bg-red-900/20 text-red-500 font-bold py-2 rounded-lg"
          >
            HARD RESET GAME
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Main App Logic ---

const App: React.FC = () => {
  const [stats, setStats] = useState<PlayerStats>({
    mep: 0,
    totalMepEarned: 0,
    cps: 0,
    clickPower: 1,
    critChance: 0.05,
    inventory: ['m-orig'],
    equippedIds: ['m-orig'],
    rebirths: 0,
    upgrades: {},
    saveStatus: 'Saved',
  });

  const [floatingParticles, setFloatingParticles] = useState<{ id: number, x: number, y: number, value: string }[]>([]);
  const [showAdmin, setShowAdmin] = useState(false);
  const logoClickCount = useRef(0);
  const lastSaveTime = useRef(Date.now());

  // Initialization & Auto-Save
  useEffect(() => {
    const saved = localStorage.getItem('monster-clicker-save');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setStats(prev => ({ ...prev, ...parsed, saveStatus: 'Saved' }));
      } catch (e) {
        console.error("Failed to load save", e);
      }
    }
  }, []);

  const saveToLocal = useCallback(() => {
    setStats(prev => ({ ...prev, saveStatus: 'Saving' }));
    localStorage.setItem('monster-clicker-save', JSON.stringify(stats));
    setTimeout(() => {
      setStats(prev => ({ ...prev, saveStatus: 'Saved' }));
    }, 1000);
    lastSaveTime.current = Date.now();
  }, [stats]);

  // Handle auto-save interval
  useEffect(() => {
    const interval = setInterval(() => {
      if (Date.now() - lastSaveTime.current > 120000) { // 2 minutes
        saveToLocal();
      }
    }, 10000);
    return () => clearInterval(interval);
  }, [saveToLocal]);

  // Recalculate CPS and Click Power
  useEffect(() => {
    const activeFlavors = stats.equippedIds.map(id => FLAVORS.find(f => f.id === id)).filter(Boolean) as Flavor[];
    const baseCPS = activeFlavors.reduce((acc, f) => acc + f.baseCPS, 0);
    
    // Upgrades
    const clickMulti = Math.pow(2, stats.upgrades['click-1'] || 0);
    const critLevel = stats.upgrades['click-crit'] || 0;
    const autoSpeed = 1 + (stats.upgrades['auto-speed'] || 0) * 0.1;
    const synergyMulti = 1 + (stats.upgrades['boost-perc'] || 0) * 0.05;

    // Prestige Multiplier
    const rebirthMulti = 1 + stats.rebirths * 1.5;

    const totalCPS = baseCPS * synergyMulti * autoSpeed * rebirthMulti;
    const totalClickPower = (1 + totalCPS * 0.1) * clickMulti * rebirthMulti;

    setStats(prev => ({
      ...prev,
      cps: totalCPS,
      clickPower: totalClickPower,
      critChance: 0.05 + critLevel * 0.05
    }));
  }, [stats.equippedIds, stats.upgrades, stats.rebirths]);

  // Game Loop
  useEffect(() => {
    const loop = setInterval(() => {
      if (stats.cps > 0) {
        setStats(prev => ({
          ...prev,
          mep: prev.mep + prev.cps / 10,
          totalMepEarned: prev.totalMepEarned + prev.cps / 10
        }));
      }
    }, 100);
    return () => clearInterval(loop);
  }, [stats.cps]);

  const handleTap = (x: number, y: number) => {
    const isCrit = Math.random() < stats.critChance;
    const gain = stats.clickPower * (isCrit ? 2 : 1);
    
    setStats(prev => ({
      ...prev,
      mep: prev.mep + gain,
      totalMepEarned: prev.totalMepEarned + gain
    }));

    const id = Date.now();
    setFloatingParticles(prev => [...prev, { id, x, y, value: `+${formatNumber(gain)}${isCrit ? ' CRIT!' : ''}` }]);
    setTimeout(() => {
      setFloatingParticles(prev => prev.filter(p => p.id !== id));
    }, 1000);
  };

  const handleLogoClick = () => {
    logoClickCount.current++;
    if (logoClickCount.current >= 3) {
      setShowAdmin(true);
      logoClickCount.current = 0;
    }
    setTimeout(() => { logoClickCount.current = 0; }, 2000);
  };

  const openCrate = (crateId: string) => {
    const crate = CRATES.find(c => c.id === crateId);
    if (!crate || stats.mep < crate.price) return;

    setStats(prev => ({ ...prev, mep: prev.mep - crate.price }));

    // Weighted drop logic
    const possibleFlavors = FLAVORS.filter(f => crate.rarities.includes(f.rarity));
    const drop = possibleFlavors[Math.floor(Math.random() * possibleFlavors.length)];

    alert(`You found: ${drop.name}!`);
    setStats(prev => ({
      ...prev,
      inventory: [...prev.inventory, drop.id]
    }));
    saveToLocal();
  };

  const handleUpgrade = (upgradeId: string) => {
    const upgrade = UPGRADES.find(u => u.id === upgradeId);
    if (!upgrade) return;

    const level = stats.upgrades[upgradeId] || 0;
    const cost = Math.floor(upgrade.baseCost * Math.pow(upgrade.multiplier, level));

    if (stats.mep >= cost) {
      setStats(prev => ({
        ...prev,
        mep: prev.mep - cost,
        upgrades: { ...prev.upgrades, [upgradeId]: (prev.upgrades[upgradeId] || 0) + 1 }
      }));
      saveToLocal();
    }
  };

  const equipFlavor = (fid: string) => {
    const slotLimit = 1 + (stats.upgrades['boost-slot'] || 0);
    setStats(prev => {
      let newEquipped = [...prev.equippedIds];
      if (newEquipped.includes(fid)) {
        newEquipped = newEquipped.filter(id => id !== fid);
      } else {
        if (newEquipped.length >= slotLimit) {
          newEquipped.shift(); // Remove oldest
        }
        newEquipped.push(fid);
      }
      return { ...prev, equippedIds: newEquipped };
    });
    saveToLocal();
  };

  const sellFlavor = (fid: string) => {
    const flavor = FLAVORS.find(f => f.id === fid);
    if (!flavor) return;
    const price = flavor.baseCPS * 10;
    setStats(prev => ({
      ...prev,
      mep: prev.mep + price,
      inventory: prev.inventory.filter((id, i) => i !== prev.inventory.indexOf(fid)),
      equippedIds: prev.equippedIds.filter(id => id !== fid)
    }));
    saveToLocal();
  };

  const handleRebirth = () => {
    const stage = REBIRTH_STAGES[stats.rebirths] || REBIRTH_STAGES[REBIRTH_STAGES.length - 1];
    if (stats.mep >= stage.milestone) {
      setStats(prev => ({
        ...prev,
        mep: 0,
        cps: 0,
        clickPower: 1,
        upgrades: {},
        inventory: ['m-orig'],
        equippedIds: ['m-orig'],
        rebirths: prev.rebirths + 1
      }));
      saveToLocal();
    }
  };

  const mainEquippedFlavor = FLAVORS.find(f => f.id === stats.equippedIds[0]) || FLAVORS[0];

  return (
    <div className="flex flex-col h-screen monster-gradient overflow-hidden">
      <TopBar stats={stats} onLogoClick={handleLogoClick} />
      
      <div className="flex flex-1 overflow-hidden">
        <InventoryPanel 
          inventory={stats.inventory} 
          equippedIds={stats.equippedIds} 
          onEquip={equipFlavor}
          onSell={sellFlavor}
        />
        
        <div className="flex-1 flex flex-col relative">
          <ClickZone 
            equippedFlavor={mainEquippedFlavor} 
            onTap={handleTap} 
          />
          
          {/* Progression Bar */}
          <div className="px-12 pb-8">
            {(() => {
               const stage = REBIRTH_STAGES[stats.rebirths] || REBIRTH_STAGES[REBIRTH_STAGES.length - 1];
               const progress = Math.min((stats.mep / stage.milestone) * 100, 100);
               return (
                 <div className="space-y-3">
                   <div className="flex justify-between items-end">
                      <div className="flex items-center gap-2">
                        <Trophy className="w-5 h-5 text-yellow-500" />
                        <span className="text-sm font-black uppercase text-slate-300">Goal: Rebirth {stats.rebirths + 1}</span>
                      </div>
                      <span className="text-xs font-black text-slate-500">{formatNumber(stats.mep)} / {formatNumber(stage.milestone)} MEP</span>
                   </div>
                   <div className="h-4 bg-slate-900 border border-slate-800 rounded-full overflow-hidden p-0.5">
                     <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        className="h-full bg-gradient-to-r from-[#32CD32] to-emerald-400 rounded-full shadow-[0_0_10px_#32CD32]"
                     />
                   </div>
                   {progress >= 100 && (
                     <motion.button 
                       initial={{ scale: 0.9, opacity: 0 }}
                       animate={{ scale: 1, opacity: 1 }}
                       onClick={handleRebirth}
                       className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-black py-3 rounded-xl uppercase tracking-widest shadow-xl shadow-yellow-500/20"
                     >
                       REBIRTH NOW (Permanent Multiplier!)
                     </motion.button>
                   )}
                 </div>
               );
            })()}
          </div>
          
          <UpgradePanel stats={stats} onUpgrade={handleUpgrade} />
        </div>

        <CratePanel mep={stats.mep} onOpenCrate={openCrate} />
      </div>

      {/* Floating Particles */}
      {floatingParticles.map(p => (
        <div 
          key={p.id} 
          className="particle font-display font-black text-xl text-[#32CD32] pointer-events-none drop-shadow-lg z-[999]"
          style={{ left: p.x, top: p.y }}
        >
          {p.value}
        </div>
      ))}

      {/* Admin Panel */}
      {showAdmin && (
        <AdminPanel 
          stats={stats} 
          setStats={setStats} 
          onClose={() => setShowAdmin(false)} 
        />
      )}
    </div>
  );
};

export default App;
