import React, { FC, useState } from 'react';
import { TextField, Typography, TypographyTypeMap } from '@mui/material';
import Markdown from 'marked-react';

interface EditableFieldProps {
    initialValue: string;
    onUpdate: (value: string) => void;
    typographyVariant?: TypographyTypeMap['props']['variant'];
    disabled: boolean;
}

const EditableField: FC<EditableFieldProps> = ({
    initialValue,
    onUpdate,
    typographyVariant,
    disabled,
}) => {
    const [value, setValue] = useState(initialValue);
    const [isEditing, setIsEditing] = useState(false);
    const [editedValue, setEditedValue] = useState('');

    const handleClick = () => {
        if (disabled) return;
        setIsEditing(true);
        setEditedValue(value);
    };

    const handleUpdate = () => {
        if (editedValue === '') return;
        setValue(editedValue);
        onUpdate(editedValue);
        setIsEditing(false);
    };

    const handleEnterDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === 'Enter') {
            handleUpdate();
        }
    };

    return (
        <div>
            {isEditing ? (
                <TextField
                    variant='standard'
                    margin='dense'
                    sx={{ minWidth: '400px' }}
                    value={editedValue}
                    onChange={(e) => setEditedValue(e.target.value)}
                    onBlur={handleUpdate}
                    onKeyDown={handleEnterDown}
                    autoFocus
                    multiline
                />
            ) : (
                <Typography
                    sx={{
                        cursor: `${!disabled && 'pointer'}`,
                        maxWidth: '700px',
                    }}
                    component={'h2'}
                    variant={typographyVariant || undefined}
                    onClick={handleClick}
                >
                    <Markdown value={value} />
                </Typography>
            )}
        </div>
    );
};

export default EditableField;
