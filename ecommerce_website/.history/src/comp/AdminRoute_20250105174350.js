import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const AdminRoute = ({ element: Element, ...rest }) => {
  const token = Cookies.get('token');

  return (
    <Route
      {...rest}
      element={token ? <Element {...rest} /> : <Navigate to="/login" />}
    />
  );
};

export default AdminRoute;
