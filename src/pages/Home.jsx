import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PenLine, BarChart3, Zap } from 'lucide-react';

const Home = () => {
    const navigate = useNavigate();

    // Subtle, purposeful motion — entrance fades and a gentle stagger.
    const fadeInUp = {
        hidden: { opacity: 0, y: 16 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5, ease: 'easeOut' }
        }
    };

    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.12 }
        }
    };

    const features = [
        {
            Icon: PenLine,
            title: 'AI Content Generation',
            description: 'Create high-quality, engaging blog posts in seconds with state-of-the-art AI.'
        },
        {
            Icon: BarChart3,
            title: 'Content Analysis',
            description: 'Get detailed quality scores, sentiment, and topic insights for any piece of content.'
        },
        {
            Icon: Zap,
            title: 'Optimization Tips',
            description: 'Receive personalized, actionable recommendations to improve every draft.'
        }
    ];

    const steps = [
        { step: '1', text: 'Sign up for an account' },
        { step: '2', text: 'Input your content requirements' },
        { step: '3', text: 'Get AI-generated content' },
        { step: '4', text: 'Analyze and optimize' }
    ];

    return (
        <div className="bg-gradient-to-b from-brand-50/70 to-slate-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20">
                {/* Hero Section */}
                <motion.div
                    className="text-center"
                    initial="hidden"
                    animate="visible"
                    variants={staggerContainer}
                >
                    <motion.span
                        variants={fadeInUp}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-100 text-brand-700 text-sm font-medium"
                    >
                        <Zap className="w-4 h-4" />
                        AI-powered content platform
                    </motion.span>

                    <motion.h1
                        variants={fadeInUp}
                        className="mt-6 text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight"
                    >
                        Content
                        <span className="ml-2 bg-gradient-to-r from-brand-600 to-accent-600 bg-clip-text text-transparent">
                            Gini
                        </span>
                    </motion.h1>

                    <motion.p
                        variants={fadeInUp}
                        className="mt-5 max-w-2xl mx-auto text-lg text-slate-500"
                    >
                        Your AI-powered content companion. Create, analyze, and optimize your
                        content with advanced machine learning — all in one place.
                    </motion.p>

                    <motion.div
                        className="mt-8 flex flex-col sm:flex-row justify-center gap-3"
                        variants={fadeInUp}
                    >
                        <button
                            onClick={() => navigate('/auth?mode=register')}
                            className="inline-flex items-center justify-center px-6 py-3 text-base font-semibold rounded-lg shadow-sm text-white bg-brand-600 hover:bg-brand-700 transition-colors"
                        >
                            Get started free
                        </button>
                        <button
                            onClick={() => navigate('/auth?mode=login')}
                            className="inline-flex items-center justify-center px-6 py-3 text-base font-semibold rounded-lg border border-slate-300 text-slate-700 bg-white hover:bg-slate-50 transition-colors"
                        >
                            Sign in
                        </button>
                    </motion.div>
                </motion.div>

                {/* Features Section */}
                <motion.div
                    className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-6"
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                >
                    {features.map(({ Icon, title, description }) => (
                        <motion.div
                            key={title}
                            className="p-6 bg-white rounded-2xl shadow-card border border-slate-100 transition-shadow hover:shadow-card-hover"
                            variants={fadeInUp}
                        >
                            <div className="w-12 h-12 bg-brand-100 rounded-xl flex items-center justify-center mb-4">
                                <Icon className="w-6 h-6 text-brand-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-slate-900 mb-2">{title}</h3>
                            <p className="text-slate-500 leading-relaxed">{description}</p>
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
                    <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">
                        How It Works
                    </h2>
                    <motion.div
                        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8"
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.3 }}
                    >
                        {steps.map((item) => (
                            <motion.div
                                key={item.step}
                                className="text-center"
                                variants={fadeInUp}
                            >
                                <div className="w-12 h-12 bg-brand-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold shadow-sm">
                                    {item.step}
                                </div>
                                <p className="text-slate-600">{item.text}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </motion.div>

                {/* CTA Section */}
                <motion.div
                    className="mt-24"
                    variants={fadeInUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                >
                    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand-600 to-accent-600 px-6 py-14 text-center">
                        <h2 className="text-3xl font-bold text-white mb-3">
                            Ready to get started?
                        </h2>
                        <p className="text-brand-100 mb-8 max-w-xl mx-auto">
                            Join Content Gini and turn your ideas into polished, optimized content today.
                        </p>
                        <button
                            onClick={() => navigate('/auth?mode=register')}
                            className="inline-flex items-center px-8 py-4 text-lg font-semibold rounded-lg shadow-sm text-brand-700 bg-white hover:bg-brand-50 transition-colors"
                        >
                            Start Creating Content
                        </button>
                    </div>
                </motion.div>
            </div>

            {/* Footer */}
            <footer className="bg-white border-t border-slate-200">
                <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-slate-500">
                    <span className="font-semibold bg-gradient-to-r from-brand-600 to-accent-600 bg-clip-text text-transparent">
                        Content Gini
                    </span>
                    <p>© {new Date().getFullYear()} Content Gini. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default Home;
