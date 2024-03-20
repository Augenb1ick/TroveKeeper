import React, { useEffect, useState } from 'react';
import UsersTable from '../сomponents/UsersTable';
import { managingUsersApi } from '../utills/api/usersApi';
import { useNavigate } from 'react-router-dom';
import {
    DENIED_ERROR,
    MANAGING_USERS_ERROR_MESSAGE,
    SELF_BAN_MESSAGE,
} from '../utills/constants';
import { UserDataType } from '../types/dataTypes/userData';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import {
    setCurrentUser,
    setIsLoggedIn,
    setUsers,
} from '../redux/slices/usersSlice';
import { handleErrorSnackOpen } from '../redux/slices/snackBarsSlice';

const AdminPanel = () => {
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { currentUser } = useSelector((state: RootState) => state.appUsers);

    const handleLogOut = () => {
        dispatch(setIsLoggedIn(false));
        dispatch(setCurrentUser({} as UserDataType));
        localStorage.clear();
        navigate('/', { replace: true });
    };

    const logOutIfNoAuth = (err: string) => {
        err === DENIED_ERROR && handleLogOut();
    };

    type ActionFunction = (usersIds: string[]) => Promise<void>;

    const handleUsersAction = (
        actionFunction: ActionFunction,
        usersIds: string[],
        postActionCallback?: () => void
    ) => {
        setIsLoading(true);
        actionFunction(usersIds)
            .then(() => {
                postActionCallback && postActionCallback();
                managingUsersApi
                    .getUsersInfo()
                    .then((users) => dispatch(setUsers(users)))
                    .catch((err) => {
                        dispatch(handleErrorSnackOpen(SELF_BAN_MESSAGE));
                        logOutIfNoAuth(err);
                    });
            })
            .catch((err) => {
                dispatch(handleErrorSnackOpen(MANAGING_USERS_ERROR_MESSAGE));
                logOutIfNoAuth(err);
            })
            .finally(() => setIsLoading(false));
    };

    const handleBlockUsers = (usersIds: string[]) => {
        handleUsersAction(managingUsersApi.blockUsers, usersIds, () => {
            if (usersIds.includes(currentUser._id)) {
                handleLogOut();
            }
        });
    };

    const handleUnblockUsers = (usersIds: string[]) => {
        handleUsersAction(managingUsersApi.unblockUsers, usersIds);
    };

    const handleDeleteUsers = (usersIds: string[]) => {
        handleUsersAction(managingUsersApi.deleteUsers, usersIds, () => {
            if (usersIds.includes(currentUser._id)) {
                handleLogOut();
            }
        });
    };

    const handleAssignAdmin = (usersIds: string[]) => {
        handleUsersAction(managingUsersApi.assignAdmin, usersIds);
    };

    const handleDemoteAdmin = (usersIds: string[]) => {
        handleUsersAction(managingUsersApi.demoteAdmin, usersIds, () => {
            if (usersIds.includes(currentUser._id)) {
                handleLogOut();
            }
        });
    };

    const fetchUsersInfo = () => {
        managingUsersApi
            .getUsersInfo()
            .then((users) => dispatch(setUsers(users)))
            .catch((err) => console.error(err));
    };

    useEffect(() => {
        fetchUsersInfo();
    }, []);

    return (
        <UsersTable
            handleAssignAdmin={handleAssignAdmin}
            handleDemoteAdmin={handleDemoteAdmin}
            isLoading={isLoading}
            handleBlockUsers={handleBlockUsers}
            handleDeleteUsers={handleDeleteUsers}
            handleUnblockUsers={handleUnblockUsers}
        />
    );
};

export default AdminPanel;
