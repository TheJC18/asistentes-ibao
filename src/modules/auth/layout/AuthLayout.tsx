import { ReactNode } from 'react';

interface AuthLayoutProps {
  children: ReactNode;
  title?: string;
  icon?: ReactNode;
}

export const AuthLayout = ({ children, title = '', icon }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-surface">
      <div className="animate-fadein w-full max-w-md p-8 bg-card rounded-lg shadow-md">
        <div className="flex items-center gap-2 mb-6">
          {icon && <div className="text-4xl text-text-primary">{icon}</div>}
          <h1 className="text-4xl font-bold text-text-primary">{title}</h1>
        </div>
        {children}
      </div>
    </div>
  );
};
