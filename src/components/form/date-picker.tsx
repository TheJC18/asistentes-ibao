import { useState, useEffect, useRef } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./calendar-custom.css";
import Label from "./Label";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// Helper para convertir cualquier entrada a Date o null
const parseDate = (input: Date | string | null | undefined): Date | null => {
  if (!input) return null;
  if (input instanceof Date) return input;
  
  try {
    // Limpiar cadena de espacios
    const cleanInput = input.toString().trim();
    if (!cleanInput) return null;
    
    const parsed = new Date(cleanInput);
    return isNaN(parsed.getTime()) ? null : parsed;
  } catch {
    return null;
  }
};

export default function DatePicker({
  id,
  onChange,
  label,
  defaultDate,
  placeholder,
  inputClassName = "",
  hideRightIcon = false,
}: {
  id: string;
  onChange?: (date: Date[]) => void;
  label?: string;
  defaultDate?: Date | string | null;
  placeholder?: string;
  inputClassName?: string;
  hideRightIcon?: boolean;
}) {
  // Solo Date o null para el estado interno
  const [value, setValue] = useState<Date | null>(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Maneja todos los tipos posibles de react-calendar
  const handleDateChange = (date, event) => {
    let selectedDate = null;

    if (Array.isArray(date)) {
      selectedDate = date[0] || null;
    } else {
      selectedDate = date;
    }

    setValue(selectedDate);
    setShowCalendar(false);

    if (
      onChange &&
      selectedDate &&
      Object.prototype.toString.call(selectedDate) === '[object Date]' &&
      !isNaN((selectedDate as Date).getTime())
    ) {
      onChange([selectedDate as Date]);
    }
    
  };

  useEffect(() => {
    const parsedDate = parseDate(defaultDate);
    setValue(parsedDate);
  }, [defaultDate]);

  // Efecto adicional para inicialización
  useEffect(() => {
    if (!value && defaultDate) {
      const parsedDate = parseDate(defaultDate);
      setValue(parsedDate);
    }
  }, []);

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
          className={`h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3  dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30  bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700  dark:focus:border-brand-800 ${inputClassName}`}
        />
        {!hideRightIcon && (
          <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
            <FontAwesomeIcon icon={["fas", "calendar-alt"]} className="size-6" />
          </span>
        )}
        {showCalendar && (
          <div className="absolute z-50 mt-2 left-0 w-full bg-white dark:bg-gray-900 rounded-lg shadow-lg p-2">
            <Calendar
              onChange={handleDateChange}
              value={value}
              locale="es-ES"
              formatShortWeekday={(locale, date) =>
                date.toLocaleDateString("es-ES", { weekday: "short" }).toUpperCase().replace('.', '')
              }
              maxDetail="month"
              next2Label={null}
              prev2Label={null}
            />
          </div>
        )}
      </div>
    </div>
  );
}
