"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import homepage from "@/data/homepage.json";
import { CompanyLogo, User, WishList, Cart } from "@/icons";
import { getIcon, type IconName } from "@/lib/icons";
import Paragraph from "./ui/Paragraph";
import SearchBox from "./ui/SearchBox";
import { useDispatch, useSelector } from "@/redux/hooks";
import { clearLogin, loadLogin, logout } from "@/redux/slices/userSlice";
import { MiniCart } from "./MiniCart";
import CartLoginForm from "./CartLoginForm";
import DropDown from "./ui/DropDown";
import Heading from "./ui/Heading";
import { useCurrency } from "@/hooks/useCurrency";
import { currencySymbols, type Currency } from "@/lib/currency";
import { addToCart, clearCart } from "@/redux/slices/cartSlice";
import { apiAddProduct, clearApiCart } from "@/lib/cartApi";
import {
  toggleCartDropdown,
  closeCartDropdown,
  openCartDropdown,
  showAddedToCart,
  clearPendingItem,
} from "@/redux/slices/cartUiSlice";

const { header, ui } = homepage;

const currencyMenu = [
  { id: "dollar" as Currency, sign: currencySymbols.dollar },
  { id: "rupee" as Currency, sign: currencySymbols.rupee },
  { id: "euro" as Currency, sign: currencySymbols.euro },
];

function CurrencyMenu({ className }: { className?: string }) {
  const { currency, changeCurrency } = useCurrency();
  const selectedSign =
    currencyMenu.find((item) => item.id === currency)?.sign ?? "$";

  return (
    <DropDown
      options={currencyMenu.map((item) => item.sign)}
      selected={selectedSign}
      className={className || "w-[72px] lg:min-w-[72px]"}
      onSelect={(sign) => {
        const selected = currencyMenu.find((item) => item.sign === sign);
        if (selected) changeCurrency(selected.id);
      }}
    />
  );
}

function AddedToCartMessage() {
  return (
    <div className="p-[20px] text-center">
      <Heading as="h3" variant="cartTitle">
        Added to cart!
      </Heading>
      <Paragraph className="mt-[8px] !text-muted-nav">
        Your item was added successfully.
      </Paragraph>
    </div>
  );
}

// Only the cart icon button (safe to use in desktop / tablet / mobile)
function CartButton() {
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart.cart);
  const open = useSelector((state) => state.cartUi.open);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  // item count (how many products), not quantity sum
  const cartCount = hasMounted ? cart.length : 0;

  return (
    <button
      type="button"
      aria-label="Cart"
      aria-expanded={open}
      onClick={(e) => {
        e.stopPropagation();
        dispatch(toggleCartDropdown());
      }}
      className="relative inline-flex cursor-pointer items-center"
    >
      <Cart />
      {cartCount > 0 ? (
        <span className="absolute -top-[6px] -right-[8px] flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-primary px-[4px] text-[10px] font-[600] text-white">
          {cartCount}
        </span>
      ) : null}
    </button>
  );
}

