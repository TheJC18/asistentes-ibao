import { useTranslation } from '@/core/context/LanguageContext';
import { useEvents } from '../store/useEvents';
import EntityList from '@/core/components/ui/table/EntityList';
import { EventData } from '../firebase/eventQueries';
import { useState } from 'react';
import React, { Suspense } from 'react';
const EventModal = React.lazy(() => import('../components/EventModal'));
import { useAuthUser } from '@/modules/auth/hooks/useAuthUser';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import FloatingActionButtons from '@/core/components/ui/FloatingActionButtons';
import { useSidebar } from '@/core/context/SidebarContext';
import { showSuccessAlert, showErrorAlert, showDeleteConfirmAlert, showInfoAlert } from '@/core/helpers/sweetAlertHelper';
import Swal from 'sweetalert2';

export default function EventListPage() {
  const sidebar = useSidebar();
  const translate = useTranslation();
  const { events, loading, error, addEvent, editEvent, removeEvent } = useEvents();
  const auth = useAuthUser();
  const [editingEvent, setEditingEvent] = useState<EventData | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [viewingEvent, setViewingEvent] = useState<EventData | null>(null);

  const columns = [
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
      render: (event: EventData) => event.type || <span className="text-text-disabled">-</span>,
    },
    {
      key: 'color',
      label: translate.events?.table?.color || 'Color',
      className: 'text-start',
      visibleOn: ["lg", "xl"],
      render: (event: EventData) => (
        <span className="inline-block w-4 h-4 rounded-full border border-border" style={{ background: event.color || '#ccc' }} />
      ),
    },
  ];

  const renderActions = (event: EventData) => (
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

  const handleSave = async (data: EventData) => {
    try {
      if (editingEvent && editingEvent.id) {
        await editEvent(editingEvent.id, data);
        await showSuccessAlert(translate.events?.messages?.updated || 'Evento actualizado correctamente');
      } else {
        await addEvent({ ...data, createdBy: auth.uid || '' });
        await showSuccessAlert(translate.events?.messages?.created || 'Evento creado correctamente');
      }
      setShowForm(false);
      setEditingEvent(null);
    } catch (err) {
      await showErrorAlert(translate.events?.messages?.error || 'Ocurrió un error al procesar el evento');
    }
  };

  const handleDelete = async (id: string) => {
    const result = await showDeleteConfirmAlert(
      translate.events?.messages?.confirmDelete || '¿Estás seguro de eliminar este evento?'
    );
    if (result.isConfirmed) {
      try {
        await removeEvent(id);
        await showSuccessAlert(translate.events?.messages?.deleted || 'Evento eliminado correctamente');
      } catch (err) {
        await showErrorAlert(translate.events?.messages?.error || 'Ocurrió un error al procesar el evento');
      }
    } else if (result.dismiss === Swal.DismissReason.cancel) {
      await showInfoAlert(translate.events?.messages?.cancel || 'Acción cancelada');
    }
  };

  const handleView = (event: EventData) => {
    setViewingEvent(event);
  };

  return (
    <>
      <EntityList<EventData>
        title={
          <div className="flex items-center gap-3">
            <FontAwesomeIcon icon={["fas", "calendar-plus"]} className="text-primary text-3xl" />
            <h2 className="text-3xl font-bold text-text-primary">{translate.events?.title}</h2>
          </div>
        }
        description={translate.events?.description}
        data={events}
        columns={columns}
        renderActions={renderActions}
        isLoading={loading}
        error={error}
        noDataMessage={translate.common.noData}
      />

      {!(sidebar && sidebar.isMobileOpen) && (
        <FloatingActionButtons
          buttons={[{
            icon: ["fas", "plus"],
            onClick: () => { setEditingEvent(null); setShowForm(true); },
            title: translate.events?.add,
            tooltip: translate.events?.add,
            color: "blue"
          }]}
        />
      )}

      <Suspense fallback={<div className="flex justify-center items-center min-h-[20vh]"><span className="text-lg">Cargando modal...</span></div>}>
        {showForm && (
          <EventModal
            open={showForm}
            onClose={() => { setShowForm(false); setEditingEvent(null); }}
            mode={editingEvent ? 'edit' : 'create'}
            event={editingEvent || {}}
            onSave={handleSave}
          />
        )}
        {viewingEvent && (
          <EventModal
            open={!!viewingEvent}
            onClose={() => setViewingEvent(null)}
            mode="view"
            event={viewingEvent}
          />
        )}
      </Suspense>
    </>
  );
}
