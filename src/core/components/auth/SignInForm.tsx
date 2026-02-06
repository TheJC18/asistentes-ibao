import { useMemo, useState, FormEvent } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FaEye, FaEyeSlash, FaInfoCircle, FaGoogle, FaSignInAlt } from 'react-icons/fa';
import { Spinner } from 'flowbite-react';
import { useForm } from '@/core/hooks/useForm';
import { useTranslation } from '@/core/context/LanguageContext';
import Label from '@/core/components/form/Label';
import Input from '@/core/components/form/input/InputField';
import Button from '@/core/components/ui/button/Button';
import { startGoogleSignIn, startLoginWithEmailPassword } from '@/modules/auth/store';
import { RootState, AppDispatch } from '@/core/store';

interface SignInFormData {
  email: string;
  password: string;
}

// Mueve formData fuera del componente para evitar bucles infinitos
const formData: SignInFormData = { email: '', password: '' };

export default function SignInForm() {
  const dispatch = useDispatch<AppDispatch>();
  const { status, errorMessage } = useSelector((state: RootState) => state.auth);
  const translate = useTranslation();

  // Usa el formData definido fuera del componente
  const { formState, onInputChange } = useForm(formData);
  const { email, password } = formState;
  const isCheckingAuthentication = useMemo(() => status === 'checking', [status]);
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    dispatch(startLoginWithEmailPassword({ email, password }));
  };

  const onGoogleSignIn = () => {
    dispatch(startGoogleSignIn());
  };

  return (
    <div className="flex flex-col flex-1 relative">
      {/* Overlay con spinner cuando está autenticando */}
      {isCheckingAuthentication && (
        <div className="absolute inset-0 z-5 flex items-center justify-center bg-black bg-opacity-40">
          <Spinner aria-label="Verificando si el usuario está logeado" color="info" className="!w-24 !h-24" />
        </div>
      )}
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <div className="w-32 h-32 mx-auto mb-10 flex items-center justify-center">
              <img src="/logo.webp" alt="Logo" className="w-full h-full object-contain"/>
            </div>
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              {translate.auth.login}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {translate.auth.enterCredentials}
            </p>
          </div>
          <div>
            <form onSubmit={onSubmit}>
              <div className="space-y-6">
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
                </div>
                {errorMessage && (
                  <div className="mb-5 mt-2 text-error-500 text-sm font-medium flex items-center gap-2">
                    <FaInfoCircle />
                    <span>{errorMessage}</span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <RouterLink
                    to="/auth/registro"
                    className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400"
                  >
                    {translate.auth.createNewAccount}
                  </RouterLink>
                </div>
                <div className="flex gap-x-4">
                  
                  <Button
                    className="w-1/2 flex items-center justify-center gap-2"
                    size="sm"
                    type="submit"
                    disabled={isCheckingAuthentication}
                    startIcon={<FaSignInAlt />}
                  >
                    {translate.auth.signIn}
                  </Button>

                  <Button
                    className="w-1/2 flex items-center justify-center gap-2"
                    size="sm"
                    type="button"
                    onClick={onGoogleSignIn}
                    disabled={isCheckingAuthentication}
                    startIcon={<FaGoogle />}
                  >
                    {translate.auth.google}
                  </Button>

                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