// ONE panel only — login modal + cart dropdown (fixes View Cart / Clear Cart)
function CartPanel() {
  const dispatch = useDispatch();
  const { open, view, pendingItem } = useSelector((state) => state.cartUi);
  const panelRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open || view === "login") return;

    function handleClickOutside(e: MouseEvent) {
      const target = e.target as Node;
      // ignore clicks on any cart button
      if ((target as HTMLElement).closest?.('[aria-label="Cart"]')) return;
      if (panelRef.current && !panelRef.current.contains(target)) {
        dispatch(closeCartDropdown());
      }
    }

    // delay so the same click that opened does not instantly close
    const timer = setTimeout(() => {
      document.addEventListener("click", handleClickOutside);
    }, 0);

    return () => {
      clearTimeout(timer);
      document.removeEventListener("click", handleClickOutside);
    };
  }, [dispatch, open, view]);

  useEffect(() => {
    if (view !== "added" || !open) return;

    const timer = setTimeout(() => {
      dispatch(closeCartDropdown());
    }, 5000);

    return () => clearTimeout(timer);
  }, [view, open, dispatch]);

  async function handleLoginSuccess() {
    if (pendingItem) {
      const saved = loadLogin();

      if (saved?.user?.id) {
        try {
          await apiAddProduct(
            saved.user.id,
            pendingItem.id,
            pendingItem.quantity ?? 1
          );
        } catch (error) {
          console.error("Cart API add failed:", error);
        }
      }

      dispatch(
        addToCart({
          id: pendingItem.id,
          title: pendingItem.title,
          price: pendingItem.price,
          thumbnail: pendingItem.thumbnail,
          quantity: pendingItem.quantity ?? 1,
        })
      );
      dispatch(clearPendingItem());
    }
    dispatch(showAddedToCart());
  }

  if (!open) return null;

  // Login = center of screen
  if (view === "login") {
    return (
      <div
        className="fixed inset-0 z-[9990] flex items-center justify-center bg-black/40 px-[16px]"
        onClick={() => dispatch(closeCartDropdown())}
      >
        <div
          className="w-full max-w-[400px] overflow-hidden rounded-[12px] border border-border-light bg-secondary shadow-lg"
          onClick={(e) => e.stopPropagation()}
        >
          <CartLoginForm onSuccess={handleLoginSuccess} />
        </div>
      </div>
    );
  }

  // Cart / Added = near top-right (under header cart)
  return (
    <div
      ref={panelRef}
      className="fixed top-[88px] right-[16px] z-[9990] w-[min(420px,calc(100vw-32px))] overflow-hidden rounded-[8px] border border-border-light bg-secondary shadow-lg md:right-[32px] 2xl:right-[160px]"
    >
      {view === "added" ? (
        <AddedToCartMessage />
      ) : (
        <MiniCart
          onClose={() => dispatch(closeCartDropdown())}
          simple
        />
      )}
    </div>
  );
}

function UserMenu() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleLogout() {
    clearLogin();
    dispatch(logout());
    dispatch(clearCart());
    clearApiCart();
    setOpen(false);
  }

  const displayName = user?.name || user?.username || "User";

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        aria-label="Account"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
        className="flex max-w-[140px] cursor-pointer items-center"
      >
        <Paragraph as="span" type="nav" className="truncate !font-[500]">
          {displayName}
        </Paragraph>
      </button>

      {open ? (
        <div className="absolute top-[45px] right-0 z-50 w-[180px] rounded-[8px] border border-border-light bg-secondary p-[8px] shadow-lg">
          <button
            type="button"
            onClick={handleLogout}
            className="block w-full rounded-[6px] px-4 py-3 text-left text-[14px] font-[500] hover:bg-surface"
          >
            Log out
          </button>
        </div>
      ) : null}
    </div>
  );
}

