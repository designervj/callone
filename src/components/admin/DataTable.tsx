export type DataTableHeader = string | {
  label: React.ReactNode;
  key?: string;
  renderFilter?: (label: React.ReactNode) => React.ReactNode;
};

type DataTableProps = {
  headers: DataTableHeader[];
  children: React.ReactNode;
};

export function DataTable({headers, children}: DataTableProps) {
  return (
    <div className="overflow-clip rounded-[24px] border border-white/6 bg-[color:var(--surface)] shadow-[0_24px_70px_rgba(0,0,0,0.3)]">
      <div className="w-full max-h-[calc(100vh-250px)] overflow-auto rounded-b-[16px]">
        <table className="min-w-full border-separate border-spacing-y-3 text-left text-sm">
          <thead>
            <tr className="bg-surface-muted/50 text-foreground">
              {headers.map((item, index) => {
                const label = typeof item === 'string' ? item : item.label;
                const renderFilter = typeof item === 'object' ? item.renderFilter : undefined;
                
                return (
                  <th
                    key={`${label}-${index}`}
                    className="sticky z-20 whitespace-nowrap border-b border-white/6 bg-[color:var(--surface)]/96 px-5 py-4 text-[10px] font-semibold uppercase tracking-[0.24em] text-foreground/62 backdrop-blur-md"
                    style={{top: 0}}
                  >
                  <div className="flex flex-col gap-2">
                       <span>{label}</span>
                       {renderFilter && (
                         <div className="mt-1 flex items-center gap-1.5 font-normal normal-case tracking-normal">
                           {renderFilter(label)}
                         </div>
                       )}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="bg-[color:var(--surface)] [&_tr]:transition-all [&_tr:hover]:scale-[1.008] [&_tr:hover]:bg-white/[0.05]">
            {children}
          </tbody>
        </table>
      </div>
    </div>
  );
}
