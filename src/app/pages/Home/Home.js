import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import './home.css';
import { getMenuItems } from '../../../settings/localVar';
import { jwtDecode } from 'jwt-decode';
import { TOKEN } from "../../../settings/localVar";

export default function Home() {
  const navigate = useNavigate();
  
  const user =  jwtDecode(localStorage.getItem(TOKEN));

  useEffect(() => {
    console.log(user);
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);


  const menuItems = getMenuItems(user?.role);

  return (
    <div className="home">
      <Sidebar user={user} menuItems={menuItems} />
      <div className="main-content">
      </div>
    </div>
  );
}