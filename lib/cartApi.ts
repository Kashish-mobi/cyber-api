import { deleteData, getData, postData, putData } from "@/api/api";
import type { CartItem } from "@/redux/slices/cartSlice";

const API_CART_KEY = "apiCart";

export const MINI_CART_LIMIT = 5;
export const CART_PAGE_SIZE = 12;

type ApiProduct = {
  id: number;
  title: string;
  price: number;
  thumbnail: string;
  quantity: number;
};

export type ApiCart = {
  id: number;
  userId: number;
  products: ApiProduct[];
};

// simple cache — only one network call per userId
let cachedUserId: number | null = null;
let cachedItems: CartItem[] | null = null;
let loadingPromise: Promise<{ items: CartItem[]; total: number }> | null = null;

export function clearCartCache() {
  cachedUserId = null;
  cachedItems = null;
  loadingPromise = null;
}

function toCartItem(product: ApiProduct): CartItem {
  return {
    id: product.id,
    title: product.title,
    price: product.price,
    thumbnail: product.thumbnail,
    quantity: product.quantity,
  };
}

export function saveApiCart(cart: ApiCart) {
  localStorage.setItem(API_CART_KEY, JSON.stringify(cart));
}

export function loadApiCart(): ApiCart | null {
  try {
    const raw = localStorage.getItem(API_CART_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function clearApiCart() {
  localStorage.removeItem(API_CART_KEY);
  clearCartCache();
}

// GET /carts/{id}
export async function getCartById(id: number) {
  return getData(`/carts/${id}`);
}

export async function getUserCarts(userId: number) {
  if (userId === 0) {
    return getData("/carts?limit=0");
  }
  return getData(`/carts/user/${userId}?limit=0`);
}

export async function addCartApi(
  userId: number,
  products: { id: number; quantity: number }[]
) {
  return postData("/carts/add", { userId, products });
}

export async function updateCartApi(
  cartId: number,
  products: { id: number; quantity: number }[],
  merge = true
) {
  return putData(`/carts/${cartId}`, { merge, products });
}

export async function deleteCartApi(cartId: number) {
  const res = await deleteData(`/carts/${cartId}`);
  clearApiCart();
  return res;
}

function cartsToItems(data: {
  carts?: ApiCart[];
  products?: ApiProduct[];
}): CartItem[] {
  if (data.products) {
    return data.products.map(toCartItem);
  }

  const carts = data.carts || [];
  const items: CartItem[] = [];

  for (const cart of carts) {
    for (const product of cart.products || []) {
      const existing = items.find((item) => item.id === product.id);
      if (existing) {
        existing.quantity += product.quantity;
      } else {
        items.push(toCartItem(product));
      }
    }
  }

  return items;
}

// ONE network call — later calls reuse cache
export async function loadCartItems(
  userId: number
): Promise<{ items: CartItem[]; total: number }> {
  // already loaded for this user
  if (cachedUserId === userId && cachedItems) {
    return { items: cachedItems, total: cachedItems.length };
  }

  // same call already in progress — wait for it
  if (cachedUserId === userId && loadingPromise) {
    return loadingPromise;
  }

  cachedUserId = userId;
  loadingPromise = (async () => {
    try {
      const data = await getUserCarts(userId);

      if (data.carts?.[0]) {
        saveApiCart(data.carts[0]);
      }

      const items = cartsToItems(data);
      cachedItems = items;
      return { items, total: items.length };
    } catch (error) {
      console.error("Load cart failed:", error);
      cachedUserId = null;
      cachedItems = null;
      return { items: [], total: 0 };
    } finally {
      loadingPromise = null;
    }
  })();

  return loadingPromise;
}

// Always POST /carts/add (never PUT fake ids like 209)
export async function apiAddProduct(
  userId: number,
  productId: number,
  quantity: number
) {
  clearCartCache();
  return addCartApi(userId, [{ id: productId, quantity }]);
}

// Remove: only PUT/DELETE if we have a real cart from GET
export async function apiRemoveProduct(productId: number) {
  const saved = loadApiCart();
  if (!saved) return null;

  const next = saved.products
    .filter((p) => p.id !== productId)
    .map((p) => ({ id: p.id, quantity: p.quantity }));

  try {
    if (next.length === 0) {
      return await deleteCartApi(saved.id);
    }
    const res = await updateCartApi(saved.id, next, false);
    saveApiCart(res);
    clearCartCache();
    return res;
  } catch (error) {
    console.error("Remove cart API failed:", error);
    return null;
  }
}
