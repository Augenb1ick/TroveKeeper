import React, { FC } from 'react';
import { MenuItem, TextField } from '@mui/material';
import { UseFormRegister } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

interface CategoriesMenuProps {
    register?: UseFormRegister<any>;
    disabled?: boolean;
    defaultValue?: string | number;
    onChange?: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
}

const CategoriesMenu: FC<CategoriesMenuProps> = ({
    register,
    disabled,
    defaultValue,
    onChange,
}) => {
    const { t } = useTranslation('translation', {
        keyPrefix: 'myCollections',
    });

    const collectionCategories = [
        { name: t('categorySelectItemNoCategory'), value: 0 },
        { name: t('categorySelectItemBooks'), value: 1 },
        { name: t('categorySelectItemFilms'), value: 2 },
        { name: t('categorySelectItemStamps'), value: 3 },
        { name: t('categorySelectItemOther'), value: 4 },
    ];

    if (!register) {
        return (
            <TextField
                disabled={disabled}
                select
                label={t('categorySelectTitle')}
                defaultValue={defaultValue || 0}
                sx={{ width: 'fit-content' }}
                onChange={onChange}
            >
                {collectionCategories.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                        {option.name}
                    </MenuItem>
                ))}
            </TextField>
        );
    }

    return (
        <TextField
            disabled={disabled}
            select
            label={t('categorySelectTitle')}
            defaultValue={defaultValue || 0}
            sx={{ width: 'fit-content' }}
            {...register('category')}
        >
            {collectionCategories.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                    {option.name}
                </MenuItem>
            ))}
        </TextField>
    );
};

export default CategoriesMenu;
