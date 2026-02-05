import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import ReactDOM from "react-dom";
import Select from "../../../components/form/Select";
import DatePicker from "../../../components/form/date-picker";
import Label from "../../../components/form/Label";
import Input from "../../../components/form/input/InputField";
import { countriesES, relationsES, gendersES } from "../../../helpers";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FileInput } from "flowbite-react";
import { 
  createFileUploadHandler, 
  createFieldUpdater, 
  createBirthdateUpdater, 
  createAvatarRestorer 
} from "../helpers/userFormHelpers";
import { validateUserForm, prepareUserDataForSave } from "../helpers/userValidations";
import { formatDate, convertISOToDate } from "../../../helpers/dateUtils";
import { linkGoogleAccount } from "../../auth/firebase/authQueries";
import { showSuccessAlert, showErrorAlert, showLoadingAlert, closeAlert } from "../../../helpers/sweetAlertHelper";
import { User } from "../../../types";

interface UserModalProps {
  open: boolean;
  onClose: () => void;
  mode?: 'view' | 'edit' | 'create' | 'family';
  user?: Partial<User>;
  onSave?: (data: any) => void;
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
}

export default function UserModal({ 
  open, 
  onClose, 
  mode = "view", 
  user = {}, 
  onSave 
}: UserModalProps) {
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
      const userHadWebAccess = user.hasWebAccess || false;
      
      setFormData({
        name: user.name || user.displayName || "",
        email: user.email || "",
        role: user.role || "",
        isMember: user.isMember || false,
        nationality: user.nationality || "",
        birthdate: user.birthdate || "",
        avatar: user.avatar || user.photoURL || "/user_default.png",
        gender: user.gender || "",
        relation: (user as any).relation || "",
      });
      setOriginalAvatar(user.avatar || user.photoURL || "/user_default.png");
      setFileInputValue("");
      setPassword("");
      setConfirmPassword("");
      setErrors([]);
      setHasWebAccess(userHadWebAccess);
      setOriginalHasWebAccess(userHadWebAccess);
    }
  }, [open, user.id]);

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

  // Handler para vincular Google
  const handleLinkGoogle = async () => {
    try {
      showLoadingAlert('Vinculando cuenta de Google...', 'Por favor, selecciona tu cuenta de Google');
      
      const result = await linkGoogleAccount();
      
      closeAlert();
      
      if (result.ok) {
        await showSuccessAlert(
          '¡Google vinculado!',
          'Ahora puedes iniciar sesión con Google o con tu email/contraseña.'
        );
      } else {
        showErrorAlert(
          'Error al vincular',
          result.errorMessage || 'No se pudo vincular tu cuenta de Google'
        );
      }
    } catch (error) {
      closeAlert();
      console.error('Error al vincular Google:', error);
      showErrorAlert(
        'Error inesperado',
        'Ocurrió un error al vincular Google. Por favor intenta de nuevo.'
      );
    }
  };

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
    ? "Información del usuario"
    : isEdit
    ? "Editar usuario"
    : isFamily
    ? "Agregar familiar"
    : "Crear usuario";

  const modalContent = (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm overflow-y-auto p-4"
      style={{ display: open ? "flex" : "none" }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="relative w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-2xl dark:shadow-black/50 border border-gray-200 dark:border-gray-700 my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 z-10 p-2 rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          onClick={onClose}
          aria-label="Close"
        >
          <FontAwesomeIcon icon={["fas", "times"]} className="text-lg" />
        </button>

        {/* Header */}
        <div className="px-6 sm:px-8 pt-6 pb-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-center gap-3">
            <FontAwesomeIcon icon={titleIcon as any} className="text-blue-600 dark:text-blue-400 text-2xl" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{titleText}</h2>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 sm:px-8 py-6">
          <form className="space-y-6" onSubmit={handleSubmit}>
          
          {/* Sección: Datos Personales */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
              <FontAwesomeIcon icon={["fas", "user"]} className="mr-2 text-blue-600 dark:text-blue-400" />
              Datos Personales
            </h3>
            
          <div>
            <img
              src={formData.avatar}
              alt="Imagen del usuario"
              className="text-center w-32 h-32 mx-auto mb-2 rounded-full border-2 border-blue-500 object-cover shadow"
            />
            {!isView && (
              <>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                  Imagen de perfil
                </label>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 relative group w-full">
                  <FileInput value={fileInputValue} onChange={onFileChange} className="custom-class flex-1" />
                  <div className="flex sm:block w-full sm:w-auto">
                    <button
                      type="button"
                      className="flex items-center justify-center rounded-full p-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-blue-100 dark:hover:bg-blue-800 transition focus:outline-none focus:ring-2 focus:ring-blue-400 w-full sm:w-auto"
                      title="Restaurar imagen original"
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
            <Label htmlFor="user-name">Nombre</Label>
            <Input
              id="user-name"
              type="text"
              value={formData.name || ""}
              disabled={isView}
              onChange={(e: ChangeEvent<HTMLInputElement>) => onChange("name", e.target.value)}
              autoComplete="on"
              placeholder="Ingresa el nombre"
            />
          </div>

          {isFamily && (
            <div>
              <Label htmlFor="user-relation">
                Relación <span className="text-red-500">*</span>
              </Label>
              <Select
                options={relationsES.map(r => ({ value: r.code, label: r.name }))}
                placeholder="Selecciona una relación"
                onChange={(value: string) => onChange("relation", value)}
                defaultValue={formData.relation || ""}
              />
            </div>
          )}

          <div>
            <Label htmlFor="user-gender">Género</Label>
            {isView ? (
              <Input
                id="user-gender"
                type="text"
                value={gendersES.find(g => g.code === formData.gender)?.name || ""}
                disabled={true}
              />
            ) : (
              <Select
                options={gendersES.map(g => ({ value: g.code, label: g.name }))}
                placeholder="Selecciona un género"
                onChange={(value: string) => onChange("gender", value)}
                defaultValue={formData.gender || ""}
              />
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Fecha de nacimiento</label>
            {isView ? (
              <div className="relative flex items-center">
                <span className="absolute left-3 text-gray-500 dark:text-gray-400 pointer-events-none">
                  <FontAwesomeIcon icon={["fas", "calendar-alt"]} />
                </span>
                <input
                  className="w-full rounded-lg border pl-10 pr-3 py-2 text-base dark:bg-gray-800 dark:text-white border-gray-300 dark:border-gray-700"
                  type="text"
                  value={formatDate(formData.birthdate) || ""}
                  disabled
                />
              </div>
            ) : (
              <div className="relative flex items-center">
                <span className="absolute left-3 text-gray-500 dark:text-gray-400 z-10">
                  <FontAwesomeIcon icon={["fas", "calendar-alt"]} />
                </span>
                <DatePicker
                  key={`birthdate-${user.id || 'new'}-${formData.birthdate || 'empty'}`}
                  id="user-birthdate"
                  label=""
                  placeholder="Selecciona la fecha"
                  inputClassName="pl-10 pr-3"
                  hideRightIcon
                  defaultDate={convertISOToDate(formData.birthdate || null)}
                  onChange={onBirthdateChange}
                />
              </div>
            )}
          </div>

          <div>
            <Label htmlFor="user-nationality">Nacionalidad</Label>
            {isView ? (
              <Input
                id="user-nationality"
                type="text"
                value={countriesES.find(c => c.code === formData.nationality)?.name || ""}
                disabled={true}
              />
            ) : (
              <Select
                options={countriesES
                  .sort((a, b) => a.name.localeCompare(b.name))
                  .map(c => ({ value: c.code, label: c.name }))}
                placeholder="Selecciona un país"
                onChange={(value: string) => onChange("nationality", value)}
                defaultValue={formData.nationality || ""}
              />
            )}
          </div>
          </div>

          {/* Sección: Datos de la Iglesia */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
              <FontAwesomeIcon icon={["fas", "church"]} className="mr-2 text-purple-600 dark:text-purple-400" />
              Datos de la Iglesia
            </h3>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-3">
              ¿Forma parte de la membresía?
            </label>
            
            {isView ? (
              <div className="flex items-center gap-2">
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium ${
                  formData.isMember 
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                    : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
                }`}>
                  <FontAwesomeIcon 
                    icon={["fas", formData.isMember ? "check-circle" : "times-circle"]} 
                    className="text-lg"
                  />
                  <span>{formData.isMember ? 'Sí, es miembro' : 'No es miembro'}</span>
                </div>
              </div>
            ) : (
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => onChange("isMember", true)}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 transition-all ${
                    formData.isMember
                      ? 'border-green-500 bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400 dark:border-green-500'
                      : 'border-gray-300 bg-white text-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700 hover:border-green-300'
                  }`}
                >
                  <FontAwesomeIcon 
                    icon={["fas", "check-circle"]} 
                    className={`text-xl ${formData.isMember ? 'text-green-500' : 'text-gray-400'}`}
                  />
                  <span className="font-medium">Soy miembro</span>
                </button>
                
                <button
                  type="button"
                  onClick={() => onChange("isMember", false)}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 transition-all ${
                    !formData.isMember
                      ? 'border-red-500 bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400 dark:border-red-500'
                      : 'border-gray-300 bg-white text-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700 hover:border-red-300'
                  }`}
                >
                  <FontAwesomeIcon 
                    icon={["fas", "times-circle"]} 
                    className={`text-xl ${!formData.isMember ? 'text-red-500' : 'text-gray-400'}`}
                  />
                  <span className="font-medium">No soy miembro</span>
                </button>
              </div>
            )}
          </div>
          </div>

          {/* Sección: Accesos Web */}
          {(isFamily || isEdit || (isView && hasWebAccess)) && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
              <FontAwesomeIcon icon={["fas", "globe"]} className="mr-2 text-green-600 dark:text-green-400" />
              Accesos Web
            </h3>

            {!isView && (
            <div className="border border-gray-300 dark:border-gray-600 rounded-lg p-4 bg-gray-50 dark:bg-gray-800/50">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  {isEdit ? '¿Tiene acceso a la aplicación web?' : '¿Dar acceso a la aplicación web?'}
                </label>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hasWebAccess}
                    onChange={(e) => setHasWebAccess(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {isEdit 
                  ? 'Si desactivas esta opción, el usuario no podrá iniciar sesión (debes eliminar manualmente desde Firebase Console > Authentication)'
                  : 'Si activas esta opción, el familiar podrá iniciar sesión con correo y contraseña'
                }
              </p>
            </div>
            )}

            {hasWebAccess && (
              <>
                <div>
                  <Label htmlFor="user-email">
                    Correo {!isView && <span className="text-red-500">*</span>}
                  </Label>
                  <Input
                    id="user-email"
                    type="email"
                    value={formData.email || ""}
                    disabled={isView || (isEdit && originalHasWebAccess)}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => onChange("email", e.target.value)}
                    autoComplete="on"
                    placeholder="Ingresa el correo electrónico"
                  />
                  {isEdit && originalHasWebAccess && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      El correo no se puede cambiar después de crear el usuario
                    </p>
                  )}
                  {isEdit && !originalHasWebAccess && (
                    <p className="text-xs text-blue-500 dark:text-blue-400 mt-1">
                      Ingresa un correo para dar acceso web a este usuario
                    </p>
                  )}
                </div>

                {/* Campos de contraseña */}
                {(isCreate || isFamily) && (
                  <>
                    <div>
                      <Label htmlFor="user-password">
                        Contraseña <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="user-password"
                        type="password"
                        value={password}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => {
                          setPassword(e.target.value);
                          setErrors([]);
                        }}
                        placeholder="Ingresa la contraseña"
                        autoComplete="on"
                      />
                    </div>

                    <div>
                      <Label htmlFor="user-confirm-password">
                        Verificar contraseña <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="user-confirm-password"
                        type="password"
                        value={confirmPassword}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => {
                          setConfirmPassword(e.target.value);
                          setErrors([]);
                        }}
                        placeholder="Confirma la contraseña"
                        autoComplete="on"
                      />
                    </div>
                  </>
                )}

                {/* En modo edit: campos de contraseña opcionales */}
                {isEdit && (
                  <>
                    <div>
                      <Label htmlFor="user-new-password">Nueva contraseña</Label>
                      <Input
                        id="user-new-password"
                        type="password"
                        value={password}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => {
                          setPassword(e.target.value);
                          setErrors([]);
                        }}
                        placeholder="Dejar vacío para no cambiar"
                        autoComplete="on"
                        hint="Deja vacío si no deseas cambiar la contraseña"
                      />
                    </div>

                    <div>
                      <Label htmlFor="user-confirm-new-password">Verificar nueva contraseña</Label>
                      <Input
                        id="user-confirm-new-password"
                        type="password"
                        value={confirmPassword}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => {
                          setConfirmPassword(e.target.value);
                          setErrors([]);
                        }}
                        placeholder="Dejar vacío para no cambiar"
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
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg">
              <div className="flex items-center gap-2 mb-2 font-semibold">
                <FontAwesomeIcon icon={["fas", "exclamation-circle"]} />
                <span>Por favor, corrige los siguientes errores:</span>
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
              className="w-full mt-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-medium shadow-sm hover:shadow transition-all"
            >
              {isEdit ? "Guardar cambios" : isFamily ? "Agregar familiar" : "Crear usuario"}
            </button>
          )}
        </form>
        </div>
      </div>
    </div>
  );

  return ReactDOM.createPortal(modalContent, document.body);
}
