import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';

const PrivateRoute = ({ children }) => {
    const { token } = useContext(ShopContext);
    const location = useLocation();

    return token && token !== 'guest' ? children : <Navigate to="/login" state={{ from: location }} />;
};

export default PrivateRoute;