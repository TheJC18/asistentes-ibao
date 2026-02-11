import { useMemo, useState, FormEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { startCreatingUserWithEmailPassword } from '@/modules/auth/store';
import { RootState, AppDispatch } from '@/core/store';
import { RegisterFormData } from '@/modules/auth/types';
import { useForm } from '@/core/hooks/useForm';
import { FormValidationRules } from '@/types';
import { useTranslation } from '@/core/context/LanguageContext';

export function useRegisterForm() {
  const dispatch = useDispatch<AppDispatch>();
  const { status, errorMessage } = useSelector((state: RootState) => state.auth);
  const translate = useTranslation();
  const isCheckingAuthentication = useMemo(() => status === 'checking', [status]);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const formData: RegisterFormData = { displayName: '', email: '', password: '', confirmPassword: '' };

  const formValidations: FormValidationRules<RegisterFormData> = {
    email: [ (value) => value.includes('@'), translate.messages.validation.emailInvalid ],
    password: [ (value) => value.length >= 6, translate.messages.validation.passwordLength ],
    displayName: [ (value) => value.length >= 1, translate.messages.validation.nameRequired ],
    confirmPassword: [ 
      (value, formState) => value === formState?.password, 
      translate.messages.validation.passwordsMustMatch
    ]
  };

  const validate = (values: RegisterFormData) => {
    const errors: { [key: string]: string } = {};
    if (!values.displayName || values.displayName.length < 1) {
      errors.displayName = translate.messages.validation.nameRequired;
    }
    if (!values.email || !values.email.includes('@')) {
      errors.email = translate.messages.validation.emailInvalid;
    }
    if (!values.password || values.password.length < 6) {
      errors.password = translate.messages.validation.passwordLength;
    }
    if (values.password !== values.confirmPassword) {
      errors.confirmPassword = translate.messages.validation.passwordsMustMatch;
    }
    return errors;
  };

  const {
    values,
    errors,
    handleChange,
  } = useForm(formData, undefined, validate);

  const { displayName, email, password, confirmPassword } = values;
  const isFormValid = Object.keys(errors).length === 0;

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormSubmitted(true);
    if (!isFormValid) return;
    dispatch(startCreatingUserWithEmailPassword({
      displayName: values.displayName,
      email: values.email,
      password: values.password
    }));
  };

  return {
    values,
    errors,
    handleChange,
    displayName,
    email,
    password,
    confirmPassword,
    isCheckingAuthentication,
    formSubmitted,
    setFormSubmitted,
    showPassword,
    setShowPassword,
    showConfirmPassword,
    setShowConfirmPassword,
    onSubmit,
    errorMessage,
  };
}
