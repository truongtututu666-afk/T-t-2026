import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { RoutePath, User, UserRole } from './types';
import { ASSETS } from './constants';

import Layout from './components/Layout';
import SplashScreen from './components/SplashScreen';
import AuthPortal from './components/AuthPortal';
import Dashboard from './components/Dashboard';
import VirtualAltar from './components/VirtualAltar';
import BauCuaArena from './components/BauCuaArena';
import LiXiWallet from './components/LiXiWallet';
import TreeOfWishes from './components/TreeOfWishes';
import FireworksStudio from './components/FireworksStudio';
import Settings from './components/Settings';
import XongDat from './components/XongDat';
import FortuneTeller from './components/FortuneTeller';
import DapNieu from './components/DapNieu';
import LuckyWheel from './components/LuckyWheel';

const App: React.FC = () => {
  // Initialize user from localStorage
  const [user, setUser] = useState<User | undefined>(() => {
    const saved = localStorage.getItem('tet2026_user');
    return saved ? JSON.parse(saved) : undefined;
  });

  // Persist user data whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('tet2026_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('tet2026_user');
    }
  }, [user]);

  const handleLogin = (newUser: User) => {
    setUser(newUser);
  };

  const handleUpdateBalance = (newBalance: number) => {
    if (user) {
        setUser({ ...user, balance: newBalance });
    }
  };

  return (
    <HashRouter>
      <Layout user={user}>
        <Routes>
          <Route path={RoutePath.SPLASH} element={<SplashScreen />} />
          <Route path={RoutePath.AUTH} element={<AuthPortal onLogin={handleLogin} />} />
          
          <Route path={RoutePath.DASHBOARD} element={user ? <Dashboard user={user} /> : <Navigate to={RoutePath.AUTH} />} />
          <Route path={RoutePath.ALTAR} element={user ? <VirtualAltar /> : <Navigate to={RoutePath.AUTH} />} />
          
          <Route path={RoutePath.ARCADE_BAUCUA} element={user ? <BauCuaArena user={user} onUpdateBalance={handleUpdateBalance} /> : <Navigate to={RoutePath.AUTH} />} />
          <Route path={RoutePath.ARCADE_FIREWORKS} element={user ? <FireworksStudio /> : <Navigate to={RoutePath.AUTH} />} />
          <Route path={RoutePath.ARCADE_DAPNIEU} element={user ? <DapNieu user={user} onUpdateBalance={handleUpdateBalance} /> : <Navigate to={RoutePath.AUTH} />} />
          <Route path={RoutePath.ARCADE_WHEEL} element={user ? <LuckyWheel user={user} onUpdateBalance={handleUpdateBalance} /> : <Navigate to={RoutePath.AUTH} />} />
          
          <Route path={RoutePath.LIXI} element={user ? <LiXiWallet user={user} onUpdateBalance={handleUpdateBalance} /> : <Navigate to={RoutePath.AUTH} />} />
          <Route path={RoutePath.WISHES} element={user ? <TreeOfWishes user={user} /> : <Navigate to={RoutePath.AUTH} />} />
          <Route path={RoutePath.SETTINGS} element={user ? <Settings user={user} onLogout={() => setUser(undefined)} /> : <Navigate to={RoutePath.AUTH} />} />
          
          <Route path={RoutePath.XONG_DAT} element={user ? <XongDat /> : <Navigate to={RoutePath.AUTH} />} />
          <Route path={RoutePath.FORTUNE} element={user ? <FortuneTeller /> : <Navigate to={RoutePath.AUTH} />} />
          
          <Route path="*" element={<Navigate to={RoutePath.SPLASH} />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
};

export default App;