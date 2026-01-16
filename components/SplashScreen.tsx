import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { RoutePath } from '../types';

const SplashScreen: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate(RoutePath.AUTH);
    }, 3500);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="fixed inset-0 bg-tet-dark flex flex-col items-center justify-center z-[100]">
      <div className="relative w-48 h-48 mb-8">
        {/* Simplified Horse Animation using CSS */}
        <div className="absolute inset-0 bg-tet-red rounded-full blur-3xl opacity-20 animate-pulse"></div>
        <img 
            src="https://cdn-icons-png.flaticon.com/512/2316/2316629.png" 
            alt="Fire Horse" 
            className="relative z-10 w-full h-full object-contain animate-float drop-shadow-[0_0_15px_rgba(215,0,24,0.6)]" 
        />
      </div>
      
      <h1 className="text-4xl md:text-6xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-tet-gold via-orange-400 to-tet-gold animate-pulse">
        TẾT 2026
      </h1>
      <p className="text-tet-peach mt-2 tracking-widest uppercase text-sm">Năm Bính Ngọ - Year of Fire Horse</p>

      {/* Loading Bar */}
      <div className="mt-12 w-64 h-1 bg-white/10 rounded-full overflow-hidden relative">
        <div className="absolute inset-y-0 left-0 bg-tet-red w-full animate-[shimmer_2s_infinite] origin-left scale-x-0 transition-transform duration-[3000ms] ease-out" style={{ transform: 'scaleX(1)' }}></div>
      </div>
      
      <style>{`
        @keyframes shimmer {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};

export default SplashScreen;