import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie' ;

const AdminDashboard = () => {
  const [cookies, , removeCookie] = useCookies(['userid']);
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!cookies.userid) {
      navigate('/adminlogin', { replace: true });
    } else {
      setUsername(cookies.userid);
    }
  }, [cookies, navigate]);

  const handleLogout = () => {
    removeCookie('userid', { path: '/' });
    navigate('/adminlogin', { replace: true });
  };

  return (
    <div className="w-50 mx-auto mt-4">
      <h2>Admin Dashboard - {username} Signed In</h2>
      <button onClick={handleLogout} className="btn btn-link">
        Logout
      </button>
    </div>
  );
};

export default AdminDashboard;