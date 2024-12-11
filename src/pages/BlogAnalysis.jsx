import React, { useState, useEffect } from 'react';
import useBlog from '../hooks/useBlog';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCw, LineChart, Search, Sparkles, Loader2 } from 'lucide-react';

const BlogAnalysis = () => {
    const [blogText, setBlogText] = useState('');
    const {
        loading,
        progress,
        analyzeContent,
        getAnalysisData,
        clearAnalysis,
        cleanup,
        formatQualityMetrics,
        formatKeywords,
        formatTopics
    } = useBlog();

    const analysisData = getAnalysisData();

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

    const progressBarVariants = {
        hidden: { width: 0 },
        visible: width => ({
            width: `${width}%`,
            transition: { duration: 1, ease: "easeOut" }
        })
    };

    const processingContainerVariants = {
        hidden: { opacity: 0, scale: 0.8 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: {
                duration: 0.5,
                ease: "easeOut"
            }
        },
        exit: {
            opacity: 0,
            scale: 0.8,
            transition: {
                duration: 0.3
            }
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
                        className="w-16 h-16 border-4 border-blue-200 rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    />
                    <motion.div
                        className="absolute top-0 left-0 w-16 h-16 border-4 border-t-blue-600 rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                    />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Analyzing Content</h3>
                <p className="text-gray-600 text-center mb-4">Please wait while we analyze your content</p>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                    <motion.div
                        className="h-full bg-blue-600 rounded-full origin-left"
                        style={{ width: `${progress}%` }}
                        transition={{ duration: 0.3 }}
                        layoutId="progressBar"
                    />
                </div>
                <span className="text-sm text-gray-500">{progress}% Complete</span>
            </motion.div>
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-20">
            <motion.div
                className="relative mb-6 rounded-xl bg-gradient-to-br from-purple-600 via-purple-700 to-purple-800 overflow-hidden will-change-transform"
                variants={headerContainerVariants}
                initial="hidden"
                animate="visible"
                style={{
                    transform: 'translate3d(0, 0, 0)',
                    backfaceVisibility: 'hidden'
                }}
            >
                <div className="absolute top-0 right-0 w-40 h-40 bg-purple-500/20 rounded-full -mr-20 -mt-20 blur-3xl transform-gpu" />
                <div className="absolute bottom-0 left-0 w-40 h-40 bg-purple-600/20 rounded-full -ml-20 -mb-20 blur-3xl transform-gpu" />
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
                                <p className="mt-1 text-sm sm:text-base text-purple-100">
                                    Analyze your content quality and insights
                                </p>
                            </div>
                        </motion.div>
                        <motion.div
                            variants={iconVariants}
                            className="hidden sm:flex items-center gap-2"
                        >
                            <Search className="w-5 h-5 text-purple-100" />
                            <span className="text-purple-100 text-sm">AI Analysis</span>
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
                            <label className="block text-sm font-medium text-gray-700">
                                Blog Content for Analysis
                            </label>
                            <textarea
                                value={blogText}
                                onChange={(e) => setBlogText(e.target.value)}
                                className="w-full h-64 px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200"
                                placeholder="Paste your blog content here..."
                                required
                            />
                        </motion.div>

                        <div className="flex flex-col sm:flex-row gap-3 mt-8">
                            <motion.button
                                type="submit"
                                disabled={loading}
                                className={`flex-1 px-6 py-3 rounded-lg font-medium flex items-center justify-center
                                    ${loading ? 'bg-purple-400' : 'bg-purple-600 hover:bg-purple-700'} text-white
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
                                className="px-6 py-3 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100
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
                            {/* Basic Metrics */}
                            <motion.div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                                {Object.entries(analysisData.qualityAnalysis.metrics).map(([key, value], index) => (
                                    <motion.div
                                        key={key}
                                        className="bg-gray-50 p-4 rounded-lg"
                                        variants={textVariants}
                                        transition={{ delay: index * 0.1 }}
                                        whileHover={{ scale: 1.05 }}
                                    >
                                        <h3 className="text-sm font-medium text-gray-500 capitalize">
                                            {key.replace(/([A-Z])/g, ' $1').trim()}
                                        </h3>
                                        <p className="mt-1 text-xl font-semibold">{value}</p>
                                    </motion.div>
                                ))}
                            </motion.div>

                            {/* Overall Analysis Section */}
                            <motion.div className="mb-8">
                                <h2 className="text-xl font-semibold mb-4">Overall Analysis</h2>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {/* Quality Score Card */}
                                    <motion.div
                                        className="bg-gray-50 p-4 rounded-lg"
                                        variants={cardVariants}
                                        whileHover={{ scale: 1.02 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <h3 className="text-sm font-medium text-gray-500">Quality Score</h3>
                                        <p className="mt-1 text-2xl font-semibold">{analysisData.qualityAnalysis.overallScore}%</p>
                                        <p className="text-sm text-gray-600 mt-2">{analysisData.qualityAnalysis.interpretation}</p>
                                    </motion.div>

                                    {/* Sentiment Analysis Card */}
                                    <motion.div
                                        className="bg-gray-50 p-4 rounded-lg"
                                        variants={cardVariants}
                                        whileHover={{ scale: 1.02 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <h3 className="text-sm font-medium text-gray-500">Content Sentiment</h3>
                                        <p className="mt-1 text-xl font-semibold">{analysisData.sentiment.type}</p>
                                        <p className="text-sm text-gray-600 mt-2">
                                            Confidence: {analysisData.sentiment.confidence}%
                                        </p>
                                    </motion.div>

                                    {/* Topics Card */}
                                    <motion.div
                                        className="bg-gray-50 p-4 rounded-lg"
                                        variants={cardVariants}
                                        whileHover={{ scale: 1.02 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <h3 className="text-sm font-medium text-gray-500">Main Topics</h3>
                                        <div className="mt-2 space-y-2">
                                            {analysisData.topics.map((topic, index) => (
                                                <div key={index} className="flex justify-between items-center">
                                                    <span className="text-gray-700 capitalize">{topic.topic}</span>
                                                    <span className="text-sm text-gray-500">{topic.confidence}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </motion.div>
                                </div>
                            </motion.div>

                            {/* Content Scores */}
                            <motion.div variants={containerVariants} className="mb-8">
                                <h2 className="text-xl font-semibold mb-4">Content Scores</h2>
                                <div className="space-y-4">
                                    {Object.entries(analysisData.qualityAnalysis.scores).map(([key, value], index) => (
                                        <motion.div
                                            key={key}
                                            className="space-y-2"
                                            initial="hidden"
                                            animate="visible"
                                            transition={{ delay: index * 0.2 }}
                                        >
                                            <div className="flex justify-between">
                                                <span className="text-sm font-medium text-gray-600 capitalize">{key}</span>
                                                <span className="text-sm font-medium">{(value * 100).toFixed(0)}%</span>
                                            </div>
                                            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                                <motion.div
                                                    className="h-2 bg-purple-600 rounded-full"
                                                    custom={value * 100}
                                                    variants={progressBarVariants}
                                                />
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>

                            {/* Keywords */}
                            <motion.div variants={containerVariants} className="mb-8">
                                <h2 className="text-xl font-semibold mb-4">Key Terms</h2>
                                <div className="flex flex-wrap gap-3">
                                    {analysisData.keywords.map((keyword, index) => (
                                        <motion.div
                                            key={index}
                                            className="bg-gray-50 p-3 rounded-lg border border-gray-100 shadow-sm flex-grow sm:flex-grow-0"
                                            variants={textVariants}
                                            transition={{ delay: index * 0.1 }}
                                            whileHover={{ scale: 1.03 }}
                                        >
                                            <div className="flex items-center justify-between gap-3">
                                                <span className="font-medium text-gray-800">{keyword.keyword}</span>
                                                <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                                                    {keyword.relevance}
                                                </span>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>

                            {/* Recommendations */}
                            <motion.div variants={containerVariants}>
                                <h2 className="text-xl font-semibold mb-4">Recommendations</h2>
                                <ul className="space-y-3">
                                    {analysisData.qualityAnalysis.recommendations.map((recommendation, index) => (
                                        <motion.li
                                            key={index}
                                            className="flex items-start bg-gray-50 p-4 rounded-lg"
                                            variants={textVariants}
                                            transition={{ delay: index * 0.1 }}
                                            whileHover={{ x: 10 }}
                                        >
                                            <span className="text-purple-600 mr-3">•</span>
                                            <span className="text-gray-700">{recommendation}</span>
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