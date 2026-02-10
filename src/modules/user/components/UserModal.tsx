import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import ReactDOM from "react-dom";
import Select from "@/core/components/form/Select";
import DatePicker from "@/core/components/form/date-picker";
import Label from "@/core/components/form/Label";
import Input from "@/core/components/form/input/InputField";
import { countriesES, countriesEN } from "@/i18n/countries";
import { gendersES, gendersEN } from "@/i18n/genders";
import { relationsES, relationsEN } from "@/i18n/relations";
import { useLanguage, useTranslation } from "@/core/context/LanguageContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FileInput } from "flowbite-react";
import { 
  createFileUploadHandler, 
  createFieldUpdater, 
  createBirthdateUpdater, 
  createAvatarRestorer 
} from "@/modules/user/helpers/userFormHelpers";
import { validateUserForm, prepareUserDataForSave } from "@/modules/user/helpers/userValidations";
import { formatDate, convertISOToDate } from "@/core/helpers/dateUtils";
import { linkGoogleAccount } from "@/modules/auth/firebase/authQueries";
import { showSuccessAlert, showErrorAlert, showLoadingAlert, closeAlert } from "@/core/helpers/sweetAlertHelper";
import { User } from "@/types";

interface UserModalProps {
  open: boolean;
  onClose: () => void;
  mode?: 'view' | 'edit' | 'create' | 'family';
  user?: Partial<User>;
  onSave?: (data: any) => void;
  onPasswordReset?: (email: string) => Promise<void>;
}

interface UserFormData {
  name: string;
  email: string;
  role: string;
  nationality: string;
  birthdate: string | null;
  avatar: string;
  isMember: boolean;
  gender: string;
  relation: string;
  phone: string;
}


