import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Box, Checkbox, FormControlLabel, MenuItem } from '@mui/material';
import { SubmitHandler, useForm } from 'react-hook-form';
import {
    DialogSelectField,
    DialogSelectItem,
    DialogSelectsFields,
} from '../types/dataTypes/DialogSelectsFields';
import CreatableSelect from 'react-select/creatable';
import { Fragment, useEffect, useState } from 'react';
import { tagsApi } from '../utills/api/tagsApi';
import { ItemType, TableField } from './ItemsTable';
import { useTheme } from '../context/ThemeContext';
import { DARK_THEME_CREATABLE_SELECT_STYLES } from '../utills/constants';
import { useTranslation } from 'react-i18next';

export type DialogFormValues = {
    [x: string]: any;
};

interface FormDialogProps {
    isOpen: boolean;
    handleClose: () => void;
    handleSubmitDialog: (dialogData: DialogFormValues) => void;
    dialogTitle: string;
    dialogText: string;
    dialogBtnAltText?: string;
    dialogInputs: TableField[];
    dialogInputsDefaultValues?: ItemType | undefined;
    dialogSelects?: DialogSelectsFields;
    isDialogTags?: boolean;
    allTags?: string[];
}

const CollectionDialog: React.FC<FormDialogProps> = ({
    isOpen,
    handleClose,
    handleSubmitDialog,
    dialogTitle,
    dialogText,
    dialogInputs,
    dialogInputsDefaultValues,
    dialogBtnAltText,
    dialogSelects,
    isDialogTags,
    allTags,
}) => {
    const { t } = useTranslation('translation', {
        keyPrefix: 'collection.dialogs',
    });
    const {
        register,
        formState: { errors, isValid },
        handleSubmit,
        reset,
        setValue,
    } = useForm<DialogFormValues>({ mode: 'onChange' });

    const { themeMode } = useTheme();

    const onSubmit: SubmitHandler<DialogFormValues> = (data) => {
        handleSubmitDialog(data);
        reset();
    };

    const getDefaultValue = (key: string) => {
        if (dialogInputsDefaultValues && key in dialogInputsDefaultValues) {
            return dialogInputsDefaultValues[key];
        }
        return '';
    };

    const [tagsOptions, setTagsOptions] = useState([{}]);
    const [defaultTags, setDefaultTags] = useState([{}]);

    useEffect(() => {
        if (!isDialogTags) return;

        if (allTags) {
            const formattedTags = allTags.map((tag: any) => ({
                value: tag,
                label: tag.charAt(0).toUpperCase() + tag.slice(1),
            }));
            setTagsOptions(formattedTags);
        }
        const defTags = dialogInputsDefaultValues?.tags as string[] | undefined;

        const formattedDefTags = defTags?.map((tag) => ({
            value: tag,
            label: tag.charAt(0).toUpperCase() + tag.slice(1),
        }));

        if (!formattedDefTags) return;
        setDefaultTags(formattedDefTags);
    }, []);

    return (
        <Fragment>
            <Dialog
                open={isOpen}
                onClose={() => {
                    handleClose();
                    reset();
                }}
            >
                <Box component='form' onSubmit={handleSubmit(onSubmit)}>
                    <DialogTitle>{dialogTitle}</DialogTitle>
                    <DialogContent sx={{ minHeight: '200px' }}>
                        <Box
                            flexDirection={'column'}
                            display={'flex'}
                            alignItems={'strech'}
                            gap={'20px'}
                        >
                            <DialogContentText>{dialogText}</DialogContentText>
                            {isDialogTags && (
                                <CreatableSelect
                                    formatCreateLabel={(inputValue) =>
                                        `${t('tags.create')} ${inputValue}`
                                    }
                                    isMulti
                                    placeholder={t('tags.placeholder')}
                                    options={tagsOptions}
                                    maxMenuHeight={100}
                                    styles={
                                        themeMode === 'dark'
                                            ? DARK_THEME_CREATABLE_SELECT_STYLES
                                            : undefined
                                    }
                                    onChange={(value) =>
                                        setValue('tags', value)
                                    }
                                    defaultValue={
                                        Object.keys(defaultTags[0] || [])
                                            .length && defaultTags
                                    }
                                />
                            )}
                        </Box>
                        {dialogInputs.map((item) => (
                            <>
                                {item.type === 'checkbox' ? (
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                {...register(item.field)}
                                                defaultChecked={
                                                    getDefaultValue(
                                                        item.field
                                                    ) === 'true' || false
                                                }
                                                name={item.field}
                                            />
                                        }
                                        label={item.headerName}
                                        key={item.id}
                                    />
                                ) : (
                                    <TextField
                                        type={item.type}
                                        key={item.id}
                                        multiline={item.type === 'text'}
                                        {...register(item.field, {
                                            required: {
                                                value: item.isRequired || false,
                                                message: t('requiredField'),
                                            },
                                        })}
                                        autoComplete='off'
                                        label={item.headerName}
                                        error={!!errors?.[item.field]?.message}
                                        helperText={
                                            (errors?.[item.field]
                                                ?.message as string) || ''
                                        }
                                        autoFocus
                                        defaultValue={getDefaultValue(
                                            item.field
                                        )}
                                        margin='dense'
                                        fullWidth
                                        InputLabelProps={{ shrink: true }}
                                        variant='standard'
                                        sx={{
                                            display: `${
                                                item.field === 'tags' ||
                                                item.field === 'id'
                                                    ? 'none'
                                                    : 'block'
                                            }`,
                                        }}
                                    />
                                )}
                            </>
                        ))}

                        {dialogSelects?.map(
                            (select: DialogSelectField, index: number) => (
                                <TextField
                                    {...register(select.selectName)}
                                    key={index}
                                    select
                                    label={select.label}
                                    margin='dense'
                                    fullWidth
                                    defaultValue={select.defaultValue}
                                    variant='standard'
                                    sx={{ minWidth: '200px' }}
                                    onChange={(event) =>
                                        setValue(
                                            select.label,
                                            event.target.value
                                        )
                                    }
                                >
                                    {select.selectItems.map(
                                        (item: DialogSelectItem) => (
                                            <MenuItem
                                                key={item.index}
                                                value={item.value}
                                            >
                                                {item.name}
                                            </MenuItem>
                                        )
                                    )}
                                </TextField>
                            )
                        )}
                    </DialogContent>

                    <DialogActions>
                        <Button disabled={!isValid} type='submit'>
                            {dialogBtnAltText || 'Add'}
                        </Button>
                    </DialogActions>
                </Box>
            </Dialog>
        </Fragment>
    );
};

export default CollectionDialog;
