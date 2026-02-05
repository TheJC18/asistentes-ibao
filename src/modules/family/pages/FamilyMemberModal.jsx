import { useEffect, useRef, useState } from "react";
import { countriesES, countriesEN } from "../../../helpers";
import DatePicker from "../../../components/form/date-picker";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function FamilyMemberModal({ isOpen, onClose, onAdd, member, mode = "create" }) {
  const modalRef = useRef(null);

  const [form, setForm] = useState({
    displayName: "",
    email: "",
    photoURL: "",
    country: "",
    birthDate: null,
    role: "user",
    isMember: false,
    uid: null,
    createdAt: null,
  });

  const [success, setSuccess] = useState(false);

  // Reset form al abrir/cerrar o al cambiar de miembro
  useEffect(() => {
    if (isOpen) {
      if (mode === "edit" && member) {
        setForm({ ...member });
      } else {
        setForm({
          displayName: "",
          email: "",
          photoURL: "",
          country: "",
          birthDate: null,
          role: "user",
          isMember: false,
        });
      }
      setSuccess(false);
    }
  }, [isOpen, member, mode]);

  // Bloquear scroll del fondo
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Cerrar con ESC
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  // Cerrar al hacer click fuera
  const handleBackdrop = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      onClose();
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    let newMember;
    if (mode === "edit") {
      newMember = { ...form };
    } else {
      newMember = {
        ...form,
      };
    }
    if (onAdd) onAdd(newMember);
    setSuccess(true);
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[999999] flex items-start sm:items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto"
      onMouseDown={handleBackdrop}
    >
      <div
        ref={modalRef}
        className="relative w-full max-w-3xl bg-white dark:bg-gray-900 rounded-2xl shadow-2xl dark:shadow-black/50 border border-gray-200 dark:border-gray-700 my-8"
        onMouseDown={(e) => e.stopPropagation()}
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
          <h4 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            {mode === "edit" ? "Edit family member" : "Add family member"}
          </h4>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {mode === "edit" ? "Edit the information and save changes." : "Fill the form to add a new member."}
          </p>
        </div>

        {/* Content */}
        <div className="px-6 sm:px-8 py-6">
          {success ? (
            <div className="text-green-600 dark:text-green-400 text-center font-semibold py-12">
              {mode === "edit" ? "✓ Member updated successfully!" : "✓ Member created successfully!"}
            </div>
          ) : (
            <form className="space-y-6" onSubmit={handleSave}>
              {/* Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Name */}
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="displayName"
                    type="text"
                    value={form.displayName}
                    onChange={handleChange}
                    required
                    placeholder="Enter full name"
                    className="w-full rounded-lg border px-3.5 py-2.5 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 placeholder-gray-400 dark:placeholder-gray-500 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 transition-all outline-none"
                  />
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    placeholder="email@example.com"
                    className="w-full rounded-lg border px-3.5 py-2.5 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 placeholder-gray-400 dark:placeholder-gray-500 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 transition-all outline-none"
                  />
                </div>

                {/* Photo URL */}
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                    Photo (URL)
                  </label>
                  <input
                    name="photoURL"
                    type="text"
                    value={form.photoURL}
                    onChange={handleChange}
                    placeholder="https://example.com/photo.jpg"
                    className="w-full rounded-lg border px-3.5 py-2.5 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 placeholder-gray-400 dark:placeholder-gray-500 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 transition-all outline-none"
                  />
                </div>

                {/* Date */}
                <div className="space-y-1.5">
                  <DatePicker
                    id="birthDate"
                    label="Birth Date"
                    placeholder="Select birth date"
                    defaultDate={form.birthDate}
                    onChange={(dates) => {
                      if (dates && dates.length > 0) {
                        setForm(prev => ({ ...prev, birthDate: dates[0] }));
                      }
                    }}
                    inputClassName="w-full rounded-lg border px-3.5 py-2.5 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 placeholder-gray-400 dark:placeholder-gray-500 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 transition-all outline-none"
                  />
                </div>

                {/* Country */}
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                    Country
                  </label>
                  <select
                    name="country"
                    value={form.country}
                    onChange={handleChange}
                    className="w-full rounded-lg border px-3.5 py-2.5 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 transition-all outline-none"
                  >
                    <option value="">Select a country</option>
                    {countriesES
                      .sort((a, b) => a.name.localeCompare(b.name)) // Ordena alfabéticamente
                      .map((c) => (
                        <option key={c.code} value={c.code}>
                          {c.name}
                        </option>
                      ))
                    }
                  </select>
                </div>

                {/* Is Member Checkbox */}
                <div className="flex items-center space-x-2.5 pt-7">
                  <input
                    name="isMember"
                    type="checkbox"
                    checked={form.isMember}
                    onChange={handleChange}
                    className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 cursor-pointer"
                    id="isMember"
                  />
                  <label htmlFor="isMember" className="text-sm font-medium text-gray-700 dark:text-gray-200 cursor-pointer select-none">
                    Is member?
                  </label>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
                <button
                  type="button"
                  className="px-6 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  onClick={onClose}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="sm:ml-auto px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-medium shadow-sm hover:shadow transition-all"
                >
                  Save
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}