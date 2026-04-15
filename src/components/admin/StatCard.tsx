import {LucideIcon} from "lucide-react";

export function StatCard({
  label,
  value,
  hint,
  icon: Icon,
}: {
  label: string;
  value: string | number;
  hint?: string;
  icon: LucideIcon;
}) {
  return (
    <div className="group premium-card p-7 transition-all duration-300 hover:-translate-y-1 hover:scale-[1.01]">
      <div className="mb-5 h-px w-20 rounded-full bg-white/20 transition-all duration-300 group-hover:w-28" />
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-foreground/52">
            {label}
          </p>
          <p className="bg-gradient-to-b from-white to-zinc-400 bg-clip-text text-[2.7rem] font-semibold tracking-[-0.04em] text-transparent sm:text-[3.2rem]">
            {value}
          </p>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/8 bg-white/5 text-foreground transition-all duration-300 group-hover:scale-105 group-hover:bg-white/10">
          <Icon size={20} />
        </div>
      </div>
      {hint ? (
        <div className="mt-4 flex items-center gap-1.5 text-[11px] font-medium text-foreground/62">
          <span className="h-1 w-1 rounded-full bg-white/70" />
          {hint}
        </div>
      ) : null}
    </div>
  );
}
