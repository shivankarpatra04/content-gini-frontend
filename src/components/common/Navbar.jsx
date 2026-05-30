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
            className="bg-white/90 backdrop-blur border-b border-slate-200 fixed w-full z-50"
            initial={{ y: -64 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    {/* Logo */}
                    <motion.div
                        className="flex items-center"
                        whileHover={{ scale: 1.05 }}
                    >
                        <Link to="/" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-2" aria-label="Content Gini home">
                            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-brand-600 to-accent-600 text-white font-bold text-lg">
                                C
                            </span>
                            <span className="text-xl font-bold bg-gradient-to-r from-brand-600 to-accent-600 bg-clip-text text-transparent">
                                Content Gini
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
                                        className={`text-sm font-medium transition-colors duration-200 hover:text-brand-600
                                            ${isActive('/blog-generator') ? 'text-brand-600' : 'text-slate-700'}`}
                                    >
                                        Generate Blog
                                    </Link>
                                    <Link
                                        to="/blog-analysis"
                                        className={`text-sm font-medium transition-colors duration-200 hover:text-brand-600
                                            ${isActive('/blog-analysis') ? 'text-brand-600' : 'text-slate-700'}`}
                                    >
                                        Analyze Blog
                                    </Link>
                                    <motion.button
                                        whileTap={{ scale: 0.97 }}
                                        onClick={handleLogout}
                                        className="px-4 py-2 text-sm font-medium rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors duration-200"
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
                                    className="px-4 py-2 text-sm font-semibold rounded-lg bg-brand-600 text-white hover:bg-brand-700 transition-colors duration-200"
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
                                aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
                                aria-expanded={isMenuOpen}
                                className="inline-flex items-center justify-center p-2 rounded-md text-slate-700 hover:text-brand-600 hover:bg-slate-50"
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
                                    className="px-4 py-2 text-sm font-semibold rounded-lg bg-brand-600 text-white hover:bg-brand-700 transition-colors duration-200"
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
                            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-slate-100">
                                <button
                                    onClick={() => handleNavigation('/blog-generator')}
                                    className={`block w-full text-left px-3 py-2 rounded-md text-sm font-medium hover:text-brand-600 hover:bg-slate-50
                                        ${isActive('/blog-generator') ? 'bg-brand-50 text-brand-600' : 'text-slate-700'}`}
                                >
                                    Generate Blog
                                </button>
                                <button
                                    onClick={() => handleNavigation('/blog-analysis')}
                                    className={`block w-full text-left px-3 py-2 rounded-md text-sm font-medium hover:text-brand-600 hover:bg-slate-50
                                        ${isActive('/blog-analysis') ? 'bg-brand-50 text-brand-600' : 'text-slate-700'}`}
                                >
                                    Analyze Blog
                                </button>
                                <button
                                    onClick={handleLogout}
                                    className="block w-full text-left px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:text-brand-600 hover:bg-slate-50"
                                >
                                    Logout
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.nav>
    );
};

export default Navbar;