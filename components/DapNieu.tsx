import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, Hammer, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { User } from '../types';

interface DapNieuProps {
  user: User;
  onUpdateBalance: (amount: number) => void;
}

interface Pot {
  id: number;
  x: number; // Percentage 0-100
  speed: number;
  isBroken: boolean;
  reward: number;
  type: 'lucky' | 'empty' | 'gold';
}

const DapNieu: React.FC<DapNieuProps> = ({ user, onUpdateBalance }) => {
  const navigate = useNavigate();
  const [pots, setPots] = useState<Pot[]>([]);
  const [isSwinging, setIsSwinging] = useState(false);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<number>(0);
  const lastSpawnTime = useRef<number>(0);

  // Game Loop
  const animate = (time: number) => {
    if (!lastSpawnTime.current) lastSpawnTime.current = time;
    const deltaTime = time - lastSpawnTime.current;

    // Spawn Pot every 1.5s (approx)
    if (deltaTime > 1500) {
      spawnPot();
      lastSpawnTime.current = time;
    }

    setPots(prevPots => {
      return prevPots
        .map(pot => ({ ...pot, x: pot.x + pot.speed }))
        .filter(pot => pot.x < 110); // Remove off-screen
    });

    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, []);

  const spawnPot = () => {
    const types: Pot['type'][] = ['empty', 'lucky', 'lucky', 'gold'];
    const type = types[Math.floor(Math.random() * types.length)];
    let reward = 0;
    if (type === 'lucky') reward = 1000;
    if (type === 'gold') reward = 5000;

    const newPot: Pot = {
      id: Date.now(),
      x: -10,
      speed: 0.3 + Math.random() * 0.3, // Varying speeds
      isBroken: false,
      reward,
      type
    };
    setPots(prev => [...prev, newPot]);
  };

  const handleSmash = () => {
    if (isSwinging) return;
    setIsSwinging(true);
    
    // Play sound (optional, browser policy restricts auto audio)
    if(navigator.vibrate) navigator.vibrate(50);

    setTimeout(() => setIsSwinging(false), 300); // Reset swing

    // Hit Detection
    // Hit zone is roughly center screen: 45% to 55%
    let hit = false;
    setPots(prev => prev.map(pot => {
      if (!pot.isBroken && pot.x > 40 && pot.x < 60) {
        hit = true;
        if (pot.reward > 0) {
            onUpdateBalance(user.balance + pot.reward);
            setScore(s => s + pot.reward);
        }
        return { ...pot, isBroken: true };
      }
      return pot;
    }));

    if (hit) {
        setCombo(c => c + 1);
        if(navigator.vibrate) navigator.vibrate([50, 50, 50]);
    } else {
        setCombo(0);
    }
  };

  return (
    <div className="h-full flex flex-col bg-slate-900 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1548013146-72479768bada?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-40 pointer-events-none"></div>
      
      {/* UI Overlay */}
      <div className="relative z-20 flex justify-between items-center p-6">
         <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="p-2 glass-panel rounded-full text-white/70 hover:text-white">
                <ChevronLeft size={20} />
            </button>
            <h1 className="text-xl font-serif font-bold text-white shadow-black drop-shadow-md">Đập Niêu</h1>
         </div>
         <div className="flex flex-col items-end">
             <span className="text-tet-gold font-mono font-bold text-xl">+{score.toLocaleString()}</span>
             {combo > 1 && <span className="text-orange-400 font-bold text-xs animate-bounce">Combo x{combo}</span>}
         </div>
      </div>

      {/* Game Area */}
      <div className="flex-1 relative" ref={containerRef}>
          
          {/* Rope */}
          <div className="absolute top-[30%] left-0 w-full h-1 bg-amber-800 shadow-sm z-10"></div>

          {/* Hit Zone Marker (Visual Guide) */}
          <div className="absolute top-[30%] left-1/2 -translate-x-1/2 w-20 h-40 border-x-2 border-white/10 bg-white/5 pointer-events-none z-0"></div>

          {/* Pots */}
          {pots.map(pot => (
              <div 
                key={pot.id}
                className="absolute top-[30%] transition-transform will-change-transform z-20"
                style={{ 
                    left: `${pot.x}%`,
                    transform: `translateX(-50%) ${pot.isBroken ? 'translateY(100px) rotate(45deg) scale(0.5)' : 'translateY(0)'}`,
                    opacity: pot.isBroken ? 0 : 1,
                    transition: pot.isBroken ? 'all 0.3s ease-in' : 'none'
                }}
              >
                  {/* Rope Connector */}
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-0.5 h-4 bg-amber-100/50"></div>
                  
                  {/* Pot Body */}
                  <div className={`
                    w-16 h-20 rounded-b-3xl rounded-t-lg shadow-lg flex items-center justify-center relative
                    ${pot.type === 'gold' ? 'bg-gradient-to-b from-yellow-300 to-yellow-600 border border-yellow-200' : 'bg-gradient-to-b from-orange-800 to-orange-900 border border-orange-950'}
                  `}>
                      <div className="w-full h-2 bg-black/20 absolute top-2"></div>
                      {pot.type === 'lucky' && <span className="text-2xl">🧧</span>}
                      {pot.type === 'gold' && <span className="text-2xl animate-pulse">💎</span>}
                  </div>

                  {/* Broken Effect Particles */}
                  {pot.isBroken && (
                      <div className="absolute inset-0 flex items-center justify-center">
                          <Sparkles className="text-yellow-400 animate-ping" size={40} />
                          {pot.reward > 0 && (
                             <div className="absolute -top-10 text-tet-gold font-bold text-lg animate-float">+{pot.reward}</div>
                          )}
                      </div>
                  )}
              </div>
          ))}

          {/* Player/Stick */}
          <div 
            className="absolute bottom-0 left-0 w-full h-full z-30 cursor-crosshair"
            onClick={handleSmash}
          >
              <div className="absolute bottom-10 left-1/2 -translate-x-1/2 pointer-events-none">
                  {/* The Stick */}
                  <div 
                    className={`w-4 h-64 bg-gradient-to-t from-amber-900 to-amber-600 rounded-full border border-black shadow-xl origin-bottom transition-transform duration-100 ease-out
                        ${isSwinging ? 'rotate-[-30deg]' : 'rotate-[15deg]'}
                    `}
                    style={{ transformOrigin: 'bottom center' }}
                  ></div>
                  
                  {/* Hand (Simplified) */}
                  <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-16 h-16 bg-blue-900 rounded-full border-4 border-white/20"></div>
              </div>
              
              <div className="absolute bottom-20 w-full text-center pointer-events-none">
                  <p className="text-white/50 text-sm animate-pulse">Chạm màn hình để đập!</p>
              </div>
          </div>
      </div>
    </div>
  );
};

export default DapNieu;