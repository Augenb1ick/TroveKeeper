import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

const Preloader = () => {
    return (
        <Box sx={{ display: 'flex', width: '100%', height: '50vh' }}>
            <CircularProgress sx={{ m: 'auto' }} />
        </Box>
    );
};

export default Preloader;
