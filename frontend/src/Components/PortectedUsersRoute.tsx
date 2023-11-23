import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUsers } from '../context/UsersContext';

const ProtectedUsersRouteElement = ({
    element,
}: {
    element: React.ReactNode;
}) => {
    const { isLoggedIn } = useUsers();

    return isLoggedIn ? <>{element} </> : <Navigate to='/' replace={true} />;
};

export default ProtectedUsersRouteElement;
