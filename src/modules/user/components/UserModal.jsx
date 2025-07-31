import { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import Select from "../../../components/form/Select";
import DatePicker from "../../../components/form/date-picker";
import { countriesES } from "../../../helpers";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Checkbox, FileInput } from "flowbite-react";
import { createFileUploadHandler, createFieldUpdater, createBirthdateUpdater, createAvatarRestorer } from "../helpers/userFormHelpers";
import { getCountryNameByCode } from "../helpers/userUtils";
import { formatDate } from "../../../helpers/dateUtils";

// Helper para convertir string ISO a Date para el DatePicker
const convertISOToDate = (isoString) => {
  if (!isoString) return null;
  try {
    return new Date(isoString);
  } catch {
    return null;
  }
};

export default function UserModal({ open, onClose, mode = "view", user = {}, onSave }) {
  const isView = mode === "view";
  const isEdit = mode === "edit";

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    nationality: "",
    birthdate: "",
    avatar: "/user_default.png",
    isMember: false,
  });

  const [originalAvatar, setOriginalAvatar] = useState("/user_default.png");
  const [fileInputValue, setFileInputValue] = useState("");

  useEffect(() => {
    setFormData({
      name: user.name || user.displayName || "",
      email: user.email || "",
      role: user.role || "",
      isMember: user.isMember || false,
      nationality: user.nationality || "",
      birthdate: user.birthdate || "",
      avatar: user.avatar || user.photoURL || "/user_default.png",
    });
    setOriginalAvatar(user.avatar || user.photoURL || "/user_default.png");
    setFileInputValue(""); // Vacía el input de archivo al iniciar
  }, [user]);

  // Usar helpers
  const onFileChange = createFileUploadHandler(setFormData, setFileInputValue);
  const onChange = createFieldUpdater(setFormData);
  const onBirthdateChange = createBirthdateUpdater(onChange);
  const onRestoreAvatar = createAvatarRestorer(setFormData, originalAvatar);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (onSave) onSave(formData);
  };

  const countryOptions = countriesES.map((c) => ({
    value: c.name,
    label: c.name,
  }));

  const titleIcon = isView ? ["fas", "eye"] : isEdit ? ["fas", "edit"] : ["fas", "user-plus"];
  const titleText = isView
    ? "Información del usuario"
    : isEdit
    ? "Editar usuario"
    : "Crear usuario";

  const modalContent = (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      style={{ display: open ? "flex" : "none" }}
    >
      <div
        className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl w-full max-w-md p-8 relative border-1 border-blue-200 max-h-[90vh] overflow-y-auto"
        style={{ maxHeight: '90vh' }}
      >
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-red-500 text-2xl"
          onClick={onClose}
          title="Cerrar"
        >
          <FontAwesomeIcon icon={["fas", "times"]} />
        </button>

        <div className="flex items-center justify-center mb-6 mt-3 text-2xl font-extrabold text-black dark:text-white text-center drop-shadow">
          <FontAwesomeIcon icon={titleIcon} className="text-blue-700 px-3" />
          <h2 className="text-2xl font-bold">{titleText}</h2>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
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
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Nombre</label>
            <input
              className="w-full rounded-lg border px-3 py-2 text-base dark:bg-gray-800 dark:text-white border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-400"
              type="text"
              value={formData.name || ""}
              disabled={isView}
              readOnly={isView}
              onChange={(e) => onChange("name", e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              Email{" "}
              <span className="text-xs font-bold">(Opcional)</span>
            </label>
            <input
              className="w-full rounded-lg border px-3 py-2 text-base dark:bg-gray-800 dark:text-white border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-400"
              type="email"
              value={formData.email || ""}
              disabled={isView}
              readOnly={isView}
              onChange={(e) => onChange("email", e.target.value)}
            />
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
                  defaultDate={convertISOToDate(formData.birthdate)}
                  onChange={onBirthdateChange}
                />
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">¿Es parte de la membresía?</label>
            <div className="flex items-center gap-3">
              <Checkbox checked={formData.isMember} onChange={(e) => onChange("isMember", e.target.checked)} />
              <span className="block font-normal text-gray-700 text-theme-sm dark:text-gray-400">
                {formData.isMember ? 'Sí lo es' : 'No lo es'}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Nacionalidad</label>
            {isView ? (
              <input
                className="w-full rounded-lg border px-3 py-2 text-base dark:bg-gray-800 dark:text-white border-gray-300 dark:border-gray-700"
                type="text"
                value={getCountryNameByCode(formData.nationality) || ""}
                disabled
                readOnly
              />
            ) : (
              <Select
                options={countryOptions}
                placeholder="Selecciona un país"
                onChange={(val) => onChange("nationality", val)}
                defaultValue={formData.nationality || ""}
              />
            )}
          </div>

          {!isView && (
            <button
              type="submit"
              className="w-full mt-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-700 text-white font-bold text-lg transition"
            >
              {isEdit ? "Guardar cambios" : "Crear usuario"}
            </button>
          )}
        </form>
      </div>
    </div>
  );

  return ReactDOM.createPortal(modalContent, document.body);
}