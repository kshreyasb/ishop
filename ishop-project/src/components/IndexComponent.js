import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { CookiesProvider } from 'react-cookie';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import RegisterAdmin from './RegisterAdmin';
import LoginComponent from './LoginComponent';
import AdminDashboard from './AdminDashboard';

const IndexComponent = () => {
  return (
    <CookiesProvider>
      <div className="container-fluid">
        <Router>
          <header className="bg-danger text-white text-center p-2 mt-2">
            <h2>
              <span className="bi bi-cart4"></span> i-Shop
            </h2>
          </header>
          <div className="mt-2 row">
            <div className="col-3">
              <Link className="btn btn-danger w-100" to="/adminregister">
                Admin Register
              </Link>
              <Link className="btn btn-danger w-100 mt-2" to="/adminlogin">
                Admin Login
              </Link>
            </div>
          </div>
          <Routes>
            <Route path="/adminregister" element={<RegisterAdmin />} />
            <Route path="/adminlogin" element={<LoginComponent />} />
            <Route path="/admindashboard" element={<AdminDashboard />} />
            <Route path="/" element={<h3>Welcome to i-Shop</h3>} />
          </Routes>
        </Router>
      </div>
    </CookiesProvider>
  );
};

export default IndexComponent;