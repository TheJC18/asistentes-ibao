import SignInForm from '../../../components/auth/SignInForm';
import { AuthLayout } from '../layout/AuthLayout';

export const LoginPage = () => {
  return (
    <AuthLayout>
      <SignInForm />
    </AuthLayout>
  );
};
