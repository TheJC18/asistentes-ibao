import { useState, useMemo, ReactNode } from 'react';
import TableDefault from './TableDefault';
import Pagination from './Pagination';
import type { EntityListProps } from '../../types/index';
import { useTranslation } from '@/core/context/LanguageContext';

export default function EntityList<T extends { id?: string | number }>({
  title,
  description,
  data = [],
  columns = [],
  renderActions,
  filterFunction,
  perPageOptions = [5, 10, 15, 25],
  defaultPerPage = 10,
  onSearchChange,
  FloatingButton,
  ModalComponent,
  isLoading = false,
  error = null,
  onRetry,
  searchPlaceholder,
  noDataMessage,
}: EntityListProps<T>) {
  // Importación directa y nombre descriptivo para la traducción
  // (debe ir al inicio del archivo, pero aquí se muestra para el diff)
  const translation = useTranslation();
  const i18nSearchPlaceholder = translation.table?.searchPlaceholder ?? '';
  const i18nNoDataMessage = translation.table?.noDataMessage ?? '';
  const searchInputPlaceholder = searchPlaceholder ?? i18nSearchPlaceholder;
  const emptyDataMessage = noDataMessage ?? i18nNoDataMessage;
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
      <div className="min-h-[80vh]">
        <div className="p-4 md:p-6">
          {/* Header */}
          <div className="flex flex-col items-center mb-6">
            {typeof title === 'string' ? (
              <h2 className="text-3xl font-bold text-text-primary mb-2">{title}</h2>
            ) : (
              title
            )}
            {description && (
              <p className="text-text-secondary text-center">{description}</p>
            )}
          </div>

          {error && (
            <div className="mb-6 p-4 bg-error-light border border-error rounded-lg">
              <p className="text-error text-center">{error}</p>
              {onRetry && (
                <button
                  onClick={onRetry}
                  className="mt-2 mx-auto block px-4 py-2 bg-error hover:bg-error/80 text-text-on-primary rounded"
                >
                  Reintentar
                </button>
              )}
            </div>
          )}

          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary"></div>
            </div>
          ) : (
            <>
              <input
                className="mb-10 w-full rounded-xl border border-border px-5 py-4 text-lg focus:ring-2 focus:ring-primary bg-background text-text-primary shadow-sm"
                placeholder={searchInputPlaceholder}
                value={search}
                autoComplete="false"
                onChange={(e) => {
                  setSearch(e.target.value);
                  onSearchChange?.(e.target.value);
                }}
              />

              {filteredData.length === 0 ? (
                <div className="text-center py-20 text-text-secondary">
                  {emptyDataMessage}
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
                      perPageLabel={translation.table?.perPageLabel ?? ''}
                      perPageOptions={perPageOptions}
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
