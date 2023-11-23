import { useState } from 'react';

import { DataGrid, GridColDef, GridRowId } from '@mui/x-data-grid';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import DeleteIcon from '@mui/icons-material/Delete';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import LockOpenOutlinedIcon from '@mui/icons-material/LockOpenOutlined';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import { Typography } from '@mui/material';

import { reformDataFromApi } from '../utills/dataReformer';
import UsersTableProps from '../types/props/UsersTableProps';
import { useUsers } from '../context/UsersContext';
import {
    TABLE_INITIAL_PAGE,
    TABLE_PAGE_SIZE,
    TABLE_PAGE_SIZE_OPTIONS,
} from '../utills/constants';
import { useTranslation } from 'react-i18next';

const UsersTable: React.FC<UsersTableProps> = ({
    handleDeleteUsers,
    handleBlockUsers,
    handleUnblockUsers,
    handleAssignAdmin,
    handleDemoteAdmin,
    isLoading,
}) => {
    const { t } = useTranslation('translation', {
        keyPrefix: 'adminPanel',
    });
    const { users } = useUsers();

    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

    const handleRowClick = (rowId: GridRowId[]) => {
        const selectedUserIds: string[] = rowId.map((id) => id.toString());
        setSelectedUsers(selectedUserIds);
    };

    const onBlockUsers = () => {
        handleBlockUsers(selectedUsers);
    };
    const onUnblockUsers = () => {
        handleUnblockUsers(selectedUsers);
    };
    const onDeleteUsers = () => {
        handleDeleteUsers(selectedUsers);
    };

    const onAssignAdmin = () => {
        handleAssignAdmin(selectedUsers);
    };

    const onDemoteAdmin = () => {
        handleDemoteAdmin(selectedUsers);
    };

    const buttonIsDisabled = !selectedUsers.length || isLoading;

    const usersGridColumns: GridColDef[] = [
        { field: 'id', headerName: t('tableFields.id'), width: 200 },
        { field: 'name', headerName: t('tableFields.name'), width: 120 },
        { field: 'email', headerName: t('tableFields.email'), width: 250 },
        { field: 'regDate', headerName: t('tableFields.regDate'), width: 190 },
        {
            field: 'lastLogin',
            headerName: t('tableFields.lastLogin'),
            width: 190,
        },
        {
            field: 'isBlocked',
            headerName: t('tableFields.isBlocked'),
            width: 190,
        },
        { field: 'role', headerName: t('tableFields.role'), width: 190 },
    ];

    return (
        <div style={{ width: '90%', margin: '20px auto 0 auto' }}>
            <Typography component='h3' variant='h5'>
                {t('title')}
            </Typography>
            <Box sx={{ margin: '10px 0' }}>
                <Box
                    flexDirection='row'
                    gap='10px'
                    display='flex'
                    alignItems='start'
                    flexWrap={'wrap'}
                >
                    <Button
                        disabled={buttonIsDisabled}
                        onClick={onBlockUsers}
                        variant='outlined'
                        startIcon={<LockOutlinedIcon />}
                    >
                        {t('blockButtonText')}
                    </Button>
                    <Button
                        disabled={buttonIsDisabled}
                        onClick={onUnblockUsers}
                        variant='outlined'
                    >
                        <LockOpenOutlinedIcon />
                    </Button>

                    <Button
                        onClick={onAssignAdmin}
                        disabled={buttonIsDisabled}
                        variant='outlined'
                        startIcon={<AdminPanelSettingsIcon />}
                    >
                        {t('assignAdminButtonText')}
                    </Button>
                    <Button
                        onClick={onDemoteAdmin}
                        disabled={buttonIsDisabled}
                        variant='outlined'
                        startIcon={<PersonRemoveIcon />}
                    >
                        {t('demoteAdminButtonText')}
                    </Button>
                    <Button
                        disabled={buttonIsDisabled}
                        onClick={onDeleteUsers}
                        variant='contained'
                        color='error'
                    >
                        <DeleteIcon />
                    </Button>
                </Box>
            </Box>
            <div style={{ width: '100%' }}>
                <DataGrid
                    onRowSelectionModelChange={handleRowClick}
                    rows={reformDataFromApi(users)}
                    columns={usersGridColumns}
                    initialState={{
                        pagination: {
                            paginationModel: {
                                page: TABLE_INITIAL_PAGE,
                                pageSize: TABLE_PAGE_SIZE,
                            },
                        },
                    }}
                    pageSizeOptions={TABLE_PAGE_SIZE_OPTIONS}
                    checkboxSelection
                />
            </div>
        </div>
    );
};

export default UsersTable;
