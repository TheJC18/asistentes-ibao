import { useMemo, useState, FormEvent } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FaEye, FaEyeSlash, FaInfoCircle } from 'react-icons/fa';

import { useForm } from '@/core/hooks/useForm';
import { useTranslation } from '@/core/context/LanguageContext';
import Label from '@/core/components/form/Label';
import Input from '@/core/components/form/input/InputField';
import Button from '@/core/components/ui/button/Button';
import { startCreatingUserWithEmailPassword } from '@/modules/auth/store';
import { RootState, AppDispatch } from '@/core/store';
import { FormValidationRules } from '@/types';

interface RegisterFormData {
  displayName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

// Datos iniciales del formulario
const formData: RegisterFormData = { 
  displayName: '', 
  email: '', 
  password: '', 
  confirmPassword: '' 
};

export default function RegisterForm() {
  const dispatch = useDispatch<AppDispatch>();
  const { status, errorMessage } = useSelector((state: RootState) => state.auth);
  const translate = useTranslation();
  const isCheckingAuthentication = useMemo(() => status === 'checking', [status]);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const formValidations: FormValidationRules<RegisterFormData> = {
    email: [ (value) => value.includes('@'), translate.messages.validation.emailInvalid ],
    password: [ (value) => value.length >= 6, translate.messages.validation.passwordLength ],
    displayName: [ (value) => value.length >= 1, translate.messages.validation.nameRequired ],
    confirmPassword: [ 
      (value, formState) => value === formState?.password, 
      translate.messages.validation.passwordsMustMatch
    ]
  };

  const {
    formState,
    formValidation,
    onInputChange,
    isFormValid,
  } = useForm(formData, formValidations);

  const { displayName, email, password, confirmPassword } = formState;
  const displayNameValid = formValidation.displayName;
  const emailValid = formValidation.email;
  const passwordValid = formValidation.password;
  const confirmPasswordValid = formValidation.confirmPassword;

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormSubmitted(true);
    if (!isFormValid) return;
    dispatch(startCreatingUserWithEmailPassword(formState));
  };

  return (
    <div className="flex flex-col flex-1">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <div className="w-32 h-32 mx-auto mb-10 flex items-center justify-center">
              <img src="/logo.webp" alt="Logo" className="w-full h-full object-contain"/>
            </div>
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              {translate.auth.signUp}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {translate.auth.registerWithData}
            </p>
          </div>
          <div>
            <form onSubmit={onSubmit}>
              <div className="space-y-6">
                <div>
                  <Label>
                    {translate.auth.fullName} <span className="text-error-500">*</span>{' '}
                  </Label>
                  <Input
                    name="displayName"
                    type="text"
                    value={displayName}
                    onChange={onInputChange}
                    required
                    placeholder={translate.auth.fullNamePlaceholder}
                    disabled={isCheckingAuthentication}
                  />
                  {formSubmitted && displayNameValid && (
                    <div className="text-error-500 text-xs mt-1">{displayNameValid}</div>
                  )}
                </div>
                <div>
                  <Label>
                    {translate.form.email} <span className="text-error-500">*</span>{' '}
                  </Label>
                  <Input
                    name="email"
                    type="email"
                    value={email}
                    onChange={onInputChange}
                    required
                    placeholder={translate.auth.emailPlaceholder}
                    disabled={isCheckingAuthentication}
                  />
                  {formSubmitted && emailValid && (
                    <div className="text-error-500 text-xs mt-1">{emailValid}</div>
                  )}
                </div>
                <div>
                  <Label>
                    {translate.form.password} <span className="text-error-500">*</span>{' '}
                  </Label>
                  <div className="relative">
                    <Input
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={onInputChange}
                      required
                      placeholder={translate.auth.passwordPlaceholder}
                      disabled={isCheckingAuthentication}
                    />
                    <span
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute z-5 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </span>
                  </div>
                  {formSubmitted && passwordValid && (
                    <div className="text-error-500 text-xs mt-1">{passwordValid}</div>
                  )}
                </div>
                <div>
                  <Label>
                    {translate.form.confirmPassword} <span className="text-error-500">*</span>{' '}
                  </Label>
                  <div className="relative">
                    <Input
                      name="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={onInputChange}
                      required
                      placeholder={translate.auth.passwordPlaceholder}
                      disabled={isCheckingAuthentication}
                    />
                    <span
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute z-5 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                    >
                      {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                    </span>
                  </div>
                  {formSubmitted && confirmPasswordValid && (
                    <div className="text-error-500 text-xs mt-1">{confirmPasswordValid}</div>
                  )}
                </div>
                {errorMessage && (
                  <div className="mb-5 mt-2 text-error-500 text-sm font-medium flex items-center gap-2">
                    <FaInfoCircle />
                    <span>{errorMessage}</span>
                  </div>
                )}
                <div className="flex gap-x-4">
                  <Button
                    className="w-full flex items-center justify-center gap-2"
                    size="sm"
                    type="submit"
                    disabled={isCheckingAuthentication}
                  >
                    {translate.auth.signUp}
                  </Button>
                </div>
                <div className="flex items-center justify-end">
                  <RouterLink
                    to="/auth/iniciar-sesion"
                    className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400"
                  >
                    {translate.auth.signInHere}
                  </RouterLink>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
