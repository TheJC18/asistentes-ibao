import { useEffect, useState, ReactNode } from "react";
import type { ColumnConfig, TableDefaultProps } from '../../types/index';

// Helper para obtener el breakpoint actual
function useBreakpoint() {
  const [breakpoint, setBreakpoint] = useState<"base" | "2xs" | "xs"  | "ss" | "sm" | "md" | "lg" | "xl">("base");
  useEffect(() => {
    function updateBreakpoint() {
      const w = window.innerWidth;
      if (w >= 1280) setBreakpoint("xl");
      else if (w >= 1024) setBreakpoint("lg");
      else if (w >= 768) setBreakpoint("md");
      else if (w >= 640) setBreakpoint("sm");
      else if (w >= 480) setBreakpoint("ss");
      else if (w >= 375) setBreakpoint("xs");
      else if (w >= 320) setBreakpoint("2xs");
      else setBreakpoint("base");
    }
    updateBreakpoint();
    window.addEventListener("resize", updateBreakpoint);
    return () => window.removeEventListener("resize", updateBreakpoint);
  }, []);
  return breakpoint;
}

function TableDefault<T extends { id?: string | number }>({
  data,
  columns,
  actions,
}: TableDefaultProps<T>) {
  const breakpoint = useBreakpoint();
  // Filtra columnas visibles en el breakpoint actual
  const visibleColumns = columns.filter(
    (col) => !col.visibleOn || col.visibleOn.includes(breakpoint)
  );
  const showActions = !!actions;
  return (
    <div className="w-full max-w-full overflow-x-auto relative" style={{ WebkitOverflowScrolling: 'touch' }}>
      {/* Sombra sutil a la derecha para indicar scroll */}
      <div className="pointer-events-none absolute top-0 right-0 h-full w-6 bg-gradient-to-l from-surface/80 to-transparent z-10" />
      <table className="min-w-fit w-full border-2 border-secondary rounded-xl overflow-hidden shadow-lg bg-card">
        <thead className="border-b-2 border-secondary bg-surface">
          <tr>
            {visibleColumns.map((col) => (
              <th
                key={String(col.key)}
                className={`px-4 py-3 font-bold text-text-primary text-base border-b-2 border-secondary ${col.className || ""}`}
              >
                {col.label}
              </th>
            ))}
            {showActions && (
              <th
                className="px-4 py-3 font-bold text-text-primary text-center text-base border-b-2 border-secondary whitespace-nowrap"
              >
                Acciones
              </th>
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-divider">
          {data.map((item) => (
            <tr key={item.id || JSON.stringify(item)} className="hover:bg-surface-hover transition">
              {visibleColumns.map((col) => (
                <td
                  key={String(col.key)}
                  className={`px-4 py-3 text-start border-b border-divider text-text-primary ${col.className || ""}`}
                >
                  {col.render
                    ? col.render(item)
                    : (typeof col.key === 'string'
                        ? (item[col.key as keyof T] as React.ReactNode)
                        : (item[col.key] as React.ReactNode)
                      )}
                </td>
              ))}
              {showActions && (
                <td
                  className="px-2 py-3 border-b border-divider text-center whitespace-nowrap"
                >
                  {actions(item)}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TableDefault;
