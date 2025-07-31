import { useMemo, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FaEye, FaEyeSlash, FaInfoCircle } from 'react-icons/fa';

import { useForm } from '../../hooks/useForm';
import Label from '../form/Label';
import Input from '../form/input/InputField';
import Button from '../ui/button/Button';
import { startCreatingUserWithEmailPassword } from '../../modules/auth/store';

// Datos iniciales del formulario
const formData = { displayName: '', email: '', password: '', confirmPassword: '' };

// Validaciones del formulario
const formValidations = {
  email: [ (value) => value.includes('@'), 'El correo debe tener una @' ],
  password: [ (value) => value.length >= 6, 'La contraseña debe tener al menos 6 caracteres' ],
  displayName: [ (value) => value.length >= 1, 'El nombre es obligatorio' ],
  confirmPassword: [ (value, formState) => value === formState.password, 'Las contraseñas deben coincidir' ]
};

export default function RegisterForm() {
  const dispatch = useDispatch();
  const { status, errorMessage } = useSelector(state => state.auth);
  const isCheckingAuthentication = useMemo(() => status === 'checking', [status]);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    formState,
    displayName,
    email,
    password,
    confirmPassword,
    onInputChange,
    isFormValid,
    displayNameValid,
    emailValid,
    passwordValid,
    confirmPasswordValid,
  } = useForm(formData, formValidations);

  const onSubmit = (event) => {
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
            <img src="/logo.svg" alt="Logo" className="w-32 h-32 mx-auto mb-10 rounded-full border-2 border-brand-500"/>
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Crear cuenta
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Regístrate con tus datos
            </p>
          </div>
          <div>
            <form onSubmit={onSubmit}>
              <div className="space-y-6">
                <div>
                  <Label>
                    Nombre completo <span className="text-error-500">*</span>{' '}
                  </Label>
                  <Input
                    name="displayName"
                    type="text"
                    value={displayName}
                    onChange={onInputChange}
                    required
                    placeholder="Nombre completo"
                    disabled={isCheckingAuthentication}
                  />
                  {formSubmitted && displayNameValid && (
                    <div className="text-error-500 text-xs mt-1">{displayNameValid}</div>
                  )}
                </div>
                <div>
                  <Label>
                    Correo <span className="text-error-500">*</span>{' '}
                  </Label>
                  <Input
                    name="email"
                    type="email"
                    value={email}
                    onChange={onInputChange}
                    required
                    placeholder="Correo electrónico"
                    disabled={isCheckingAuthentication}
                  />
                  {formSubmitted && emailValid && (
                    <div className="text-error-500 text-xs mt-1">{emailValid}</div>
                  )}
                </div>
                <div>
                  <Label>
                    Contraseña <span className="text-error-500">*</span>{' '}
                  </Label>
                  <div className="relative">
                    <Input
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={onInputChange}
                      required
                      placeholder="Contraseña"
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
                    Confirmar Contraseña <span className="text-error-500">*</span>{' '}
                  </Label>
                  <div className="relative">
                    <Input
                      name="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={onInputChange}
                      required
                      placeholder="Contraseña"
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
                    Crear cuenta
                  </Button>
                </div>
                <div className="flex items-center justify-end">
                  <RouterLink
                    to="/auth/iniciar-sesion"
                    className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400"
                  >
                    Inicia sesión aquí
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