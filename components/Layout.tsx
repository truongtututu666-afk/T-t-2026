import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { LayoutGrid, Sparkles, Gamepad2, Wallet, Menu, Bell, Search, Zap } from 'lucide-react';
import { RoutePath, User } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  user?: User;
}

const Layout: React.FC<LayoutProps> = ({ children, user }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const isAuth = location.pathname === RoutePath.AUTH || location.pathname === RoutePath.SPLASH;

  // Background Mesh Logic
  const renderBackground = () => (
    <div className="mesh-bg">
      <div className="mesh-orb w-[80vw] h-[80vw] bg-red-900/40 top-[-20%] left-[-20%] animate-blob"></div>
      <div className="mesh-orb w-[60vw] h-[60vw] bg-amber-700/30 bottom-[-10%] right-[-10%] animate-blob" style={{ animationDelay: '2s' }}></div>
      <div className="mesh-orb w-[40vw] h-[40vw] bg-blue-900/30 top-[40%] left-[30%] animate-blob" style={{ animationDelay: '4s' }}></div>
    </div>
  );

  if (isAuth) return <>{renderBackground()}{children}</>;

  const navItems = [
    { icon: LayoutGrid, path: RoutePath.DASHBOARD },
    { icon: Sparkles, path: RoutePath.ALTAR },
    { icon: Gamepad2, path: RoutePath.ARCADE_BAUCUA },
    { icon: Wallet, path: RoutePath.LIXI },
    { icon: Menu, path: RoutePath.SETTINGS },
  ];

  return (
    <div className="min-h-screen text-white font-sans relative overflow-hidden flex flex-col">
      {renderBackground()}

      {/* Dynamic Island Header */}
      <header className="fixed top-0 w-full z-50 pt-safe-top px-4 mt-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
            {/* Left Pill */}
            <div className="glass-panel rounded-full px-4 py-2 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-xs font-medium tracking-wide text-white/80">TẾT 2026</span>
            </div>

            {/* Center Dynamic Island (Invisible on desktop, creates space) */}
            <div className="flex-1"></div>

            {/* Right Pill (User) */}
            <div className="glass-panel rounded-full pl-3 pr-1 py-1 flex items-center gap-3">
                <div className="flex flex-col items-end mr-1">
                    <span className="text-[10px] text-tet-gold font-bold">{user?.balance.toLocaleString()} xu</span>
                </div>
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-tet-red to-orange-500 p-[2px]">
                    <img src={user?.avatar} alt="User" className="w-full h-full rounded-full object-cover" />
                </div>
            </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto no-scrollbar pt-24 pb-32 px-4 max-w-7xl mx-auto w-full">
        <div className="animate-fade-in-up">
            {children}
        </div>
      </main>

      {/* VisionOS Floating Dock */}
      <nav className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50">
        <div className="glass-panel px-6 py-4 rounded-[2.5rem] flex items-center gap-6 shadow-2xl scale-100 hover:scale-[1.02] transition-transform duration-300">
          {navItems.map((item, idx) => {
            const isActive = location.pathname === item.path || (item.path === RoutePath.ARCADE_BAUCUA && location.pathname.startsWith('/arcade'));
            return (
              <button
                key={idx}
                onClick={() => navigate(item.path)}
                className={`relative group flex items-center justify-center transition-all duration-300 ${isActive ? '-translate-y-2' : ''}`}
              >
                {/* Active Light Bloom */}
                {isActive && <div className="absolute inset-0 bg-tet-red/60 blur-xl rounded-full"></div>}
                
                <div 
                  className={`relative p-3 rounded-full transition-all duration-300 ${
                      isActive 
                      ? 'bg-gradient-to-b from-tet-red to-tet-darkRed text-white shadow-lg shadow-red-500/30' 
                      : 'text-white/60 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <item.icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                </div>
                
                {isActive && <div className="absolute -bottom-6 w-1 h-1 bg-white rounded-full"></div>}
              </button>
            );
          })}
        </div>
      </nav>
      
      <style>{`
        .pt-safe-top { padding-top: env(safe-area-inset-top, 20px); }
        @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(20px) scale(0.95); }
            to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-fade-in-up {
            animation: fadeInUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
};

export default Layout;