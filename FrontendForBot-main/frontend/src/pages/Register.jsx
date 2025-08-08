import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import useAuth from '../hooks/useAuth';
import AuthLayout from '../components/auth/AuthLayout';
import AnimatedButton from '../components/common/AnimatedButton';
import Spinner from '../components/common/Spinner';
import { pageVariants, pageTransition, itemVariants } from '../utils/motionVariants';

const Register = () => {
    const { register } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await register(formData.name, formData.email, formData.password);
            navigate('/dashboard');
        } catch (error) {
             // Error toast is handled in AuthContext
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
        >
            <AuthLayout>
                <motion.div
                    variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } }}
                    initial="hidden"
                    animate="visible"
                >
                    <motion.h1 variants={itemVariants} className="text-3xl font-bold text-text mb-2">Create Your Account</motion.h1>
                    <motion.p variants={itemVariants} className="text-text-light mb-8">Join our community to get started.</motion.p>
                    
                    <form onSubmit={handleRegister} className="space-y-6">
                        <motion.div variants={itemVariants}>
                            <label className="block text-sm font-medium text-text-light">Full Name</label>
                            <input name="name" type="text" required onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" />
                        </motion.div>
                         <motion.div variants={itemVariants}>
                            <label className="block text-sm font-medium text-text-light">Email Address</label>
                            <input name="email" type="email" required onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" />
                        </motion.div>
                        <motion.div variants={itemVariants}>
                            <label className="block text-sm font-medium text-text-light">Password</label>
                            <input name="password" type="password" required onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" />
                        </motion.div>
                        <motion.div variants={itemVariants}>
                            <AnimatedButton type="submit" className="w-full flex justify-center" disabled={loading}>
                                {loading ? <Spinner /> : 'Create Account'}
                            </AnimatedButton>
                        </motion.div>
                    </form>

                    <motion.p variants={itemVariants} className="mt-6 text-center text-sm text-text-light">
                        Already have an account?{' '}
                        <Link to="/login" className="font-medium text-primary hover:text-primary-dark">Log in</Link>
                    </motion.p>
                </motion.div>
            </AuthLayout>
        </motion.div>
    );
};

export default Register;