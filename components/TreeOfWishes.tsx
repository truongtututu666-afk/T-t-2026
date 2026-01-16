import React, { useState, useEffect } from 'react';
import { User, Wish } from '../types';
import { ChevronLeft, Send, Sparkles, X, PenTool } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface TreeOfWishesProps {
  user: User;
}

const TreeOfWishes: React.FC<TreeOfWishesProps> = ({ user }) => {
  const navigate = useNavigate();
  const [wishes, setWishes] = useState<Wish[]>(() => {
      const saved = localStorage.getItem('tet_wishes');
      return saved ? JSON.parse(saved) : [];
  });
  const [showInput, setShowInput] = useState(false);
  const [newWish, setNewWish] = useState('');
  const [selectedWish, setSelectedWish] = useState<Wish | null>(null);

  useEffect(() => {
    localStorage.setItem('tet_wishes', JSON.stringify(wishes));
  }, [wishes]);

  const handleAddWish = () => {
    if (!newWish.trim()) return;
    
    // Calculate a random position within the "canopy" area of the tree
    // Assuming the tree canopy is roughly in the top-center 60% of the screen width and top 20-70% height
    const canopyX = 15 + Math.random() * 70; // 15% to 85% width
    const canopyY = 15 + Math.random() * 45; // 15% to 60% height

    const wish: Wish = {
        id: Date.now().toString(),
        userId: user.id,
        userName: user.name,
        content: newWish,
        position: {
            x: canopyX,
            y: canopyY,
            z: Math.random() // For varied animation delay
        }
    };
    setWishes([...wishes, wish]);
    setNewWish('');
    setShowInput(false);
  };

  return (
    <div className="h-full relative overflow-hidden bg-[#0a0a12]">
       {/* --- Realistic Environment Layers --- */}

       {/* 1. Background Sky & Moon */}
       <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-[#050505] to-black"></div>
       <div className="absolute top-10 right-10 w-32 h-32 bg-yellow-100 rounded-full blur-[3px] shadow-[0_0_60px_rgba(255,255,200,0.3)] opacity-80"></div>
       
       {/* 2. Fireflies Effect */}
       <div className="absolute inset-0 pointer-events-none">
           {[...Array(20)].map((_, i) => (
               <div 
                key={i}
                className="absolute w-1 h-1 bg-yellow-400 rounded-full animate-float opacity-0"
                style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDuration: `${3 + Math.random() * 5}s`,
                    animationDelay: `${Math.random() * 2}s`,
                    boxShadow: '0 0 4px yellow'
                }}
               ></div>
           ))}
       </div>

       {/* 3. The Realistic Tree (Mai Vang) */}
       <div className="absolute inset-0 flex items-end justify-center pointer-events-none">
           {/* Using a high-quality transparent PNG of a tree or a well-blended image */}
           {/* Fallback to a high quality Unsplash image with blending if transparent asset not available, 
               but here we simulate a transparent tree using a masked image approach or a carefully selected image */}
           <img 
            src="https://png.pngtree.com/png-clipart/20230427/original/pngtree-yellow-apricot-flower-tree-for-tet-png-image_9113697.png" 
            alt="Tree"
            className="w-full max-w-4xl h-[90%] object-contain object-bottom drop-shadow-[0_0_20px_rgba(255,214,10,0.2)] filter brightness-110 contrast-110"
            onError={(e) => {
                // Fallback if the specific PNG fails
                e.currentTarget.src = "https://images.unsplash.com/photo-1546272522-869278cb7126?q=80&w=1000&auto=format&fit=crop";
                e.currentTarget.className = "w-full h-full object-cover opacity-60 mask-image-gradient";
            }}
           />
       </div>

       {/* 4. Falling Petals (Foreground) */}
       <div className="absolute inset-0 pointer-events-none z-20">
            {[...Array(10)].map((_, i) => (
               <div 
                key={`petal-${i}`}
                className="absolute w-2 h-2 bg-yellow-500/80 rounded-tl-xl rounded-br-xl animate-spin-slow"
                style={{
                    left: `${Math.random() * 100}%`,
                    top: `-10px`,
                    animation: `fall ${5 + Math.random() * 10}s linear infinite`,
                    animationDelay: `${Math.random() * 5}s`
                }}
               ></div>
           ))}
       </div>

       {/* --- Header UI --- */}
       <div className="absolute top-0 w-full p-6 flex items-center justify-between z-50 mt-12 md:mt-0 pointer-events-none">
        <button onClick={() => navigate(-1)} className="p-2 bg-black/40 backdrop-blur-md rounded-full text-white pointer-events-auto border border-white/10 hover:bg-white/10 transition-colors">
          <ChevronLeft size={24} />
        </button>
        <div className="text-center">
            <h2 className="text-2xl font-serif text-tet-gold font-bold drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">Cây Nêu Lời Chúc</h2>
            <p className="text-xs text-yellow-200/80 font-light tracking-widest uppercase">Gửi niệm lành - Nhận phước lộc</p>
        </div>
        <button 
            onClick={() => setShowInput(true)} 
            className="pointer-events-auto p-3 bg-gradient-to-br from-tet-red to-rose-700 rounded-full text-white shadow-[0_0_15px_rgba(255,59,48,0.5)] hover:scale-110 transition-transform active:scale-95 group"
        >
            <PenTool size={20} className="group-hover:animate-wiggle" />
        </button>
      </div>

       {/* --- Hanging Wishes Layer --- */}
       <div className="absolute inset-0 z-30">
           {wishes.map((wish) => (
               <div 
                key={wish.id}
                className="absolute origin-top cursor-pointer group"
                style={{ 
                    left: `${wish.position.x}%`, 
                    top: `${wish.position.y}%`,
                    zIndex: Math.floor(wish.position.y), // Lower items appear in front
                    animation: `sway ${3 + wish.position.z * 2}s ease-in-out infinite alternate`,
                    animationDelay: `${wish.position.z}s`
                }}
                onClick={() => setSelectedWish(wish)}
               >
                   {/* The String */}
                   <div className="w-[1px] h-8 bg-yellow-100/50 absolute -top-8 left-1/2 -translate-x-1/2"></div>
                   
                   {/* The Tag (Red Envelope Style) */}
                   <div className="w-10 h-16 bg-gradient-to-b from-tet-red to-red-900 rounded-sm border-[0.5px] border-yellow-400/50 shadow-lg flex flex-col items-center justify-center p-1 relative overflow-hidden transition-transform group-hover:scale-110 duration-300">
                       <div className="absolute top-0 w-full h-2 bg-yellow-500/20"></div>
                       <div className="w-6 h-6 rounded-full border border-yellow-400/30 flex items-center justify-center mb-1">
                            <span className="text-[8px] font-serif text-tet-gold">Lộc</span>
                       </div>
                       <div className="w-full h-[1px] bg-yellow-400/20 my-1"></div>
                       <span className="text-[6px] text-white/90 text-center font-serif leading-tight line-clamp-3">
                           {wish.content}
                       </span>
                       
                       {/* Glow on hover */}
                       <div className="absolute inset-0 bg-yellow-400/0 group-hover:bg-yellow-400/10 transition-colors"></div>
                   </div>
                   
                   {/* Name Tag (Visible on Hover) */}
                   <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-black/80 text-white text-[10px] px-2 py-1 rounded backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-white/10">
                       {wish.userName}
                   </div>
               </div>
           ))}
       </div>

       {/* --- Read Wish Modal --- */}
       {selectedWish && (
           <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
               <div className="relative bg-[#fffdf0] w-full max-w-xs rounded-lg shadow-2xl p-8 text-center animate-scale-up border-8 border-double border-red-900">
                   <button 
                    onClick={() => setSelectedWish(null)}
                    className="absolute top-2 right-2 text-red-900/50 hover:text-red-900"
                   >
                       <X size={20} />
                   </button>
                   
                   <div className="mb-4">
                       <p className="text-red-800 text-xs font-bold uppercase tracking-widest border-b border-red-200 inline-block pb-1">Lời Chúc Của</p>
                       <h3 className="text-2xl font-serif font-bold text-red-900 mt-2">{selectedWish.userName}</h3>
                   </div>
                   
                   <p className="font-serif text-lg text-gray-800 italic leading-relaxed mb-6">
                       "{selectedWish.content}"
                   </p>
                   
                   <div className="flex justify-center">
                       <div className="w-8 h-8 opacity-50 bg-[url('https://cdn-icons-png.flaticon.com/512/744/744922.png')] bg-contain bg-no-repeat"></div>
                   </div>
               </div>
           </div>
       )}

       {/* --- Write Wish Modal --- */}
       {showInput && (
           <div className="fixed inset-0 z-[60] flex items-end md:items-center justify-center bg-black/80 backdrop-blur-md animate-fade-in">
               <div className="bg-[#1a1a1a] w-full md:max-w-md md:rounded-3xl rounded-t-3xl border border-white/10 shadow-2xl overflow-hidden animate-slide-up">
                   {/* Header */}
                   <div className="bg-gradient-to-r from-tet-red to-red-900 p-6 flex justify-between items-center">
                       <h3 className="text-white font-serif font-bold text-xl flex items-center gap-2">
                           <PenTool size={18} /> Viết Lời Chúc
                       </h3>
                       <button onClick={() => setShowInput(false)} className="text-white/70 hover:text-white">
                           <X size={24} />
                       </button>
                   </div>

                   {/* Body */}
                   <div className="p-6 space-y-4">
                       <p className="text-gray-400 text-sm">Gửi gắm những ước nguyện tốt đẹp nhất cho năm Bính Ngọ 2026.</p>
                       
                       <div className="relative">
                           <textarea 
                            value={newWish}
                            onChange={(e) => setNewWish(e.target.value)}
                            className="w-full h-40 bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder-white/20 focus:border-tet-gold outline-none resize-none font-serif text-lg leading-relaxed"
                            placeholder="Cầu mong gia đình mạnh khỏe, vạn sự như ý..."
                            autoFocus
                           ></textarea>
                           <Sparkles className="absolute bottom-4 right-4 text-tet-gold/50 pointer-events-none" size={20} />
                       </div>

                       <button 
                        onClick={handleAddWish} 
                        disabled={!newWish.trim()}
                        className="w-full py-4 bg-tet-gold text-black font-bold rounded-xl hover:bg-yellow-400 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(255,214,10,0.3)]"
                       >
                           Treo Lên Cây <Send size={18} />
                       </button>
                   </div>
               </div>
           </div>
       )}

       <style>{`
        @keyframes sway {
            0% { transform: rotate(-5deg); }
            100% { transform: rotate(5deg); }
        }
        @keyframes fall {
            0% { transform: translateY(0) rotate(0deg); opacity: 1; }
            100% { transform: translateY(100vh) rotate(360deg); opacity: 0; }
        }
        @keyframes wiggle {
            0%, 100% { transform: rotate(-3deg); }
            50% { transform: rotate(3deg); }
        }
        .animate-wiggle { animation: wiggle 0.3s ease-in-out infinite; }
        .animate-spin-slow { animation: spin 8s linear infinite; }
        .animate-scale-up { animation: scaleUp 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
        @keyframes scaleUp { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }
       `}</style>
    </div>
  );
};

export default TreeOfWishes;