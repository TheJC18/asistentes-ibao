import { useState, ChangeEvent } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight, faCalendarDay } from '@fortawesome/free-solid-svg-icons';
import CalendarGrid from './CalendarGrid';
import { useTranslation } from '@/core/context';

interface CalendarEvent {
  id: string | number;
  title: string;
  date: string | Date;
  type?: string;
  color?: string;
  allDay?: boolean;
}

export interface UserBirthday {
  uid: string;
  name: string;
  birthdate: string;
}

interface CalendarProps {
  events?: CalendarEvent[];
  birthdays?: UserBirthday[];
  onDateClick?: (date: Date) => void;
  onEventClick?: (event: CalendarEvent) => void;
  className?: string;
}

export default function Calendar({ events = [], birthdays = [], onDateClick, onEventClick, className = '' }: CalendarProps) {
  const translate = useTranslation();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth());
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());

  // Convertir cumpleaños a eventos
  const birthdayEvents: CalendarEvent[] = birthdays.map(birthday => {
    const birthdateObj = new Date(birthday.birthdate);
    // Usar el año seleccionado para mostrar cumpleaños
    const thisYearBirthday = new Date(
      selectedYear,
      birthdateObj.getMonth(),
      birthdateObj.getDate()
    );
    
    return {
      id: `birthday-${birthday.uid}`,
      title: `🎂 ${birthday.name}`,
      date: thisYearBirthday,
      type: 'birthday',
      allDay: true
    };
  });

  // Combinar eventos normales con cumpleaños
  const allEvents = [...events, ...birthdayEvents];

  const handlePrevMonth = (): void => {
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
    setCurrentDate(newDate);
    setSelectedMonth(newDate.getMonth());
    setSelectedYear(newDate.getFullYear());
  };

  const handleNextMonth = (): void => {
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
    setCurrentDate(newDate);
    setSelectedMonth(newDate.getMonth());
    setSelectedYear(newDate.getFullYear());
  };

  const handleToday = (): void => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedMonth(today.getMonth());
    setSelectedYear(today.getFullYear());
  };

  const handleMonthChange = (e: ChangeEvent<HTMLSelectElement>): void => {
    const month = parseInt(e.target.value);
    setSelectedMonth(month);
    const newDate = new Date(selectedYear, month, 1);
    setCurrentDate(newDate);
  };

  const handleYearChange = (e: ChangeEvent<HTMLSelectElement>): void => {
    const year = parseInt(e.target.value);
    setSelectedYear(year);
    const newDate = new Date(year, selectedMonth, 1);
    setCurrentDate(newDate);
  };

  // Generar array de años (5 años atrás y 5 años adelante)
  const years: number[] = [];
  const currentYear = new Date().getFullYear();
  for (let i = currentYear - 5; i <= currentYear + 5; i++) {
    years.push(i);
  }

  return (
    <div
      className={`bg-card rounded-lg shadow-lg border border-border ${className}`}
    >
      {/* Header */}
      <div
        className="p-4 sm:p-6 border-b border-border bg-surface"
      >
        <div className="flex flex-col sm:flex-row items-center sm:items-end justify-between mb-2 sm:mb-4 gap-2 sm:gap-0">
          <h2 className="text-xl sm:text-2xl font-bold text-text-primary">
            {translate.calendar.months[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={handleToday}
              className="px-2 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm font-medium text-primary hover:bg-primary-light rounded-lg transition"
            >
              <FontAwesomeIcon icon={faCalendarDay} className="mr-1 sm:mr-2" />
              {translate.calendar.today}
            </button>
            <button
              onClick={handlePrevMonth}
              className="p-1 sm:p-2 text-text-secondary hover:bg-surface rounded-lg transition"
            >
              <FontAwesomeIcon icon={faChevronLeft} />
            </button>
            <button
              onClick={handleNextMonth}
              className="p-1 sm:p-2 text-text-secondary hover:bg-surface rounded-lg transition"
            >
              <FontAwesomeIcon icon={faChevronRight} />
            </button>
          </div>
        </div>
        {/* Selectores de mes y año */}
        <div className="flex gap-2 sm:gap-3 mt-2 sm:mt-0">
          <select
            value={selectedMonth}
            onChange={handleMonthChange}
            className="flex-1 px-2 sm:px-3 py-1 sm:py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary bg-background text-text-primary text-xs sm:text-base"
          >
            {translate.calendar.months.map((month, index) => (
              <option key={index} value={index}>
                {month}
              </option>
            ))}
          </select>
          <select
            value={selectedYear}
            onChange={handleYearChange}
            className="px-2 sm:px-3 py-1 sm:py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary bg-background text-text-primary text-xs sm:text-base"
          >
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      </div>
      {/* Grid del calendario */}
      <div className="p-2 sm:p-6 bg-card">
        <CalendarGrid
          currentDate={currentDate}
          events={allEvents}
          onDateClick={onDateClick}
          onEventClick={onEventClick}
        />
      </div>
    </div>
  );
}
