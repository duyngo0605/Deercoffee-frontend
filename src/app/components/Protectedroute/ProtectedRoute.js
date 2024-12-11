import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';


const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  const { verifyAuth } = useAuth(navigate);

  useEffect(() => {
    verifyAuth();
  }, []);

  return children;
};

export default ProtectedRoute; 