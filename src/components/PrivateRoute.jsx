import React from 'react';
import { Navigate } from 'react-router-dom';

export function PrivateRoute({ user, children, allowedRole }) {
  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (allowedRole && user.role !== allowedRole) {
    return <Navigate to={`/dashboard/${user.role}`} replace />;
  }

  return <>{children}</>;
}