import { Box, Button, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const Main = () => {
    const navigate = useNavigate();
    const { t } = useTranslation('translation', { keyPrefix: 'main' });

    return (
        <Box
            width='90%'
            p='40px 0'
            margin='auto'
            display='flex'
            justifyContent='space-between'
            gap='50px'
        >
            <Box
                display='flex'
                flexDirection='column'
                justifyContent='center'
                alignItems={{ xs: 'center', sm: 'start' }}
                gap='20px'
            >
                <Typography
                    maxWidth='650px'
                    variant='h4'
                    component='h1'
                    sx={{ textAlign: { xs: 'center', sm: 'start' } }}
                >
                    {t('mainTitle')}
                </Typography>
                <Typography
                    maxWidth='650px'
                    sx={{ textAlign: { xs: 'center', sm: 'start' } }}
                >
                    {t('mainText')}
                </Typography>
                <Button
                    onClick={() => navigate('/all-collections')}
                    variant='outlined'
                >
                    {t('browseButton')}
                </Button>
            </Box>
            <img
                style={{
                    maxHeight: '550px',
                    minHeight: '400px',
                    width: '40vw',
                    objectFit: 'cover',
                    margin: 'auto 0',
                    borderRadius: '8px',
                }}
                src={require('../images/main-image.jpg')}
                alt=''
            />
            <style>{`
                @media (max-width: 700px) {
                    img {
                        display: none;
                    }
                }
            `}</style>
        </Box>
    );
};

export default Main;
