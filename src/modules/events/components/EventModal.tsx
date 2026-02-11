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
              <label className="block mb-1">{translate.events?.form?.date}</label>
              <DatePicker
                id="event-date"
                label=""
                defaultDate={convertISOToDate(formData.date || null)}
                placeholder={translate.events?.form?.date}
                inputClassName=""
                hideRightIcon={false}
                disabled={isView}
                required
                onChange={onDateChange}
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
