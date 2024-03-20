import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App';
import i18n from './configs/i18n/i18n';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { ThemeContextProvider } from './theme/ThemeContext';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { store } from './redux/store';

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);
root.render(
    <React.StrictMode>
        <BrowserRouter>
            <Provider store={store}>
                <I18nextProvider i18n={i18n}>
                    <ThemeContextProvider>
                        <App />
                    </ThemeContextProvider>
                </I18nextProvider>
            </Provider>
        </BrowserRouter>
    </React.StrictMode>
);
