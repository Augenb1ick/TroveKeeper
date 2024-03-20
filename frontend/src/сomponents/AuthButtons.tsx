import { Box, Button, Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { setIsLoggedIn } from '../redux/slices/usersSlice';

const AuthButtons = () => {
    const dispatch = useDispatch();

    const { isLoggedIn } = useSelector((state: RootState) => state.appUsers);
    const navigate = useNavigate();
    const { t } = useTranslation('translation', { keyPrefix: 'header' });

    const handleLogOut = () => {
        dispatch(setIsLoggedIn(false));
        localStorage.clear();
        navigate('/', { replace: true });
        window.location.reload();
    };
    return (
        <Box sx={{ flexGrow: 0, ml: '10px', order: 4 }}>
            {!isLoggedIn ? (
                <>
                    <Stack
                        sx={{ display: { xs: 'none', sm: 'flex' } }}
                        direction='row'
                        spacing={1}
                    >
                        <Button
                            onClick={() => navigate('/signin')}
                            variant='outlined'
                        >
                            {t('signin')}
                        </Button>
                        <Button
                            onClick={() => navigate('/signup')}
                            variant='contained'
                        >
                            {t('signup')}
                        </Button>
                    </Stack>
                    <Button
                        onClick={() => navigate('/signin')}
                        sx={{
                            minWidth: 0,
                            display: { xs: 'flex', sm: 'none' },
                        }}
                        variant='contained'
                    >
                        <LoginIcon />
                    </Button>
                </>
            ) : (
                <Button
                    sx={{ minWidth: 0, p: 1, gap: 1 }}
                    variant='contained'
                    onClick={handleLogOut}
                >
                    <Typography
                        sx={{
                            display: { xs: 'none', sm: 'block' },
                        }}
                    >
                        {t('logout')}
                    </Typography>
                    <LogoutIcon />
                </Button>
            )}
        </Box>
    );
};

export default AuthButtons;
