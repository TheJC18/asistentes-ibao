import SignInForm from '@/core/components/auth/SignInForm';
import { AuthLayout } from '@/modules/auth/layout/AuthLayout';

export const LoginPage = () => {
  return (
    <AuthLayout>
      <SignInForm />
    </AuthLayout>
  );
};
