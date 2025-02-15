import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const AdminRoute = ({ element: Element, allowedRoles, ...rest }) => {
  const token = Cookies.get('token');
  const userRole = Cookies.get('role');

  return (
    <Route
      {...rest}
      element={
        token && (!allowedRoles || allowedRoles.includes(userRole)) ? (
          <Element />
        ) : (
          <Navigate to="/admin/login" />
        )
      }
    />
  );
};

export default AdminRoute;