export default function UserModal({ 
  open, 
  onClose, 
  mode = "view", 
  user = {}, 
  onSave 
}: UserModalProps) {
  const { language } = useLanguage();
  const translate = useTranslation();

  const countries = language === "es" ? countriesES : countriesEN;
  const genders = language === "es" ? gendersES : gendersEN;
  const relations = language === "es" ? relationsES : relationsEN;

  const isView = mode === "view";
  const isEdit = mode === "edit";
  const isCreate = mode === "create";
  const isFamily = mode === "family";

  const [formData, setFormData] = useState<UserFormData>({
    name: "",
    email: "",
    role: "",
    nationality: "",
    birthdate: "",
    avatar: "/user_default.png",
    isMember: false,
    gender: "",
    relation: "",
    phone: "",
  });

  const [hasWebAccess, setHasWebAccess] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<string[]>([]);

  const [originalAvatar, setOriginalAvatar] = useState("/user_default.png");
  const [fileInputValue, setFileInputValue] = useState("");
  const [originalHasWebAccess, setOriginalHasWebAccess] = useState(false);

  useEffect(() => {
    if (open) {
      // En modo create, siempre empezar con hasWebAccess = false
      const userHadWebAccess = isCreate ? false : (user.hasWebAccess || false);
      const birthdateValue = user.birthdate ? (typeof user.birthdate === 'string' ? user.birthdate : user.birthdate.toISOString()) : null;
      
      setFormData({
        name: user.name || "",
        email: user.email || "",
        role: user.role || "",
        isMember: user.isMember || false,
        nationality: user.nationality || "",
        birthdate: birthdateValue,
        avatar: user.avatar || user.photoURL || "/user_default.png",
        gender: user.gender || "",
        relation: (user as any).relation || "",
        phone: user.phone || "",
      });
      <div>
        <Label htmlFor="user-phone">Teléfono</Label>
        <Input
          id="user-phone"
          type="tel"
          value={formData.phone || ""}
          disabled={isView}
          onChange={(e: ChangeEvent<HTMLInputElement>) => onChange("phone", e.target.value)}
          autoComplete="on"
          placeholder="Ingresa el teléfono"
        />
      </div>
      setOriginalAvatar(user.avatar || user.photoURL || "/user_default.png");
      setFileInputValue("");
      setPassword("");
      setConfirmPassword("");
      setErrors([]);
      setHasWebAccess(userHadWebAccess);
      setOriginalHasWebAccess(userHadWebAccess);
    }
  }, [open, user.id, isCreate]);

  // Bloquear scroll del body cuando el modal está abierto
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Usar helpers
  const onFileChange = createFileUploadHandler(setFormData, setFileInputValue);
  const onChange = createFieldUpdater(setFormData);
  const onBirthdateChange = createBirthdateUpdater(onChange);
  const onRestoreAvatar = createAvatarRestorer(setFormData, originalAvatar);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    // Validar usando helper
    const validationErrors = validateUserForm({
      formData,
      password,
      confirmPassword,
      mode,
      hasWebAccess
    });

    // Si hay errores, mostrarlos y detener
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Limpiar errores
    setErrors([]);
    
    // Preparar datos usando helper
    const dataToSave = prepareUserDataForSave({
      formData,
      password,
      mode,
      hasWebAccess
    });
    
    if (onSave) onSave(dataToSave);
  };

  const titleIcon = isView ? ["fas", "eye"] : isEdit ? ["fas", "edit"] : isFamily ? ["fas", "user-friends"] : ["fas", "user-plus"];
  const titleText = isView
    ? translate.pages?.users?.viewUser || translate.common.viewDetails 
    : isEdit
    ? translate.pages?.users?.editUser || translate.common.editUser
    : isFamily
    ? translate.pages?.family?.addFamiliar 
    : translate.pages?.users?.addUser || translate.common.create;

  const modalContent = (
    <div
      className="fixed inset-0 z-[9999] flex items-start justify-center bg-black/60 backdrop-blur-sm overflow-y-auto p-4"
      style={{ display: open ? "flex" : "none" }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="relative w-full max-w-md bg-card rounded-2xl shadow-2xl border border-border my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 z-10 p-2 rounded-lg text-text-tertiary hover:text-text-primary hover:bg-surface-hover transition-colors"
          onClick={onClose}
          aria-label="Close"
        >
          <FontAwesomeIcon icon={["fas", "times"]} className="text-lg" />
        </button>

        {/* Header */}
        <div className="px-6 sm:px-8 pt-6 pb-4 border-b border-border">
          <div className="flex items-center justify-center gap-3">
            <FontAwesomeIcon icon={titleIcon as any} className="text-secondary text-2xl" />
            <h2 className="text-2xl font-bold text-text-primary">{titleText}</h2>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 sm:px-8 py-6">
          <form className="space-y-6" onSubmit={handleSubmit}>
          
          {/* Sección: Datos Personales */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-text-primary border-b border-border pb-2">
              <FontAwesomeIcon icon={["fas", "user"]} className="mr-2 text-secondary" />
              {translate.formSections?.personalData}
            </h3>
            
          <div>
            <img
              src={formData.avatar}
              alt={translate.form?.avatar}
              className="text-center w-32 h-32 mx-auto mb-2 rounded-full border-2 border-primary object-cover shadow"
            />
            {!isView && (
              <>
                <label className="block text-sm font-medium text-text-secondary mb-1">
                  {translate.form?.avatar}
                </label>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 relative group w-full">
                  <FileInput value={fileInputValue} onChange={onFileChange} className="custom-class flex-1" />
                  <div className="flex sm:block w-full sm:w-auto">
                    <button
                      type="button"
                      className="flex items-center justify-center rounded-full p-2 bg-surface text-text-secondary hover:bg-secondary hover:text-text-on-primary transition focus:outline-none focus:ring-2 focus:ring-secondary w-full sm:w-auto"
                      title={""}
                      onClick={onRestoreAvatar}
                    >
                      <FontAwesomeIcon icon={["fas", "arrow-rotate-left"]} className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          <div>
            <Label htmlFor="user-name">{translate.form?.name}</Label>
            <Input
              id="user-name"
              type="text"
              value={formData.name || ""}
              disabled={isView}
              onChange={(e: ChangeEvent<HTMLInputElement>) => onChange("name", e.target.value)}
              autoComplete="on"
              placeholder={translate.form?.namePlaceholder ?? ""}
            />
          </div>

          <div>
            <Label htmlFor="user-phone">{translate.form?.phone}</Label>
            <Input
              id="user-phone"
              type="tel"
              value={formData.phone || ""}
              disabled={isView}
              onChange={(e: ChangeEvent<HTMLInputElement>) => onChange("phone", e.target.value)}
              autoComplete="on"
              placeholder={translate.form?.phonePlaceholder ?? ""}
            />
          </div>

          {(isFamily || formData.relation) && (
            <div>
              <Label htmlFor="user-relation">
                {translate.form?.relation} {!isView && <span className="text-error">*</span>}
              </Label>
              {isView ? (
                <Input
                  id="user-relation"
                  type="text"
                  value={relations.find(r => r.code === formData.relation)?.name || ""}
                  disabled={true}
                />
              ) : (
                <Select
                  options={relations.map(r => ({ value: r.code, label: r.name }))}
                  placeholder={translate.form?.relationPlaceholder ?? ""}
                  onChange={(value: string) => onChange("relation", value)}
                  defaultValue={formData.relation || ""}
                />
              )}
            </div>
          )}

          <div>
            <Label htmlFor="user-gender">{translate.form?.gender}</Label>
            {isView ? (
              <Input
                id="user-gender"
                type="text"
                value={genders.find(g => g.code === formData.gender)?.name || ""}
                disabled={true}
              />
            ) : (
              <Select
                options={genders.map(g => ({ value: g.code, label: g.name }))}
                placeholder={translate.form?.genderPlaceholder ?? ""}
                onChange={(value: string) => onChange("gender", value)}
                defaultValue={formData.gender || ""}
              />
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">{translate.form?.birthdate}</label>
            {isView ? (
              <div className="relative flex items-center">
                <span className="absolute left-3 text-text-tertiary pointer-events-none">
                  <FontAwesomeIcon icon={["fas", "calendar-alt"]} />
                </span>
                <input
                  className="w-full rounded-lg border pl-10 pr-3 py-2 text-base bg-background text-text-primary border-border"
                  type="text"
                  value={formData.birthdate ? new Date(formData.birthdate).toLocaleDateString('es-ES', { year: 'numeric', month: '2-digit', day: '2-digit' }) : ""}
                  disabled
                />
              </div>
            ) : (
              <div className="relative flex items-center">
                <span className="absolute left-3 text-text-tertiary z-10">
                  <FontAwesomeIcon icon={["fas", "calendar-alt"]} />
                </span>
                <DatePicker
                  key={`birthdate-${user.id || 'new'}-${formData.birthdate || 'empty'}`}
                  id="user-birthdate"
                  label=""
                  placeholder={translate.form?.birthdatePlaceholder ?? ""}
                  inputClassName="pl-10 pr-3"
                  hideRightIcon
                  defaultDate={convertISOToDate(formData.birthdate || null)}
                  onChange={onBirthdateChange}
                />
              </div>
            )}
          </div>

          <div>
            <Label htmlFor="user-nationality">{translate.form?.nationality}</Label>
            {isView ? (
              <Input
                id="user-nationality"
                type="text"
                value={countries.find(c => c.code === formData.nationality)?.name || ""}
                disabled={true}
              />
            ) : (
              <Select
                options={countries
                  .sort((countryA, countryB) => countryA.name.localeCompare(countryB.name))
                  .map(country => ({ value: country.code, label: country.name }))}
                placeholder={translate.form?.nationalityPlaceholder ?? ""}
                onChange={(value: string) => onChange("nationality", value)}
                defaultValue={formData.nationality || ""}
              />
            )}
          </div>
          </div>

          {/* Sección: Datos de la Iglesia */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-text-primary border-b border-border pb-2">
              <FontAwesomeIcon icon={["fas", "church"]} className="mr-2 text-secondary" />
              {translate.formSections?.churchData}
            </h3>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-3">
              {translate.form?.isMember}
            </label>
            
            {isView ? (
              <div className="flex items-center gap-2">
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium ${
                  formData.isMember 
                    ? 'bg-success-light text-success' 
                    : 'bg-surface text-text-tertiary'
                }`}>
                  <FontAwesomeIcon 
                    icon={["fas", formData.isMember ? "check-circle" : "times-circle"]} 
                    className="text-lg"
                  />
                  <span>{formData.isMember ? translate.formLabels?.memberYes : translate.formLabels?.memberNo}</span>
                </div>
              </div>
            ) : (
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => onChange("isMember", true)}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 transition-all ${
                    formData.isMember
                      ? 'border-success bg-success-light text-success'
                      : 'border-border bg-card text-text-secondary hover:border-success'
                  }`}
                >
                  <FontAwesomeIcon 
                    icon={["fas", "check-circle"]} 
                    className={`text-xl ${formData.isMember ? 'text-success' : 'text-text-disabled'}`}
                  />
                  <span className="font-medium">{translate.formLabels?.memberYes}</span>
                </button>
                
                <button
                  type="button"
                  onClick={() => onChange("isMember", false)}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 transition-all ${
                    !formData.isMember
                      ? 'border-error bg-error-light text-error'
                      : 'border-border bg-card text-text-secondary hover:border-error'
                  }`}
                >
                  <FontAwesomeIcon 
                    icon={["fas", "times-circle"]} 
                    className={`text-xl ${!formData.isMember ? 'text-error' : 'text-text-disabled'}`}
                  />
                  <span className="font-medium">{translate.formLabels?.memberNo}</span>
                </button>
              </div>
            )}
          </div>
          </div>

          {/* Sección: Accesos Web */}
          {(isFamily || isEdit || isCreate || (isView && hasWebAccess)) && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-text-primary border-b border-border pb-2">
              <FontAwesomeIcon icon={["fas", "globe"]} className="mr-2 text-success" />
              {translate.form?.hasWebAccess}
            </h3>

            {!isView && (
            <div className="border border-border rounded-lg p-4 bg-surface">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-text-secondary">
                  {isEdit ? (translate.form?.hasWebAccessEdit || '¿Tiene acceso a la aplicación web?') : (translate.form?.hasWebAccessCreate)}
                </label>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hasWebAccess}
                    onChange={(e) => setHasWebAccess(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-surface peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-light rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-background after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-background after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-secondary"></div>
                </label>
              </div>
              <p className="text-xs text-text-tertiary">
                {isEdit 
                  ? translate.form?.webAccessEditHelp
                  : translate.form?.webAccessCreateHelp
                }
              </p>
            </div>
            )}

            {hasWebAccess && (
              <>
                <div>
                  <Label htmlFor="user-email">
                    {translate.form?.email} {!isView && <span className="text-error">*</span>}
                  </Label>
                  <Input
                    id="user-email"
                    type="email"
                    value={formData.email || ""}
                    disabled={isView || (isEdit && originalHasWebAccess)}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => onChange("email", e.target.value)}
                    autoComplete="on"
                    placeholder={""}
                  />
                  {isEdit && originalHasWebAccess && (
                    <p className="text-xs text-text-tertiary mt-1">
                      {translate.form?.emailNoChange}
                    </p>
                  )}
                  {isEdit && !originalHasWebAccess && (
                    <p className="text-xs text-info mt-1">
                      {translate.form?.emailForWebAccess}
                    </p>
                  )}
                </div>

                {/* Campos de contraseña */}
                {(isCreate || isFamily) && (
                  <>
                    <div>
                      <Label htmlFor="user-password">
                        {translate.form?.password} <span className="text-error">*</span>
                      </Label>
                      <Input
                        id="user-password"
                        type="password"
                        value={password}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => {
                          setPassword(e.target.value);
                          setErrors([]);
                        }}
                        placeholder={""}
                        autoComplete="on"
                      />
                    </div>

                    <div>
                      <Label htmlFor="user-confirm-password">
                        {translate.form?.confirmPassword} <span className="text-error">*</span>
                      </Label>
                      <Input
                        id="user-confirm-password"
                        type="password"
                        value={confirmPassword}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => {
                          setConfirmPassword(e.target.value);
                          setErrors([]);
                        }}
                        placeholder={""}
                        autoComplete="on"
                      />
                    </div>
                  </>
                )}

                {/* En modo edit: campos de contraseña opcionales */}
                {isEdit && (
                  <>
                    <div>
                      <Label htmlFor="user-new-password">{translate.form?.newPassword}</Label>
                      <Input
                        id="user-new-password"
                        type="password"
                        value={password}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => {
                          setPassword(e.target.value);
                          setErrors([]);
                        }}
                        placeholder={translate.form?.newPasswordPlaceholder}
                        autoComplete="on"
                        hint={translate.form?.newPasswordHint}
                      />
                    </div>

                    <div>
                      <Label htmlFor="user-confirm-new-password">{translate.form?.confirmNewPassword}</Label>
                      <Input
                        id="user-confirm-new-password"
                        type="password"
                        value={confirmPassword}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => {
                          setConfirmPassword(e.target.value);
                          setErrors([]);
                        }}
                        placeholder={translate.form?.confirmNewPasswordPlaceholder}
                        autoComplete="on"
                      />
                    </div>
                  </>
                )}

              </>
            )}
          </div>
          )}

          {errors.length > 0 && (
            <div className="bg-error-light border border-error text-error px-4 py-3 rounded-lg">
              <div className="flex items-center gap-2 mb-2 font-semibold">
                <FontAwesomeIcon icon={["fas", "exclamation-circle"]} />
                <span>{translate.messages?.error?.generic}</span>
              </div>
              <ul className="space-y-1 ml-1">
                {errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          )}

          {!isView && (
            <button
              type="submit"
              className="w-full mt-6 py-2.5 rounded-lg bg-secondary hover:bg-secondary-hover text-text-on-primary font-medium shadow-sm hover:shadow transition-all"
            >
              {isEdit ? (translate.common?.save) : isFamily ? (translate.pages?.family?.addFamiliar) : (translate.pages?.users?.addUser)}
            </button>
          )}
        </form>
        </div>
      </div>
    </div>
  );

  const modalRoot = document.getElementById('modal-root');
  return ReactDOM.createPortal(modalContent, modalRoot);
}
