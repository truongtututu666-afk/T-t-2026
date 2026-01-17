import React, { useState, useEffect } from 'react';
import { User, RoutePath } from '../types';
import { FORTUNES } from '../constants';
import { Flame, MapPin, Compass, ArrowUpRight, Gift, Sparkles, Zap, MessageCircle, Hammer, Disc } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface DashboardProps {
  user: User;
}

const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0 });
  const [fortune] = useState(() => FORTUNES[Math.floor(Math.random() * FORTUNES.length)]);

  useEffect(() => {
    // Tet Binh Ngo 2026 is Feb 17, 2026
    const targetDate = new Date('2026-02-17T00:00:00').getTime();

    const calculateTime = () => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0 });
      }
    };

    calculateTime();
    const interval = setInterval(calculateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6 pb-20">
      {/* Greeting Section */}
      <div className="flex justify-between items-end px-2">
        <div>
            <h1 className="text-4xl font-light text-white/60">Chào,</h1>
            <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 font-serif">
                {user.name}
            </h2>
        </div>
        <div className="text-right">
            <p className="text-xs text-tet-gold font-bold uppercase tracking-widest mb-1">Tết Bính Ngọ</p>
            <div className="text-2xl font-mono font-bold text-white leading-none">
                {timeLeft.days}<span className="text-sm font-sans font-normal text-white/50 ml-1">ngày</span>
            </div>
        </div>
      </div>

      {/* Bento Grid Layout */}
      <div className="bento-grid">
        
        {/* Large Hero Card (Fortune) */}
        <div className="bento-item-large glass-card rounded-[2rem] p-6 relative overflow-hidden group min-h-[160px]">
            <div className="absolute inset-0 bg-gradient-to-br from-tet-red/20 via-transparent to-transparent opacity-50"></div>
            <div className="absolute -right-10 -top-10 text-white/5 rotate-12">
                <Sparkles size={200} />
            </div>
            
            <div className="relative z-10 h-full flex flex-col justify-between">
                <div className="flex justify-between items-start mb-2">
                    <span className="bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-xs font-medium text-white/80 border border-white/5">
                        Lời chúc hôm nay
                    </span>
                    <Sparkles className="text-tet-gold animate-pulse-slow" />
                </div>
                <h3 className="text-xl md:text-2xl font-serif text-white leading-snug max-w-[90%] italic">
                    "{fortune}"
                </h3>
            </div>
        </div>
        
        {/* --- Arcade Section --- */}
        
        {/* Bau Cua */}
        <div 
            onClick={() => navigate(RoutePath.ARCADE_BAUCUA)}
            className="glass-card rounded-[2rem] p-4 flex flex-col justify-between aspect-square group cursor-pointer hover:bg-white/5 transition-colors relative overflow-hidden"
        >
            <div className="absolute top-0 right-0 w-20 h-20 bg-orange-500/20 blur-2xl rounded-full"></div>
            <div className="w-10 h-10 rounded-full bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400 group-hover:scale-110 spring-transition relative z-10">
                <Flame size={20} fill="currentColor" />
            </div>
            <div className="relative z-10">
                <h4 className="font-bold text-base text-white">Bầu Cua</h4>
                <p className="text-[10px] text-white/50">Cổ truyền</p>
            </div>
        </div>

        {/* Dap Nieu (New) */}
        <div 
            onClick={() => navigate(RoutePath.ARCADE_DAPNIEU)}
            className="glass-card rounded-[2rem] p-4 flex flex-col justify-between aspect-square group cursor-pointer hover:bg-white/5 transition-colors relative overflow-hidden"
        >
            <div className="absolute top-0 right-0 w-20 h-20 bg-amber-500/20 blur-2xl rounded-full"></div>
            <div className="w-10 h-10 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-110 spring-transition relative z-10">
                <Hammer size={20} />
            </div>
            <div className="relative z-10">
                <h4 className="font-bold text-base text-white">Đập Niêu</h4>
                <p className="text-[10px] text-white/50">Trò chơi dân gian</p>
            </div>
        </div>

        {/* Lucky Wheel (New) */}
        <div 
            onClick={() => navigate(RoutePath.ARCADE_WHEEL)}
            className="glass-card rounded-[2rem] p-4 flex flex-col justify-between aspect-square group cursor-pointer hover:bg-white/5 transition-colors relative overflow-hidden"
        >
            <div className="absolute bottom-0 left-0 w-20 h-20 bg-pink-500/20 blur-2xl rounded-full"></div>
            <div className="w-10 h-10 rounded-full bg-pink-500/10 border border-pink-500/30 flex items-center justify-center text-pink-400 group-hover:scale-110 spring-transition relative z-10">
                <Disc size={20} className="animate-spin-slow" />
            </div>
            <div className="relative z-10">
                <h4 className="font-bold text-base text-white">Vòng Quay</h4>
                <p className="text-[10px] text-white/50">Thử vận may</p>
            </div>
        </div>

        {/* Li Xi */}
        <div 
            onClick={() => navigate(RoutePath.LIXI)}
            className="glass-card rounded-[2rem] p-4 flex flex-col justify-between aspect-square group cursor-pointer hover:bg-white/5 transition-colors relative overflow-hidden"
        >
            <div className="absolute bottom-0 left-0 w-20 h-20 bg-red-500/20 blur-2xl rounded-full"></div>
            <div className="w-10 h-10 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 group-hover:scale-110 spring-transition relative z-10">
                <Gift size={20} />
            </div>
            <div className="relative z-10">
                <h4 className="font-bold text-base text-white">Lì Xì</h4>
                <p className="text-[10px] text-white/50">Gửi lộc</p>
            </div>
        </div>

        {/* Utility Strip */}
        <div className="bento-item-large glass-card rounded-[2rem] p-2 flex items-center justify-between">
            <button onClick={() => navigate(RoutePath.XONG_DAT)} className="flex-1 py-4 flex flex-col items-center gap-2 hover:bg-white/5 rounded-2xl transition-colors">
                <MapPin size={20} className="text-green-400" />
                <span className="text-xs font-medium">Xông Đất</span>
            </button>
            <div className="w-[1px] h-8 bg-white/10"></div>
            <button onClick={() => navigate(RoutePath.FORTUNE)} className="flex-1 py-4 flex flex-col items-center gap-2 hover:bg-white/5 rounded-2xl transition-colors">
                <Compass size={20} className="text-blue-400" />
                <span className="text-xs font-medium">Tử Vi</span>
            </button>
            <div className="w-[1px] h-8 bg-white/10"></div>
            <button onClick={() => navigate(RoutePath.ARCADE_FIREWORKS)} className="flex-1 py-4 flex flex-col items-center gap-2 hover:bg-white/5 rounded-2xl transition-colors">
                <Zap size={20} className="text-purple-400" />
                <span className="text-xs font-medium">Pháo Hoa</span>
            </button>
        </div>

        {/* Large Decorative Card (Tree of Wishes) */}
        <div 
            onClick={() => navigate(RoutePath.WISHES)}
            className="bento-item-large relative h-48 rounded-[2rem] overflow-hidden group cursor-pointer border border-white/10"
        >
             <img 
                src="https://images.unsplash.com/photo-1514064019862-23e2a332a6a6?q=80&w=2000&auto=format&fit=crop" 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-60"
             />
             <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent p-6 flex flex-col justify-end">
                <h3 className="text-2xl font-serif text-tet-gold mb-1">Cây Nêu Lời Chúc</h3>
                <p className="text-sm text-gray-300">Gửi gắm ước nguyện đầu xuân</p>
             </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;