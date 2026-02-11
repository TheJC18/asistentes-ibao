import { useState, useEffect, FormEvent } from "react";
import { UserModalProps, UserFormData } from'@/modules/user/types';
import { useLanguage, useTranslation } from '@/core/context/LanguageContext';
import { countriesES, countriesEN } from '@/i18n/countries';
import { gendersES, gendersEN } from '@/i18n/genders';
import { relationsES, relationsEN } from '@/i18n/relations';
import { 
  createFileUploadHandler, 
  createFieldUpdater, 
  createAvatarRestorer, 
  createDateFieldUpdater
} from '@/modules/user/helpers/userFormHelpers';
import { validateUserForm, prepareUserDataForSave } from '@/modules/user/helpers/userValidations';

export function useUserModalLogic({ open, mode = 'view', user = {}, onSave }: UserModalProps) {
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
      setOriginalAvatar(user.avatar || user.photoURL || "/user_default.png");
      setFileInputValue("");
      setPassword("");
      setConfirmPassword("");
      setErrors([]);
      setHasWebAccess(userHadWebAccess);
      setOriginalHasWebAccess(userHadWebAccess);
    }
  }, [open, user.id, isCreate]);

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

  const onFileChange = createFileUploadHandler(setFormData, setFileInputValue);
  const onChange = createFieldUpdater(setFormData);
  const onBirthdateChange = createDateFieldUpdater(onChange, 'birthdate');
  const onRestoreAvatar = createAvatarRestorer(setFormData, originalAvatar);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validationErrors = validateUserForm({
      formData,
      password,
      confirmPassword,
      mode,
      hasWebAccess
    });
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors([]);
    const dataToSave = prepareUserDataForSave({
      formData,
      password,
      mode,
      hasWebAccess
    });
    if (onSave) onSave(dataToSave);
  };

  return {
    translate,
    countries,
    genders,
    relations,
    isView,
    isEdit,
    isCreate,
    isFamily,
    formData,
    setFormData,
    hasWebAccess,
    setHasWebAccess,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    errors,
    setErrors,
    originalAvatar,
    setOriginalAvatar,
    fileInputValue,
    setFileInputValue,
    originalHasWebAccess,
    setOriginalHasWebAccess,
    onFileChange,
    onChange,
    onBirthdateChange,
    onRestoreAvatar,
    handleSubmit
  };
}
