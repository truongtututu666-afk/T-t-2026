export enum RoutePath {
  SPLASH = '/',
  AUTH = '/auth',
  DASHBOARD = '/dashboard',
  ALTAR = '/altar',
  ARCADE_BAUCUA = '/arcade/baucua',
  ARCADE_FIREWORKS = '/arcade/fireworks',
  ARCADE_DAPNIEU = '/arcade/dapnieu',
  ARCADE_WHEEL = '/arcade/wheel',
  LIXI = '/lixi',
  WISHES = '/wishes',
  SETTINGS = '/settings',
  XONG_DAT = '/xong-dat',
  FORTUNE = '/fortune',
  CHATBOT = '/chatbot'
}

export enum UserRole {
  GUEST = 'GUEST',
  USER = 'USER'
}

export interface User {
  id: string;
  name: string;
  avatar: string; // URL or Zodiac ID
  balance: number;
  role: UserRole;
}

export interface Wish {
  id: string;
  userId: string;
  userName: string;
  content: string;
  position: { x: number; y: number; z: number };
}

export enum BauCuaMascot {
  DEER = 'Nai',
  GOURD = 'Bầu',
  CHICKEN = 'Gà',
  FISH = 'Cá',
  CRAB = 'Cua',
  SHRIMP = 'Tôm'
}

export interface AltarItem {
  id: string;
  type: 'incense' | 'fruit' | 'chicken' | 'cake' | 'flower';
  name: string;
  image: string;
}