import React from 'react';
import { HEADER_MENU_ITEMS } from '../utills/constants';
import {
    Box,
    Button,
    IconButton,
    Menu,
    MenuItem,
    Typography,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useUsers } from '../context/UsersContext';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { inherits } from 'util';

const NavMenu = () => {
    const { t } = useTranslation('translation', { keyPrefix: 'header' });
    const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
        null
    );

    const navigate = useNavigate();

    const { currentUser } = useUsers();
    const role = currentUser.role;

    const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElNav(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const headerMenuItems = [
        {
            name: t('home'),
            route: '/',
            allowed: ['user', 'admin', ''],
        },
        {
            name: t('allCollections'),
            route: '/all-collections',
            allowed: ['user', 'admin', ''],
        },
        {
            name: t('myCollections'),
            route: '/my-collections',
            allowed: ['user', 'admin'],
        },
        {
            name: t('adminPanel'),
            route: '/admin-panel',
            allowed: ['admin'],
        },
    ];

    const visibleMenuItems = headerMenuItems.filter((page) => {
        if (page.allowed.includes(role)) {
            return page;
        }
    });

    return (
        <>
            <Box
                sx={{
                    flexGrow: 1,
                    order: 1,
                    display: { xs: 'flex', md: 'none' },
                }}
            >
                <IconButton
                    size='large'
                    aria-controls='menu-appbar'
                    aria-haspopup='true'
                    onClick={handleOpenNavMenu}
                    color='inherit'
                >
                    <MenuIcon />
                </IconButton>
                <Menu
                    id='menu-appbar'
                    anchorEl={anchorElNav}
                    color={'primary'}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                    keepMounted
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'left',
                    }}
                    open={Boolean(anchorElNav)}
                    onClose={handleCloseNavMenu}
                    sx={{
                        display: { xs: 'block', md: 'none' },
                    }}
                >
                    {visibleMenuItems.map((page) => (
                        <MenuItem key={page.name} onClick={handleCloseNavMenu}>
                            <Typography
                                onClick={() => navigate(page.route)}
                                textAlign='center'
                            >
                                {page.name}
                            </Typography>
                        </MenuItem>
                    ))}
                </Menu>
            </Box>
            <Box
                sx={{
                    flexGrow: 1,
                    display: { xs: 'none', md: 'flex' },
                }}
            >
                {visibleMenuItems.map((page) => (
                    <Button
                        key={page.name}
                        onClick={() => navigate(page.route)}
                        sx={{ my: 2, display: 'block' }}
                    >
                        {page.name}
                    </Button>
                ))}
            </Box>
        </>
    );
};

export default NavMenu;
