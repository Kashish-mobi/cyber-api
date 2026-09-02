import { useDispatch, useSelector } from "@/redux/hooks";
import { addToCart, removeFromCart } from "@/redux/slices/cartSlice";
import {
  showAddedToCart,
  showLoginForCart,
  type PendingCartItem,
} from "@/redux/slices/cartUiSlice";
import { apiAddProduct, apiRemoveProduct } from "@/lib/cartApi";

export function useAddToCart() {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
  const user = useSelector((state) => state.user.user);

  // Always ask login first if not logged in
  async function tryAddToCart(item: PendingCartItem) {
    if (!isAuthenticated) {
      dispatch(showLoginForCart(item));
      return;
    }

    if (user?.id) {
      try {
        await apiAddProduct(user.id, item.id, item.quantity ?? 1);
      } catch (error) {
        console.error("Cart API add failed:", error);
      }
    }

    dispatch(
      addToCart({
        id: item.id,
        title: item.title,
        price: item.price,
        thumbnail: item.thumbnail,
        quantity: item.quantity ?? 1,
      })
    );
    dispatch(showAddedToCart());
  }

  async function tryRemoveFromCart(productId: number) {
    try {
      await apiRemoveProduct(productId);
    } catch (error) {
      console.error("Cart API remove failed:", error);
    }

    dispatch(removeFromCart(productId));
  }

  return { tryAddToCart, tryRemoveFromCart, isAuthenticated };
}
