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
import { UsersProvider } from './context/UsersContext';
import { SnackBarsProvider } from './context/SnackBarsContext';
import { CollectionsProvider } from './context/CollectionsContext';
import { TagsProvider } from './context/TagsContext';
import { ItemsProvider } from './context/ItemsContext';
import { ThemeContextProvider } from './context/ThemeContext';
import { SearchProvider } from './context/SearchContext';
import { I18nextProvider } from 'react-i18next';

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);
root.render(
    <React.StrictMode>
        <I18nextProvider i18n={i18n}>
            <ThemeContextProvider>
                <SearchProvider>
                    <UsersProvider>
                        <TagsProvider>
                            <CollectionsProvider>
                                <ItemsProvider>
                                    <SnackBarsProvider>
                                        <BrowserRouter>
                                            <App />
                                        </BrowserRouter>
                                    </SnackBarsProvider>
                                </ItemsProvider>
                            </CollectionsProvider>
                        </TagsProvider>
                    </UsersProvider>
                </SearchProvider>
            </ThemeContextProvider>
        </I18nextProvider>
    </React.StrictMode>
);
