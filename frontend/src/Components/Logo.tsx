import { Box, Typography } from '@mui/material';
import CollectionsIcon from '@mui/icons-material/Collections';

import React from 'react';
import { useNavigate } from 'react-router-dom';

const Logo = () => {
    const navigate = useNavigate();
    return (
        <Box
            onClick={() => navigate('/')}
            gap='5px'
            alignItems='center'
            order={{ xs: 2, md: 0 }}
            flexGrow={1}
            mr={2}
            ml={{ xs: 2, sm: 0 }}
            sx={{ cursor: 'pointer', display: { xs: 'none', sm: 'flex' } }}
        >
            <CollectionsIcon />
            <Typography
                variant='h6'
                noWrap
                sx={{
                    fontFamily: 'monospace',
                    fontWeight: 700,
                    display: { xs: 'block', md: 'none' },
                }}
            >
                TK
            </Typography>
            <Typography
                variant='h6'
                noWrap
                sx={{
                    fontFamily: 'monospace',
                    fontWeight: 700,
                    display: { xs: 'none', lg: 'block' },
                }}
            >
                TroveKeeper
            </Typography>
        </Box>
    );
};

export default Logo;
