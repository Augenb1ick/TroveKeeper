import { Box, Button, Typography } from '@mui/material';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
    const navigate = useNavigate();
    const { t } = useTranslation('translation', { keyPrefix: 'notFound' });

    return (
        <Box
            height='calc(100vh - 68.5px)'
            display='flex'
            flexDirection='column'
            maxWidth='350px'
            margin='auto'
            alignItems='center'
            justifyContent='center'
            gap='10px'
        >
            <Typography variant='h1' component='h1'>
                404
            </Typography>
            <Typography sx={{ maxWidth: '320px', textAlign: 'center' }}>
                {t('text')}
            </Typography>
            <Button onClick={() => navigate('/')} variant='contained'>
                {t('buttonText')}
            </Button>
        </Box>
    );
};

export default NotFound;
