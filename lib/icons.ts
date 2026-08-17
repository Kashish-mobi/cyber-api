import {
  Phone,
  Watch,
  Camera,
  Headphones,
  Computer,
  Gamepad,
  Facebook,
  Instagram,
  Twitter,
  Music2,
  WishList,
  Cart,
  User,
  Search,
  LeftArrow,
  RightArrow,
  Wishlist,
} from "@/icons";

export const iconMap = {
  phone: Phone,
  watch: Watch,
  camera: Camera,
  headphones: Headphones,
  computer: Computer,
  gamepad: Gamepad,
  facebook: Facebook,
  instagram: Instagram,
  twitter: Twitter,
  music2: Music2,
  wishlist: WishList,
  cart: Cart,
  user: User,
  search: Search,
  leftArrow: LeftArrow,
  rightArrow: RightArrow,
  wishlistHeart: Wishlist,
} as const;

export type IconName = keyof typeof iconMap;

export function getIcon(name: IconName) {
  return iconMap[name];
}
