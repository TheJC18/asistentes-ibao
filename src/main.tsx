import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';

import { store } from './store';
import { ThemeProvider } from './context/ThemeContext';

import './index.css';
import { AppTheme } from './theme/AppTheme';
import { AppRouter } from './router/AppRouter';

createRoot(document.getElementById('root')!).render(
  // <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <ThemeProvider>
          <AppTheme>
            <AppRouter />
          </AppTheme> 
        </ThemeProvider>
      </BrowserRouter>
    </Provider>
  // </StrictMode>,
);
