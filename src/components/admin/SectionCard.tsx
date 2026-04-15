type SectionCardProps = {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
};

export function SectionCard({
  title,
  description,
  action,
  children,
}: SectionCardProps) {
  return (
    <section className="premium-card overflow-hidden rounded-[28px]">
      {(title || action) && (
        <div className="flex flex-col gap-4 border-b border-white/8 px-7 py-7 lg:flex-row lg:items-center lg:justify-between">
          <div>
            {title ? <h2 className="text-[11px] font-semibold uppercase tracking-[0.24em] text-foreground/62">{title}</h2> : null}
            {description ? (
              <p className="mt-2 max-w-2xl text-sm leading-6 text-foreground/62">{description}</p>
            ) : null}
          </div>
          {action ? <div className="flex items-center gap-3">{action}</div> : null}
        </div>
      )}
      <div className="p-7">{children}</div>
    </section>
  );
}
