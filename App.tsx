
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Archive, ShoppingBag, TrendingUp, Lock, CheckCircle, X, Trophy, FlaskConical, Package, RotateCcw, Flame, AlertTriangle, Mail, Terminal, Cloud, Cpu, Code, Server, FileCode, Database, Send, ZapOff } from 'lucide-react';
import { PlayerStats, Flavor, Rarity, Upgrade, Crate } from './types';
import { FLAVORS, CRATES, UPGRADES, REBIRTH_STAGES } from './constants';
import { formatNumber } from './Notation';
import DevHub from './DevHub';

// --- Components ---

const TopBar: React.FC<{ stats: PlayerStats, onLogoClick: () => void, onOpenDevHub: () => void }> = ({ stats, onLogoClick, onOpenDevHub }) => {
  return (
    <div className="h-16 border-b border-slate-800 bg-black/80 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-50">
      <div className="flex items-center gap-4">
        <div onClick={onLogoClick} className="cursor-pointer group select-none">
          <h1 className="text-2xl font-black font-display tracking-tighter text-[#32CD32] group-hover:scale-105 transition-transform">
            MONSTER<span className="text-white">CLICKER</span>
            {stats.isAdminEnabled && <span className="ml-2 text-[10px] bg-red-600 text-white px-1 rounded animate-pulse">ADMIN</span>}
          </h1>
        </div>
        <div className="hidden md:flex h-8 w-[1px] bg-slate-800" />
        <div className="flex flex-col">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Balance</span>
          <span className="text-xl font-display font-bold text-white leading-none">
            {stats.infiniteMep ? '∞' : formatNumber(stats.mep)} MEP
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Dev Tools Link */}
        <button 
          onClick={onOpenDevHub}
          className="flex items-center gap-2 text-[9px] font-black text-cyan-400 hover:text-white transition-colors uppercase tracking-widest bg-cyan-950/30 border border-cyan-800/50 px-3 py-1 rounded-full shadow-[0_0_10px_rgba(34,211,238,0.1)]"
        >
          <Terminal className="w-3 h-3" />
          Dev Hub
        </button>

        <a 
          href="mailto:officalmonsterenergyclicker@gmail.com" 
          className="hidden md:flex items-center gap-2 text-[9px] font-black text-slate-500 hover:text-[#32CD32] transition-colors uppercase tracking-widest bg-slate-900/50 border border-slate-800 px-3 py-1 rounded-full"
        >
          <Mail className="w-3 h-3" />
          Support
        </a>

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
      x = (e as React.MouseEvent).clientX;
      y = (e as React.MouseEvent).clientY;
    } else {
      x = (e as React.TouchEvent).touches[0].clientX;
      y = (e as React.TouchEvent).touches[0].clientY;
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
                <div className="w-8 h-12 rounded bg-gradient-to-b from-slate-400 to-slate-600 mb-2" style={{ backgroundColor: flavor.color }} />
                <div className="text-[10px] font-black uppercase text-white leading-tight line-clamp-2">{flavor.name}</div>
                <div className="text-[8px] font-bold text-[#32CD32] mt-1">{formatNumber(flavor.baseCPS)} CPS</div>
                {isEquipped && <div className="absolute -top-1 -right-1 bg-[#32CD32] text-black text-[8px] font-black px-1 rounded shadow-lg">EQUIPPED</div>}
              </motion.div>
            );
          })}
        </div>
      </div>

      <AnimatePresence>
        {selectedId && (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4">
            <div className="bg-slate-900 border border-slate-700 p-6 rounded-2xl w-full max-w-xs shadow-2xl relative overflow-hidden">
               {(() => {
                 const flavor = getFlavor(selectedId);
                 if (!flavor) return null;
                 return (
                   <div className="flex flex-col items-center gap-4">
                     <div className="w-24 h-40 rounded-xl border-2" style={{ backgroundColor: flavor.color, borderColor: flavor.borderColor }} />
                     <div className="text-center">
                       <h4 className="text-xl font-display font-black text-white uppercase">{flavor.name}</h4>
                       <p className="text-[#32CD32] font-bold">{flavor.rarity} - {formatNumber(flavor.baseCPS)} CPS</p>
                     </div>
                     <div className="grid grid-cols-2 gap-2 w-full mt-4">
                       <button onClick={() => { onEquip(selectedId); setSelectedId(null); }} className="bg-[#32CD32] hover:bg-[#28a428] text-black font-black py-2 rounded-lg transition-colors uppercase text-sm">Equip</button>
                       <button onClick={() => { onSell(selectedId); setSelectedId(null); }} className="bg-red-600 hover:bg-red-700 text-white font-black py-2 rounded-lg transition-colors uppercase text-sm">Sell</button>
                     </div>
                     <button onClick={() => setSelectedId(null)} className="absolute top-4 right-4 text-slate-500 hover:text-white"><X className="w-6 h-6" /></button>
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

const AdminPanel: React.FC<{ 
  onClose: () => void, 
  stats: PlayerStats, 
  setStats: React.Dispatch<React.SetStateAction<PlayerStats>> 
}> = ({ onClose, stats, setStats }) => {
  const [password, setPassword] = useState('');
  const [isAuthed, setIsAuthed] = useState(false);
  const [activeTab, setActiveTab] = useState<'economy'|'inventory'|'crates'|'upgrades'|'rebirth'>('economy');

  const handleAuth = () => {
    if (password === 'reuben2026') {
      setIsAuthed(true);
      setStats(prev => ({ ...prev, isAdminEnabled: true }));
    } else alert('Invalid Admin Key');
  };

  if (!isAuthed && !stats.isAdminEnabled) {
    return (
      <div className="fixed inset-0 z-[200] bg-black flex items-center justify-center p-6">
        <div className="w-full max-w-md space-y-4">
          <div className="text-center mb-8">
            <Lock className="w-16 h-16 text-[#32CD32] mx-auto mb-4" />
            <h2 className="text-2xl font-display font-black text-white uppercase tracking-tighter">ACCESS RESTRICTED</h2>
          </div>
          <input type="password" placeholder="Admin Password" className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-[#32CD32] outline-none font-bold text-center" value={password} onChange={(e) => setPassword(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleAuth()} />
          <button onClick={handleAuth} className="w-full bg-[#32CD32] hover:bg-[#28a428] text-black font-black py-3 rounded-xl transition-all">Authenticate</button>
          <button onClick={onClose} className="w-full text-slate-500 font-bold py-2 hover:text-white">Exit</button>
        </div>
      </div>
    );
  }

  const SectionTitle = ({ icon: Icon, title, color }: any) => (
    <div className={`flex items-center gap-2 mb-6 pb-2 border-b border-slate-800 ${color}`}>
      <Icon className="w-6 h-6" />
      <h3 className="text-xl font-display font-black uppercase tracking-tighter">{title}</h3>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[200] bg-[#020617] flex flex-col font-sans">
      <div className="h-20 border-b border-slate-800 flex items-center justify-between px-8 bg-black/50">
        <div className="flex items-center gap-4">
          <FlaskConical className="w-8 h-8 text-[#32CD32]" />
          <h2 className="text-3xl font-display font-black text-white uppercase tracking-tighter">System Overlord</h2>
        </div>
        <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors"><X className="w-10 h-10" /></button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="w-64 bg-black/40 border-r border-slate-800 flex flex-col p-4 gap-2">
          {[
            { id: 'economy', label: 'Economy', icon: TrendingUp },
            { id: 'inventory', label: 'Inventory', icon: Archive },
            { id: 'crates', label: 'Crates', icon: Package },
            { id: 'upgrades', label: 'Upgrades', icon: Zap },
            { id: 'rebirth', label: 'Rebirth', icon: RotateCcw },
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold uppercase text-xs transition-all ${activeTab === tab.id ? 'bg-[#32CD32] text-black shadow-lg shadow-[#32CD32]/20' : 'text-slate-400 hover:bg-slate-800'}`}>
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
          <div className="mt-auto space-y-2">
            <button onClick={() => setStats(prev => ({ ...prev, isFrozen: !prev.isFrozen }))} className={`w-full py-2 rounded-lg text-[10px] font-black uppercase ${stats.isFrozen ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400'}`}>
              {stats.isFrozen ? 'Unfreeze Economy' : 'Freeze Economy'}
            </button>
            <button onClick={() => setStats(prev => ({ ...prev, infiniteMep: !prev.infiniteMep }))} className={`w-full py-2 rounded-lg text-[10px] font-black uppercase ${stats.infiniteMep ? 'bg-purple-600 text-white' : 'bg-slate-800 text-slate-400'}`}>
              {stats.infiniteMep ? 'Disable Infinite' : 'Enable Infinite'}
            </button>
          </div>
        </div>

        <div className="flex-1 p-8 overflow-y-auto">
          {activeTab === 'economy' && (
            <div className="animate-in fade-in duration-300">
              <SectionTitle icon={TrendingUp} title="🧪 Economy Controls" color="text-emerald-400" />
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4 bg-slate-900/50 p-6 rounded-2xl border border-slate-800">
                  <label className="text-[10px] font-black text-slate-500 uppercase">Set MEP Balance</label>
                  <div className="flex gap-2">
                    <input type="number" placeholder="Value..." className="flex-1 bg-black border border-slate-800 rounded-lg px-3 py-2 text-white font-bold" id="mep-set" />
                    <button onClick={() => {
                      const val = Number((document.getElementById('mep-set') as HTMLInputElement).value);
                      setStats(prev => ({ ...prev, mep: val }));
                    }} className="bg-emerald-500 text-black px-4 font-black rounded-lg text-xs uppercase">Set</button>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {[1e6, 1e9, 1e12].map(n => (
                      <button key={n} onClick={() => setStats(prev => ({ ...prev, mep: prev.mep + n }))} className="bg-slate-800 py-2 rounded-lg text-[10px] font-bold text-slate-300 hover:bg-emerald-500/20">+{formatNumber(n)}</button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4 bg-slate-900/50 p-6 rounded-2xl border border-slate-800">
                  <label className="text-[10px] font-black text-slate-500 uppercase">CPS & Click Power</label>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-300">Admin CPS Flat Bonus</span>
                      <input type="number" value={stats.adminCpsFlatBonus} onChange={(e) => setStats(prev => ({ ...prev, adminCpsFlatBonus: Number(e.target.value) }))} className="w-24 bg-black border border-slate-800 rounded px-2 py-1 text-xs" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-300">Global Multiplier</span>
                      <select onChange={(e) => setStats(prev => ({ ...prev, adminCpsMultiplier: Number(e.target.value) }))} className="bg-black border border-slate-800 text-xs px-2 py-1">
                        <option value="1">1x</option>
                        <option value="10">10x</option>
                        <option value="100">100x</option>
                        <option value="1000">1000x</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'inventory' && (
            <div className="animate-in slide-in-from-bottom duration-300">
              <SectionTitle icon={Archive} title="🥫 Inventory & Flavor" color="text-blue-400" />
              <div className="space-y-6">
                <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800">
                   <h4 className="text-xs font-black text-slate-400 uppercase mb-4">Spawn Any Flavor</h4>
                   <div className="grid grid-cols-4 gap-2 h-64 overflow-y-auto pr-2">
                     {FLAVORS.map(f => (
                       <button key={f.id} onClick={() => setStats(prev => ({ ...prev, inventory: [...prev.inventory, f.id] }))} className="text-[10px] font-bold py-2 px-1 border border-slate-800 rounded hover:border-[#32CD32] truncate" style={{ backgroundColor: f.color + '22' }}>{f.name}</button>
                     ))}
                   </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <button onClick={() => setStats(prev => ({ ...prev, inventory: FLAVORS.map(f => f.id) }))} className="bg-blue-600 text-white py-3 rounded-xl font-black text-[10px] uppercase shadow-lg shadow-blue-600/20">Unlock All Flavors</button>
                  <button onClick={() => setStats(prev => ({ ...prev, inventory: [], equippedIds: [] }))} className="bg-red-600 text-white py-3 rounded-xl font-black text-[10px] uppercase">Clear Inventory</button>
                  <button onClick={() => {
                    setStats(prev => ({ ...prev, inventory: [...prev.inventory, 'admin-monster'], equippedIds: ['admin-monster'] }));
                    alert('ADMIN OVERLORD EQUIPPED');
                  }} className="bg-white text-black py-3 rounded-xl font-black text-[10px] uppercase flex items-center justify-center gap-2 font-display"><Flame className="w-4 h-4" /> Admin Monster</button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'crates' && (
            <div className="animate-in slide-in-from-right duration-300">
              <SectionTitle icon={Package} title="📦 Crate Controls" color="text-yellow-400" />
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-4 bg-slate-900/50 p-6 rounded-2xl border border-slate-800">
                  <h4 className="text-xs font-black text-slate-400 uppercase mb-2">Next Drop Rarity</h4>
                  <div className="flex flex-wrap gap-2">
                    {Object.values(Rarity).map(r => (
                      <button key={r} onClick={() => setStats(prev => ({ ...prev, forcedRarity: r }))} className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all ${stats.forcedRarity === r ? 'bg-yellow-500 text-black' : 'bg-slate-800 text-slate-400 hover:text-white'}`}>{r}</button>
                    ))}
                    <button onClick={() => setStats(prev => ({ ...prev, forcedRarity: null }))} className="px-3 py-1.5 rounded-lg text-[10px] font-black uppercase bg-red-900/50 text-red-200">Reset Force</button>
                  </div>
                </div>
                <div className="space-y-4 bg-slate-900/50 p-6 rounded-2xl border border-slate-800">
                  <h4 className="text-xs font-black text-slate-400 uppercase mb-2">Automated Opening</h4>
                  <button onClick={() => setStats(prev => ({ ...prev, autoOpenCrates: !prev.autoOpenCrates }))} className={`w-full py-3 rounded-xl font-black text-xs uppercase ${stats.autoOpenCrates ? 'bg-yellow-500 text-black' : 'bg-slate-800 text-slate-400'}`}>
                    {stats.autoOpenCrates ? 'Spam Mode: ON' : 'Spam Mode: OFF'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'upgrades' && (
            <div className="animate-in slide-in-from-top duration-300">
              <SectionTitle icon={Zap} title="⚙️ Upgrade Engineering" color="text-cyan-400" />
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-4">
                  <button onClick={() => {
                    const maxed: Record<string, number> = {};
                    UPGRADES.forEach(u => maxed[u.id] = 100);
                    setStats(prev => ({ ...prev, upgrades: maxed }));
                  }} className="w-full bg-cyan-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-cyan-600/20">MAX ALL UPGRADES (Lvl 100)</button>
                  <button onClick={() => setStats(prev => ({ ...prev, noUpgradeCost: !prev.noUpgradeCost }))} className={`w-full py-4 rounded-2xl font-black uppercase tracking-widest ${stats.noUpgradeCost ? 'bg-cyan-400 text-black' : 'bg-slate-800 text-slate-400'}`}>
                    {stats.noUpgradeCost ? 'FREE UPGRADES ENABLED' : 'ENABLE FREE UPGRADES'}
                  </button>
                </div>
                <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 flex flex-col justify-center items-center text-center">
                   <RotateCcw className="w-12 h-12 text-slate-700 mb-4" />
                   <h4 className="font-bold text-slate-300 mb-2">Factory Reset</h4>
                   <button onClick={() => setStats(prev => ({ ...prev, upgrades: {} }))} className="text-red-500 font-black uppercase text-[10px] hover:underline">Reset all upgrades to Level 0</button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'rebirth' && (
            <div className="animate-in fade-in duration-300">
              <SectionTitle icon={RotateCcw} title="🔁 Rebirth Control" color="text-orange-400" />
              <div className="grid grid-cols-3 gap-4">
                 {[1, 5, 10, 25, 50, 100].map(lv => (
                   <button key={lv} onClick={() => setStats(prev => ({ ...prev, rebirths: lv }))} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl hover:border-orange-500 transition-colors group">
                      <div className="text-[10px] font-black text-slate-500 mb-1 group-hover:text-orange-500 uppercase">Skip to</div>
                      <div className="text-3xl font-display font-black text-white">LV. {lv}</div>
                   </button>
                 ))}
                 <button onClick={() => setStats(prev => ({ ...prev, mep: 1e30 }))} className="bg-orange-600 text-white py-3 rounded-xl font-black text-[10px] uppercase col-span-3">Force Condition (Set Max MEP)</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const CratePanel: React.FC<{ mep: number, onOpenCrate: (cid: string) => void, stats: PlayerStats }> = ({ mep, onOpenCrate, stats }) => {
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
              <span className="text-xs font-black text-[#32CD32] font-display">{formatNumber(crate.price)} MEP</span>
            </div>
            <p className="text-xs text-slate-400 mb-4">{crate.description}</p>
            <div className="flex gap-2">
              <div className="flex-1 text-[10px] text-slate-500 font-bold uppercase py-1 truncate">Drops: {crate.rarities.join(', ')}</div>
              <button 
                disabled={!stats.isAdminEnabled && !stats.noUpgradeCost && mep < crate.price}
                onClick={() => onOpenCrate(crate.id)}
                className={`px-4 py-1.5 rounded-lg text-xs font-black uppercase transition-all ${(mep >= crate.price || stats.noUpgradeCost || stats.isAdminEnabled) ? 'bg-[#32CD32] text-black hover:scale-105 active:scale-95' : 'bg-slate-700 text-slate-500 cursor-not-allowed'}`}
              >
                {stats.noUpgradeCost || stats.isAdminEnabled ? 'Claim' : 'Buy'}
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
            className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'text-[#32CD32] bg-[#32CD32]/5 font-black' : 'text-slate-500 hover:text-slate-300 font-bold'}`}
          >
            {tab === 'click' ? 'Click Power' : tab === 'automation' ? 'Automation' : 'Flavor Boosts'}
          </button>
        ))}
      </div>
      
      <div className="flex-1 flex gap-4 p-4 overflow-x-auto overflow-y-hidden">
        {UPGRADES.filter(u => u.type === activeTab).map(upgrade => {
          const level = stats.upgrades[upgrade.id] || 0;
          const cost = Math.floor(upgrade.baseCost * Math.pow(upgrade.multiplier, level));
          const isMaxLevel = level >= 100;
          const canAfford = !isMaxLevel && (stats.noUpgradeCost || stats.mep >= cost);

          return (
            <div 
              key={upgrade.id}
              onClick={() => canAfford && onUpgrade(upgrade.id)}
              className={`min-w-[200px] bg-slate-900 border border-slate-800 p-4 rounded-xl transition-all hover:border-slate-600 active:scale-95 group ${isMaxLevel ? 'border-yellow-500/50 cursor-default opacity-90' : canAfford ? 'cursor-pointer' : 'opacity-50 grayscale cursor-not-allowed'}`}
            >
              <div className="flex justify-between items-start mb-1">
                <h5 className={`font-bold text-sm ${isMaxLevel ? 'text-yellow-500' : 'text-slate-200'}`}>{upgrade.name}</h5>
                <span className={`text-[10px] px-1.5 py-0.5 rounded font-black ${isMaxLevel ? 'bg-yellow-500 text-black' : 'bg-slate-800 text-slate-400'}`}>Lvl {level}</span>
              </div>
              <p className="text-[10px] text-slate-400 mb-4 line-clamp-2">{upgrade.description}</p>
              <div className="mt-auto pt-2 border-t border-slate-800 flex justify-between items-center">
                 <span className={`text-xs font-black ${isMaxLevel ? 'text-yellow-500' : 'text-[#32CD32]'}`}>
                    {isMaxLevel ? 'MAXED' : stats.noUpgradeCost ? 'FREE' : formatNumber(cost) + ' MEP'}
                 </span>
                 <CheckCircle className={`w-4 h-4 ${isMaxLevel ? 'text-yellow-500' : canAfford ? 'text-[#32CD32]' : 'text-slate-700'}`} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const RebirthWarningModal: React.FC<{ onConfirm: () => void, onCancel: () => void, bonus: number }> = ({ onConfirm, onCancel, bonus }) => {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[300] bg-black/90 backdrop-blur-sm flex items-center justify-center p-6">
      <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="bg-slate-900 border border-slate-800 p-8 rounded-3xl max-w-md w-full shadow-2xl space-y-6 text-center">
        <div className="w-20 h-20 bg-yellow-500/10 rounded-full flex items-center justify-center mx-auto text-yellow-500 mb-2">
           <AlertTriangle className="w-10 h-10" />
        </div>
        <div>
          <h3 className="text-3xl font-display font-black text-white uppercase tracking-tighter mb-2">FINAL WARNING</h3>
          <p className="text-slate-400 text-sm leading-relaxed font-sans">
            Rebirthing will reset your current <span className="text-white font-bold font-display">MEP balance</span> and <span className="text-red-500 font-bold">all collected flavors</span>. 
            However, you will keep all of your purchased <span className="text-[#32CD32] font-bold">Upgrades</span> and gain a <span className="text-yellow-500 font-bold font-display">{bonus}x Multiplier</span>.
          </p>
        </div>
        <div className="flex flex-col gap-3">
          <button onClick={onConfirm} className="w-full bg-[#32CD32] hover:bg-[#28a428] text-black font-black py-4 rounded-2xl uppercase tracking-widest transition-all text-sm font-display">Yes, Ascend Now</button>
          <button onClick={onCancel} className="w-full text-slate-500 hover:text-white font-bold py-2 text-xs uppercase tracking-widest transition-colors font-display">Wait, I'm not ready</button>
        </div>
      </motion.div>
    </motion.div>
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
    isAdminEnabled: false,
    isFrozen: false,
    infiniteMep: false,
    adminCpsMultiplier: 1,
    adminClickPowerMultiplier: 1,
    adminCpsFlatBonus: 0,
    noUpgradeCost: false,
    forcedRarity: null,
    autoOpenCrates: false
  });

  const [floatingParticles, setFloatingParticles] = useState<{ id: number, x: number, y: number, value: string, isAuto?: boolean }[]>([]);
  const [showAdmin, setShowAdmin] = useState(false);
  const [showDevHub, setShowDevHub] = useState(false);
  const [showRebirthModal, setShowRebirthModal] = useState(false);
  const logoClickCount = useRef(0);
  const lastSaveTime = useRef(Date.now());

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

  useEffect(() => {
    const interval = setInterval(() => {
      if (Date.now() - lastSaveTime.current > 120000) {
        saveToLocal();
      }
    }, 10000);
    return () => clearInterval(interval);
  }, [saveToLocal]);

  useEffect(() => {
    const activeFlavors = stats.equippedIds.map(id => FLAVORS.find(f => f.id === id)).filter(Boolean) as Flavor[];
    const baseCPS = activeFlavors.reduce((acc, f) => acc + f.baseCPS, 0);
    
    const clickMulti = Math.pow(2, stats.upgrades['click-1'] || 0);
    const critLevel = stats.upgrades['click-crit'] || 0;
    const autoSpeed = 1 + (stats.upgrades['auto-speed'] || 0) * 0.1;
    const synergyMulti = 1 + (stats.upgrades['boost-perc'] || 0) * 0.05;

    const rebirthMulti = 1 + stats.rebirths * 1.5;

    const totalCPS = (baseCPS * synergyMulti * autoSpeed * rebirthMulti + stats.adminCpsFlatBonus) * stats.adminCpsMultiplier;
    const totalClickPower = (1 + totalCPS * 0.1) * clickMulti * rebirthMulti * stats.adminClickPowerMultiplier;

    setStats(prev => ({
      ...prev,
      cps: totalCPS,
      clickPower: totalClickPower,
      critChance: 0.05 + critLevel * 0.05
    }));
  }, [stats.equippedIds, stats.upgrades, stats.rebirths, stats.adminCpsMultiplier, stats.adminClickPowerMultiplier, stats.adminCpsFlatBonus]);

  useEffect(() => {
    const loop = setInterval(() => {
      if (stats.cps > 0 && !stats.isFrozen) {
        const gain = stats.cps / 10;
        setStats(prev => ({
          ...prev,
          mep: prev.infiniteMep ? Infinity : prev.mep + gain,
          totalMepEarned: prev.totalMepEarned + gain
        }));
      }
    }, 100);
    return () => clearInterval(loop);
  }, [stats.cps, stats.isFrozen, stats.infiniteMep]);

  useEffect(() => {
    const fingerLevel = stats.upgrades['auto-fingers'] || 0;
    if (fingerLevel > 0 && !stats.isFrozen) {
      const delay = Math.max(80, 1000 / Math.pow(1.15, fingerLevel - 1));
      const interval = setInterval(() => {
        const centerX = window.innerWidth / 2 + (Math.random() - 0.5) * 100;
        const centerY = window.innerHeight / 2 + (Math.random() - 0.5) * 100;
        handleTap(centerX, centerY, true);
      }, delay);
      return () => clearInterval(interval);
    }
  }, [stats.upgrades['auto-fingers'], stats.isFrozen, stats.clickPower, stats.critChance]);

  const handleTap = (x: number, y: number, isAuto: boolean = false) => {
    if (stats.isFrozen) return;
    const isCrit = Math.random() < stats.critChance;
    const gain = stats.clickPower * (isCrit ? 2 : 1);
    
    setStats(prev => ({
      ...prev,
      mep: prev.infiniteMep ? Infinity : prev.mep + gain,
      totalMepEarned: prev.totalMepEarned + gain
    }));

    const id = Date.now() + Math.random();
    setFloatingParticles(prev => [...prev, { 
      id, 
      x, 
      y, 
      value: `+${formatNumber(gain)}${isCrit ? ' CRIT!' : ''}`,
      isAuto
    }]);
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
    if (!crate) return;
    
    const canAfford = stats.isAdminEnabled || stats.noUpgradeCost || stats.mep >= crate.price;
    if (!canAfford) return;

    if (!stats.noUpgradeCost && !stats.isAdminEnabled) {
      setStats(prev => ({ ...prev, mep: prev.mep - crate.price }));
    }

    const rollCount = stats.autoOpenCrates ? 10 : 1;
    const newItems: string[] = [];

    for (let i = 0; i < rollCount; i++) {
      let possibleFlavors = FLAVORS.filter(f => crate.rarities.includes(f.rarity));
      if (stats.forcedRarity) {
        const forced = FLAVORS.filter(f => f.rarity === stats.forcedRarity);
        if (forced.length > 0) possibleFlavors = forced;
      }
      const drop = possibleFlavors[Math.floor(Math.random() * possibleFlavors.length)];
      newItems.push(drop.id);
    }

    if (rollCount === 1) {
      const drop = FLAVORS.find(f => f.id === newItems[0]);
      alert(`You found: ${drop?.name}!`);
    } else {
      alert(`Bulk Open complete! Found ${newItems.length} flavors.`);
    }

    setStats(prev => ({
      ...prev,
      inventory: [...prev.inventory, ...newItems]
    }));
    saveToLocal();
  };

  const handleUpgrade = (upgradeId: string) => {
    const upgrade = UPGRADES.find(u => u.id === upgradeId);
    if (!upgrade) return;

    const level = stats.upgrades[upgradeId] || 0;
    if (level >= 100) return;

    const cost = Math.floor(upgrade.baseCost * Math.pow(upgrade.multiplier, level));
    const canAfford = stats.noUpgradeCost || stats.mep >= cost;

    if (canAfford) {
      setStats(prev => ({
        ...prev,
        mep: stats.noUpgradeCost ? prev.mep : prev.mep - cost,
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
          newEquipped.shift(); 
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
      mep: prev.infiniteMep ? Infinity : prev.mep + price,
      inventory: prev.inventory.filter((id, i) => i !== prev.inventory.indexOf(fid)),
      equippedIds: prev.equippedIds.filter(id => id !== fid)
    }));
    saveToLocal();
  };

  const handleRebirth = () => {
    const stage = REBIRTH_STAGES[stats.rebirths] || REBIRTH_STAGES[REBIRTH_STAGES.length - 1];
    if (stats.mep >= stage.milestone || stats.isAdminEnabled) {
      setStats(prev => ({
        ...prev,
        mep: 0,
        inventory: ['m-orig'],
        equippedIds: ['m-orig'],
        rebirths: prev.rebirths + 1,
      }));
      setShowRebirthModal(false);
      saveToLocal();
    }
  };

  const mainEquippedFlavor = FLAVORS.find(f => f.id === stats.equippedIds[0]) || FLAVORS[0];

  return (
    <div className="flex flex-col h-screen monster-gradient overflow-hidden selection:bg-[#32CD32] selection:text-black">
      <TopBar stats={stats} onLogoClick={handleLogoClick} onOpenDevHub={() => setShowDevHub(true)} />
      
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
                      <span className="text-xs font-black text-slate-500 font-display">{formatNumber(stats.mep)} / {formatNumber(stage.milestone)} MEP</span>
                   </div>
                   <div className="h-4 bg-slate-900 border border-slate-800 rounded-full overflow-hidden p-0.5 shadow-inner">
                     <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        className="h-full bg-gradient-to-r from-[#32CD32] to-emerald-400 rounded-full shadow-[0_0_15px_#32CD32CC]"
                     />
                   </div>
                   {progress >= 100 && (
                     <motion.button 
                       initial={{ scale: 0.9, opacity: 0 }}
                       animate={{ scale: 1, opacity: 1 }}
                       onClick={() => setShowRebirthModal(true)}
                       className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-black py-4 rounded-xl uppercase tracking-widest shadow-xl shadow-yellow-500/20 font-display transition-all"
                     >
                       REBIRTH NOW (Keep Upgrades!)
                     </motion.button>
                   )}
                 </div>
               );
            })()}
          </div>
          
          <UpgradePanel stats={stats} onUpgrade={handleUpgrade} />
        </div>

        <CratePanel mep={stats.mep} onOpenCrate={openCrate} stats={stats} />
      </div>

      <AnimatePresence>
        {floatingParticles.map(p => (
          <div 
            key={p.id} 
            className={`particle font-display font-black text-xl pointer-events-none drop-shadow-lg z-[999] flex flex-col items-center ${p.isAuto ? 'text-blue-400 font-sans italic' : 'text-[#32CD32]'}`} 
            style={{ left: p.x, top: p.y }}
          >
            {p.value}
            {p.isAuto && <span className="text-[8px] font-black -mt-1 tracking-tighter bg-blue-500 text-white px-1 rounded shadow-lg uppercase">Auto</span>}
          </div>
        ))}
      </AnimatePresence>

      <AnimatePresence>
        {showAdmin && <AdminPanel stats={stats} setStats={setStats} onClose={() => setShowAdmin(false)} />}
      </AnimatePresence>

      <AnimatePresence>
        {showDevHub && <DevHub onClose={() => setShowDevHub(false)} />}
      </AnimatePresence>

      <AnimatePresence>
        {showRebirthModal && (
          <RebirthWarningModal 
            onConfirm={handleRebirth} 
            onCancel={() => setShowRebirthModal(false)} 
            bonus={REBIRTH_STAGES[stats.rebirths]?.bonus || 100} 
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;
