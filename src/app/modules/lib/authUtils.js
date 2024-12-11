import { jwtDecode } from 'jwt-decode';
import { message } from 'antd';
import { TOKEN } from '../../../settings/localVar';

export const verifyToken = (navigate) => {
  const token = localStorage.getItem(TOKEN);
  
  if (!token) {
    message.error('Vui lòng đăng nhập để tiếp tục');
    navigate('/login');
    return false;
  }

  try {
    const decodedToken = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    
    if (decodedToken.exp < currentTime) {
      localStorage.removeItem(TOKEN);
      message.error('Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại');
      navigate('/login');
      return false;
    }
    
    return true;
  } catch (error) {
    localStorage.removeItem(TOKEN);
    message.error('Token không hợp lệ, vui lòng đăng nhập lại');
    navigate('/login');
    return false;
  }
};
