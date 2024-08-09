import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../App.css';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate(); 
  const [alert, setAlert] = useState(null);

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      email: Yup.string().email('Invalid email address').required('Required'),
      password: Yup.string().min(8, 'Password must be at least 8 characters').required('Required'),
    }),
    onSubmit: async (values) => {
      try {
        await login(values.email, values.password);
        setAlert({ type: 'success', message: 'Login successful! Redirecting to home...' });
        setTimeout(() => navigate('/home'), 1000); 
      } catch (error) {
        console.error('Login failed:', error);
        const errorMessage = error.response?.data?.message || 'Login failed. Please check your credentials and try again.';
        setAlert({ type: 'danger', message: errorMessage });
      }
    },
  });

  return (
    <div className="container">
      <h1>Login</h1>
      {alert && <div className={`alert alert-${alert.type}`} role="alert">{alert.message}</div>}
      <form onSubmit={formik.handleSubmit}>
        <div>
          <label>Email</label>
          <input
            type="email"
            name="email"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.email}
            className={`form-control ${formik.touched.email && formik.errors.email ? 'is-invalid' : ''}`}
          />
          {formik.touched.email && formik.errors.email ? (
            <div className="invalid-feedback">{formik.errors.email}</div>
          ) : null}
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            name="password"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.password}
            className={`form-control ${formik.touched.password && formik.errors.password ? 'is-invalid' : ''}`}
          />
          {formik.touched.password && formik.errors.password ? (
            <div className="invalid-feedback">{formik.errors.password}</div>
          ) : null}
        </div>
        <button type="submit" className="btn btn-primary">Login</button>
      </form>
      <p>
        <Link to="/forgot-password">Forgot password?</Link>
      </p>
      <p>
        Don't have an account? <Link to="/register">Register here</Link>
      </p>
    </div>
  );
};

export default Login;
