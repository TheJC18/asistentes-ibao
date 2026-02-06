import { useState, useEffect, useRef } from "react";
import Label from "./Label";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// Helper para convertir cualquier entrada a Date o null
const parseDate = (input: Date | string | null | undefined): Date | null => {
  if (!input) return null;
  if (input instanceof Date) return input;
  
  try {
    const cleanInput = input.toString().trim();
    if (!cleanInput) return null;
    
    const parsed = new Date(cleanInput);
    return isNaN(parsed.getTime()) ? null : parsed;
  } catch {
    return null;
  }
};

// Helper para obtener los días del mes
const getDaysInMonth = (year: number, month: number) => {
  return new Date(year, month + 1, 0).getDate();
};

// Helper para obtener el primer día de la semana del mes (0 = Domingo, 1 = Lunes, etc.)
const getFirstDayOfMonth = (year: number, month: number) => {
  return new Date(year, month, 1).getDay();
};

// Nombres de los meses
const monthNames = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

// Nombres de los días de la semana
const dayNames = ["DOM", "LUN", "MAR", "MIÉ", "JUE", "VIE", "SÁB"];

export default function DatePicker({
  id,
  onChange,
  label,
  defaultDate,
  placeholder,
  inputClassName = "",
  hideRightIcon = false,
  disabled = false,
  required = false,
  name,
}: {
  id: string;
  onChange?: (date: Date[]) => void;
  label?: string;
  defaultDate?: Date | string | null;
  placeholder?: string;
  inputClassName?: string;
  hideRightIcon?: boolean;
  disabled?: boolean;
  required?: boolean;
  name?: string;
}) {
  const [value, setValue] = useState<Date | null>(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [viewMode, setViewMode] = useState<'days' | 'months' | 'years'>('days');
  
  const inputRef = useRef<HTMLInputElement | null>(null);
  const calendarRef = useRef<HTMLDivElement | null>(null);

  // Inicializar con defaultDate
  useEffect(() => {
    const parsedDate = parseDate(defaultDate);
    if (parsedDate) {
      setValue(parsedDate);
      setCurrentMonth(parsedDate.getMonth());
      setCurrentYear(parsedDate.getFullYear());
    }
  }, [defaultDate]);

  // Cerrar calendario al hacer clic fuera
  useEffect(() => {
    if (!showCalendar) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        calendarRef.current &&
        !calendarRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowCalendar(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showCalendar]);

  const handleDateSelect = (day: number) => {
    const selectedDate = new Date(currentYear, currentMonth, day);
    setValue(selectedDate);
    setShowCalendar(false);
    setViewMode('days');

    if (onChange) {
      onChange([selectedDate]);
    }
  };

  const handleMonthSelect = (month: number) => {
    setCurrentMonth(month);
    setViewMode('days');
  };

  const handleYearSelect = (year: number) => {
    setCurrentYear(year);
    setViewMode('months');
  };

  const toggleViewMode = () => {
    if (viewMode === 'days') {
      setViewMode('months');
    } else if (viewMode === 'months') {
      setViewMode('years');
    }
  };

  const goToPrevious = () => {
    if (viewMode === 'days') {
      if (currentMonth === 0) {
        setCurrentMonth(11);
        setCurrentYear(currentYear - 1);
      } else {
        setCurrentMonth(currentMonth - 1);
      }
    } else if (viewMode === 'months') {
      setCurrentYear(currentYear - 1);
    } else if (viewMode === 'years') {
      setCurrentYear(currentYear - 12);
    }
  };

  const goToNext = () => {
    if (viewMode === 'days') {
      if (currentMonth === 11) {
        setCurrentMonth(0);
        setCurrentYear(currentYear + 1);
      } else {
        setCurrentMonth(currentMonth + 1);
      }
    } else if (viewMode === 'months') {
      setCurrentYear(currentYear + 1);
    } else if (viewMode === 'years') {
      setCurrentYear(currentYear + 12);
    }
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentYear, currentMonth);
    const firstDay = getFirstDayOfMonth(currentYear, currentMonth);
    const today = new Date();
    const isToday = (day: number) => {
      return (
        day === today.getDate() &&
        currentMonth === today.getMonth() &&
        currentYear === today.getFullYear()
      );
    };
    const isSelected = (day: number) => {
      if (!value) return false;
      return (
        day === value.getDate() &&
        currentMonth === value.getMonth() &&
        currentYear === value.getFullYear()
      );
    };

    const days = [];
    
    // Días vacíos antes del primer día del mes
    for (let i = 0; i < firstDay; i++) {
      days.push(
        <div key={`empty-${i}`} className="p-2"></div>
      );
    }

    // Días del mes
    for (let day = 1; day <= daysInMonth; day++) {
      const isWeekend = new Date(currentYear, currentMonth, day).getDay() === 0 || 
                        new Date(currentYear, currentMonth, day).getDay() === 6;
      
      days.push(
        <button
          key={day}
          type="button"
          onClick={() => handleDateSelect(day)}
          className={`
            p-2 text-center rounded-lg text-sm font-medium transition-all duration-200
            hover:bg-blue-50 dark:hover:bg-blue-900/40
            focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400
            ${isSelected(day) 
              ? 'bg-gradient-to-r from-blue-600 to-blue-400 text-white font-bold shadow-lg' 
              : isToday(day)
              ? 'border-2 border-blue-600 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-semibold'
              : isWeekend
              ? 'text-red-500 dark:text-red-400'
              : 'text-gray-900 dark:text-gray-100'
            }
          `}
        >
          {day}
        </button>
      );
    }

    return days;
  };

  const renderMonths = () => {
    return monthNames.map((month, index) => {
      const isCurrentMonth = index === new Date().getMonth() && currentYear === new Date().getFullYear();
      const isSelected = index === currentMonth;

      return (
        <button
          key={month}
          type="button"
          onClick={() => handleMonthSelect(index)}
          className={`
            p-3 text-center rounded-lg text-sm font-medium transition-all duration-200
            hover:bg-blue-50 dark:hover:bg-blue-900/40
            focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400
            ${isSelected 
              ? 'bg-gradient-to-r from-blue-600 to-blue-400 text-white font-bold shadow-lg' 
              : isCurrentMonth
              ? 'border-2 border-blue-600 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-semibold'
              : 'text-gray-900 dark:text-gray-100'
            }
          `}
        >
          {month.substring(0, 3)}
        </button>
      );
    });
  };

  const renderYears = () => {
    const startYear = Math.floor(currentYear / 12) * 12;
    const years = [];

    for (let i = 0; i < 12; i++) {
      const year = startYear + i;
      const isCurrentYear = year === new Date().getFullYear();
      const isSelected = year === currentYear;

      years.push(
        <button
          key={year}
          type="button"
          onClick={() => handleYearSelect(year)}
          className={`
            p-3 text-center rounded-lg text-sm font-medium transition-all duration-200
            hover:bg-blue-50 dark:hover:bg-blue-900/40
            focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400
            ${isSelected 
              ? 'bg-gradient-to-r from-blue-600 to-blue-400 text-white font-bold shadow-lg' 
              : isCurrentYear
              ? 'border-2 border-blue-600 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-semibold'
              : 'text-gray-900 dark:text-gray-100'
            }
          `}
        >
          {year}
        </button>
      );
    }

    return years;
  };

  return (
    <div>
      {label && <Label htmlFor={id}>{label}</Label>}
      <div className="relative">
        <input
          ref={inputRef}
          id={id}
          value={value?.toLocaleDateString('es-ES') ?? ""}
          placeholder={placeholder}
          readOnly
          onClick={() => setShowCalendar((prev) => !prev)}
          className={`h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700 dark:focus:border-brand-800 cursor-pointer ${inputClassName}`}
          autoComplete="bday"
        />
        {!hideRightIcon && (
          <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
            <FontAwesomeIcon icon={["fas", "calendar-alt"]} className="size-6" />
          </span>
        )}
        
        {showCalendar && (
          <div
            ref={calendarRef}
            className="absolute z-[9999] mt-2 left-0 w-full bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 p-4"
          >
            {/* Header - Navegación */}
            <div className="flex items-center justify-between mb-4">
              <button
                type="button"
                onClick={goToPrevious}
                className="p-2 rounded-lg text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/50 transition-colors"
              >
                <FontAwesomeIcon icon={["fas", "chevron-left"]} className="w-4 h-4" />
              </button>
              
              <button
                type="button"
                onClick={toggleViewMode}
                className="text-base font-bold text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors px-2 py-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                {viewMode === 'days' && `${monthNames[currentMonth]} ${currentYear}`}
                {viewMode === 'months' && currentYear}
                {viewMode === 'years' && `${Math.floor(currentYear / 12) * 12} - ${Math.floor(currentYear / 12) * 12 + 11}`}
              </button>
              
              <button
                type="button"
                onClick={goToNext}
                className="p-2 rounded-lg text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/50 transition-colors"
              >
                <FontAwesomeIcon icon={["fas", "chevron-right"]} className="w-4 h-4" />
              </button>
            </div>

            {/* Vista de días */}
            {viewMode === 'days' && (
              <>
                {/* Días de la semana */}
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {dayNames.map((day) => (
                    <div
                      key={day}
                      className="text-center text-xs font-semibold text-gray-600 dark:text-gray-400 p-2"
                    >
                      {day}
                    </div>
                  ))}
                </div>

                {/* Días del mes */}
                <div className="grid grid-cols-7 gap-1">
                  {renderCalendar()}
                </div>
              </>
            )}

            {/* Vista de meses */}
            {viewMode === 'months' && (
              <div className="grid grid-cols-3 gap-2">
                {renderMonths()}
              </div>
            )}

            {/* Vista de años */}
            {viewMode === 'years' && (
              <div className="grid grid-cols-3 gap-2">
                {renderYears()}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
