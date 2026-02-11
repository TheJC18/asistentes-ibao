import { useState } from 'react';
import { EventData } from '../types';
import { useEvents } from '../store/useEvents';
import { useAuthUser } from '@/modules/auth/hooks/useAuthUser';
import { showSuccessAlert, showErrorAlert, showDeleteConfirmAlert, showInfoAlert } from '@/core/helpers/sweetAlertHelper';
import Swal from 'sweetalert2';

export function useEventList(translate: any) {
  const { events, loading, error, addEvent, editEvent, removeEvent } = useEvents();
  const auth = useAuthUser();
  const [editingEvent, setEditingEvent] = useState<EventData | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [viewingEvent, setViewingEvent] = useState<EventData | null>(null);

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

  return {
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
  };
}