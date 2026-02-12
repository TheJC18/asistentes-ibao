import { useTranslation } from '@/core/context';
import { useSignInForm } from '@/modules/auth/hooks/useSignInForm';
import Input from '../form/input/InputField';
import Label from '../form/Label';
import { Button } from '@/core/components';
import { Spinner } from 'flowbite-react';
import { Link as RouterLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export function SignInForm() {
  const translate = useTranslation();
  const {
    handleChange,
    email,
    password,
    isCheckingAuthentication,
    showPassword,
    setShowPassword,
    onSubmit,
    onGoogleSignIn,
    errorMessage,
  } = useSignInForm();

  return (
    <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
      {/* Overlay con spinner cuando está autenticando */}
      {isCheckingAuthentication && (
        <div className="absolute inset-0 z-5 flex items-center justify-center bg-overlay/60">
          <Spinner aria-label="Verificando si el usuario está logeado" color="info" className="!w-24 !h-24" />
        </div>
      )}
      <div>
        <div>
          <div className="mb-5 sm:mb-8">
            <div className="w-32 h-32 mx-auto mb-10 flex items-center justify-center">
              <img src="/logo.webp" alt="Logo" className="w-full h-full object-contain"/>
            </div>
            <h1 className="mb-2 font-semibold text-text-primary text-title-sm sm:text-title-md">
              {translate.auth.login}
            </h1>
            <p className="text-sm text-text-secondary">
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
                    onChange={handleChange}
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
                      onChange={handleChange}
                      required
                      placeholder={translate.auth.passwordPlaceholder}
                      disabled={isCheckingAuthentication}
                    />
                    <span
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute z-5 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                    >
                      {showPassword ? (
                        <FontAwesomeIcon icon="eye-slash" />
                      ) : (
                        <FontAwesomeIcon icon="eye" />
                      )}
                    </span>
                  </div>
                </div>
                {errorMessage && (
                  <div className="mb-5 mt-2 text-error-500 text-sm font-medium flex items-center gap-2">
                    <FontAwesomeIcon icon="info-circle" />
                    <span>{errorMessage}</span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <RouterLink to="/auth/registro" className="text-sm text-primary hover:text-primary-hover">
                    {translate.auth.createNewAccount}
                  </RouterLink>
                </div>
                <div className="flex gap-x-4">
                  
                  <Button
                    className="w-1/2 flex items-center justify-center gap-2"
                    size="sm"
                    type="submit"
                    disabled={isCheckingAuthentication}
                    startIcon={<FontAwesomeIcon icon="sign-in-alt" />}
                    endIcon={undefined}
                    onClick={undefined}
                  >
                    {translate.auth.signIn}
                  </Button>

                  <Button
                    className="w-1/2 flex items-center justify-center gap-2"
                    size="sm"
                    type="button"
                    onClick={onGoogleSignIn}
                    disabled={isCheckingAuthentication}
                    startIcon={<FontAwesomeIcon icon={["fab", "google"]} />}
                    endIcon={undefined}
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

export default SignInForm;