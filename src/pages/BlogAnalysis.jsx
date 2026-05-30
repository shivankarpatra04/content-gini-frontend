import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import useBlog from '../hooks/useBlog';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCw, LineChart, Search, Loader2, CheckCircle2 } from 'lucide-react';

// Map a 0–100 score to a semantic colour set for consistent, readable feedback.
const scoreTheme = (pct) => {
    if (pct >= 80) return { text: 'text-emerald-600', bar: 'bg-emerald-500', ring: 'text-emerald-500', soft: 'bg-emerald-50' };
    if (pct >= 60) return { text: 'text-amber-600', bar: 'bg-amber-500', ring: 'text-amber-500', soft: 'bg-amber-50' };
    return { text: 'text-rose-600', bar: 'bg-rose-500', ring: 'text-rose-500', soft: 'bg-rose-50' };
};

const BlogAnalysis = () => {
    const [blogText, setBlogText] = useState('');
    const {
        loading,
        progress,
        analyzeContent,
        getAnalysisData,
        clearAnalysis,
        cleanup
    } = useBlog();

    const analysisData = getAnalysisData();
    const location = useLocation();

    // Auto-fill the textarea when arriving from the Blog Generator with content.
    useEffect(() => {
        const passedContent = location.state?.content;
        if (passedContent) {
            setBlogText(passedContent);
            toast.success('Generated blog loaded for analysis');
        }
    }, [location.state]);

    useEffect(() => {
        return () => cleanup();
    }, [cleanup]);

    const headerContainerVariants = {
        hidden: { opacity: 0, y: -20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                staggerChildren: 0.1
            }
        }
    };

    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6 }
        },
        exit: {
            opacity: 0,
            y: -20,
            transition: { duration: 0.3 }
        }
    };

    const textVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: {
            opacity: 1,
            x: 0,
            transition: { duration: 0.5 }
        }
    };

    const iconVariants = {
        hidden: { scale: 0, rotate: -180 },
        visible: {
            scale: 1,
            rotate: 0,
            transition: { duration: 0.5, type: "spring" }
        },
        hover: {
            scale: 1.1,
            rotate: 5,
            transition: { duration: 0.2 }
        }
    };

    const handleAnalyze = async (e) => {
        e.preventDefault();
        if (!blogText.trim()) {
            toast.error('Please enter some content to analyze');
            return;
        }

        try {
            await analyzeContent(blogText);
        } catch (error) {
            console.error('Analysis error:', error);
        }
    };

    const handleRefresh = () => {
        setBlogText('');
        clearAnalysis();
        toast.success('Form has been reset!');
    };
    // Add to your existing variants
    const cardVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.4 }
        }
    };

    const ProcessingOverlay = () => (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
            <motion.div
                className="bg-white rounded-2xl p-8 flex flex-col items-center max-w-md mx-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                layoutId="progressCard"
            >
                <div className="relative mb-4">
                    <motion.div
                        className="w-16 h-16 border-4 border-brand-200 rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    />
                    <motion.div
                        className="absolute top-0 left-0 w-16 h-16 border-4 border-t-brand-600 rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                    />
                </div>
                <h3 className="text-xl font-semibold text-slate-800 mb-2">Analyzing Content</h3>
                <p className="text-slate-600 text-center mb-4">Please wait while we analyze your content</p>
                <div className="w-full bg-slate-200 rounded-full h-2 mb-2">
                    <motion.div
                        className="h-full bg-brand-600 rounded-full origin-left"
                        style={{ width: `${progress}%` }}
                        transition={{ duration: 0.3 }}
                        layoutId="progressBar"
                    />
                </div>
                <span className="text-sm text-slate-500">{progress}% Complete</span>
            </motion.div>
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-20">
            <motion.div
                className="relative mb-6 rounded-xl bg-gradient-to-br from-accent-600 via-accent-700 to-accent-800 overflow-hidden will-change-transform"
                variants={headerContainerVariants}
                initial="hidden"
                animate="visible"
                style={{
                    transform: 'translate3d(0, 0, 0)',
                    backfaceVisibility: 'hidden'
                }}
            >
                <div className="absolute top-0 right-0 w-40 h-40 bg-accent-500/20 rounded-full -mr-20 -mt-20 blur-3xl transform-gpu" />
                <div className="absolute bottom-0 left-0 w-40 h-40 bg-accent-600/20 rounded-full -ml-20 -mb-20 blur-3xl transform-gpu" />
                <div className="relative p-6 sm:p-8 z-10">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <motion.div
                            className="flex items-center gap-3"
                            variants={textVariants}
                        >
                            <motion.div
                                className="p-2 bg-white/10 backdrop-blur rounded-lg"
                                variants={iconVariants}
                                whileHover={{ scale: 1.05 }}
                            >
                                <LineChart className="w-6 h-6 text-white" />
                            </motion.div>
                            <div>
                                <h1 className="text-2xl sm:text-3xl font-bold text-white">
                                    Blog Analysis
                                </h1>
                                <p className="mt-1 text-sm sm:text-base text-accent-100">
                                    Analyze your content quality and insights
                                </p>
                            </div>
                        </motion.div>
                        <motion.div
                            variants={iconVariants}
                            className="hidden sm:flex items-center gap-2"
                        >
                            <Search className="w-5 h-5 text-accent-100" />
                            <span className="text-accent-100 text-sm">AI Analysis</span>
                        </motion.div>
                    </div>
                </div>
            </motion.div>

            <motion.div
                className="bg-white rounded-xl shadow-lg"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <div className="p-6 sm:p-8">
                    <form onSubmit={handleAnalyze} className="space-y-6">
                        <motion.div className="space-y-4">
                            <label className="block text-sm font-medium text-slate-700">
                                Blog Content for Analysis
                            </label>
                            <textarea
                                value={blogText}
                                onChange={(e) => setBlogText(e.target.value)}
                                className="w-full h-64 px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent transition duration-200"
                                placeholder="Paste your blog content here..."
                                required
                            />
                        </motion.div>

                        <div className="flex flex-col sm:flex-row gap-3 mt-8">
                            <motion.button
                                type="submit"
                                disabled={loading}
                                className={`flex-1 px-6 py-3 rounded-lg font-medium flex items-center justify-center
                                    ${loading ? 'bg-accent-400' : 'bg-accent-600 hover:bg-accent-700'} text-white
                                    transition duration-200`}
                                whileHover={!loading ? { scale: 1.02 } : {}}
                                whileTap={!loading ? { scale: 0.98 } : {}}
                            >
                                {loading ? (
                                    <div className="flex items-center gap-2">
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        <span>Analyzing...</span>
                                    </div>
                                ) : (
                                    <span>Analyze Content</span>
                                )}
                            </motion.button>

                            <motion.button
                                type="button"
                                onClick={handleRefresh}
                                className="px-6 py-3 bg-slate-50 text-slate-700 rounded-lg hover:bg-slate-100
                                    flex items-center justify-center gap-2 transition duration-200"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <RotateCw className="w-4 h-4" />
                                <span>Reset</span>
                            </motion.button>
                        </div>
                    </form>
                </div>
            </motion.div>

            <AnimatePresence mode="wait">
                {loading && <ProcessingOverlay key="processing-overlay" />}
            </AnimatePresence>

            <AnimatePresence>
                {analysisData && (
                    <motion.div
                        className="mt-6 bg-white rounded-xl shadow-lg overflow-hidden"
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        variants={containerVariants}
                    >
                        <div className="p-6 sm:p-8">
                            {/* Hero: Quality Score gauge */}
                            {(() => {
                                const score = Math.round(analysisData.qualityAnalysis.overallScore);
                                const theme = scoreTheme(score);
                                const circumference = 2 * Math.PI * 42;
                                return (
                                    <motion.div
                                        className="mb-8 flex flex-col sm:flex-row items-center gap-6 rounded-2xl border border-slate-100 bg-slate-50/70 p-6"
                                        variants={cardVariants}
                                    >
                                        <div className="relative w-32 h-32 shrink-0">
                                            <svg className="w-32 h-32 -rotate-90" viewBox="0 0 100 100">
                                                <circle cx="50" cy="50" r="42" fill="none" stroke="#e2e8f0" strokeWidth="9" />
                                                <motion.circle
                                                    cx="50" cy="50" r="42" fill="none"
                                                    className={theme.ring}
                                                    stroke="currentColor" strokeWidth="9" strokeLinecap="round"
                                                    strokeDasharray={circumference}
                                                    initial={{ strokeDashoffset: circumference }}
                                                    animate={{ strokeDashoffset: circumference - (score / 100) * circumference }}
                                                    transition={{ duration: 1, ease: 'easeOut' }}
                                                />
                                            </svg>
                                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                                <span className={`text-3xl font-bold ${theme.text}`}>{score}%</span>
                                                <span className="text-xs text-slate-400">quality</span>
                                            </div>
                                        </div>
                                        <div className="text-center sm:text-left">
                                            <h2 className="text-lg font-semibold text-slate-900">Overall Quality Score</h2>
                                            <p className="mt-1 text-slate-600 max-w-md">{analysisData.qualityAnalysis.interpretation}</p>
                                        </div>
                                    </motion.div>
                                );
                            })()}

                            {/* Basic Metrics */}
                            <motion.div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                                {Object.entries(analysisData.qualityAnalysis.metrics).map(([key, value], index) => (
                                    <motion.div
                                        key={key}
                                        className="bg-white p-4 rounded-xl border border-slate-100 shadow-card"
                                        variants={textVariants}
                                        transition={{ delay: index * 0.05 }}
                                        whileHover={{ y: -3 }}
                                    >
                                        <h3 className="text-xs font-medium text-slate-400 uppercase tracking-wide capitalize">
                                            {key.replace(/([A-Z])/g, ' $1').trim()}
                                        </h3>
                                        <p className="mt-1 text-2xl font-bold text-slate-900">{value}</p>
                                    </motion.div>
                                ))}
                            </motion.div>

                            {/* Sentiment + Topics */}
                            <motion.div className="mb-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Sentiment Analysis Card */}
                                    <motion.div
                                        className="bg-white p-5 rounded-xl border border-slate-100 shadow-card"
                                        variants={cardVariants}
                                    >
                                        <h3 className="text-sm font-medium text-slate-500">Content Sentiment</h3>
                                        <p className="mt-1 text-xl font-semibold text-slate-900 capitalize">{analysisData.sentiment.type}</p>
                                        <div className="mt-3 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-accent-500 rounded-full"
                                                style={{ width: `${analysisData.sentiment.confidence}%` }}
                                            />
                                        </div>
                                        <p className="text-xs text-slate-400 mt-2">
                                            {analysisData.sentiment.confidence}% confidence
                                        </p>
                                    </motion.div>

                                    {/* Topics Card */}
                                    <motion.div
                                        className="bg-white p-5 rounded-xl border border-slate-100 shadow-card"
                                        variants={cardVariants}
                                    >
                                        <h3 className="text-sm font-medium text-slate-500 mb-2">Main Topics</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {analysisData.topics.map((topic, index) => (
                                                <span
                                                    key={index}
                                                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-accent-50 text-accent-700 text-sm font-medium capitalize"
                                                >
                                                    {topic.topic}
                                                    <span className="text-xs text-accent-400">{topic.confidence}</span>
                                                </span>
                                            ))}
                                        </div>
                                    </motion.div>
                                </div>
                            </motion.div>

                            {/* Content Scores */}
                            <motion.div variants={containerVariants} className="mb-8">
                                <h2 className="text-lg font-semibold text-slate-900 mb-4">Content Scores</h2>
                                <div className="space-y-4">
                                    {Object.entries(analysisData.qualityAnalysis.scores).map(([key, value], index) => {
                                        const pct = Math.round(value * 100);
                                        const theme = scoreTheme(pct);
                                        return (
                                            <motion.div
                                                key={key}
                                                className="space-y-2"
                                                initial={{ opacity: 0, y: 8 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: index * 0.08 }}
                                            >
                                                <div className="flex justify-between">
                                                    <span className="text-sm font-medium text-slate-600 capitalize">{key}</span>
                                                    <span className={`text-sm font-semibold ${theme.text}`}>{pct}%</span>
                                                </div>
                                                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                                    <motion.div
                                                        className={`h-2 rounded-full ${theme.bar}`}
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${pct}%` }}
                                                        transition={{ duration: 0.8, ease: 'easeOut', delay: index * 0.08 }}
                                                    />
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            </motion.div>

                            {/* Keywords */}
                            <motion.div variants={containerVariants} className="mb-8">
                                <h2 className="text-lg font-semibold text-slate-900 mb-4">Key Terms</h2>
                                <div className="flex flex-wrap gap-3">
                                    {analysisData.keywords.map((keyword, index) => (
                                        <motion.div
                                            key={index}
                                            className="bg-slate-50 p-3 rounded-lg border border-slate-100 shadow-sm flex-grow sm:flex-grow-0"
                                            variants={textVariants}
                                            transition={{ delay: index * 0.1 }}
                                            whileHover={{ scale: 1.03 }}
                                        >
                                            <div className="flex items-center justify-between gap-3">
                                                <span className="font-medium text-slate-800">{keyword.keyword}</span>
                                                <span className="text-sm text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
                                                    {keyword.relevance}
                                                </span>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>

                            {/* Recommendations */}
                            <motion.div variants={containerVariants}>
                                <h2 className="text-lg font-semibold text-slate-900 mb-4">Recommendations</h2>
                                <ul className="space-y-3">
                                    {analysisData.qualityAnalysis.recommendations.map((recommendation, index) => (
                                        <motion.li
                                            key={index}
                                            className="flex items-start gap-3 bg-accent-50/60 border border-accent-100 p-4 rounded-xl"
                                            variants={textVariants}
                                            transition={{ delay: index * 0.08 }}
                                        >
                                            <CheckCircle2 className="w-5 h-5 text-accent-600 shrink-0 mt-0.5" />
                                            <span className="text-slate-700">{recommendation}</span>
                                        </motion.li>
                                    ))}
                                </ul>
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
export default BlogAnalysis;