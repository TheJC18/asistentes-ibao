import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { EventData } from '@/modules/events/types';
import { getEventTypeLabel, getEventTypes } from '@/core/helpers/eventUtils';

export function getEventColumns(translate: any) {
  return [
    {
      key: 'title',
      label: translate.events?.table?.title || 'Título',
      className: 'text-start font-semibold text-base md:text-lg text-text-primary',
      visibleOn: ["base", "2xs", "xs", "ss", "sm", "md", "lg", "xl"],
      render: (event: EventData) => event.title,
    },
    {
      key: 'date',
      label: translate.events?.table?.date || 'Fecha',
      className: 'text-start text-text-primary',
      visibleOn: ["md", "lg", "xl"],
      render: (event: EventData) => {
        if (!event.date) return <span className="text-text-disabled">-</span>;
        try {
          const date = new Date(event.date);
          return date.toLocaleDateString('es-ES', { year: 'numeric', month: '2-digit', day: '2-digit' });
        } catch {
          return <span className="text-text-disabled">-</span>;
        }
      },
    },
    {
      key: 'type',
      label: translate.events?.table?.type || 'Tipo',
      className: 'text-start text-text-primary',
      visibleOn: ["lg", "xl"],
      render: (event: EventData) => {
        const eventTypes = getEventTypes(translate.language);
        const found = eventTypes.find(t => t.color === event.color);
        const typeCode = (event.type as import('@/core/helpers/eventUtils').EventTypeCode) || 'normal';
        return (
          <span className="flex items-center gap-2">
            <span className="text-sm">{found ? found.label : getEventTypeLabel(typeCode, translate.language)}</span>
          </span>
        );
      },
    },
    {
      key: 'color',
      label: translate.events?.table?.color || 'Color',
      className: 'text-start',
      visibleOn: ["lg", "xl"],
      render: (event: EventData) => {
        return (
          <span className="flex items-center gap-2">
            <span className={`inline-block w-4 h-4 rounded-full border border-border ${event.color}`} />
          </span>
        );
      },
    },
    {
      key: 'hour',
      label: translate.events?.table?.hour || 'Hora',
      className: 'text-start text-text-primary',
      visibleOn: ["md", "lg", "xl"],
      render: (event: EventData) => event.hour || <span className="text-text-disabled">-</span>,
    },
  ];
}

export function renderEventActions(event: EventData, translate: any, handleView: (event: EventData) => void, setEditingEvent: (event: EventData) => void, setShowForm: (show: boolean) => void, handleDelete: (id: string) => void) {
  return (
    <div className="flex flex-row gap-1 items-center justify-center">
      <button
        className="p-1 h-7 w-7 text-xs rounded-full bg-info hover:bg-info/80 text-text-on-primary transition"
        title={translate.common.viewDetails}
        onClick={() => handleView(event)}
      >
        <FontAwesomeIcon icon={["fas", "eye"]} />
      </button>
      <button
        className="p-1 h-7 w-7 text-xs rounded-full bg-success hover:bg-success/80 text-text-on-primary transition"
        title={translate.common.edit}
        onClick={() => { setEditingEvent(event); setShowForm(true); }}
      >
        <FontAwesomeIcon icon={["fas", "edit"]} />
      </button>
      <button
        className="p-1 h-7 w-7 text-xs rounded-full bg-error hover:bg-error/80 text-text-on-primary transition"
        title={translate.common.delete}
        onClick={() => handleDelete(event.id!)}
      >
        <FontAwesomeIcon icon={["fas", "trash"]} />
      </button>
    </div>
  );
}
