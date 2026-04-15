export function EmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-[24px] border border-dashed border-white/10 bg-white/[0.02] px-6 py-14 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]">
      <h3 className="text-lg font-semibold tracking-tight text-foreground">{title}</h3>
      <p className="mx-auto mt-2 max-w-2xl text-sm leading-6 text-foreground/62">{description}</p>
    </div>
  );
}
