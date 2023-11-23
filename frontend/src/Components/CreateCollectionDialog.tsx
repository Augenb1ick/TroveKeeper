import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Box, MenuItem } from '@mui/material';
import { RegisterOptions, SubmitHandler, useForm } from 'react-hook-form';
import { CollectionDataType } from '../types/dataTypes/CollectionDataType';
import { DialogFormValues } from './CollectionDialog';
import {
    CREATE_COLLECTION_DIALOG_TEXT,
    CREATE_COLLECTION_DIALOG_TITLE,
} from '../utills/constants';
import AddPosterComponent from './AddPosterComponent';
import { NAME_VALIDATION_CONFIG } from '../configs/validationConfig';
import { useTranslation } from 'react-i18next';
import CategoriesMenu from './CategoriesMenu';

interface CreateCollectionDialogProps {
    isOpen: boolean;
    handleClose: () => void;
    handleSubmitDialog: (dialogData: CollectionDataType) => void;
}

const CreateCollectionDialog: React.FC<CreateCollectionDialogProps> = ({
    isOpen,
    handleClose,
    handleSubmitDialog,
}) => {
    const { t } = useTranslation('translation', {
        keyPrefix: 'myCollections',
    });
    const {
        register,
        formState: { errors, isValid },
        handleSubmit,
        reset,
        setValue,
    } = useForm<DialogFormValues>({ mode: 'onChange' });

    const [collectionPoster, setCollectionPoster] = React.useState('');

    const onSubmit: SubmitHandler<CollectionDataType | DialogFormValues> = (
        data
    ) => {
        handleSubmitDialog(data as CollectionDataType);
        reset();
    };

    React.useEffect(() => {
        setValue('poster', collectionPoster);
    }, [collectionPoster]);

    return (
        <React.Fragment>
            <Dialog
                open={isOpen}
                onClose={() => {
                    handleClose();
                    reset();
                }}
            >
                <Box component='form' onSubmit={handleSubmit(onSubmit)}>
                    <DialogTitle>{t('dialogTitle')}</DialogTitle>
                    <DialogContent>
                        <DialogContentText>{t('dialogText')}</DialogContentText>
                        <TextField
                            {...register('name', {
                                required: t('inputRequired'),
                            })}
                            label={t('nameInput')}
                            error={!!errors.name?.message}
                            helperText={(errors.name?.message as string) || ''}
                            autoFocus
                            margin='dense'
                            fullWidth
                            variant='standard'
                        />
                        <TextField
                            {...register('description', {
                                required: t('inputRequired'),
                            })}
                            label={t('descriptionInput')}
                            error={!!errors.description?.message}
                            helperText={
                                (errors.description?.message as string) || ''
                            }
                            autoFocus
                            margin='dense'
                            fullWidth
                            variant='standard'
                        />
                        <Box
                            display='flex'
                            gap={2}
                            mt='30px'
                            justifyContent='space-between'
                        >
                            <AddPosterComponent
                                getPoster={(poster) =>
                                    setCollectionPoster(poster)
                                }
                            />
                            <input
                                {...register('poster')}
                                hidden
                                value={collectionPoster}
                            />

                            <CategoriesMenu register={register} />
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Button disabled={!isValid} type='submit'>
                            {t('dialogButton')}
                        </Button>
                    </DialogActions>
                </Box>
            </Dialog>
        </React.Fragment>
    );
};

export default CreateCollectionDialog;
