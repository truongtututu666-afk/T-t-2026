import React from 'react';
import { User } from '../types';
import { ChevronLeft, Volume2, Moon, Sun, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface SettingsProps {
  user: User;
  onLogout: () => void;
}

const Settings: React.FC<SettingsProps> = ({ user, onLogout }) => {
  const navigate = useNavigate();

  return (
    <div className="h-full bg-tet-dark p-6">
      <div className="flex items-center gap-4 mb-8 mt-8 md:mt-0">
        <button onClick={() => navigate(-1)} className="p-2 bg-white/10 rounded-full hover:bg-white/20">
          <ChevronLeft size={24} />
        </button>
        <h2 className="text-2xl font-serif text-tet-gold font-bold">Cài Đặt</h2>
      </div>

      <div className="flex items-center gap-4 mb-8 p-4 bg-white/5 rounded-2xl border border-white/10">
          <img src={user.avatar} alt="Profile" className="w-16 h-16 rounded-full border-2 border-tet-gold" />
          <div>
              <h3 className="text-xl font-bold text-white">{user.name}</h3>
              <p className="text-gray-400 text-sm">ID: {user.id.slice(0, 8)}...</p>
          </div>
      </div>

      <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
              <div className="flex items-center gap-3">
                  <Volume2 className="text-gray-300" />
                  <span className="text-white">Nhạc nền</span>
              </div>
              <div className="w-12 h-6 bg-tet-red rounded-full relative cursor-pointer">
                  <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
              </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
              <div className="flex items-center gap-3">
                  <Moon className="text-gray-300" />
                  <span className="text-white">Giao diện Tối</span>
              </div>
              <div className="w-12 h-6 bg-tet-red rounded-full relative cursor-pointer">
                  <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
              </div>
          </div>
      </div>

      <button onClick={onLogout} className="mt-12 w-full py-4 bg-red-900/50 text-red-400 font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-red-900/80">
          <LogOut size={20} /> Đăng Xuất
      </button>
    </div>
  );
};

export default Settings;