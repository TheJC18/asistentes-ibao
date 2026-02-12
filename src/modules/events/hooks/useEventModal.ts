import { useEffect, useState } from 'react';
import { EventData, EventFormData, UseEventModalProps } from '@/modules/events/types';
import { useTranslation } from '@/core/context/LanguageContext';

export function useEventModal({ open, event = {}, mode = 'view', onSave }: UseEventModalProps) {
  const translate = useTranslation();
  const isView = mode === 'view';
  const isEdit = mode === 'edit';
  const isCreate = mode === 'create';

  const [formData, setFormData] = useState<EventFormData>({
    id: '', // Mantener el id
    title: '',
    description: '',
    date: '',
    hour: '',
    type: 'normal',
    color: 'bg-blue-500',
    createdBy: '',
  });
  const [errors, setErrors] = useState<string[]>([]);

  const titleIcon = isView
    ? ['fas', 'eye']
    : isEdit
    ? ['fas', 'edit']
    : ['fas', 'calendar-plus'];
    
  const titleText = isView
    ? translate.events?.view || translate.common.viewDetails
    : isEdit
    ? translate.events?.edit || translate.common.edit
    : translate.events?.add || translate.common.create;

  useEffect(() => {
    if (open) {
      setFormData({
        id: event.id || '', // Mantener el id
        title: event.title || '',
        description: event.description || '',
        date: event.date || '',
        hour: event.hour || '',
        type: event.type || 'normal',
        color: event.color || 'bg-blue-500',
        createdBy: event.createdBy || '',
      });
      setErrors([]);
    }
  }, [open, event.title, event.description, event.date, event.hour, event.type, event.color, event.createdBy, event.id]);

  const handleChange = (field: keyof EventFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = [];
    if (!formData.title) newErrors.push(translate.events?.form?.title + ' es requerido');
    if (!formData.date) newErrors.push(translate.events?.form?.date + ' es requerido');
    setErrors(newErrors);
    if (newErrors.length > 0) return;
    if (onSave) {
      const dataToSave: EventData = {
        ...formData,
        type: formData.type || 'normal',
        color: formData.color || 'bg-blue-500',
        id: formData.id || '', // Usar el id del evento
      };
      onSave(dataToSave);
    }
  };

  return {
    formData,
    setFormData,
    errors,
    setErrors,
    handleChange,
    handleSubmit,
    isView,
    isEdit,
    isCreate,
    titleIcon,
    titleText,
  };
}
