import React, { useState } from 'react';
import { User } from '../types';
import { Send, ChevronLeft, Sparkles, X, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface LiXiWalletProps {
  user: User;
  onUpdateBalance: (amount: number) => void;
}

const LiXiWallet: React.FC<LiXiWalletProps> = ({ user, onUpdateBalance }) => {
  const navigate = useNavigate();
  const [activeCard, setActiveCard] = useState<number | null>(null);
  const [showSend, setShowSend] = useState(false);
  const [opened, setOpened] = useState(false);
  const [winAmount, setWinAmount] = useState(0);

  // Styling for Polymer Bills
  const bills = [
    { 
        id: 1, 
        amount: 500000, 
        color: 'bg-cyan-600', 
        gradient: 'from-cyan-400 to-blue-600',
        pattern: 'opacity-30 bg-[url("https://www.transparenttextures.com/patterns/cubes.png")]',
        label: 'Năm Trăm Nghìn'
    },
    { 
        id: 2, 
        amount: 200000, 
        color: 'bg-rose-600', 
        gradient: 'from-rose-400 to-red-700',
        pattern: 'opacity-30 bg-[url("https://www.transparenttextures.com/patterns/diamond-upholstery.png")]',
        label: 'Hai Trăm Nghìn'
    },
    { 
        id: 3, 
        amount: 100000, 
        color: 'bg-emerald-600', 
        gradient: 'from-emerald-400 to-green-700',
        pattern: 'opacity-30 bg-[url("https://www.transparenttextures.com/patterns/arabesque.png")]',
        label: 'Một Trăm Nghìn'
    },
  ];

  const handleOpen = (id: number) => {
    if (activeCard === id && !opened) {
        if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
        setOpened(true);
        // Randomize win based on the bill "value" simulation
        const base = bills.find(b => b.id === id)?.amount || 10000;
        const multiplier = Math.random() > 0.8 ? 2 : 1;
        const win = base * multiplier; // Simulating getting the bill value
        
        setWinAmount(win);
        setTimeout(() => onUpdateBalance(user.balance + win), 1500);
    } else {
        setActiveCard(id);
        setOpened(false);
        setWinAmount(0);
    }
  };

  const closeCard = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveCard(null);
    setOpened(false);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="p-2 glass-panel rounded-full text-white/70 hover:text-white">
                <ChevronLeft size={20} />
            </button>
            <h1 className="text-2xl font-serif font-bold">Ví Lì Xì</h1>
        </div>
        <button onClick={() => setShowSend(true)} className="p-2 glass-panel rounded-full text-tet-gold border-tet-gold/30 flex items-center gap-2 px-4">
            <Plus size={16} /> <span className="text-xs font-bold">Nạp Xu</span>
        </button>
      </div>

      {/* Main Wallet View */}
      <div className="flex-1 relative perspective-[1000px] pt-4 px-2">
        
        {/* Balance Display */}
        <div className={`transition-all duration-500 mb-8 ${activeCard !== null ? 'opacity-0 -translate-y-10' : 'opacity-100'}`}>
            <div className="glass-panel p-6 rounded-3xl border border-tet-gold/20 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-tet-gold/10 rounded-full blur-3xl"></div>
                <p className="text-white/50 text-xs uppercase tracking-widest mb-1">Tổng tài sản</p>
                <h2 className="text-4xl font-mono font-bold text-white tracking-tight flex items-baseline gap-2">
                    {user.balance.toLocaleString()} <span className="text-sm text-tet-gold">VND</span>
                </h2>
            </div>
        </div>

        {/* Stacked Money Bills */}
        <div className="relative h-[400px]">
            {bills.map((bill, index) => {
                const isActive = activeCard === bill.id;
                const isHidden = activeCard !== null && activeCard !== bill.id;
                
                return (
                    <div
                        key={bill.id}
                        onClick={() => handleOpen(bill.id)}
                        className={`absolute w-full h-48 rounded-xl shadow-2xl transition-all duration-700 cubic-bezier(0.34, 1.56, 0.64, 1) cursor-pointer border-t border-white/20 overflow-hidden group
                            ${isActive ? 'top-10 z-50 scale-100 rotate-0' : isHidden ? 'top-[1000px] opacity-0' : ''}
                        `}
                        style={{
                            top: isActive ? 40 : index * 50,
                            zIndex: index,
                            transform: isActive ? 'rotateX(0deg)' : `scale(${1 - index * 0.05}) rotate(${index % 2 === 0 ? 2 : -2}deg)`,
                        }}
                    >
                         {/* Polymer Texture */}
                         <div className={`absolute inset-0 bg-gradient-to-r ${bill.gradient}`}></div>
                         <div className={`absolute inset-0 ${bill.pattern}`}></div>
                         <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                         
                         {/* Holographic Strip */}
                         <div className="absolute right-8 top-0 bottom-0 w-12 bg-white/10 backdrop-blur-md border-x border-white/20 skew-x-12"></div>

                         {/* Bill Content */}
                         <div className="relative p-6 h-full flex flex-col justify-between">
                            <div className="flex justify-between items-start">
                                <div className="flex flex-col">
                                    <span className="text-xs font-bold text-white/70 tracking-widest">NGÂN HÀNG ĐỊA PHỦ</span>
                                    <span className="text-[10px] text-white/50">Lộc Bất Tận Hưởng</span>
                                </div>
                                {isActive && (
                                    <button onClick={closeCard} className="p-2 bg-black/20 rounded-full text-white/80 hover:bg-black/40 z-50">
                                        <X size={16} />
                                    </button>
                                )}
                            </div>

                            <div className="flex justify-between items-end">
                                <div>
                                    <h3 className="text-3xl font-mono font-bold text-white drop-shadow-md">
                                        {bill.amount.toLocaleString()}
                                    </h3>
                                    <p className="text-white/80 text-xs font-serif italic">{bill.label}</p>
                                </div>
                                {/* Emblem */}
                                <div className="w-16 h-16 rounded-full border-2 border-white/30 flex items-center justify-center bg-white/10 backdrop-blur-sm">
                                    <Sparkles size={24} className="text-tet-gold animate-pulse" />
                                </div>
                            </div>
                         </div>

                         {/* Reveal Animation Overlay */}
                         {isActive && opened && (
                             <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center animate-fade-in-up z-50 backdrop-blur-xl">
                                 <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-tet-gold to-orange-400 flex items-center justify-center mb-4 shadow-[0_0_50px_rgba(255,214,10,0.5)]">
                                     <Sparkles size={40} className="text-white" />
                                 </div>
                                 <p className="text-gray-400 text-sm uppercase mb-2">Lì xì thực nhận</p>
                                 <h2 className="text-4xl font-mono font-bold text-tet-gold mb-1">+{winAmount.toLocaleString()}</h2>
                                 <p className="text-white/60 text-xs">Chúc Mừng Năm Mới</p>
                             </div>
                         )}
                    </div>
                );
            })}
        </div>
        
        {activeCard === null && (
             <p className="text-center text-white/30 text-sm mt-12 animate-pulse">Chọn tờ tiền để rút lộc</p>
        )}
      </div>

      {/* Send Modal Overlay */}
      {showSend && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-xl z-[100] flex flex-col justify-end">
              <div className="bg-[#1c1c1e] rounded-t-[2.5rem] p-8 pb-12 animate-slide-up border-t border-white/10">
                  <div className="w-12 h-1 bg-white/20 rounded-full mx-auto mb-8"></div>
                  <h3 className="text-2xl font-bold mb-6">Gửi Tiền Mừng Tuổi</h3>
                  
                  <div className="bg-white/5 rounded-2xl p-4 mb-4 flex items-center gap-4 border border-white/10">
                      <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
                          <span className="font-bold">??</span>
                      </div>
                      <input type="text" placeholder="Tên người nhận..." className="bg-transparent outline-none text-white w-full" />
                  </div>
                  
                  <div className="bg-white/5 rounded-2xl p-4 mb-8 border border-white/10">
                       <label className="text-xs text-gray-500 uppercase">Số tiền (VND)</label>
                       <div className="flex items-center gap-2">
                           <input type="number" placeholder="500,000" className="bg-transparent outline-none text-3xl font-mono text-white w-full" autoFocus />
                       </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                      <button onClick={() => setShowSend(false)} className="py-4 bg-white/10 rounded-2xl font-bold text-gray-400">Hủy</button>
                      <button onClick={() => setShowSend(false)} className="py-4 bg-gradient-to-r from-tet-red to-rose-600 rounded-2xl font-bold text-white shadow-lg shadow-red-900/40">Chuyển Ngay</button>
                  </div>
              </div>
          </div>
      )}
      
      <style>{`
        @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
        .animate-slide-up { animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
      `}</style>
    </div>
  );
};

export default LiXiWallet;