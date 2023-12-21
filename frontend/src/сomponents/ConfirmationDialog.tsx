import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';

import DialogTitle from '@mui/material/DialogTitle';
import { Box } from '@mui/material';

import { useTranslation } from 'react-i18next';

interface ConfirmationDialogProps {
    isOpen: boolean;
    handleClose: () => void;
    handleConfirm: () => void;
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
    isOpen,
    handleClose,
    handleConfirm,
}) => {
    const { t } = useTranslation('translation', {
        keyPrefix: 'deleteCollectionDialog',
    });
    return (
        <React.Fragment>
            <Dialog open={isOpen} onClose={handleClose}>
                <Box>
                    <DialogTitle textAlign={'center'} maxWidth={300}>
                        {t('text')}
                    </DialogTitle>
                    <DialogActions>
                        <Button
                            onClick={handleConfirm}
                            autoFocus
                            type='submit'
                            fullWidth
                            variant='contained'
                        >
                            {t('buttonText')}
                        </Button>
                    </DialogActions>
                </Box>
            </Dialog>
        </React.Fragment>
    );
};

export default ConfirmationDialog;
