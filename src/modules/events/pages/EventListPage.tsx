import { useTranslation } from '@/core/context/LanguageContext';
import { useEventList } from '../hooks/useEventList';
import EntityList from '@/core/components/ui/table/EntityList';
import { lazy, Suspense } from 'react';
const EventModal = lazy(() => import('../components/EventModal'));
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import FloatingActionButtons from '@/core/components/ui/FloatingActionButtons';
import { useSidebar } from '@/core/context/SidebarContext';
import { EventData } from '../types';
import { getEventColumns, renderEventActions } from '../utils/EventListColumns';

export default function EventListPage() {
  const sidebar = useSidebar();
  const translate = useTranslation();
  const {
    events,
    loading,
    error,
    editingEvent,
    setEditingEvent,
    showForm,
    setShowForm,
    viewingEvent,
    setViewingEvent,
    handleSave,
    handleDelete,
    handleView,
  } = useEventList(translate);


  const columns = getEventColumns(translate);
  const renderActions = (event: EventData) => renderEventActions(event, translate, handleView, setEditingEvent, setShowForm, handleDelete);

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
            onClose={() => setShowForm(false)}
            mode={editingEvent ? 'edit' : 'create'}
            event={editingEvent || {}}
            onSave={async (data) => {
              await handleSave(data);
              setEditingEvent(null); // Limpiar solo después de guardar
            }}
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
