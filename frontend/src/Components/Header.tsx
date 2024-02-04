import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import SearchInput from './SearchInput';
import Logo from './Logo';
import NavMenu from './NavMenu';
import AuthButtons from './AuthButtons';
import { Box, IconButton } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useTheme } from '../context/ThemeContext';
import ChangeLanguageButtons from './ChangeLanguageButtons';

const Header = () => {
    const { toggleColorMode, themeMode } = useTheme();

    return (
        <AppBar
            position='relative'
            sx={{ maxWidth: '100%' }}
            color='transparent'
        >
            <Box width='90%' m={'auto'}>
                <Toolbar disableGutters>
                    <Logo />
                    <NavMenu />
                    <IconButton
                        sx={{ order: 2 }}
                        onClick={toggleColorMode}
                        color='inherit'
                    >
                        {themeMode === 'dark' ? (
                            <Brightness7Icon />
                        ) : (
                            <Brightness4Icon />
                        )}
                    </IconButton>
                    <Box order={3} mr={1}>
                        <ChangeLanguageButtons />
                    </Box>
                    <SearchInput />
                    <AuthButtons />
                </Toolbar>
            </Box>
        </AppBar>
    );
};
export default Header;
