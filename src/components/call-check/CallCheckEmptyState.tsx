'use client';

import {Database, FileSpreadsheet, Link as LinkIcon, Loader2, Upload} from "lucide-react";
import type {CallCheckDataset} from "@/components/call-check/types";

type CallCheckEmptyStateProps = {
  urlInput: string;
  onUrlInputChange: (value: string) => void;
  onLoadFromUrl: (event: React.FormEvent<HTMLFormElement>) => void;
  onOpenFile: () => void;
  onOpenDataset: (slug: string) => void;
  datasets: CallCheckDataset[];
  isLoading: boolean;
};

export function CallCheckEmptyState({
  urlInput,
  onUrlInputChange,
  onLoadFromUrl,
  onOpenFile,
  onOpenDataset,
  datasets,
  isLoading,
}: CallCheckEmptyStateProps) {
  return (
    <div className="flex min-h-[640px] items-center justify-center p-6">
      <section className="premium-card w-full max-w-3xl overflow-hidden rounded-[32px]">
        <div className="grid gap-0 md:grid-cols-[minmax(0,1.05fr)_320px]">
          <div className="space-y-6 border-b border-border/60 p-6 md:border-b-0 md:border-r">
            <div className="space-y-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-foreground/42">
                Raw sheet workspace
              </p>
              <h2 className="text-[2rem] font-semibold tracking-tight text-foreground">
                Call-check spreadsheet manager
              </h2>
              <p className="max-w-xl text-sm text-foreground/62">
                Upload Excel or CSV files, load a public sheet URL, review the data in AG Grid, and save
                reusable datasets back into CallawayOne.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={onOpenFile}
                disabled={isLoading}
                className="inline-flex items-center gap-2 rounded-[20px] bg-primary px-5 py-3 text-sm font-semibold text-white disabled:opacity-60"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Upload className="h-4 w-4" />
                )}
                Upload spreadsheet
              </button>
            </div>

            <form onSubmit={onLoadFromUrl} className="grid gap-3 rounded-[24px] border border-border/70 bg-background/80 p-4 md:grid-cols-[minmax(0,1fr)_140px]">
              <label className="relative block">
                <LinkIcon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/42" />
                <input
                  type="url"
                  value={urlInput}
                  onChange={(event) => onUrlInputChange(event.target.value)}
                  placeholder="Paste a Google Sheets or file URL"
                  className="w-full rounded-[18px] border border-border/70 bg-background px-11 py-3 text-sm"
                />
              </label>
              <button
                type="submit"
                disabled={isLoading || !urlInput.trim()}
                className="inline-flex items-center justify-center gap-2 rounded-[18px] border border-border/70 bg-background px-4 py-3 text-sm font-semibold text-foreground/76 disabled:opacity-60"
              >
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                Load URL
              </button>
            </form>
          </div>

          <div className="space-y-4 p-6">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-foreground/42">
                Saved datasets
              </p>
              <p className="mt-2 text-sm text-foreground/56">
                Reopen previously saved raw sheets and continue editing in place.
              </p>
            </div>

            {datasets.length ? (
              <div className="space-y-2">
                {datasets.map((dataset) => (
                  <button
                    key={dataset.id}
                    type="button"
                    onClick={() => onOpenDataset(dataset.slug)}
                    className="flex w-full items-center gap-3 rounded-[20px] border border-border/70 bg-background/85 px-4 py-3 text-left"
                  >
                    <Database className="h-4 w-4 shrink-0 text-foreground/42" />
                    <span className="min-w-0 flex-1 truncate text-sm font-medium text-foreground">
                      {dataset.name}
                    </span>
                  </button>
                ))}
              </div>
            ) : (
              <div className="rounded-[20px] border border-dashed border-border/80 bg-background/70 px-4 py-6 text-center text-sm text-foreground/56">
                No saved raw sheets yet.
              </div>
            )}

            <div className="rounded-[22px] border border-border/70 bg-background/70 p-4 text-sm text-foreground/56">
              <div className="flex items-center gap-2 font-semibold text-foreground/74">
                <FileSpreadsheet className="h-4 w-4" />
                Included features
              </div>
              <ul className="mt-3 space-y-2">
                <li>Excel, CSV, and public sheet URL loading</li>
                <li>AG Grid filtering, sorting, editing, and export</li>
                <li>Saved dataset reopen flow</li>
                <li>Row-level database updates after edits</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
