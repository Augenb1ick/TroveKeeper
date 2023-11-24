import React from 'react';
import { useUsers } from '../context/UsersContext';
import { Navigate } from 'react-router-dom';

const ProtectedAdminRouteElement = ({
    element,
}: {
    element: React.ReactNode;
}) => {
    const { currentUser } = useUsers();
    const admin = currentUser.role === 'admin';

    return admin ? <>{element} </> : <Navigate to='/' replace={true} />;
};

export default ProtectedAdminRouteElement;
