import Link from "next/link";
import {DatabaseZap, FileSpreadsheet, Files, Workflow} from "lucide-react";
import {SectionCard} from "@/components/admin/SectionCard";

const IMPORT_MODULES = [
  {
    title: "Sheet Calibration",
    description:
      "Upload the default CSV or your own intake sheet, calibrate it against live brands/products/variants/warehouses, and reopen saved datasets.",
    href: "/admin/imports/sheet-calibration",
    cta: "Open workspace",
    icon: FileSpreadsheet,
  },
  {
    title: "Legacy SQL Migration",
    description:
      "Script-driven migration from the full MySQL dump into MongoDB collections, preserving order snapshots and stock logic.",
    href: "/README.md",
    cta: "Review migration notes",
    icon: DatabaseZap,
  },
  {
    title: "Import Jobs Roadmap",
    description:
      "Future upload consoles for blocked stock, catalog refreshes, user onboarding sheets, and brand-specific qty updates.",
    href: "/admin/imports/sheet-calibration",
    cta: "Use calibration as base",
    icon: Workflow,
  },
];

export default function ImportsPage() {
  return (
    <div className="space-y-4">
      <section className="premium-card overflow-hidden rounded-[28px]">
        <div className="grid gap-4 border-b border-border/60 px-4 py-4 xl:grid-cols-[minmax(0,1fr)_320px]">
          <div className="space-y-2">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-foreground/42">
              Import operations
            </p>
            <h2 className="text-[1.85rem] font-semibold tracking-tight text-foreground">
              Imports and Calibration
            </h2>
            <p className="max-w-3xl text-sm text-foreground/62">
              This hub now includes the first production import workspace. The old `call-check` experiment has been folded into a cleaner admin route so uploads, saved sheets, and calibration logic sit inside the main system.
            </p>
          </div>

          <div className="rounded-[24px] border border-border/70 bg-background/80 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-foreground/42">
              Current live scope
            </p>
            <ul className="mt-3 space-y-2 text-sm text-foreground/62">
              <li>CSV-based intake and calibration page.</li>
              <li>Mongo-backed saved datasets and reopen flow.</li>
              <li>Legacy SQL import remains script-first.</li>
            </ul>
          </div>
        </div>
      </section>

      <div className="grid gap-4 xl:grid-cols-3">
        {IMPORT_MODULES.map((item) => {
          const Icon = item.icon;

          return (
            <SectionCard
              key={item.title}
              title={item.title}
              description={item.description}
              action={
                <Link
                  href={item.href}
                  className="inline-flex items-center gap-2 rounded-2xl border border-border/70 bg-background px-4 py-2.5 text-sm font-semibold text-foreground/76"
                >
                  <Files className="h-4 w-4" />
                  {item.cta}
                </Link>
              }
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-[22px] bg-[#111111] text-white">
                <Icon className="h-5 w-5" />
              </div>
            </SectionCard>
          );
        })}
      </div>
    </div>
  );
}
