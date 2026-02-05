import { ReactNode } from 'react';

interface AppThemeProps {
  children: ReactNode;
}

export const AppTheme = ({ children }: AppThemeProps) => {
  return <>{children}</>;
};
