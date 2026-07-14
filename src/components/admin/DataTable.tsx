export type DataTableHeader = string | {
  label: React.ReactNode;
  key?: string;
  renderFilter?: (label: React.ReactNode) => React.ReactNode;
};

type DataTableProps = {
  headers: DataTableHeader[];
  children: React.ReactNode;
  containerClassName?: string;
  isCompact?: boolean;
};

export function DataTable({headers, children, containerClassName, isCompact}: DataTableProps) {
  return (
    <div className="overflow-clip rounded-2xl border border-border/15 bg-surface shadow-sm flex flex-col min-h-0 flex-1">
      <div className={containerClassName || "w-full max-h-[calc(100vh-250px)] overflow-auto"}>
        <table className={`min-w-full border-separate border-spacing-0 text-left text-sm ${isCompact ? "is-compact" : ""}`}>
          <thead>
            <tr>
              {headers.map((item, index) => {
                const label = typeof item === 'string' ? item : item.label;
                const renderFilter = typeof item === 'object' ? item.renderFilter : undefined;
                
                return (
                  <th
                    key={`${label}-${index}`}
                    className="sticky top-0 z-20 whitespace-nowrap border-b border-zinc-800 bg-zinc-900 px-5 py-4 text-xs font-bold uppercase tracking-wider text-zinc-100"
                  >
                    <div className="flex flex-col gap-2">
                      {!renderFilter && <span>{label}</span>}
                      {renderFilter && (
                        <div className="flex items-center gap-1.5 font-normal normal-case tracking-normal">
                          {renderFilter(label)}
                        </div>
                      )}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-border/4 bg-surface [&_tr]:transition-colors [&_tr:hover]:bg-surface-muted/50">
            {children}
          </tbody>
        </table>
      </div>
    </div>
  );
}

