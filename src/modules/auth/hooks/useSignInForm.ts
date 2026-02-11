import { useMemo, useState, FormEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { startGoogleSignIn, startLoginWithEmailPassword } from '@/modules/auth/store';
import { RootState, AppDispatch } from '@/core/store';
import { useForm } from '@/core/hooks/useForm';

export function useSignInForm() {
  const dispatch = useDispatch<AppDispatch>();
  const { status, errorMessage } = useSelector((state: RootState) => state.auth);
  const { values, handleChange } = useForm({ email: '', password: '' });
  const { email, password } = values;
  const isCheckingAuthentication = useMemo(() => status === 'checking', [status]);
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    dispatch(startLoginWithEmailPassword({ email, password }));
  };

  const onGoogleSignIn = () => {
    dispatch(startGoogleSignIn());
  };

  return {
    values,
    handleChange,
    email,
    password,
    isCheckingAuthentication,
    showPassword,
    setShowPassword,
    onSubmit,
    onGoogleSignIn,
    errorMessage,
  };
}
