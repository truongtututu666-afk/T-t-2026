import React, { useState, useEffect } from 'react';
import { Archive, Plus } from 'lucide-react';

interface PlacedItem {
  id: number;
  type: string;
  x: number;
  y: number;
}

const VirtualAltar: React.FC = () => {
  const [items, setItems] = useState<PlacedItem[]>(() => {
    const saved = localStorage.getItem('altar_items');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [inventoryOpen, setInventoryOpen] = useState(true);

  useEffect(() => {
    localStorage.setItem('altar_items', JSON.stringify(items));
  }, [items]);

  const handleAddItem = (type: string) => {
    const newItem: PlacedItem = {
      id: Date.now(),
      type,
      x: 30 + Math.random() * 40, // Random center placement
      y: 45 + Math.random() * 20,
    };
    setItems([...items, newItem]);
  };

  const handleRemoveItem = (id: number) => {
    setItems(items.filter(i => i.id !== id));
  };

  return (
    <div className="h-full relative overflow-hidden bg-gray-900">
      {/* 3D Room Effect Container */}
      <div className="absolute inset-0 flex items-center justify-center perspective-[1000px]">
        {/* The Altar Table */}
        <div className="relative w-[90%] md:w-[600px] aspect-[4/3] bg-[url('https://images.unsplash.com/photo-1616627561845-84a32e185381?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center rounded-lg shadow-2xl transform rotate-x-10 shadow-black border-4 border-amber-900">
            <div className="absolute inset-0 bg-black/20"></div>
            
            {/* Placed Items */}
            {items.map((item) => (
                <div 
                    key={item.id}
                    className="absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 transition-transform hover:scale-110 z-10"
                    style={{ left: `${item.x}%`, top: `${item.y}%` }}
                    onClick={() => handleRemoveItem(item.id)}
                >
                    <RenderAltarItem type={item.type} />
                </div>
            ))}
        </div>
      </div>

      {/* Title */}
      <div className="absolute top-4 w-full text-center pointer-events-none z-20">
        <h2 className="text-2xl font-serif text-tet-gold drop-shadow-lg">Gian Thờ Tổ Tiên</h2>
        <p className="text-white/60 text-sm">Chạm vào vật phẩm để dâng lên bàn thờ</p>
      </div>

      {/* Inventory Panel */}
      <div className={`absolute bottom-20 md:bottom-4 left-0 right-0 bg-black/80 backdrop-blur-md border-t border-white/10 transition-transform duration-300 z-30 ${inventoryOpen ? 'translate-y-0' : 'translate-y-[80%]'}`}>
        <div 
            className="flex justify-center py-2 cursor-pointer"
            onClick={() => setInventoryOpen(!inventoryOpen)}
        >
            <div className="w-12 h-1 bg-white/20 rounded-full"></div>
        </div>
        <div className="p-4 grid grid-cols-4 gap-4 md:flex md:justify-center md:gap-8 pb-8">
            <InventoryItem type="incense" label="Nhang" onClick={() => handleAddItem('incense')} />
            <InventoryItem type="fruit" label="Ngũ Quả" onClick={() => handleAddItem('fruit')} />
            <InventoryItem type="chicken" label="Gà Luộc" onClick={() => handleAddItem('chicken')} />
            <InventoryItem type="cake" label="Bánh Chưng" onClick={() => handleAddItem('cake')} />
        </div>
      </div>
    </div>
  );
};

// Custom CSS Assets (Replacing Emojis)
const RenderAltarItem = ({ type }: { type: string }) => {
    switch (type) {
        case 'incense':
            return (
                <div className="relative group">
                    <div className="w-1 h-16 bg-gradient-to-t from-red-800 to-red-600 mx-auto rounded-full"></div>
                    <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-orange-400 rounded-full animate-pulse shadow-[0_0_8px_#f97316]"></div>
                    <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-4 h-24 bg-gray-400/20 blur-md rounded-full animate-float origin-bottom"></div>
                </div>
            );
        case 'fruit':
            return (
                <div className="w-16 h-12 relative">
                    <div className="absolute bottom-0 w-full h-8 bg-amber-800 rounded-b-xl border-b-4 border-amber-900 shadow-md"></div>
                    <div className="absolute -top-2 left-1 w-6 h-6 bg-orange-500 rounded-full border-b-2 border-orange-700 shadow-inner"></div>
                    <div className="absolute -top-4 left-5 w-8 h-8 bg-green-500 rounded-full border-b-2 border-green-700 shadow-inner"></div>
                    <div className="absolute -top-1 right-2 w-5 h-5 bg-yellow-400 rounded-full border-b-2 border-yellow-600 shadow-inner"></div>
                </div>
            );
        case 'chicken':
            return (
                <div className="w-20 h-14 relative">
                     <div className="w-full h-full bg-yellow-600 rounded-full shadow-lg border-b-4 border-yellow-800 relative overflow-hidden">
                        <div className="absolute top-2 left-2 w-16 h-8 bg-yellow-500 rounded-full opacity-80"></div>
                     </div>
                     <div className="absolute bottom-1 right-[-4px] w-6 h-3 bg-yellow-700 rotate-12 rounded-full"></div>
                     <div className="absolute bottom-1 left-[-4px] w-6 h-3 bg-yellow-700 -rotate-12 rounded-full"></div>
                </div>
            );
        case 'cake':
            return (
                <div className="w-16 h-16 bg-green-700 border-2 border-green-400 relative shadow-lg transform rotate-3">
                    <div className="absolute inset-0 border-2 border-yellow-400/40 transform rotate-45 scale-150 pointer-events-none"></div>
                    <div className="absolute inset-0 border-2 border-yellow-400/40 transform -rotate-45 scale-150 pointer-events-none"></div>
                    <div className="absolute inset-2 border border-green-600"></div>
                </div>
            );
        default:
            return null;
    }
}

const InventoryItem = ({ type, label, onClick }: any) => (
    <button onClick={onClick} className="flex flex-col items-center gap-2 group">
        <div className="w-14 h-14 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-tet-red/20 group-hover:border-tet-gold transition-colors overflow-hidden">
            <div className="scale-75">
                <RenderAltarItem type={type} />
            </div>
        </div>
        <span className="text-xs text-gray-400 group-hover:text-white">{label}</span>
    </button>
);

export default VirtualAltar;