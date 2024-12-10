import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import './home.css';
import { getMenuItems } from '../../../settings/localVar';
import { jwtDecode } from 'jwt-decode';
import { TOKEN } from "../../../settings/localVar";

export default function Home() {
  const navigate = useNavigate();

  const token = localStorage.getItem(TOKEN);
  const user = token ? jwtDecode(token) : null;

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);




  return (
    <div className="home">
      <Sidebar />
      <div className="main-content">
      </div>
    </div>
  );
}