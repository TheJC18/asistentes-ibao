import { useState, useMemo, ReactNode } from 'react';
import TableDefault from './TableDefault';
import Pagination from './Pagination';

interface EntityListProps<T> {
  title: ReactNode;
  description?: string;
  data?: T[];
  columns?: Array<{
    key: string;
    label: string;
    className?: string;
    visibleOn?: string[];
    render?: (item: T) => ReactNode;
  }>;
  renderActions?: (item: T) => ReactNode;
  filterFunction?: (item: T, search: string) => boolean;
  perPageOptions?: number[];
  defaultPerPage?: number;
  searchPlaceholder?: string;
  onSearchChange?: (search: string) => void;
  FloatingButton?: ReactNode;
  ModalComponent?: ReactNode;
  isLoading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  noDataMessage?: string;
}

export default function EntityList<T extends { id?: string | number }>({
  title,
  description,
  data = [],
  columns = [],
  renderActions,
  filterFunction,
  perPageOptions = [5, 10, 15, 25],
  defaultPerPage = 10,
  searchPlaceholder = "Buscar...",
  onSearchChange,
  FloatingButton,
  ModalComponent,
  isLoading = false,
  error = null,
  onRetry,
  noDataMessage = "No hay datos para mostrar"
}: EntityListProps<T>) {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(defaultPerPage);

  const filteredData = useMemo(() => {
    if (filterFunction) return data.filter((item) => filterFunction(item, search));
    return data;
  }, [data, search, filterFunction]);

  const totalPages = Math.ceil(filteredData.length / perPage);
  const paginatedData = filteredData.slice((page - 1) * perPage, page * perPage);

  const handlePrev = () => setPage((p) => Math.max(1, p - 1));
  const handleNext = () => setPage((p) => Math.min(totalPages, p + 1));

  return (
    <>
      <div className="min-h-[80vh] dark:from-gray-900 dark:via-gray-950 dark:to-gray-900">
        <div className="p-4 md:p-6">
          <h2 className="text-4xl font-extrabold mb-8 text-black dark:text-white text-center drop-shadow">
            {title}
          </h2>
          {description && (
            <p className="text-center text-gray-600 dark:text-gray-400 mb-6">{description}</p>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 rounded-lg">
              <p className="text-red-700 dark:text-red-300 text-center">{error}</p>
              {onRetry && (
                <button
                  onClick={onRetry}
                  className="mt-2 mx-auto block px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded"
                >
                  Reintentar
                </button>
              )}
            </div>
          )}

          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <>
              <input
                className="mb-10 w-full rounded-xl border px-5 py-4 text-lg focus:ring-2 focus:ring-blue-400 dark:bg-gray-900 dark:text-white/90 dark:border-gray-700 shadow-sm"
                placeholder={searchPlaceholder}
                value={search}
                autoComplete="false"
                onChange={(e) => {
                  setSearch(e.target.value);
                  onSearchChange?.(e.target.value);
                }}
              />

              {filteredData.length === 0 ? (
                <div className="text-center py-20 text-gray-500 dark:text-gray-400">
                  {noDataMessage}
                </div>
              ) : (
                <>
                  <div className="overflow-x-auto max-w-full min-w-0 scrollbar-thin scrollbar-thumb-blue-300 scrollbar-track-transparent">
                    <TableDefault
                      data={paginatedData}
                      columns={columns}
                      actions={renderActions}
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row justify-between items-center mt-8 gap-4">
                    <Pagination
                      page={page}
                      totalPages={totalPages}
                      onPrev={handlePrev}
                      onNext={handleNext}
                      perPage={perPage}
                      setPerPage={setPerPage}
                      perPageLabel="Por página:"
                      options={perPageOptions}
                    />
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>

      {FloatingButton}
      {ModalComponent}
    </>
  );
}
