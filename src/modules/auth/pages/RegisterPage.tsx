import RegisterForm from '@/core/components/auth/RegisterForm';
import { AuthLayout } from '@/modules/auth/layout/AuthLayout';

export const RegisterPage = () => {
  return (
    <AuthLayout>
      <RegisterForm />
    </AuthLayout>
  );
};
