import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useTranslation } from '@/core/context/LanguageContext';
import type { PaginationProps } from '../../types/index';

const Pagination = ({
  page,
  totalPages,
  onPrev,
  onNext,
  perPage,
  setPerPage,
  perPageOptions = [5, 10, 20, 50],
  perPageLabel = undefined,
}) => {
  // Importación directa y nombre descriptivo para la traducción
  const translation = useTranslation();
  // No fallback, solo muestra vacío si no existe la key
  const label = perPageLabel ?? translation.table?.perPageLabel ?? '';
  const pageLabel = translation.table?.pageLabel ?? '';
  const ofLabel = translation.table?.ofLabel ?? '';
  return (
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mt-8 gap-4">
      <div className="flex items-center gap-2 sm:order-1 order-1 w-full sm:w-auto justify-start">
        <label htmlFor="perPage" className="text-base font-semibold text-text-primary">{label}</label>
        <select
          id="perPage"
          className="rounded-full border border-secondary px-2 py-1 text-sm font-semibold bg-card text-text-primary focus:ring-2 focus:ring-primary shadow-sm transition-all hover:border-secondary-hover min-w-[60px]"
          value={perPage}
          onChange={e => setPerPage(Number(e.target.value))}
        >
          {perPageOptions.map(option => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      </div>
      <div className="flex gap-4 items-center sm:order-2 order-2 w-full sm:w-auto justify-end">
        <button
          onClick={onPrev}
          disabled={page === 1}
          className="w-10 h-10 flex items-center justify-center rounded-full border border-secondary bg-card text-secondary font-bold shadow hover:bg-secondary hover:text-text-on-primary transition disabled:opacity-40 disabled:cursor-not-allowed"
          title={translation.table?.prevLabel ?? ''}
        >
          <FontAwesomeIcon icon={["fas", "arrow-left"]} />
        </button>
        <span className="text-base text-text-primary font-semibold px-2">
          {pageLabel} {page} {ofLabel} {totalPages}
        </span>
        <button
          onClick={onNext}
          disabled={page === totalPages || totalPages === 0}
          className="w-10 h-10 flex items-center justify-center rounded-full border border-secondary bg-card text-secondary font-bold shadow hover:bg-secondary hover:text-text-on-primary transition disabled:opacity-40 disabled:cursor-not-allowed"
          title={translation.table?.nextLabel ?? ''}
        >
          <FontAwesomeIcon icon={["fas", "arrow-right"]} />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
