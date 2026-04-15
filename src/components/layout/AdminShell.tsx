'use client';

import React, {useEffect, useMemo, useRef, useState} from "react";
import Link from "next/link";
import Image from "next/image";
import {usePathname, useRouter} from "next/navigation";
import {signOut} from "next-auth/react";
import clsx from "clsx";
import {AnimatePresence, motion} from "framer-motion";
import {
  ChevronDown,
  Grid2x2,
  LogOut,
  Menu,
  Search,
  Settings,
  ShoppingBag,
  ShoppingCart,
  X,
} from "lucide-react";
import {
  ADMIN_COMMAND_ITEMS,
  ADMIN_NAV_ITEMS,
  ADMIN_ROUTE_ITEMS,
} from "@/lib/admin/command-center";
import {getAdminPageMeta} from "@/lib/admin/page-chrome";
import {getAvailableViewRoles, VIEW_ROLE_LABELS} from "@/lib/auth/view-role";
import {MegaSearch} from "../ui/MegaSearch";
import {ThemeToggle} from "../ui/ThemeToggle";
import GetAllProducts from "../products/GetAllProducts";
import { buildHeroSlides, getInitials, getSectionItems, matchesPath } from "./util/UtilFunction";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

type AdminShellProps = {
  children: React.ReactNode;
  user: {
    name?: string | null;
    email?: string | null;
    role: string;
    viewRole: string;
  };
};

export type HeroSlide = {
  id: string;
  image: string;
  eyebrow: string;
  title: string;
  description: string;
};

