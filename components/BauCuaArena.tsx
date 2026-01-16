import React, { useState } from 'react';
import { MASCOTS } from '../constants';
import { BauCuaMascot, User } from '../types';
import { RotateCw, ChevronLeft, Coins } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface BauCuaArenaProps {
    user?: User;
    onUpdateBalance?: (newBalance: number) => void;
}

const BauCuaArena: React.FC<BauCuaArenaProps> = ({ user, onUpdateBalance }) => {
  const navigate = useNavigate();
  const [bets, setBets] = useState<Record<string, number>>({});
  const [isShaking, setIsShaking] = useState(false);

  // Simplified logic for UI focus
  const placeBet = (key: string) => {
      setBets(prev => ({ ...prev, [key]: (prev[key] || 0) + 1000 }));
      if(onUpdateBalance && user) onUpdateBalance(user.balance - 1000);
  };

  const shake = () => {
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 2000);
  };

  return (
    <div className="h-full flex flex-col">
       <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="p-2 glass-panel rounded-full text-white/70 hover:text-white">
                <ChevronLeft size={20} />
            </button>
            <h1 className="text-2xl font-serif font-bold text-white">Sòng Bầu Cua</h1>
        </div>
        <div className="px-3 py-1 glass-panel rounded-full flex items-center gap-2">
            <Coins size={14} className="text-tet-gold" />
            <span className="text-xs font-mono">{user?.balance.toLocaleString()}</span>
        </div>
      </div>

      {/* Holographic Bowl */}
      <div className="flex-1 flex items-center justify-center relative mb-8">
          <div className={`w-64 h-64 rounded-full border border-white/10 flex items-center justify-center relative ${isShaking ? 'animate-bounce' : ''}`}>
              <div className="absolute inset-0 bg-tet-red/10 blur-3xl rounded-full"></div>
              <div className="glass-panel w-48 h-48 rounded-full flex items-center justify-center z-10 border border-white/20 shadow-[0_0_30px_rgba(255,59,48,0.3)]">
                  {isShaking ? <span className="text-4xl animate-spin">🎲</span> : <span className="text-white/50 text-xs">Tap Xóc</span>}
              </div>
          </div>
      </div>

      {/* Neon Grid Board */}
      <div className="glass-panel rounded-t-[2.5rem] p-6 pb-24 -mx-4">
          <div className="grid grid-cols-3 gap-3">
              {MASCOTS.map((m) => (
                  <button 
                    key={m.key} 
                    onClick={() => placeBet(m.key)}
                    className={`aspect-square rounded-2xl border border-white/5 bg-white/5 flex flex-col items-center justify-center gap-1 relative overflow-hidden active:scale-95 transition-transform ${bets[m.key] ? 'border-tet-gold bg-tet-gold/10' : ''}`}
                  >
                      <span className="text-2xl">{m.icon}</span>
                      <span className="text-[10px] uppercase font-bold text-white/60">{m.key}</span>
                      {bets[m.key] && (
                          <div className="absolute top-1 right-1 bg-tet-gold text-black text-[9px] font-bold px-1.5 rounded-full">
                              {(bets[m.key]/1000)}k
                          </div>
                      )}
                  </button>
              ))}
          </div>
          <button 
            onClick={shake}
            className="w-full mt-6 bg-gradient-to-r from-tet-red to-orange-600 py-4 rounded-2xl font-bold shadow-lg shadow-red-900/40 flex items-center justify-center gap-2"
          >
              <RotateCw size={18} className={isShaking ? 'animate-spin' : ''} />
              {isShaking ? 'Đang Xóc...' : 'Xóc Đĩa'}
          </button>
      </div>
    </div>
  );
};

export default BauCuaArena;