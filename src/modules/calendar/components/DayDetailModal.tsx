import Modal from '@/core/components/ui/modal/Modal';

export const DayDetailModal = ({ open, date, events, birthdays, onClose, onEventClick, onBirthdayClick }) => {
  // Ordenar eventos por hora (si tienen)
  const sortedEvents = [...events].sort((a, b) => {
    const aHour = a.date instanceof Date ? new Date(a.date).getHours() : new Date(a.date).getHours();
    const bHour = b.date instanceof Date ? new Date(b.date).getHours() : new Date(b.date).getHours();
    return aHour - bHour;
  });

  return (
    <Modal open={open} onClose={onClose} title={date.toLocaleDateString('es-ES', { year: 'numeric', month: '2-digit', day: '2-digit' })}>
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-text-primary">Cumpleaños</h3>
        {birthdays.length === 0 && <div className="text-text-secondary text-sm">No hay cumpleaños este día.</div>}
        <ul className="space-y-2">
          {birthdays.map(birthday => (
            <li key={birthday.uid} className="flex items-center gap-2 text-secondary">
              <span role="img" aria-label="birthday">🎂</span>
              <button className="text-link font-semibold hover:underline" onClick={() => onBirthdayClick?.(birthday, date)}>{birthday.name}</button>
            </li>
          ))}
        </ul>
        <h3 className="text-lg font-semibold text-text-primary mt-4">Eventos</h3>
        {sortedEvents.length === 0 && <div className="text-text-secondary text-sm">No hay eventos este día.</div>}
        <ul className="space-y-2">
          {sortedEvents.map(event => (
            <li key={event.id} className="flex items-center gap-2 cursor-pointer hover:underline" onClick={() => onEventClick(event)}>
              <span className={`inline-block w-3 h-3 rounded-full ${event.color || 'bg-primary'}`}></span>
              <span className="font-medium">{event.title}</span>
              {event.date && (
                <span className="text-xs text-text-secondary">{new Date(event.date).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}</span>
              )}
            </li>
          ))}
        </ul>
      </div>
    </Modal>
  );
};