export function AdminShell({children, user}: AdminShellProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const [openNavMenu, setOpenNavMenu] = useState<string | null>(null);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [viewRole, setViewRole] = useState(user.viewRole || user.role);
  const [heroSlideIndex, setHeroSlideIndex] = useState(0);
  const megaMenuRef = useRef<HTMLDivElement | null>(null);
  const navMenuRef = useRef<HTMLDivElement | null>(null);
  const profileMenuRef = useRef<HTMLDivElement | null>(null);
  const allowedViewRoles = useMemo(() => getAvailableViewRoles(user.role), [user.role]);

  const {items} = useSelector((state: RootState) => state.cart);
  const {currentOrder} = useSelector((state: RootState) => state.order);
  const visibleNavItems = useMemo(
    () => ADMIN_NAV_ITEMS.filter((item) => !item.roles || item.roles.includes(viewRole)),
    [viewRole]
  );
  const visibleRouteItems = useMemo(
    () => ADMIN_ROUTE_ITEMS.filter((item) => !item.roles || item.roles.includes(viewRole)),
    [viewRole]
  );
  const visibleCommandItems = useMemo(
    () => ADMIN_COMMAND_ITEMS.filter((item) => !item.roles || item.roles.includes(viewRole)),
    [viewRole]
  );

  const activeItem =
    visibleRouteItems.find((item) => matchesPath(pathname, item.href)) ??
    visibleNavItems.find((item) => matchesPath(pathname, item.href)) ??
    visibleNavItems[0];
  const pageMeta = useMemo(() => getAdminPageMeta(pathname), [pathname]);

  const heroSlides = useMemo(
    () => buildHeroSlides(pathname, activeItem, viewRole, pageMeta),
    [pathname, activeItem, viewRole, pageMeta]
  );
  const activeHeroSlide = heroSlides[heroSlideIndex] ?? heroSlides[0];

  const megaMenuGroups = [
    {
      title: "Navigate",
      items: visibleRouteItems.filter((item) => item.group === "Navigate"),
    },
    {
      title: "Create",
      items: visibleCommandItems.filter((item) => item.group === "Create"),
    },
    {
      title: "Operations",
      items: visibleCommandItems.filter((item) => item.group === "Operations"),
    },
  ];

  const isWideWorkspace =
    pathname.startsWith("/admin/products/brand") ||
    pathname === "/admin/orders" ||
    pathname.startsWith("/admin/orders/") ||
    pathname.startsWith("/admin/cart");

  const shellWidthClass = isWideWorkspace ? "max-w-[1600px]" : "max-w-[1280px]";
  const contentLiftClass = isWideWorkspace ? "-mt-10" : "-mt-5";

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        event.preventDefault();
        setSearchOpen((current) => !current);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    setHeroSlideIndex(0);
    const interval = window.setInterval(() => {
      setHeroSlideIndex((current) => (current + 1) % heroSlides.length);
    }, 5200);

    return () => window.clearInterval(interval);
  }, [heroSlides]);

  useEffect(() => {
    setMegaMenuOpen(false);
    setMobileMenuOpen(false);
    setOpenNavMenu(null);
    setProfileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target as Node;

      if (megaMenuRef.current && !megaMenuRef.current.contains(target)) {
        setMegaMenuOpen(false);
      }

      if (navMenuRef.current && !navMenuRef.current.contains(target)) {
        setOpenNavMenu(null);
      }

      if (profileMenuRef.current && !profileMenuRef.current.contains(target)) {
        setProfileMenuOpen(false);
      }
    };

    window.addEventListener("mousedown", handlePointerDown);
    return () => window.removeEventListener("mousedown", handlePointerDown);
  }, []);

  useEffect(() => {
    setViewRole(user.viewRole || user.role);
  }, [user.role, user.viewRole]);

  const applyViewRole = (nextRole: string) => {
    setViewRole(nextRole);
    document.cookie = `callone-view-role=${encodeURIComponent(nextRole)}; path=/; max-age=2592000; samesite=lax`;
    setProfileMenuOpen(false);
    setOpenNavMenu(null);
    setMegaMenuOpen(false);
    router.refresh();
  };

  return (
    <>
      <GetAllProducts />
      <div className="relative min-h-screen overflow-x-hidden text-foreground selection:bg-white selection:text-background">
        <MegaSearch isOpen={searchOpen} onClose={() => setSearchOpen(false)} role={viewRole} />

        <AnimatePresence>
          {mobileMenuOpen ? (
            <motion.div
              initial={{opacity: 0}}
              animate={{opacity: 1}}
              exit={{opacity: 0}}
              className="fixed inset-0 z-[110] bg-black/60 backdrop-blur-sm md:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
          ) : null}
        </AnimatePresence>

        <header className="header-shell sticky inset-x-0 top-0 z-[1000] border-b">
          <div className="mx-auto flex h-[var(--admin-header-height)] items-center justify-between gap-4 px-6 sm:px-10">
            {/* Logo Section */}
            <div className="flex items-center gap-6">
              <button
                className="header-control rounded-xl border p-2 transition md:hidden"
                onClick={() => setMobileMenuOpen(true)}
              >
                <Menu size={20} />
              </button>
              <Link href="/admin" className="group flex items-center gap-3">
                <div className="header-control flex h-11 w-[104px] items-center justify-center rounded-xl border px-2.5 transition-all duration-500 group-hover:shadow-[0_0_24px_rgba(0,0,0,0.08)]">
                  <Image
                    src="/images/brands/callaway-logo-white.png"
                    alt="Callaway"
                    width={80}
                    height={44}
                    className="h-auto w-full object-contain grayscale brightness-110 dark:brightness-110"
                    priority
                  />
                </div>
              </Link>
            </div>

            {/* Desktop Navigation Section */}
            <div className="hidden flex-1 items-center justify-center gap-6 xl:flex">
              <div ref={megaMenuRef} className="relative shrink-0">
                {/* <button
                  onClick={() => setMegaMenuOpen((current) => !current)}
                  className={clsx(
                    "inline-flex h-11 w-11 items-center justify-center rounded-2xl border transition",
                    megaMenuOpen
                      ? "border-white/18 bg-white/12 text-white"
                      : "border-white/10 bg-white/[0.04] text-white/76 hover:text-white"
                  )}
                  aria-label="Open workspace menu"
                >
                  <Grid2x2 size={16} />
                </button> */}

                <AnimatePresence>
                  {megaMenuOpen ? (
                    <motion.div
                      initial={{opacity: 0, y: 10}}
                      animate={{opacity: 1, y: 0}}
                      exit={{opacity: 0, y: 10}}
                      className="absolute left-0 top-full z-[100] mt-3 w-[min(980px,calc(100vw-48px))] overflow-hidden rounded-[28px] border border-white/10 bg-[color:var(--surface)] p-4 shadow-[0_35px_100px_rgba(0,0,0,0.42)]"
                    >
                      <div className="mb-4 flex items-end justify-between gap-3 border-b border-white/10 pb-4">
                        <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--header-muted)]">
                            Workspace
                          </p>
                        <p className="mt-2 text-lg font-semibold tracking-tight text-[color:var(--header-fg)]">
                            Fast module access
                          </p>
                        </div>
                        <button
                          onClick={() => setSearchOpen(true)}
                        className="inline-flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] header-pill"
                        >
                          <Search size={14} />
                          Search
                        </button>
                      </div>

                      <div className="grid gap-4 lg:grid-cols-3">
                        {megaMenuGroups.map((group) => (
                          <div
                            key={group.title}
                            className="rounded-[24px] border border-white/10 bg-[color:var(--header-control-bg)] p-3"
                          >
                            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--header-muted)]">
                              {group.title}
                            </p>
                            <div className="space-y-2">
                              {group.items.map((item) => {
                                const isActive = matchesPath(pathname, item.href);
                                const Icon = item.icon;

                                return (
                                  <Link
                                  key={item.id}
                                  href={item.href}
                              className={clsx(
                                "flex items-start gap-3 rounded-[20px] border px-3 py-3 transition",
                                isActive
                                  ? "border-[color:var(--header-pill-active-bg)] bg-[color:var(--header-pill-active-bg)]/5"
                                  : "border-transparent bg-[color:var(--header-control-bg)] hover:border-[color:var(--header-border)] hover:bg-[color:var(--header-control-hover)]"
                              )}
                                  >
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-white/8 bg-[color:var(--header-control-bg)] text-[color:var(--header-fg)]">
                                      <Icon size={17} />
                                    </div>
                                    <div className="min-w-0">
                                      <p className="text-sm font-semibold text-[color:var(--header-fg)]">{item.label}</p>
                                      <p className="mt-1 text-xs leading-5 text-[color:var(--header-muted)]">
                                        {item.description}
                                      </p>
                                    </div>
                                  </Link>
                                );
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>

              <nav className="flex items-center gap-1">
                {visibleNavItems.map((item) => {
                  const submenuItems = getSectionItems(item.id, viewRole);
                  const isActive = matchesPath(pathname, item.href);

                  if (submenuItems.length) {
                    return (
                      <div
                        key={item.id}
                        ref={openNavMenu === item.id ? navMenuRef : undefined}
                        className="relative"
                        onMouseEnter={() => setOpenNavMenu(item.id)}
                        onMouseLeave={() => setOpenNavMenu((current) => (current === item.id ? null : current))}
                      >
                        <button
                          onClick={() =>
                            setOpenNavMenu((current) => (current === item.id ? null : item.id))
                          }
                          className={clsx(
                            "group relative inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold tracking-wide transition-all duration-300",
                            isActive || openNavMenu === item.id
                              ? "text-[color:var(--header-pill-active-fg)]"
                              : "text-[color:var(--header-fg)]/70 hover:text-[color:var(--header-fg)]"
                          )}
                        >
                          <span className="relative z-10">{item.label}</span>
                          {(isActive || openNavMenu === item.id) && (
                            <motion.div
                              layoutId="nav-glow"
                              className="absolute inset-0 z-0 rounded-xl bg-[color:var(--header-pill-active-bg)] shadow-[0_0_15px_rgba(255,255,255,0.12)] ring-1 ring-white/20"
                              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                            />
                          )}
                          {!isActive && openNavMenu !== item.id && (
                            <div className="absolute inset-x-4 bottom-0 h-px scale-x-0 bg-[color:var(--header-border)] transition-transform duration-300 group-hover:scale-x-100" />
                          )}
                          <ChevronDown
                            size={14}
                            className={clsx("relative z-10 transition-transform duration-300", openNavMenu === item.id && "rotate-180")}
                          />
                        </button>

                        <AnimatePresence>
                          {openNavMenu === item.id ? (
                            <motion.div
                              initial={{opacity: 0, y: 10}}
                              animate={{opacity: 1, y: 0}}
                              exit={{opacity: 0, y: 10}}
                              className="absolute left-0 top-full z-[100] mt-3 w-[360px] overflow-hidden rounded-[28px] border border-white/10 bg-[color:var(--surface)] p-3 shadow-[0_30px_90px_rgba(0,0,0,0.42)]"
                            >
                              <div className="border-b border-white/10 px-2 pb-3">
                                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--header-muted)]">
                                  {item.label}
                                </p>
                                <p className="mt-2 text-sm leading-6 text-[color:var(--header-muted)]">
                                  {item.description}
                                </p>
                              </div>

                              <div className="mt-3 space-y-2">
                                {submenuItems.map((submenuItem) => {
                                  const Icon = submenuItem.icon;
                                  const childActive = matchesPath(pathname, submenuItem.href);
                                  return (
                                    <Link
                                      key={submenuItem.id}
                                      href={submenuItem.href}
                                      onClick={() => setOpenNavMenu(null)}
                                      className={clsx(
                                        "flex items-start gap-3 rounded-[20px] border px-3 py-3 transition",
                                        childActive
                                          ? "border-[color:var(--header-pill-active-bg)] bg-[color:var(--header-pill-active-bg)]/5"
                                          : "border-transparent bg-[color:var(--header-control-bg)] hover:border-[color:var(--header-border)] hover:bg-[color:var(--header-control-hover)]"
                                      )}
                                    >
                                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-white/8 bg-[color:var(--header-control-bg)] text-[color:var(--header-fg)]">
                                        <Icon size={16} />
                                      </div>
                                      <div className="min-w-0">
                                        <p className="text-sm font-semibold text-[color:var(--header-fg)]">{submenuItem.label}</p>
                                        <p className="mt-1 text-xs leading-5 text-[color:var(--header-muted)]">
                                          {submenuItem.description}
                                        </p>
                                      </div>
                                    </Link>
                                  );
                                })}
                              </div>
                            </motion.div>
                          ) : null}
                        </AnimatePresence>
                      </div>
                    );
                  }

                  return (
                      <Link
                      key={item.href}
                      href={item.href}
                      className={clsx(
                        "group relative rounded-xl px-4 py-2 text-sm font-semibold tracking-wide transition-all duration-300",
                        isActive
                          ? "text-[color:var(--header-pill-active-fg)]"
                          : "text-[color:var(--header-fg)]/70 hover:text-[color:var(--header-fg)]"
                      )}
                    >
                      <span className="relative z-10">{item.label}</span>
                      {isActive && (
                        <motion.div
                          layoutId="nav-glow"
                          className="absolute inset-0 z-0 rounded-xl bg-[color:var(--header-pill-active-bg)] shadow-[0_0_15px_rgba(255,255,255,0.12)] ring-1 ring-white/20"
                          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        />
                      )}
                      {!isActive && (
                        <div className="absolute inset-x-4 bottom-0 h-px scale-x-0 bg-[color:var(--header-border)] transition-transform duration-300 group-hover:scale-x-100" />
                      )}
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* User Actions Section */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSearchOpen(true)}
                className="header-control inline-flex h-9 w-9 items-center justify-center rounded-lg border transition"
                aria-label="Open search"
              >
                <Search size={16} />
              </button>

              <Link
                href={`/admin/cart/${currentOrder?.orderNumber}`}
                className="header-control relative inline-flex h-9 w-9 items-center justify-center rounded-lg border transition"
                aria-label="Open cart"
              >
                <ShoppingCart size={16} />
                {items.length > 0 && (
                  <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-[color:var(--header-pill-active-bg)] text-[9px] font-bold text-[color:var(--header-pill-active-fg)] ring-2 ring-[color:var(--background)]">
                    {items.length}
                  </span>
                )}
              </Link>

              <ThemeToggle className="header-control" />

              <div ref={profileMenuRef} className="relative">
                <button
                  onClick={() => setProfileMenuOpen((current) => !current)}
                  className="header-control group inline-flex h-9 items-center gap-2 rounded-lg border pl-1 pr-2 transition"
                >
                  <div className="flex h-7 w-7 items-center justify-center rounded bg-[color:var(--header-pill-active-bg)] text-[10px] font-bold text-[color:var(--header-pill-active-fg)] ring-1 ring-[color:var(--header-pill-border)] transition-all group-hover:bg-[color:var(--header-pill-active-bg)] group-hover:text-[color:var(--header-pill-active-fg)] group-hover:ring-[color:var(--header-pill-active-bg)]">
                    {getInitials(user.name)}
                  </div>
                  <ChevronDown
                    size={14}
                    className={clsx("transition-transform duration-300", profileMenuOpen && "rotate-180")}
                  />
                </button>

                <AnimatePresence>
                  {profileMenuOpen ? (
                    <motion.div
                      initial={{opacity: 0, y: 10}}
                      animate={{opacity: 1, y: 0}}
                      exit={{opacity: 0, y: 10}}
                      className="absolute right-0 top-full z-[100] mt-3 w-[320px] overflow-hidden rounded-[24px] border border-white/10 bg-[color:var(--surface)] p-3 shadow-[0_30px_90px_rgba(0,0,0,0.42)]"
                    >
                      <div className="rounded-[20px] border border-white/8 bg-[color:var(--header-control-bg)] p-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/8 bg-[color:var(--header-pill-active-bg)] text-sm font-semibold uppercase text-[color:var(--header-pill-active-fg)]">
                            {getInitials(user.name)}
                          </div>
                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-[color:var(--header-fg)]">
                              {user.name ?? "Workspace User"}
                            </p>
                            <p className="truncate text-xs text-[color:var(--header-muted)]">
                              {user.email ?? "No email available"}
                            </p>
                            <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-[color:var(--header-muted)]">
                              Logged in as {VIEW_ROLE_LABELS[user.role as keyof typeof VIEW_ROLE_LABELS] ?? user.role}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="mt-3 rounded-[20px] border border-white/8 bg-[color:var(--header-control-bg)] p-3">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[color:var(--header-muted)]">
                          View As
                        </p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {allowedViewRoles.map((role) => {
                            const active = role === viewRole;
                            return (
                              <button
                                key={role}
                                onClick={() => applyViewRole(role)}
                                className={clsx(
                                  "rounded-full border px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] transition",
                                  active
                                  ? "border-[color:var(--header-pill-active-bg)] bg-[color:var(--header-pill-active-bg)] text-[color:var(--header-pill-active-fg)]"
                                    : "border-[color:var(--header-pill-border)] bg-[color:var(--header-control-bg)] text-[color:var(--header-fg)]/72 hover:bg-[color:var(--header-control-hover)] hover:text-[color:var(--header-fg)]"
                                )}
                              >
                                {VIEW_ROLE_LABELS[role]}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div className="mt-3 space-y-2">
                        <button
                          onClick={() => router.push("/admin/orders")}
                          className="header-control flex items-center gap-3 rounded-[18px] border px-3 py-3 text-sm font-semibold transition"
                        >
                          <ShoppingBag size={16} />
                          My Orders
                        </button>
                        <button
                          onClick={() => router.push("/admin/setting")}
                          className="header-control flex items-center gap-3 rounded-[18px] border px-3 py-3 text-sm font-semibold transition"
                        >
                          <Settings size={16} />
                          Setting
                        </button>

                        <button
                          onClick={() => signOut({callbackUrl: "/login"})}
                          className="header-control flex w-full items-center gap-3 rounded-[18px] border px-3 py-3 text-sm font-semibold transition"
                        >
                          <LogOut size={16} />
                          Sign out
                        </button>
                      </div>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </header>

        {/* Header Spacer */}
        {/* <div className="h-[74px] w-full" /> */}

        <AnimatePresence>
          {mobileMenuOpen ? (
            <motion.aside
              initial={{x: -24, opacity: 0}}
              animate={{x: 0, opacity: 1}}
              exit={{x: -24, opacity: 0}}
              className="fixed left-3 top-3 z-[120] w-[320px] rounded-[28px] border border-white/10 bg-[color:var(--surface)] p-4 text-[color:var(--surface-foreground)] shadow-[0_30px_90px_rgba(0,0,0,0.42)] md:hidden"
            >
              <div className="mb-4 flex items-center justify-between">
                <div className="min-w-0">
                  <div className="header-control mb-3 flex h-11 w-[108px] items-center justify-center rounded-2xl border px-3">
                    <Image
                      src="/images/brands/callaway-logo-white.png"
                      alt="Callaway"
                      width={86}
                      height={48}
                      className="h-auto w-full object-contain"
                    />
                  </div>
                  <p className="text-xs font-bold uppercase tracking-[0.4em] text-[color:var(--header-muted)]">
                    Admin Gate
                  </p>
                  <p className="text-[9px] font-medium uppercase tracking-[0.2em] text-[color:var(--header-muted)]">v4.2.0</p>
                </div>
                <button
                  className="header-control rounded-2xl border p-2.5"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <X size={18} />
                </button>
              </div>

              <div className="mb-4 grid grid-cols-3 gap-2">
                <button
                  onClick={() => {
                    setSearchOpen(true);
                    setMobileMenuOpen(false);
                  }}
                  className="header-control flex h-11 items-center justify-center rounded-2xl border"
                >
                  <Search size={17} />
                </button>
                <Link
                  href="/admin/cart"
                  onClick={() => setMobileMenuOpen(false)}
                  className="header-control relative flex h-11 items-center justify-center rounded-2xl border"
                >
                  <ShoppingCart size={17} />
                  {items.length > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[color:var(--header-pill-active-bg)] text-[10px] font-bold text-[color:var(--header-pill-active-fg)]">
                    {items.length}
                  </span>
                  )}
                </Link>
                <ThemeToggle className="h-11 w-full justify-center rounded-2xl" showLabel />
              </div>

              <div className="mb-4 rounded-[20px] border border-white/8 bg-[color:var(--header-control-bg)] p-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/8 bg-[color:var(--header-pill-active-bg)] text-xs font-semibold uppercase text-[color:var(--header-pill-active-fg)]">
                    {getInitials(user.name)}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-[color:var(--header-fg)]">
                      {user.name ?? "Workspace User"}
                    </p>
                    <p className="truncate text-xs text-[color:var(--header-muted)]">{user.email ?? ""}</p>
                  </div>
                </div>

                <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-[color:var(--header-muted)]">
                  View As
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {allowedViewRoles.map((role) => (
                    <button
                      key={role}
                      onClick={() => {
                        applyViewRole(role);
                        setMobileMenuOpen(false);
                      }}
                      className={clsx(
                        "rounded-full border px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] transition",
                        role === viewRole
                          ? "border-[color:var(--header-pill-active-bg)] bg-[color:var(--header-pill-active-bg)] text-[color:var(--header-pill-active-fg)]"
                          : "border-[color:var(--header-pill-border)] bg-[color:var(--header-control-bg)] text-[color:var(--header-fg)]/72 hover:bg-[color:var(--header-control-hover)] hover:text-[color:var(--header-fg)]"
                      )}
                    >
                      {VIEW_ROLE_LABELS[role]}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                {visibleNavItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                      className={clsx(
                        "flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-semibold transition",
                        matchesPath(pathname, item.href)
                        ? "bg-[color:var(--header-pill-active-bg)] text-[color:var(--header-pill-active-fg)]"
                        : "text-[color:var(--header-fg)]/72 hover:bg-[color:var(--header-control-hover)] hover:text-[color:var(--header-fg)]"
                      )}
                  >
                    <item.icon size={17} />
                    {item.label}
                  </Link>
                ))}

                <Link
                  href="/admin/orders"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-semibold text-[color:var(--header-fg)]/72 transition hover:bg-[color:var(--header-control-hover)] hover:text-[color:var(--header-fg)]"
                >
                  <ShoppingBag size={17} />
                  My Orders
                </Link>

                <button
                  onClick={() => signOut({callbackUrl: "/login"})}
                  className="flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-sm font-semibold text-[color:var(--header-fg)]/72 transition hover:bg-[color:var(--header-control-hover)] hover:text-[color:var(--header-fg)]"
                >
                  <LogOut size={17} />
                  Sign out
                </button>
              </div>
            </motion.aside>
          ) : null}
        </AnimatePresence>

        <div className="relative">
          <div className="relative h-[200px] overflow-hidden bg-surface text-white">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeHeroSlide.id}
                initial={{opacity: 0}}
                animate={{opacity: 1}}
                exit={{opacity: 0}}
                transition={{duration: 0.8, ease: "easeOut"}}
                className="absolute inset-0"
                style={{
                  backgroundImage: `linear-gradient(to bottom, transparent, var(--background)), url(${activeHeroSlide.image})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  filter: "grayscale(1) contrast(1.1) brightness(0.7)",
                }}
              />
            </AnimatePresence>
            <div className="absolute inset-0 bg-gradient-to-r from-background/94 via-background/46 to-transparent" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(255,255,255,0.1),transparent_42%)]" />

            <div
              className={clsx(
                "relative mx-auto flex h-full items-end justify-between gap-5 px-4 pb-6 sm:px-5",
                shellWidthClass
              )}
            >
            </div>
          </div>

          <main className={clsx("relative z-10 overflow-y-auto overflow-x-hidden px-3 pb-5 sm:px-10", contentLiftClass)}>
            <motion.div
              initial={{opacity: 0, y: 10}}
              animate={{opacity: 1, y: 0}}
              transition={{duration: 0.35, ease: "easeOut"}}
              className={clsx("mx-auto")}
            >
              {children}
            </motion.div>
          </main>
        </div>
      </div>
    </>
  );
}
