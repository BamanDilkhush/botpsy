import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import AnimatedButton from '../common/AnimatedButton';
import Spinner from '../common/Spinner';
import { itemVariants } from '../../utils/motionVariants';

const AuthForm = ({ title, fields, onSubmit, buttonText, footerText, footerLink, footerLinkText }) => {
  const [formData, setFormData] = useState(
    fields.reduce((acc, field) => ({ ...acc, [field.name]: '' }), {})
  );
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(formData);
    } catch (error) {
      // Error is handled by toast in AuthContext
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="max-w-md mx-auto"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: { staggerChildren: 0.1 }
        }
      }}
      initial="hidden"
      animate="visible"
    >
      <motion.h1 variants={itemVariants} className="text-4xl font-extrabold text-center mb-2 text-text">
        {title}
      </motion.h1>
      <motion.p variants={itemVariants} className="text-center text-text-light mb-8">
        Welcome! Please enter your details.
      </motion.p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {fields.map((field) => (
          <motion.div variants={itemVariants} key={field.name}>
            <label htmlFor={field.name} className="block text-sm font-medium text-text-light">
              {field.label}
            </label>
            <input
              id={field.name}
              name={field.name}
              type={field.type}
              required
              value={formData[field.name]}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
            />
          </motion.div>
        ))}

        <motion.div variants={itemVariants}>
          <AnimatedButton type="submit" className="w-full flex justify-center items-center" disabled={loading}>
            {loading ? <Spinner /> : buttonText}
          </AnimatedButton>
        </motion.div>
      </form>

      <motion.p variants={itemVariants} className="mt-8 text-center text-sm text-text-light">
        {footerText}{' '}
        <Link to={footerLink} className="font-medium text-primary hover:text-primary-dark">
          {footerLinkText}
        </Link>
      </motion.p>
    </motion.div>
  );
};

export default AuthForm;