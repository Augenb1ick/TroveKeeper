import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';

const ProtectedUsersRouteElement = ({
    element,
}: {
    element: React.ReactNode;
}) => {
    const { isLoggedIn } = useSelector((state: RootState) => state.appUsers);

    return isLoggedIn ? <>{element} </> : <Navigate to='/' replace={true} />;
};

export default ProtectedUsersRouteElement;
