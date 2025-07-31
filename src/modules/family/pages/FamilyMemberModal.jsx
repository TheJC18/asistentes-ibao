import { useEffect, useRef, useState } from "react";
import { countriesES, countriesEN } from "../../../helpers";
import { Datepicker } from "flowbite-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function FamilyMemberModal({ isOpen, onClose, onAdd, member, mode = "create" }) {
  const modalRef = useRef(null);

  const [form, setForm] = useState({
    displayName: "",
    email: "",
    photoURL: "",
    country: "",
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
      className="fixed inset-0 z-[2147483647] flex items-center justify-center bg-black/60" // overlay más opaco
      style={{ backdropFilter: 'blur(2px)' }}
      onMouseDown={handleBackdrop}
    >
      <div
        ref={modalRef}
        className="relative w-full max-w-3xl mx-1 sm:mx-4 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-2xl dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.65)] animate-fadeIn"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
          onClick={onClose}
          aria-label="Close"
        >
          <FontAwesomeIcon icon={["fas", "times"]} />
        </button>
        <div className="p-2 sm:p-8">
          <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
            {mode === "edit" ? "Edit family member" : "Add family member"}
          </h4>
          <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
            {mode === "edit" ? "Edit the information and save changes." : "Fill the form to add a new member."}
          </p>
          {success ? (
            <div className="text-green-600 dark:text-green-400 text-center font-semibold py-8">
              {mode === "edit" ? "Member updated successfully!" : "Member created successfully!"}
            </div>
          ) : (
            <form className="flex flex-col" onSubmit={handleSave}>
              <div className="custom-scrollbar overflow-y-auto px-0 sm:px-2 pb-3">
                <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                  <div className="col-span-2 lg:col-span-1">
                    <label className="block mb-1 font-medium dark:text-gray-200">Name</label>
                    <input
                      name="displayName"
                      type="text"
                      value={form.displayName}
                      onChange={handleChange}
                      required
                      className="w-full rounded border px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700 placeholder-gray-400 dark:placeholder-gray-500"
                    />
                  </div>
                  <div className="col-span-2 lg:col-span-1">
                    <label className="block mb-1 font-medium dark:text-gray-200">Email</label>
                    <input
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      required
                      className="w-full rounded border px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700 placeholder-gray-400 dark:placeholder-gray-500"
                    />
                  </div>
                  <div className="col-span-2 lg:col-span-1">
                    <label className="block mb-1 font-medium dark:text-gray-200">Photo (URL)</label>
                    <input
                      name="photoURL"
                      type="text"
                      value={form.photoURL}
                      onChange={handleChange}
                      className="w-full rounded border px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700 placeholder-gray-400 dark:placeholder-gray-500"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 font-medium dark:text-gray-200">Date</label>
                    <Datepicker
                      id="date-picker"
                      label="Date Picker Input"
                      placeholder="Select a date"
                      onChange={(dates, currentDateString) => {
                        // Handle your logic
                        console.log({ dates, currentDateString });
                      }}
                    />
                  </div>
                  <div className="col-span-2 lg:col-span-1">
                    <label className="block mb-1 font-medium dark:text-gray-200">Country</label>
                    <select
                      name="country"
                      value={form.country}
                      onChange={handleChange}
                      className="w-full rounded border px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700"
                    >
                      <option value="">Select a country</option>
                      {countriesES.map((c) => (
                        <option key={c.code} value={c.code}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-span-2 lg:col-span-1 flex items-center mt-6">
                    <input
                      name="isMember"
                      type="checkbox"
                      checked={form.isMember}
                      onChange={handleChange}
                      className="mr-2 accent-blue-600 dark:accent-blue-400"
                    />
                    <label className="font-medium dark:text-gray-200">Is member?</label>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
                <button
                  type="button"
                  className="px-4 py-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
                  onClick={onClose}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
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