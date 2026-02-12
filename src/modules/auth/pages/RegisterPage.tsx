import { AuthLayout } from '@/modules/auth/layout/AuthLayout';
import RegisterForm from '@/core/components/auth/RegisterForm';

export const RegisterPage = () => {
  return (
    <AuthLayout>
      <RegisterForm />
    </AuthLayout>
  );
};
