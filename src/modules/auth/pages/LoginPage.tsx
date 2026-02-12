import { AuthLayout } from '@/modules/auth/layout/AuthLayout';
import SignInForm from '@/core/components/auth/SignInForm';

export const LoginPage = () => {
  return (
    <AuthLayout>
      <SignInForm />
    </AuthLayout>
  );
};
