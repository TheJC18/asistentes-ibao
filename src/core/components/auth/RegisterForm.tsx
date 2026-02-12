import { Link as RouterLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useTranslation } from '@/core/context';
import { useRegisterForm } from '@/modules/auth/hooks/useRegisterForm';
import Input from '../form/input/InputField';
import Label from '../form/Label';
import { Button } from '@/core/components';

export function RegisterForm() {
  const translate = useTranslation();
  const {
    errors,
    handleChange,
    displayName,
    email,
    password,
    confirmPassword,
    isCheckingAuthentication,
    formSubmitted,
    showPassword,
    setShowPassword,
    showConfirmPassword,
    setShowConfirmPassword,
    onSubmit,
    errorMessage,
  } = useRegisterForm();

  return (
    <div className="flex flex-col flex-1">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <div className="w-32 h-32 mx-auto mb-10 flex items-center justify-center">
              <img src="/logo.webp" alt="Logo" className="w-full h-full object-contain"/>
            </div>
            <h1 className="mb-2 font-semibold text-text-primary text-title-sm sm:text-title-md">
              {translate.auth.signUp}
            </h1>
            <p className="text-sm text-text-secondary">
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
                    onChange={handleChange}
                    required
                    placeholder={translate.auth.fullNamePlaceholder}
                    disabled={isCheckingAuthentication}
                  />
                  {formSubmitted && errors.displayName && (
                    <div className="text-error-500 text-xs mt-1">{errors.displayName}</div>
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
                    onChange={handleChange}
                    required
                    placeholder={translate.auth.emailPlaceholder}
                    disabled={isCheckingAuthentication}
                  />
                  {formSubmitted && errors.email && (
                    <div className="text-error-500 text-xs mt-1">{errors.email}</div>
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
                      onChange={handleChange}
                      required
                      placeholder={translate.auth.passwordPlaceholder}
                      disabled={isCheckingAuthentication}
                    />
                    <span
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute z-5 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                    >
                      {showPassword ? <FontAwesomeIcon icon="eye-slash" /> : <FontAwesomeIcon icon="eye" />
}
                    </span>
                  </div>
                  {formSubmitted && errors.password && (
                    <div className="text-error-500 text-xs mt-1">{errors.password}</div>
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
                      onChange={handleChange}
                      required
                      placeholder={translate.auth.passwordPlaceholder}
                      disabled={isCheckingAuthentication}
                    />
                    <span
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute z-5 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                    >
                      {showConfirmPassword ? <FontAwesomeIcon icon="eye-slash" /> : <FontAwesomeIcon icon="eye" />
}
                    </span>
                  </div>
                  {formSubmitted && errors.confirmPassword && (
                    <div className="text-error-500 text-xs mt-1">{errors.confirmPassword}</div>
                  )}
                </div>
                {errorMessage && (
                  <div className="mb-5 mt-2 text-error-500 text-sm font-medium flex items-center gap-2">
                    <FontAwesomeIcon icon="info-circle" />
                    <span>{errorMessage}</span>
                  </div>
                )}
                <div className="flex gap-x-4">
                  <Button
                    className="w-full flex items-center justify-center gap-2"
                    size="sm"
                    type="submit"
                    disabled={isCheckingAuthentication}
                    startIcon={null}
                    endIcon={null}
                    onClick={undefined}
                  >
                    {translate.auth.signUp}
                  </Button>
                </div>
                <div className="flex items-center justify-end">
                  <RouterLink
                    to="/auth/iniciar-sesion"
                    className="text-sm text-primary hover:text-primary-hover"
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

export default RegisterForm;
