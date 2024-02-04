import {
    CssBaseline,
    ThemeProvider,
    createTheme,
    useMediaQuery,
} from '@mui/material';
import React, { createContext, useState, ReactNode, useContext } from 'react';

export const ThemeContext = createContext({
    toggleColorMode: () => {},
    themeMode: 'light',
});

export const ThemeContextProvider: React.FC<{ children: ReactNode }> = ({
    children,
}) => {
    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
    const [themeMode, setThemeMode] = useState<'light' | 'dark'>(
        prefersDarkMode ? 'dark' : 'light'
    );

    const colorMode = React.useMemo(
        () => ({
            toggleColorMode: () => {
                setThemeMode((prevMode) =>
                    prevMode === 'light' ? 'dark' : 'light'
                );
            },
            themeMode,
        }),
        [themeMode]
    );

    const theme = React.useMemo(
        () =>
            createTheme({
                palette: {
                    mode: themeMode,
                },
            }),
        [themeMode]
    );

    return (
        <ThemeContext.Provider value={colorMode}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                {children}
            </ThemeProvider>
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    return context;
};
