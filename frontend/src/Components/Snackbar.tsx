import Stack from '@mui/material/Stack';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import { FC, forwardRef } from 'react';
import { useSnackBars } from '../context/SnackBarsContext';
import { AUTO_HIDE_SNACK_DURATION, SNACK_POSITION } from '../utills/constants';

const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert(
    props,
    ref
) {
    return <MuiAlert elevation={6} ref={ref} variant='filled' {...props} />;
});

const Snackbars: FC = () => {
    const {
        successSnackText,
        errorSnackText,
        isSuccessSnackOpen,
        isErrorSnackOpen,
        handleSnacksClose,
    } = useSnackBars();

    const handleClose = (
        event?: React.SyntheticEvent | Event,
        reason?: string
    ) => {
        if (reason === 'clickaway') {
            return;
        }
        handleSnacksClose();
    };

    return (
        <Stack spacing={2} sx={{ width: '100%' }}>
            <Snackbar
                anchorOrigin={SNACK_POSITION}
                open={isSuccessSnackOpen}
                autoHideDuration={AUTO_HIDE_SNACK_DURATION}
                onClose={handleClose}
            >
                <Alert
                    onClose={handleClose}
                    severity='success'
                    sx={{ width: 'fit-content%' }}
                >
                    {successSnackText}
                </Alert>
            </Snackbar>
            <Snackbar
                anchorOrigin={SNACK_POSITION}
                open={isErrorSnackOpen}
                autoHideDuration={AUTO_HIDE_SNACK_DURATION}
                onClose={handleClose}
            >
                <Alert
                    onClose={handleClose}
                    severity='error'
                    sx={{ width: 'fit-content%' }}
                >
                    {errorSnackText}
                </Alert>
            </Snackbar>
        </Stack>
    );
};

export default Snackbars;
