import React, { useState } from 'react';
import { ChevronLeft, Gift } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { User } from '../types';

interface LuckyWheelProps {
  user: User;
  onUpdateBalance: (amount: number) => void;
}

const SEGMENTS = [
  { label: '1.000', value: 1000, color: '#ef4444' }, // Red
  { label: 'May Mắn', value: 0, color: '#f59e0b' }, // Amber
  { label: '5.000', value: 5000, color: '#10b981' }, // Emerald
  { label: 'Thêm Lượt', value: 0, color: '#3b82f6' }, // Blue
  { label: '10.000', value: 10000, color: '#8b5cf6' }, // Violet
  { label: 'Chúc Vui', value: 0, color: '#6b7280' }, // Gray
  { label: '2.000', value: 2000, color: '#ec4899' }, // Pink
  { label: '50.000', value: 50000, color: '#eab308' }, // Yellow
];

const LuckyWheel: React.FC<LuckyWheelProps> = ({ user, onUpdateBalance }) => {
  const navigate = useNavigate();
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [lastWin, setLastWin] = useState<string | null>(null);

  const handleSpin = () => {
    if (isSpinning) return;
    
    // Cost to spin check (optional, kept free for fun)
    // if (user.balance < 1000) return alert("Không đủ tiền!");

    setIsSpinning(true);
    setLastWin(null);

    // Random rotation: Current + (5 to 10 full spins) + random segment offset
    const randomOffset = Math.floor(Math.random() * 360);
    const spins = 360 * (5 + Math.floor(Math.random() * 5));
    const newRotation = rotation + spins + randomOffset;
    
    setRotation(newRotation);

    // Calculate result after spin duration (3s)
    setTimeout(() => {
      setIsSpinning(false);
      const actualDeg = newRotation % 360;
      // Calculate index. Wheel rotates clockwise, so pointer at top (270deg or -90deg)
      // Actually CSS rotate moves the wheel. The fixed pointer is at top.
      // 0 deg = Segment 0 at 3 o'clock. 
      // Top is 270 deg relative to 0.
      // Let's simplify: 
      // Segment angle size = 360 / 8 = 45.
      // Pointer is static at top.
      const segmentAngle = 360 / SEGMENTS.length;
      // The segment at the top is determined by: (360 - (rotation % 360) + 270) % 360 / 45 ?
      // Let's just use the visual approximation for now or logic:
      // Index = Math.floor(((360 - actualDeg + 90) % 360) / segmentAngle);
      // Wait, 0 deg is usually 3 o'clock in CSS. If pointer is top, offset is 90 deg.
      
      const winningIndex = Math.floor(((360 - (actualDeg % 360)) + 90) % 360 / 45) % 8;
      const win = SEGMENTS[winningIndex];

      if (win.value > 0) {
          setLastWin(`+${win.value.toLocaleString()} xu`);
          onUpdateBalance(user.balance + win.value);
          // Confetti
          if(navigator.vibrate) navigator.vibrate([100, 50, 100, 50, 100]);
      } else {
          setLastWin(win.label);
      }

    }, 3000);
  };

  return (
    <div className="h-full flex flex-col bg-[#1a1a2e] relative overflow-hidden">
      {/* Lights Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-900/50 via-black to-black"></div>

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between p-6">
        <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="p-2 glass-panel rounded-full text-white/70 hover:text-white">
                <ChevronLeft size={20} />
            </button>
            <h1 className="text-2xl font-serif font-bold text-white">Vòng Quay</h1>
        </div>
        <div className="glass-panel px-4 py-1 rounded-full text-tet-gold font-mono">
            {user.balance.toLocaleString()} xu
        </div>
      </div>

      {/* Wheel Container */}
      <div className="flex-1 flex flex-col items-center justify-center relative z-10">
          
          {/* Pointer */}
          <div className="absolute top-[15%] z-30 translate-y-2">
              <div className="w-0 h-0 border-l-[15px] border-l-transparent border-r-[15px] border-r-transparent border-t-[30px] border-t-white drop-shadow-lg"></div>
          </div>

          {/* The Wheel */}
          <div 
            className="w-[300px] h-[300px] md:w-[400px] md:h-[400px] rounded-full border-8 border-white/20 shadow-2xl relative overflow-hidden transition-transform duration-[3000ms] cubic-bezier(0.25, 0.1, 0.25, 1)"
            style={{ 
                transform: `rotate(${rotation}deg)`,
                background: `conic-gradient(
                    ${SEGMENTS.map((s, i) => `${s.color} ${i * 45}deg ${(i + 1) * 45}deg`).join(', ')}
                )`
            }}
          >
              {/* Labels */}
              {SEGMENTS.map((s, i) => (
                  <div 
                    key={i}
                    className="absolute w-full h-full text-white font-bold text-xs md:text-sm text-center pt-4"
                    style={{ 
                        transform: `rotate(${i * 45 + 22.5}deg)`,
                        textShadow: '0 1px 2px rgba(0,0,0,0.5)'
                    }}
                  >
                      <span className="block transform rotate-0 mt-2">{s.label}</span>
                  </div>
              ))}
              
              {/* Center Cap */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center z-20">
                  <div className="w-8 h-8 bg-tet-red rounded-full"></div>
              </div>
          </div>

          {/* Controls */}
          <div className="mt-12 text-center">
              {lastWin ? (
                  <div className="animate-bounce mb-4">
                      <p className="text-gray-400 text-sm">Kết quả</p>
                      <h3 className="text-3xl font-bold text-tet-gold">{lastWin}</h3>
                  </div>
              ) : (
                  <div className="h-[60px]"></div>
              )}
              
              <button 
                onClick={handleSpin}
                disabled={isSpinning}
                className="bg-gradient-to-r from-pink-500 to-rose-600 text-white font-bold py-4 px-12 rounded-full shadow-[0_0_30px_rgba(236,72,153,0.5)] hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100 uppercase tracking-widest text-lg"
              >
                  {isSpinning ? 'Đang Quay...' : 'Quay Ngay'}
              </button>
          </div>
      </div>
    </div>
  );
};

export default LuckyWheel;