import Modal from '@/core/components/ui/modal/Modal';
import { useTranslation } from '@/core/context/LanguageContext';
import { EventModalProps } from '@/modules/events/types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import DatePicker from '@/core/components/form/date-picker';
import { convertISOToDate } from '@/core/helpers/dateUtils';
import Label from '@/core/components/form/Label';
import Input from '@/core/components/form/input/InputField';
import { useEventModal } from '../hooks/useEventModal';
import { createDateFieldUpdater } from '@/modules/user/helpers/userFormHelpers';
import { Button } from '@/core/components';

export default function EventModal({ open, onClose, mode = 'view', event = {}, onSave }: EventModalProps) {
  const {
    formData,
    errors,
    handleChange,
    handleSubmit,
    isView,
    isEdit,
    titleIcon,
    titleText,
  } = useEventModal({ open, event, mode, onSave });
  const translate = useTranslation();
  const onDateChange = createDateFieldUpdater(handleChange, 'date');

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
              <Label htmlFor="event-date">{translate.events?.form?.date}</Label>
              {isView ? (
                <div className="relative flex items-center">
                  <span className="absolute left-3 text-text-tertiary z-10">
                    <FontAwesomeIcon icon={["fas", "calendar-alt"]} />
                  </span>
                  <input
                    className="w-full rounded-lg border pl-10 pr-3 py-2 text-base bg-background text-text-primary border-border"
                    type="text"
                    value={formData.date ? new Date(formData.date).toLocaleDateString('es-ES', { year: 'numeric', month: '2-digit', day: '2-digit' }) : ""}
                    disabled
                  />
                </div>
              ) : (
                <div className="relative flex items-center">
                  <span className="absolute left-3 text-text-tertiary z-10">
                    <FontAwesomeIcon icon={["fas", "calendar-alt"]} />
                  </span>
                  <DatePicker
                    id="event-date"
                    label=""
                    defaultDate={convertISOToDate(formData.date || null)}
                    placeholder={translate.events?.form?.date}
                    inputClassName="pl-10 pr-3"
                    hideRightIcon
                    disabled={isView}
                    required
                    onChange={onDateChange}
                  />
                </div>
              )}
            </div>
            <div>
              <Label htmlFor="event-hour">{translate.events?.form?.hour || 'Hora'}</Label>
              <Input
                id="event-hour"
                type="time"
                value={formData.hour}
                onChange={e => handleChange('hour', e.target.value)}
                required={!isView}
                disabled={isView}
                placeholder={translate.events?.form?.hour || 'Hora'}
              />
            </div>
            <div>
              <Label htmlFor="event-type">{translate.events?.form?.type || 'Tipo'}</Label>
              <select
                id="event-type"
                value={formData.type}
                onChange={e => handleChange('type', e.target.value)}
                disabled={isView}
                className="w-full rounded-xl border border-border px-3 py-2 text-base focus:ring-2 focus:ring-primary bg-background text-text-primary shadow-sm"
              >
                <option value="normal">{translate.events?.form?.typeNormal || 'Normal'}</option>
                <option value="important">{translate.events?.form?.typeImportant || 'Importante'}</option>
                <option value="meeting">{translate.events?.form?.typeMeeting || 'Reunión'}</option>
              </select>
            </div>
            <div>
              <Label htmlFor="event-color">{translate.events?.form?.color || 'Color'}</Label>
              <select
                id="event-color"
                value={formData.color}
                onChange={e => handleChange('color', e.target.value)}
                disabled={isView}
                className="w-full rounded-xl border border-border px-3 py-2 text-base focus:ring-2 focus:ring-primary bg-background text-text-primary shadow-sm"
              >
                <option value="bg-blue-500">Azul</option>
                <option value="bg-red-500">Rojo</option>
                <option value="bg-green-500">Verde</option>
                <option value="bg-yellow-500">Amarillo</option>
              </select>
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
            <Button
              type="submit"
              className="w-full mt-6 py-2.5 rounded-lg bg-secondary hover:bg-secondary-hover text-text-on-primary font-medium shadow-sm hover:shadow transition-all"
              variant="primary"
              size="md"
            >
              {isEdit ? translate.common?.save : translate.events?.add}
            </Button>
          )}
        </form>
      </div>
    </Modal>
  );
}
