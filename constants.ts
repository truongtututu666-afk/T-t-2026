import { BauCuaMascot } from './types';

export const ASSETS = {
  HORSE_SILHOUETTE: "https://picsum.photos/seed/horse/400/400", // Placeholder
  FLOWER_BG: "https://picsum.photos/seed/tet/1080/1920",
  AVATAR_PLACEHOLDER: "https://picsum.photos/seed/avatar/150/150",
  ALTAR_BG: "https://picsum.photos/seed/altar/800/600",
};

export const ZODIAC_AVATARS = [
  "Rat", "Buffalo", "Tiger", "Cat", "Dragon", "Snake", 
  "Horse", "Goat", "Monkey", "Rooster", "Dog", "Pig"
];

export const MASCOTS: { key: BauCuaMascot; color: string; icon: string }[] = [
  { key: BauCuaMascot.DEER, color: 'text-amber-700', icon: '🦌' },
  { key: BauCuaMascot.GOURD, color: 'text-green-600', icon: '🍐' },
  { key: BauCuaMascot.CHICKEN, color: 'text-orange-500', icon: '🐓' },
  { key: BauCuaMascot.FISH, color: 'text-blue-500', icon: '🐟' },
  { key: BauCuaMascot.CRAB, color: 'text-red-600', icon: '🦀' },
  { key: BauCuaMascot.SHRIMP, color: 'text-pink-500', icon: '🦐' },
];

export const FORTUNES = [
  "Tiền vào như nước, tiền ra nhỏ giọt.",
  "Sức khỏe dồi dào, vạn sự như ý.",
  "Tình duyên phơi phới, hạnh phúc thăng hoa.",
  "Công danh tấn tới, sự nghiệp vững vàng."
];