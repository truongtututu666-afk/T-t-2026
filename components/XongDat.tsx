import React, { useState } from 'react';
import { ChevronLeft, UserCheck, Star, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ZODIAC_AVATARS } from '../constants';

const XongDat: React.FC = () => {
  const navigate = useNavigate();
  const [hostZodiac, setHostZodiac] = useState<string | null>(null);

  // Simplified Logic (Same as before, just UI update)
  const getCompatibility = (host: string) => {
     let advice = [];
    if (host === 'Rat') advice = [{ z: 'Monkey', score: 9 }, { z: 'Dragon', score: 8 }, { z: 'Ox', score: 7 }];
    else advice = [{ z: 'Tiger', score: 9 }, { z: 'Dog', score: 9 }, { z: 'Goat', score: 8 }]; // Default fallback for demo
    return advice;
  };

  return (
    <div className="h-full flex flex-col">
       <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate(-1)} className="p-2 glass-panel rounded-full text-white/70 hover:text-white">
            <ChevronLeft size={20} />
        </button>
        <h1 className="text-2xl font-serif font-bold">Xông Đất 2026</h1>
      </div>

      <div className="glass-panel rounded-[2.5rem] flex-1 p-6 overflow-y-auto">
        {!hostZodiac ? (
            <div className="animate-fade-in-up">
                <p className="text-white/60 mb-6 text-center text-sm">Chọn tuổi gia chủ</p>
                <div className="grid grid-cols-3 gap-3">
                    {ZODIAC_AVATARS.map((z) => (
                        <button 
                            key={z} 
                            onClick={() => setHostZodiac(z)}
                            className="aspect-square glass-card rounded-2xl flex flex-col items-center justify-center gap-2 hover:bg-white/10 transition-colors"
                        >
                            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-lg">🦁</div>
                            <span className="text-xs font-medium">{z}</span>
                        </button>
                    ))}
                </div>
            </div>
        ) : (
            <div className="animate-fade-in-up space-y-6">
                <div className="flex items-center justify-between bg-white/5 p-4 rounded-2xl border border-white/10">
                    <div>
                        <p className="text-xs text-gray-500 uppercase">Gia chủ</p>
                        <h3 className="text-2xl font-bold">{hostZodiac}</h3>
                    </div>
                    <button onClick={() => setHostZodiac(null)} className="p-2 bg-white/10 rounded-full">
                        <RefreshCw size={16} />
                    </button>
                </div>

                <div className="space-y-3">
                    <h4 className="text-sm font-bold text-green-400 flex items-center gap-2"><UserCheck size={16}/> Người hợp tuổi</h4>
                    {getCompatibility(hostZodiac).map((item, idx) => (
                        <div key={idx} className="glass-card p-4 rounded-2xl flex items-center justify-between border-l-4 border-green-500">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">✨</div>
                                <div>
                                    <h5 className="font-bold">{item.z}</h5>
                                    <p className="text-xs text-white/40">Đại Cát</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-1 text-tet-gold">
                                <span className="font-mono font-bold text-xl">{item.score}</span>
                                <Star size={12} fill="currentColor" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default XongDat;