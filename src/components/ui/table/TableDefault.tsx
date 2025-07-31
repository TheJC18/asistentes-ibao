import { useEffect, useState, ReactNode } from "react";

interface ColumnConfig<T> {
  key: keyof T;
  label: string;
  render?: (item: T) => ReactNode;
  className?: string;
  visibleOn?: Array<"base" | "2xs" | "xs"  | "ss" | "sm" | "md" | "lg" | "xl">; 
}

interface TableDefaultProps<T> {
  data: T[];
  columns: ColumnConfig<T>[];
  actions?: (item: T) => ReactNode;
  className?: string;
}

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
      <div className="pointer-events-none absolute top-0 right-0 h-full w-6 dark:from-gray-900/80 to-transparent z-10" />
      <table className="min-w-fit w-full border-2 border-blue-400 rounded-xl overflow-hidden shadow-lg dark:border-blue-500 bg-white dark:bg-gray-800">
        <thead className="border-b-2 border-blue-400 dark:border-blue-200 bg-gray-200 dark:bg-gray-600">
          <tr>
            {visibleColumns.map((col) => (
              <th
                key={String(col.key)}
                className={`px-4 py-3 font-bold text-black dark:text-white text-base border-b-2 border-blue-400 dark:border-blue-500 ${col.className || ""}`}
              >
                {col.label}
              </th>
            ))}
            {showActions && (
              <th
                className="px-4 py-3 font-bold text-black dark:text-white text-center text-base border-b-2 border-blue-400 dark:border-blue-500 whitespace-nowrap"
              >
                Acciones
              </th>
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-blue-200 dark:divide-blue-900">
          {data.map((item) => (
            <tr key={item.id || JSON.stringify(item)} className="hover:bg-blue-50 dark:hover:bg-blue-900/30 transition">
              {visibleColumns.map((col) => (
                <td
                  key={String(col.key)}
                  className={`px-4 py-3 text-start border-b border-blue-200 dark:border-blue-900 ${col.className || ""}`}
                >
                  {col.render ? col.render(item) : (item[col.key] as React.ReactNode)}
                </td>
              ))}
              {showActions && (
                <td
                  className="px-2 py-3 border-b border-blue-200 dark:border-blue-900 text-center whitespace-nowrap"
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