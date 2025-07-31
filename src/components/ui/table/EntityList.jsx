import { useState, useMemo } from 'react';
import TableDefault from './TableDefault';
import Pagination from './Pagination';

export default function EntityList({
  title,
  data = [],
  columns = [],
  renderActions,
  filterFunction,
  perPageOptions = [5, 10, 15, 25],
  defaultPerPage = 10,
  searchPlaceholder = "Buscar...",
  onSearchChange,
  FloatingButton,
  ModalComponent
}) {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(defaultPerPage);

  const filteredData = useMemo(() => {
    if (filterFunction) return data.filter((item) => filterFunction(item, search));
    return data;
  }, [data, search]);

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
        </div>
      </div>

      {FloatingButton}
      {ModalComponent}
    </>
  );
}