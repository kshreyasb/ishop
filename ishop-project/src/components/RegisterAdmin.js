import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useFormik } from 'formik';
import { useNavigate, Link } from 'react-router-dom';
import * as Yup from 'yup';

const RegisterAdmin = () => {
  const [adminUsers, setAdminUsers] = useState([]);
  const [msg, setMessage] = useState('');
  const [isUserIdTaken, setIsUserIdTaken] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get('http://127.0.0.1:8080/getadmin')
      .then((res) => {
        setAdminUsers(res.data);
      })
      .catch((error) => {
        console.error('Error fetching admins:', error);
        setMessage('Failed to load existing users');
      });
  }, []);

  const verifyUserId = (e) => {
    const userId = e.target.value;
    const userExists = adminUsers.some((user) => user.UserId === userId);
    setMessage(userExists ? 'User Name Taken: Try Another' : 'User Name Available');
    setIsUserIdTaken(userExists);
  };

  const formik = useFormik({
    initialValues: {
      UserId: '',
      FirstName: '',
      LastName: '',
      Password: '',
    },
    validationSchema: Yup.object({
      UserId: Yup.string().required('User ID is required'),
      FirstName: Yup.string().required('First Name is required'),
      LastName: Yup.string().required('Last Name is required'),
      Password: Yup.string()
        .min(6, 'Password must be at least 6 characters')
        .required('Password is required'),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      console.log('Submitting form with values:', values);
      try {
        const response = await axios.post('http://127.0.0.1:8080/adminregister', values);
        console.log('API response:', response.data);
        alert('Registered Successfully');
        navigate('/adminlogin', { replace: true });
      } catch (error) {
        console.error('Error during registration:', error);
        alert('Registration failed: ' + (error.response?.data?.error || error.message));
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="w-50 mx-auto mt-4">
      <form onSubmit={formik.handleSubmit}>
        <h3>Admin Register</h3>
        <div className="mb-3">
          <label className="form-label">User Id</label>
          <input
            type="text"
            className="form-control"
            name="UserId"
            onKeyUp={verifyUserId}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.UserId}
          />
          {formik.touched.UserId && formik.errors.UserId ? (
            <div className="text-danger">{formik.errors.UserId}</div>
          ) : null}
          <div>{msg}</div>
        </div>
        <div className="mb-3">
          <label className="form-label">First Name</label>
          <input
            type="text"
            className="form-control"
            name="FirstName"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.FirstName}
          />
          {formik.touched.FirstName && formik.errors.FirstName ? (
            <div className="text-danger">{formik.errors.FirstName}</div>
          ) : null}
        </div>
        <div className="mb-3">
          <label className="form-label">Last Name</label>
          <input
            type="text"
            className="form-control"
            name="LastName"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.LastName}
          />
          {formik.touched.LastName && formik.errors.LastName ? (
            <div className="text-danger">{formik.errors.LastName}</div>
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
          disabled={isUserIdTaken || formik.isSubmitting}
        >
          {formik.isSubmitting ? (
            <>
              <span className="spinner-border spinner-border-sm"></span>
              Registering...
            </>
          ) : (
            'Register'
          )}
        </button>
        <div className="mt-2">
          <Link className="btn btn-link" to="/adminlogin">
            Login
          </Link>
        </div>
      </form>
    </div>
  );
};

export default RegisterAdmin;