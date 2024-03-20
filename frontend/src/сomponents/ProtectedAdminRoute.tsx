import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';

const ProtectedAdminRouteElement = ({
    element,
}: {
    element: React.ReactNode;
}) => {
    const { currentUser } = useSelector((state: RootState) => state.appUsers);

    const admin = currentUser.role === 'admin';

    return admin ? <>{element} </> : <Navigate to='/' replace={true} />;
};

export default ProtectedAdminRouteElement;
