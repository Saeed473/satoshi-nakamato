// utils/cartUtils.ts

export interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
  size?: string;
}

const CART_KEY = "cart";

/* -----------------------------
   Helpers
--------------------------------*/
export const getCartFromStorage = (): CartItem[] => {
  if (typeof window === "undefined") return [];

  try {
    const cart = localStorage.getItem(CART_KEY);
    return cart ? JSON.parse(cart) : [];
  } catch (error) {
    console.error("Error reading cart from storage", error);
    return [];
  }
};

export const saveCartToStorage = (cart: CartItem[]) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
};

/* -----------------------------
   Cart Operations
--------------------------------*/
export const addToCart = (item: CartItem): CartItem[] => {
  const cart = getCartFromStorage();

  const existingIndex = cart.findIndex(
    (cartItem) =>
      cartItem.id === item.id && cartItem.size === item.size
  );

  if (existingIndex !== -1) {
    cart[existingIndex].quantity += item.quantity;
  } else {
    cart.push(item);
  }

  saveCartToStorage(cart);
  return cart;
};

export const updateCartItemQuantity = (
  id: number,
  size: string | undefined,
  newQuantity: number
): CartItem[] => {
  let cart = getCartFromStorage();

  if (newQuantity <= 0) {
    cart = cart.filter(
      (item) => !(item.id === id && item.size === size)
    );
  } else {
    cart = cart.map((item) =>
      item.id === id && item.size === size
        ? { ...item, quantity: newQuantity }
        : item
    );
  }

  saveCartToStorage(cart);
  return cart;
};

export const removeFromCart = (
  id: number,
  size: string | undefined
): CartItem[] => {
  const cart = getCartFromStorage().filter(
    (item) => !(item.id === id && item.size === size)
  );

  saveCartToStorage(cart);
  return cart;
};

export const clearCart = (): CartItem[] => {
  saveCartToStorage([]);
  return [];
};

/* -----------------------------
   Cart Calculations
--------------------------------*/
export const getCartItemCount = (): number => {
  const cart = getCartFromStorage();
  return cart.reduce((total, item) => total + item.quantity, 0);
};

export const getCartSubtotal = (): number => {
  const cart = getCartFromStorage();
  return cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
};
