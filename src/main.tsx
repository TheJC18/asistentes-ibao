import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';

import { store } from '@/core/store';
import { ThemeProvider } from '@/core/context/ThemeContext';
import { LanguageProvider } from '@/core/context/LanguageContext';

import './index.css';
import { AppTheme } from '@/theme/AppTheme';
import { AppRouter } from '@/router/AppRouter';

createRoot(document.getElementById('root')!).render(
  // <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <ThemeProvider>
          <LanguageProvider>
            <AppTheme>
              <AppRouter />
            </AppTheme>
          </LanguageProvider>
        </ThemeProvider>
      </BrowserRouter>
    </Provider>
  // </StrictMode>,
);
