import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginService } from './services/loginService';
import './login.css';
import { sLogin } from './loginStore';
import Loading from '../../components/Loading/Loading';

export default function Login() {
  const isLoading = sLogin.use();
  const usernameRef = useRef('');
  const passwordRef = useRef('');
  const navigate = useNavigate();

  const handleInputChange = (ref) => (e) => {
    ref.current = e.target.value;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      sLogin.set(true);
      const loginData = {
        username: usernameRef.current,
        password: passwordRef.current
      };
      const response = await loginService(loginData, navigate);
      console.log(response);
    } catch (error) {
      console.error('Đăng nhập thất bại:', error);
      alert('Tên đăng nhập hoặc mật khẩu không đúng!');
    }
  };

  


  return (
    <div className="login-container">
      <div className="login-box">
        {isLoading ? <Loading /> : <></>}
        <h2>Đăng nhập</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              name="username"
              placeholder="Tên đăng nhập"
              onChange={handleInputChange(usernameRef)}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              name="password"
              placeholder="Mật khẩu"
              onChange={handleInputChange(passwordRef)}
              required
            />
          </div>
          <button type="submit" className="login-button">
            Đăng nhập
          </button>
        </form>
        <div className="additional-options">
          <a href="#">Quên mật khẩu?</a>
          <a href="#">Đăng ký tài khoản mới</a>
        </div>
      </div>
    </div>
  );
}
    