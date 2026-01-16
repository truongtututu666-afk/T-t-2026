import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RoutePath, User, UserRole } from '../types';
import { ZODIAC_AVATARS } from '../constants';
import { ArrowRight, Phone, Sparkles } from 'lucide-react';

interface AuthPortalProps {
  onLogin: (user: User) => void;
}

const AuthPortal: React.FC<AuthPortalProps> = ({ onLogin }) => {
  const [step, setStep] = useState(1); // 1: Phone, 2: OTP, 3: Avatar
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  
  const handleComplete = (avatar: string) => {
    const newUser: User = {
        id: `user-${Date.now()}`,
        name: name || 'Người dùng',
        avatar: avatar,
        balance: 2026000, // Starting balance for 2026
        role: UserRole.USER
    };
    onLogin(newUser);
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute inset-0 z-0">
          <img src="https://images.unsplash.com/photo-1549887534-1541e9326642?q=80&w=2000&auto=format&fit=crop" className="w-full h-full object-cover opacity-50" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/20"></div>
      </div>

      <div className="relative z-10 flex-1 flex flex-col justify-end p-6 pb-12">
        <div className="mb-10">
            <h1 className="text-6xl font-serif text-white mb-2 tracking-tighter drop-shadow-lg">Tết 2026</h1>
            <p className="text-white/60 text-lg flex items-center gap-2">
                <Sparkles size={16} className="text-tet-gold" /> 
                Xuân Bính Ngọ - Vạn Sự An
            </p>
        </div>

        <div className="glass-panel p-8 rounded-[2.5rem] relative overflow-hidden shadow-2xl border-t border-white/20">
            {/* Step 1: Info */}
            {step === 1 && (
                <div className="space-y-6 animate-fade-in-up">
                    <h3 className="text-2xl font-bold text-white mb-6">Đăng Ký / Đăng Nhập</h3>
                    
                    <div className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-xs text-gray-400 uppercase tracking-widest pl-2">Số điện thoại</label>
                            <div className="flex items-center gap-3 bg-white/5 rounded-xl p-4 border border-white/10 focus-within:border-tet-gold transition-colors">
                                <Phone className="text-white/50" size={20} />
                                <input 
                                    type="tel" 
                                    value={phone} 
                                    onChange={(e) => setPhone(e.target.value)}
                                    className="bg-transparent w-full text-lg text-white outline-none placeholder-white/20" 
                                    placeholder="090 123 4567" 
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs text-gray-400 uppercase tracking-widest pl-2">Tên hiển thị</label>
                            <div className="flex items-center gap-3 bg-white/5 rounded-xl p-4 border border-white/10 focus-within:border-tet-gold transition-colors">
                                <span className="text-white/50 w-5 text-center font-bold">@</span>
                                <input 
                                    type="text" 
                                    value={name} 
                                    onChange={(e) => setName(e.target.value)}
                                    className="bg-transparent w-full text-lg text-white outline-none placeholder-white/20" 
                                    placeholder="Gia Huy" 
                                />
                            </div>
                        </div>
                    </div>

                    <button 
                        onClick={() => { if(phone && name) setStep(2) }} 
                        disabled={!phone || !name}
                        className="w-full bg-white text-black font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Tiếp tục <ArrowRight size={18} />
                    </button>
                </div>
            )}

            {/* Step 2: OTP */}
            {step === 2 && (
                <div className="text-center animate-fade-in-up">
                    <button onClick={() => setStep(1)} className="absolute top-8 left-8 text-gray-400 text-sm">Quay lại</button>
                    <h3 className="text-xl font-bold mb-2">Nhập mã xác thực</h3>
                    <p className="text-white/50 text-sm mb-8">Mã OTP đã gửi về {phone}</p>
                    
                    <div className="flex justify-center gap-3 mb-8">
                        {[1,2,3,4].map(i => (
                            <div key={i} className="w-14 h-16 bg-white/5 border border-white/20 rounded-2xl flex items-center justify-center text-3xl font-mono text-tet-gold shadow-inner">
                                {Math.floor(Math.random() * 9)}
                            </div>
                        ))}
                    </div>
                    <button onClick={() => setStep(3)} className="w-full bg-gradient-to-r from-tet-red to-red-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-red-900/50">
                        Xác Nhận
                    </button>
                </div>
            )}

            {/* Step 3: Persona */}
            {step === 3 && (
                <div className="animate-fade-in-up">
                    <h3 className="text-center text-xl font-bold mb-2">Chọn Linh Vật 2026</h3>
                    <p className="text-center text-white/50 text-sm mb-6">Đại diện cho bạn trong năm mới</p>
                    
                    <div className="grid grid-cols-4 gap-3 max-h-[300px] overflow-y-auto no-scrollbar pb-4">
                        {ZODIAC_AVATARS.map((z, i) => (
                            <button 
                                key={i}
                                onClick={() => handleComplete(`https://ui-avatars.com/api/?name=${z}&background=random&length=1`)}
                                className="aspect-square bg-white/5 rounded-2xl flex flex-col items-center justify-center hover:bg-tet-gold/20 hover:border-tet-gold border border-transparent transition-all gap-1"
                            >
                                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs">
                                     {['🐀','🐃','🐅','🐈','🐉','🐍','🐎','🐐','🐒','🐓','🐕','🐖'][i]}
                                </div>
                                <span className="text-[10px] text-gray-300 font-medium">{z}</span>
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default AuthPortal;