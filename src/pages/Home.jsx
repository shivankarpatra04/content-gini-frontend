import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Home = () => {
    const navigate = useNavigate();

    // Animation variants
    const fadeInUp = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6 }
        }
    };

    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    const scaleIn = {
        hidden: { scale: 0.8, opacity: 0 },
        visible: {
            scale: 1,
            opacity: 1,
            transition: { duration: 0.5 }
        }
    };

    const featureHover = {
        rest: { scale: 1 },
        hover: {
            scale: 1.05,
            transition: {
                type: "spring",
                stiffness: 400,
                damping: 17
            }
        }
    };

    const buttonHover = {
        hover: {
            scale: 1.05,
            transition: {
                type: "spring",
                stiffness: 400,
                damping: 10
            }
        },
        tap: { scale: 0.95 }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white overflow-hidden">
            {/* Hero Section */}
            <motion.div
                className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16"
                initial="hidden"
                animate="visible"
                variants={staggerContainer}
            >
                <motion.div
                    className="text-center"
                    variants={fadeInUp}
                >
                    <motion.h1
                        className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 tracking-tight"
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{
                            duration: 0.8,
                            ease: [0, 0.71, 0.2, 1.01]
                        }}
                    >
                        Content
                        <motion.span
                            className="text-blue-600 ml-2"
                            animate={{
                                scale: [1, 1.1, 1],
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                repeatType: "reverse"
                            }}
                        >
                            Gini
                        </motion.span>
                    </motion.h1>

                    <motion.p
                        variants={fadeInUp}
                        className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl"
                    >
                        Your AI-powered content companion. Create, analyze, and optimize your content with advanced machine learning technology.
                    </motion.p>

                    <motion.div
                        className="mt-8 flex justify-center gap-4"
                        variants={fadeInUp}
                    >
                        <motion.button
                            variants={buttonHover}
                            whileHover="hover"
                            whileTap="tap"
                            onClick={() => navigate('/auth?mode=login')}
                            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                        >
                            Login
                        </motion.button>
                        <motion.button
                            variants={buttonHover}
                            whileHover="hover"
                            whileTap="tap"
                            onClick={() => navigate('/auth?mode=register')}
                            className="inline-flex items-center px-6 py-3 border border-blue-600 text-base font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50 transition-colors"
                        >
                            Sign Up
                        </motion.button>
                    </motion.div>
                </motion.div>

                {/* Features Section */}
                <motion.div
                    className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8"
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                >
                    {[
                        {
                            icon: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z",
                            title: "AI Content Generation",
                            description: "Create high-quality, engaging content with our advanced AI technology."
                        },
                        {
                            icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
                            title: "Content Analysis",
                            description: "Get detailed insights and analytics about your content's performance."
                        },
                        {
                            icon: "M13 10V3L4 14h7v7l9-11h-7z",
                            title: "Optimization Tips",
                            description: "Receive personalized recommendations to improve your content quality."
                        }
                    ].map((feature, index) => (
                        <motion.div
                            key={index}
                            className="p-6 bg-white rounded-xl shadow-md"
                            variants={featureHover}
                            initial="rest"
                            whileHover="hover"
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                        >
                            <motion.div
                                className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4"
                                whileHover={{ rotate: 360 }}
                                transition={{ duration: 0.6 }}
                            >
                                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={feature.icon} />
                                </svg>
                            </motion.div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                            <p className="text-gray-600">{feature.description}</p>
                        </motion.div>
                    ))}
                </motion.div>

                {/* How It Works Section */}
                <motion.div
                    className="mt-24"
                    variants={fadeInUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                >
                    <motion.h2
                        className="text-3xl font-bold text-gray-900 text-center mb-12"
                        variants={fadeInUp}
                    >
                        How It Works
                    </motion.h2>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        {[
                            { step: '1', text: 'Sign up for an account' },
                            { step: '2', text: 'Input your content requirements' },
                            { step: '3', text: 'Get AI-generated content' },
                            { step: '4', text: 'Analyze and optimize' }
                        ].map((item, index) => (
                            <motion.div
                                key={index}
                                className="text-center"
                                variants={scaleIn}
                                whileHover={{ scale: 1.1 }}
                                transition={{ type: "spring", stiffness: 300 }}
                            >
                                <motion.div
                                    className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold"
                                    whileHover={{ rotate: 360 }}
                                    transition={{ duration: 0.6 }}
                                >
                                    {item.step}
                                </motion.div>
                                <p className="text-gray-700">{item.text}</p>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* CTA Section */}
                <motion.div
                    className="mt-24 text-center"
                    variants={fadeInUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                >
                    <motion.h2
                        className="text-3xl font-bold text-gray-900 mb-8"
                        variants={fadeInUp}
                    >
                        Ready to get started?
                    </motion.h2>
                    <motion.button
                        variants={buttonHover}
                        whileHover="hover"
                        whileTap="tap"
                        onClick={() => navigate('/auth?mode=register')}
                        className="inline-flex items-center px-8 py-4 border border-transparent text-lg font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                    >
                        Start Creating Content
                    </motion.button>
                </motion.div>
            </motion.div>

            {/* Footer */}
            <motion.footer
                className="mt-24 bg-gray-50 border-t border-gray-200"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
            >
                <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 text-center text-gray-600">
                    <p>© 2024 Content Gini. All rights reserved.</p>
                </div>
            </motion.footer>
        </div>
    );
};

export default Home;