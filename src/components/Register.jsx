import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';  
import '../App.css';  

const Register = () => {
  const navigate = useNavigate();
  const [alert, setAlert] = useState({ message: '', type: '' }); 

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
      rePassword: '',
      phone: '',
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Required'),
      email: Yup.string().email('Invalid email address').required('Required'),
      password: Yup.string()
        .required('Required')
        .min(8, 'Password must be at least 8 characters')
        .matches(/[A-Z]/, 'Password must contain an uppercase letter')
        .matches(/[a-z]/, 'Password must contain a lowercase letter')
        .matches(/[\W_]/, 'Password must contain a special character'),
      rePassword: Yup.string()
        .required('Required')
        .oneOf([Yup.ref('password'), null], 'Passwords must match'),
      phone: Yup.string()
        .required('Required')
        .matches(/^\d{11}$/, 'Phone number must be 11 digits'),
    }),
    onSubmit: async (values) => {
      try {
        const response = await axios.post('https://ecommerce.routemisr.com/api/v1/auth/signup', {
          name: values.name,
          email: values.email,
          password: values.password,
          rePassword: values.rePassword,
          phone: values.phone,
        });
        console.log('Registration successful:', response.data);
        setAlert({ message: 'Registration successful! Redirecting to login...', type: 'success' });
        setTimeout(() => navigate('/login'), 1000); 
      } catch (error) {
        console.error('Registration failed:', error);
        const errorMessage = error.response?.data?.message || 'Registration failed. Please check your details and try again.';
        setAlert({ message: errorMessage, type: 'danger' });
      }
    }
  });

  return (
    <div className="container">
      <h1>Register</h1>
      {alert.message && (
        <div className={`alert alert-${alert.type}`} role="alert">
          {alert.message}
        </div>
      )}
      <form onSubmit={formik.handleSubmit}>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">Name</label>
          <input
            id="name"
            type="text"
            name="name"
            className={`form-control ${formik.touched.name && formik.errors.name ? 'is-invalid' : ''}`}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.name}
          />
          {formik.touched.name && formik.errors.name ? (
            <div className="invalid-feedback">{formik.errors.name}</div>
          ) : null}
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email</label>
          <input
            id="email"
            type="email"
            name="email"
            className={`form-control ${formik.touched.email && formik.errors.email ? 'is-invalid' : ''}`}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.email}
          />
          {formik.touched.email && formik.errors.email ? (
            <div className="invalid-feedback">{formik.errors.email}</div>
          ) : null}
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password</label>
          <input
            id="password"
            type="password"
            name="password"
            className={`form-control ${formik.touched.password && formik.errors.password ? 'is-invalid' : ''}`}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.password}
          />
          {formik.touched.password && formik.errors.password ? (
            <div className="invalid-feedback">{formik.errors.password}</div>
          ) : null}
        </div>
        <div className="mb-3">
          <label htmlFor="rePassword" className="form-label">Re-enter Password</label>
          <input
            id="rePassword"
            type="password"
            name="rePassword"
            className={`form-control ${formik.touched.rePassword && formik.errors.rePassword ? 'is-invalid' : ''}`}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.rePassword}
          />
          {formik.touched.rePassword && formik.errors.rePassword ? (
            <div className="invalid-feedback">{formik.errors.rePassword}</div>
          ) : null}
        </div>
        <div className="mb-3">
          <label htmlFor="phone" className="form-label">Phone</label>
          <input
            id="phone"
            type="text"
            name="phone"
            className={`form-control ${formik.touched.phone && formik.errors.phone ? 'is-invalid' : ''}`}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.phone}
          />
          {formik.touched.phone && formik.errors.phone ? (
            <div className="invalid-feedback">{formik.errors.phone}</div>
          ) : null}
        </div>
        <button type="submit" className="btn btn-primary">Register</button>
      </form>
    </div>
  );
};

export default Register;
