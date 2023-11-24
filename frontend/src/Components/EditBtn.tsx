import { Button } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import React from 'react';

const EditBtn = () => {
    return (
        <Button
            sx={{
                color: 'black',
                padding: 0,
                margin: 0,
                position: 'absolute',
                top: '0',
                right: '-15px',
                minWidth: '15px',
            }}
        >
            <EditIcon sx={{ width: '15px' }} />
        </Button>
    );
};

export default EditBtn;
