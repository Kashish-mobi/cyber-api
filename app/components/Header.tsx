"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import homepage from "@/data/homepage.json";
import { CompanyLogo, User } from "../icons";
import { getIcon, type IconName } from "@/lib/icons";
import Paragraph from "./ui/Paragraph";
import SearchBox from "./ui/SearchBox";
import { useAppDispatch } from "@/redux/hooks";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { clearLogin, logout } from "@/redux/slices/userSlice";

const { header, ui } = homepage;

function UserMenu() {
  const dispatch = useAppDispatch();
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
    setOpen(false);
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        aria-label="Account"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
        className="flex cursor-pointer items-center"
      >
        <User />
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
  const [menuOpen, setMenuOpen] = useState(false);
  const isAuthenticated = useSelector(
    (state: RootState) => state.user.isAuthenticated
  );

  const userActionLink = header.actionLinks.find((link) => link.icon === "user");
  const actionIcon = (name: string) => {
    const Icon = getIcon(name as IconName);
    return Icon ? <Icon /> : null;
  };

  return (
    <header className="relative">
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
            enableProductSearch
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
          {header.actionLinks
            .filter((link) => link.icon !== "user")
            .map((link) => (
              <Link key={link.href} href={link.href} aria-label={link.label}>
                {actionIcon(link.icon)}
              </Link>
            ))}
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
            enableProductSearch
          />
        </div>

        <nav className="flex items-center gap-[20px] whitespace-nowrap text-[15px] font-[500]">
          {header.navLinks.map((link) => (
            <Link key={link.href} href={link.href}>
              {link.label}
            </Link>
          ))}
        </nav>

        {isAuthenticated ? (
          <UserMenu />
        ) : userActionLink ? (
          <Link href="/login" aria-label={userActionLink.label}>
            <User />
          </Link>
        ) : null}
      </div>

      {/* Mobile */}
      <div className="flex h-[88px] items-center justify-between px-[16px] md:hidden lg:px-[20px] border-b border-[1px] border-border-light">
        <Link href="/">
          <CompanyLogo />
        </Link>
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

      <div
        onClick={() => setMenuOpen(false)}
        className={`fixed inset-0 z-40 bg-black/40 transition-all duration-500 ease-in-out md:hidden ${
          menuOpen
            ? "visible opacity-100"
            : "pointer-events-none invisible opacity-0"
        }`}
      />

      <div
        className={`fixed top-0 right-0 z-50 h-screen w-[85%] max-w-[400px] transform overflow-y-auto bg-secondary shadow-2xl transition-transform duration-500 ease-in-out md:hidden ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
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
            className="w-full !h-[52px]"
            inputClassName="w-full bg-transparent text-[14px] outline-none"
            enableProductSearch
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
          {header.actionLinks
            .filter((link) => link.icon !== "user")
            .map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="border-b border-border-light py-[16px] text-[16px] font-[500]"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
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
    </header>
  );
}
