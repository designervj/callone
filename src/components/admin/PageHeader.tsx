"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LucideIcon, ChevronRight, Home } from "lucide-react";

type PageHeaderProps = {
  title: string;
  description?: string;
  backHref?: string;
  action?: React.ReactNode;
  icon?: LucideIcon;
};

function useBreadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  const crumbs: { label: string; href: string }[] = [];
  let accumulated = "";
  segments.forEach((seg) => {
    accumulated += `/${seg}`;
    const label = seg
      .replace(/-/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());
    crumbs.push({ label, href: accumulated });
  });
  return crumbs;
}

export function PageHeader({ title, description, action, icon: Icon }: PageHeaderProps) {
  const breadcrumbs = useBreadcrumbs();

  return (
    <div className="flex flex-col gap-3 pb-4 pt-4 md:flex-row md:items-end md:justify-between">
      <div className="flex flex-col gap-2">

        {/* Breadcrumbs — small, white, above the glass card */}
        <nav className="flex items-center gap-1 text-[11px] font-semibold text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
          <Link href="/admin" className="flex items-center gap-1 opacity-70 hover:opacity-100 transition-opacity">
            <Home size={11} />
            <span>Home</span>
          </Link>
          {breadcrumbs.slice(1).map((crumb, i) => (
            <React.Fragment key={crumb.href}>
              <ChevronRight size={11} className="opacity-40" />
              {i === breadcrumbs.length - 2 ? (
                <span className="opacity-100 text-white">{crumb.label}</span>
              ) : (
                <Link href={crumb.href} className="opacity-70 hover:opacity-100 transition-opacity">
                  {crumb.label}
                </Link>
              )}
            </React.Fragment>
          ))}
        </nav>

        {/* Glass title card — always readable regardless of background */}
        <div className="inline-flex items-center gap-4 bg-black/50 backdrop-blur-md px-5 py-4 rounded-2xl border border-white/10 shadow-xl">
          {Icon && (
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/20 bg-white/10 text-white">
              <Icon size={22} />
            </div>
          )}
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              {title}
            </h1>
            {description && (
              <p className="mt-0.5 text-xs leading-5 text-white/65 max-w-xl">
                {description}
              </p>
            )}
          </div>
        </div>

      </div>

      {action && <div className="flex items-center gap-3">{action}</div>}
    </div>
  );
}
