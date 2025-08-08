import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { BrainCircuit, LogOut, LayoutDashboard, FileText, ShieldCheck, MessageSquare, Menu, X } from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import AnimatedButton from '../common/AnimatedButton';

const Navbar = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
        setIsMobileMenuOpen(false);
    };

    const closeMobileMenu = () => setIsMobileMenuOpen(false);

    const navLinkStyle = ({ isActive }) =>
        `flex items-center px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
            isActive ? 'bg-red-400 text-white shadow-md' : 'text-text-light hover:text-primary'
        }`;
    
    const mobileNavLinkStyle = ({ isActive }) =>
        `flex items-center px-4 py-3 rounded-lg text-base font-semibold transition-all duration-200 ${
            isActive ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-100'
        }`;

    const navItems = user ? [
        { to: "/dashboard", icon: <LayoutDashboard className="h-5 w-5 mr-3" />, label: "Dashboard" },
        { to: "/assessment", icon: <FileText className="h-5 w-5 mr-3" />, label: "Assessment" },
        { to: "/ai-assistant", icon: <MessageSquare className="h-5 w-5 mr-3" />, label: "AI Assistant" },
        ...(user.role === 'admin' ? [{ to: "/admin", icon: <ShieldCheck className="h-5 w-5 mr-3" />, label: "Admin" }] : [])
    ] : [];

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="bg-surface/90 backdrop-blur-lg sticky top-0 z-50 shadow-md"
        >
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <Link to="/" className="flex items-center space-x-2 text-primary-dark">
                        <BrainCircuit className="h-9 w-9 text-primary" />
                        <span className="text-2xl font-bold text-gray-800">BotPsych</span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-2">
                        {user ? (
                            <>
                                {navItems.map(item => (
                                    <NavLink key={item.to} to={item.to} className={navLinkStyle}>
                                        {item.icon} {item.label}
                                    </NavLink>
                                ))}
                                <div className="flex items-center pl-4 ml-4 border-l border-gray-200 space-x-3">
                                    <span className="text-sm text-text-light hidden lg:block">Hi, {user.name}</span>
                                    <AnimatedButton onClick={handleLogout} variant="danger" className="!p-2">
                                        <LogOut className="h-5 w-5" />
                                    </AnimatedButton>
                                </div>
                            </>
                        ) : (
                            <div className="flex items-center space-x-2">
                                <AnimatedButton onClick={() => navigate('/login')} variant="secondary">Log In</AnimatedButton>
                                <AnimatedButton onClick={() => navigate('/register')}>Sign Up</AnimatedButton>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 rounded-md text-gray-600 hover:bg-gray-100">
                            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="md:hidden absolute top-full left-0 w-full bg-surface shadow-lg"
                    >
                        <div className="px-4 pt-2 pb-4 space-y-2">
                            {user ? (
                                <>
                                    {navItems.map(item => (
                                        <NavLink key={item.to} to={item.to} className={mobileNavLinkStyle} onClick={closeMobileMenu}>
                                            {item.icon} {item.label}
                                        </NavLink>
                                    ))}
                                    <div className="pt-4 mt-4 border-t border-gray-200">
                                        <AnimatedButton onClick={handleLogout} variant="danger" className="w-full flex justify-center">
                                            <LogOut className="h-5 w-5 mr-2" /> Logout
                                        </AnimatedButton>
                                    </div>
                                </>
                            ) : (
                                <div className="space-y-2">
                                    <AnimatedButton onClick={() => { navigate('/login'); closeMobileMenu(); }} variant="secondary" className="w-full">Log In</AnimatedButton>
                                    <AnimatedButton onClick={() => { navigate('/register'); closeMobileMenu(); }} className="w-full">Sign Up</AnimatedButton>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    );
};

export default Navbar;
