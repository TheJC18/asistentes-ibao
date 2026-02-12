import Modal from '@/core/components/ui/modal/Modal';

export const EventDetailModal = ({ open, event, onClose }) => {
  if (!event) return null;

  return (
    <Modal open={open} onClose={onClose} title={event.title}>
      <div className="space-y-4 p-4">
        <div className="flex items-center gap-2">
          <span className={`inline-block w-4 h-4 rounded-full ${event.color || 'bg-primary'}`}></span>
          <span className="font-semibold text-lg">{event.title}</span>
        </div>
        {event.date && (
          <div className="text-text-secondary">
            Fecha: {new Date(event.date).toLocaleDateString('es-ES', { year: 'numeric', month: '2-digit', day: '2-digit' })}
            {' '}
            {new Date(event.date).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
          </div>
        )}
        {event.type && <div className="text-sm">Tipo: {event.type}</div>}
      </div>
    </Modal>
  );
};
