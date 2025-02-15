import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const AdminRoute = ({ element: Element, allowedRoles, ...rest }) => {
  const token = Cookies.get('token');
  const userRole = Cookies.get('role'); // Assurez-vous que le rôle de l'utilisateur est stocké dans les cookies après la connexion

  return (
    <Route
      {...rest}
      element={token && (!allowedRoles || allowedRoles.includes(userRole)) ? <Element {...rest} /> : <Navigate to="/admin/login" />}
    />
  );
};

export default AdminRoute;
