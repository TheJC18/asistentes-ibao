// Tipos para useForm
export type FormValues = {
  [key: string]: any;
};

export type Errors = {
  [key: string]: string;
};

export type UseFormReturn = {
  values: FormValues;
  errors: Errors;
  touched: { [key: string]: boolean };
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => void;
  handleBlur: (
    e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => void;
  handleSubmit: (onSubmit: (values: FormValues) => Promise<void>) => (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  setFieldValue: (field: string, value: any) => void;
  setFieldError: (field: string, error: string) => void;
  resetForm: () => void;
};

export type UseModalReturn = {
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
  toggleModal: () => void;
};

// Context: Language
export type Language = "es" | "en";
export type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  translate: any; // Puedes reemplazar 'any' por TranslationKeys si lo deseas tipar más estricto
};

// Context: Sidebar
export type SidebarContextType = {
  isExpanded: boolean;
  isMobileOpen: boolean;
  isHovered: boolean;
  activeItem: string | null;
  openSubmenu: string | null;
  toggleSidebar: () => void;
  toggleMobileSidebar: () => void;
  setIsHovered: (isHovered: boolean) => void;
  setActiveItem: (item: string | null) => void;
  toggleSubmenu: (item: string) => void;
};

// Context: Theme
export type Theme = "light" | "dark";
export type ThemeContextType = {
  theme: Theme;
  toggleTheme: () => void;
};