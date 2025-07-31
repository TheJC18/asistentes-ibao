import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface PaginationProps {
  page: number;
  totalPages: number;
  onPrev: () => void;
  onNext: () => void;
  perPage: number;
  setPerPage: (n: number) => void;
  perPageOptions?: number[];
  perPageLabel?: string;
}

const Pagination: React.FC<PaginationProps> = ({
  page,
  totalPages,
  onPrev,
  onNext,
  perPage,
  setPerPage,
  perPageOptions = [5, 10, 20, 50],
  perPageLabel = "Por página:",
}) => (
  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mt-8 gap-4">
    <div className="flex items-center gap-2 sm:order-1 order-1 w-full sm:w-auto justify-start">
      <label htmlFor="perPage" className="text-base font-semibold text-gray-700 dark:text-gray-200">{perPageLabel}</label>
      <select
        id="perPage"
        className="rounded-full border border-blue-400 px-2 py-1 text-sm font-semibold bg-white dark:bg-gray-900 dark:text-white focus:ring-2 focus:ring-blue-400 shadow-sm transition-all hover:border-blue-500 min-w-[60px]"
        value={perPage}
        onChange={e => setPerPage(Number(e.target.value))}
      >
        {perPageOptions.map(opt => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    </div>
    <div className="flex gap-4 items-center sm:order-2 order-2 w-full sm:w-auto justify-end">
      <button
        onClick={onPrev}
        disabled={page === 1}
        className="w-10 h-10 flex items-center justify-center rounded-full border border-blue-400 bg-white text-blue-700 dark:bg-gray-900 dark:text-blue-300 font-bold shadow hover:bg-blue-100 dark:hover:bg-blue-800 transition disabled:opacity-40 disabled:cursor-not-allowed"
        title="Anterior"
      >
        <FontAwesomeIcon icon={["fas", "arrow-left"]} />
      </button>
      <span className="text-base text-gray-700 dark:text-gray-200 font-semibold px-2">
        Página {page} de {totalPages}
      </span>
      <button
        onClick={onNext}
        disabled={page === totalPages || totalPages === 0}
        className="w-10 h-10 flex items-center justify-center rounded-full border border-blue-400 bg-white text-blue-700 dark:bg-gray-900 dark:text-blue-300 font-bold shadow hover:bg-blue-100 dark:hover:bg-blue-800 transition disabled:opacity-40 disabled:cursor-not-allowed"
        title="Siguiente"
      >
        <FontAwesomeIcon icon={["fas", "arrow-right"]} />
      </button>
    </div>
  </div>
);

export default Pagination;
