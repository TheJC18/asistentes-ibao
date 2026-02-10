
import React from 'react';
import Modal from '@/core/components/ui/modal/Modal';
import { useTranslation } from '@/core/context/LanguageContext';
import { EventData } from '../firebase/eventQueries';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import DatePicker from '@/core/components/form/date-picker';
import Label from '@/core/components/form/Label';
import Input from '@/core/components/form/input/InputField';

interface EventModalProps {
  open: boolean;
  onClose: () => void;
  mode?: 'view' | 'edit' | 'create';
  event?: Partial<EventData>;
  onSave?: (data: EventData) => void;
}

export default function EventModal({ open, onClose, mode = 'view', event = {}, onSave }: EventModalProps) {
  const translate = useTranslation();
  const isView = mode === 'view';
  const isEdit = mode === 'edit';
  const isCreate = mode === 'create';

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

  const [formData, setFormData] = React.useState<EventData>({
    title: event.title || '',
    description: event.description || '',
    date: event.date || '',
    type: event.type || 'normal',
    color: event.color || 'primary',
    createdBy: event.createdBy || '',
    id: event.id,
  });
  const [errors, setErrors] = React.useState<string[]>([]);

  React.useEffect(() => {
    if (open) {
      setFormData({
        title: event.title || '',
        description: event.description || '',
        date: event.date || '',
        type: event.type || 'normal',
        color: event.color || 'primary',
        createdBy: event.createdBy || '',
        id: event.id,
      });
      setErrors([]);
    }
  }, [open, event.title, event.description, event.date, event.type, event.color, event.createdBy, event.id]);

  const handleChange = (field: keyof EventData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Validación básica
    const newErrors = [];
    if (!formData.title) newErrors.push(translate.events?.form?.title + ' es requerido');
    if (!formData.date) newErrors.push(translate.events?.form?.date + ' es requerido');
    setErrors(newErrors);
    if (newErrors.length > 0) return;
    if (onSave) {
      const { id, ...dataToSave } = formData;
      onSave({
        ...dataToSave,
        type: 'normal',
        color: 'primary',
      });
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={titleText}
      titleIcon={titleIcon as any}
      maxWidth="md"
    >
      <div className="max-h-[70vh] overflow-y-auto px-1 sm:px-2">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
          <h3 className="text-lg font-semibold text-text-primary border-b border-border pb-2 flex items-center gap-2">
            <FontAwesomeIcon icon={["fas", "eye"]} className="mr-2 text-primary" />
            {translate.events?.form?.sectionTitle}
          </h3>
          <div>
            <Label htmlFor="event-title">{translate.events?.form?.title}</Label>
            <Input
              id="event-title"
              type="text"
              value={formData.title}
              onChange={e => handleChange('title', e.target.value)}
              required
              disabled={isView}
              autoComplete="on"
              placeholder={translate.events?.form?.title}
            />
          </div>
          <div>
            <Label htmlFor="event-description">{translate.events?.form?.description}</Label>
            <textarea
              id="event-description"
              value={formData.description}
              onChange={e => handleChange('description', e.target.value)}
              disabled={isView}
              autoComplete="on"
              placeholder={translate.events?.form?.description}
              className="min-h-[80px] w-full rounded-lg border border-border px-4 py-2.5 text-sm bg-background text-text-primary placeholder:text-text-tertiary focus:border-primary focus:ring-3 focus:ring-primary-light"
            />
          </div>
          <div>
            <label className="block mb-1">{translate.events?.form?.date}</label>
            <DatePicker
              id="event-date"
              label=""
              defaultDate={formData.date || null}
              placeholder={translate.events?.form?.date}
              inputClassName=""
              hideRightIcon={false}
              disabled={isView}
              required
              onChange={dateArr => {
                const date = Array.isArray(dateArr) ? dateArr[0] : dateArr;
                handleChange('date', date ? (date instanceof Date ? date.toISOString().slice(0, 10) : date) : '');
              }}
            />
          </div>

        </div>
        {errors.length > 0 && (
          <div className="bg-error-light border border-error text-error px-4 py-3 rounded-lg">
            <ul className="space-y-1 ml-1">
              {errors.map((error, idx) => <li key={idx}>{error}</li>)}
            </ul>
          </div>
        )}
        {!isView && (
          <button
            type="submit"
            className="w-full mt-6 py-2.5 rounded-lg bg-secondary hover:bg-secondary-hover text-text-on-primary font-medium shadow-sm hover:shadow transition-all"
          >
            {isEdit ? translate.common?.save : translate.events?.add}
          </button>
        )}
      </form>
      </div>
    </Modal>
  );
}
