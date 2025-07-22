import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const LoginComponent = () => {
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();
  const [cookies, setCookie] = useCookies(['userid']);

  const formik = useFormik({
    initialValues: {
      UserId: '',
      Password: '',
    },
    validationSchema: Yup.object({
      UserId: Yup.string().required('User ID is required'),
      Password: Yup.string().required('Password is required'),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      console.log('Submitting login with values:', values);
      try {
        const response = await axios.post('http://127.0.0.1:8080/login', values);
        console.log('Login response:', response.data);
        setCookie('userid', response.data.UserId, { path: '/' });
        navigate('/admindashboard', { replace: true });
      } catch (error) {
        console.error('Login error:', error);
        setMsg(error.response?.data?.error || 'Login failed');
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="w-50 mx-auto mt-4">
      <form onSubmit={formik.handleSubmit}>
        <h2>Admin Login</h2>
        <div className="mb-3">
          <label className="form-label">User Id</label>
          <input
            type="text"
            className="form-control"
            name="UserId"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.UserId}
          />
          {formik.touched.UserId && formik.errors.UserId ? (
            <div className="text-danger">{formik.errors.UserId}</div>
          ) : null}
        </div>
        <div className="mb-3">
          <label className="form-label">Password</label>
          <input
            type="password"
            className="form-control"
            name="Password"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.Password}
          />
          {formik.touched.Password && formik.errors.Password ? (
            <div className="text-danger">{formik.errors.Password}</div>
          ) : null}
        </div>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={formik.isSubmitting}
        >
          {formik.isSubmitting ? (
            <>
              <span className="spinner-border spinner-border-sm"></span>
              Logging in...
            </>
          ) : (
            'Login'
          )}
        </button>
        <h3 className="text-danger mt-2">{msg}</h3>
        <div>
          New User? <Link to="/adminregister">Register</Link>
        </div>
      </form>
    </div>
  );
};

export default LoginComponent;