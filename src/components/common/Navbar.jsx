import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleNavigation = (path) => {
        setIsMenuOpen(false);
        navigate(path);
    };

    const handleLogout = async () => {
        try {
            setIsMenuOpen(false);
            await logout();
            navigate('/');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    const isActive = (path) => location.pathname === path;

    return (
        <motion.nav
            className="bg-white shadow fixed w-full z-50"
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    {/* Logo */}
                    <motion.div
                        className="flex items-center"
                        whileHover={{ scale: 1.05 }}
                    >
                        <Link to="/" onClick={() => setIsMenuOpen(false)} className="flex items-center space-x-2">
                            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                Content-Gini
                            </span>
                        </Link>
                    </motion.div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-6">
                        {user ? (
                            <AnimatePresence mode="wait">
                                <motion.div
                                    className="flex items-center space-x-6"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                >
                                    <Link
                                        to="/blog-generator"
                                        className={`text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium
                                            ${isActive('/blog-generator') ? 'text-blue-600' : ''}`}
                                    >
                                        Generate Blog
                                    </Link>
                                    <Link
                                        to="/blog-analysis"
                                        className={`text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium
                                            ${isActive('/blog-analysis') ? 'text-blue-600' : ''}`}
                                    >
                                        Analyze Blog
                                    </Link>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={handleLogout}
                                        className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-200"
                                    >
                                        Logout
                                    </motion.button>
                                </motion.div>
                            </AnimatePresence>
                        ) : (
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                            >
                                <Link
                                    to="/auth"
                                    className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-200"
                                >
                                    Login
                                </Link>
                            </motion.div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center">
                        {user ? (
                            <motion.button
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600 focus:outline-none"
                            >
                                <motion.svg
                                    className="h-6 w-6"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    animate={{ rotate: isMenuOpen ? 180 : 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    {isMenuOpen ? (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    ) : (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                    )}
                                </motion.svg>
                            </motion.button>
                        ) : (
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Link
                                    to="/auth"
                                    className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-200"
                                >
                                    Login
                                </Link>
                            </motion.div>
                        )}
                    </div>
                </div>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {isMenuOpen && user && (
                        <motion.div
                            className="md:hidden"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                                <motion.div
                                    whileHover={{ x: 10 }}
                                    onClick={() => handleNavigation('/blog-generator')}
                                >
                                    <a className={`block px-3 py-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-50
                                        ${isActive('/blog-generator') ? 'bg-gray-50 text-blue-600' : ''}`}>
                                        Generate Blog
                                    </a>
                                </motion.div>
                                <motion.div
                                    whileHover={{ x: 10 }}
                                    onClick={() => handleNavigation('/blog-analysis')}
                                >
                                    <a className={`block px-3 py-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-50
                                        ${isActive('/blog-analysis') ? 'bg-gray-50 text-blue-600' : ''}`}>
                                        Analyze Blog
                                    </a>
                                </motion.div>
                                <motion.div
                                    whileHover={{ x: 10 }}
                                    onClick={handleLogout}
                                >
                                    <a className="block px-3 py-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-50">
                                        Logout
                                    </a>
                                </motion.div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.nav>
    );
};

export default Navbar;