export default function Header() {
  const dispatch = useDispatch();
  const [menuOpen, setMenuOpen] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const isAuthenticated = useSelector(
    (state) => state.user.isAuthenticated
  );
  const wishlist = useSelector((state) => state.wishlist.wishlist);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const isWishlistFilled = hasMounted && wishlist.length > 0;

  const userActionLink = header.actionLinks.find((link) => link.icon === "user");
  const actionIcon = (name: string) => {
    if (name === "wishlist") {
      return <WishList isWishlist={isWishlistFilled} />;
    }
    const Icon = getIcon(name as IconName);
    return Icon ? <Icon /> : null;
  };

  return (
    <header className="sticky top-0 z-[100] bg-secondary">
      {/* Desktop (lg+) */}
      <div className="hidden h-[88px] items-center justify-center gap-[40px] px-[32px] py-[16px] lg:flex 2xl:gap-[56.53px] 2xl:px-[160px] border-b border-[1px] border-border-light">
        <Link href="/">
          <CompanyLogo />
        </Link>

        <div className="flex items-center">
          <SearchBox
            placeholder={header.searchPlaceholder}
            className="w-full"
            inputClassName="w-full bg-transparent tracking-[-0.44px] outline-none"
            forProducts
          />
        </div>

        <nav className="flex items-center gap-[20px] 2xl:gap-[52px]">
          {header.navLinks.map((link) => (
            <Link key={link.href} href={link.href}>
              <Paragraph as="span" type="nav">
                {link.label}
              </Paragraph>
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4 2xl:gap-[24px]">
          <CurrencyMenu />
          {header.actionLinks
            .filter((link) => link.icon !== "user" && link.icon !== "cart")
            .map((link) => (
              <Link key={link.href} href={link.href} aria-label={link.label}>
                {actionIcon(link.icon)}
              </Link>
            ))}
          <CartButton />
          {isAuthenticated ? (
            <UserMenu />
          ) : userActionLink ? (
            <Link href="/login" aria-label={userActionLink.label}>
              <User />
            </Link>
          ) : null}
        </div>
      </div>

      {/* Tablet (md–lg) */}
      <div className="hidden h-[88px] items-center gap-[32px] px-[32px] md:flex lg:hidden">
        <Link href="/">
          <CompanyLogo />
        </Link>

        <div className="flex-1">
          <SearchBox
            placeholder={header.searchPlaceholder}
            className="w-full !h-[56px]"
            inputClassName="w-full bg-transparent tracking-[-0.44px] outline-none"
            forProducts
          />
        </div>

        <nav className="flex items-center gap-[20px] whitespace-nowrap text-[15px] font-[500]">
          {header.navLinks.map((link) => (
            <Link key={link.href} href={link.href}>
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <CurrencyMenu className="w-[110px]" />
          <CartButton />
          {isAuthenticated ? (
            <UserMenu />
          ) : userActionLink ? (
            <Link href="/login" aria-label={userActionLink.label}>
              <User />
            </Link>
          ) : null}
        </div>
      </div>

      {/* Mobile */}
      <div className="flex h-[88px] items-center justify-between px-[16px] md:hidden lg:px-[20px] border-b border-[1px] border-border-light">
        <Link href="/">
          <CompanyLogo />
        </Link>
        <div className="flex items-center gap-[16px]">
          <CartButton />
          <button
            type="button"
            aria-label={ui.openMenu}
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex flex-col gap-[5px]"
          >
          <svg
            width="40"
            height="40"
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-hamburger"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M32.5 13.75H7.5V11.25H32.5V13.75Z"
              fill="currentColor"
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M32.5 21.25H7.5V18.75H32.5V21.25Z"
              fill="currentColor"
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M32.5 28.75H7.5V26.25H32.5V28.75Z"
              fill="currentColor"
            />
          </svg>
          </button>
        </div>
      </div>

      <div
        onClick={() => setMenuOpen(false)}
        className={`fixed inset-0 z-[200] bg-black/40 transition-all duration-500 ease-in-out md:hidden ${
          menuOpen
            ? "visible opacity-100"
            : "pointer-events-none invisible opacity-0"
        }`}
      />

      <div
        className={`fixed top-0 right-0 z-[210] h-screen w-[85%] max-w-[400px] transform overflow-y-auto bg-secondary shadow-2xl transition-transform duration-500 ease-in-out md:hidden ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex h-[72px] items-center justify-end border-b border-border-light px-[20px]">
          <button
            type="button"
            aria-label={ui.closeMenu}
            onClick={() => setMenuOpen(false)}
            className="flex h-[40px] w-[40px] items-center justify-center text-[28px] font-[300]"
          >
            ×
          </button>
        </div>

        <div className="p-[20px]">
          <SearchBox
            placeholder={header.searchPlaceholder}
            className="w-full !h-[52px] lg:!w-full"
            inputClassName="w-full bg-transparent text-[14px] outline-none"
            forProducts
            showSearchButton
            onSearch={() => setMenuOpen(false)}
          />
        </div>

        <nav className="flex flex-col px-[20px]">
          {header.navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="border-b border-border-light py-[16px] text-[16px] font-[500]"
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="mt-[8px] flex flex-col px-[20px] pb-[20px]">
          <div className="border-b border-border-light py-[16px]">
            <Paragraph as="span" type="nav" className="mb-[8px] block !text-muted-nav">
              Currency
            </Paragraph>
            <CurrencyMenu className="w-full" />
          </div>
          {header.actionLinks
            .filter((link) => link.icon !== "user")
            .map((link) =>
              link.icon === "cart" ? (
                <button
                  key={link.href}
                  type="button"
                  className="border-b border-border-light py-[16px] text-left text-[16px] font-[500]"
                  onClick={() => {
                    setMenuOpen(false);
                    dispatch(openCartDropdown("cart"));
                  }}
                >
                  {link.label}
                </button>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  className="border-b border-border-light py-[16px] text-[16px] font-[500]"
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </Link>
              )
            )}
          {header.authLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="border-b border-border-light py-[16px] text-[16px] font-[500] last:border-b-0"
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>

      {/* single cart panel for whole header */}
      <CartPanel />
    </header>
  );
}
