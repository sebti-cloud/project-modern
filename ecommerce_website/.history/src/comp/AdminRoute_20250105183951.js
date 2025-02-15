import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import Cookies from 'js-cookie';

const AdminRoute = ({ allowedRoles }) => {
  const token = Cookies.get('token');
  const userRole = Cookies.get('role');

  if (!token || (allowedRoles && !allowedRoles.includes(userRole))) {
    return <Navigate to="/admin/login" />;
  }
  return <Outlet />;
};

export default AdminRoute;
