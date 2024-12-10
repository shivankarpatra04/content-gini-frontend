// src/pages/BlogGenerator.jsx
import React, { useState, useEffect } from 'react';  // Added useEffect
import useBlog from '../hooks/useBlog';
import toast from 'react-hot-toast';
import { marked } from 'marked';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCw, Edit3, Sparkles, Loader2 } from 'lucide-react';

const BlogGenerator = () => {
    const {
        loading,
        progress, // Added progress
        generatedContent,
        generateContent,
        readTime,
        metaDescription,
        word_count,
        clearGeneratedContent,
        cleanup // Added cleanup
    } = useBlog();

    const [blogData, setBlogData] = useState({
        title: '',
        keywords: '',
        tone: 'informative',
    });

    useEffect(() => {
        return () => cleanup();
    }, [cleanup]);

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

    const typingAnimation = {
        hidden: { opacity: 0, width: '0%' },
        visible: {
            opacity: 1,
            width: '100%',
            transition: { duration: 1.5, ease: "easeOut" }
        }
    };

    const loadingVariants = {
        animate: {
            scale: [1, 1.2, 1],
            rotate: [0, 360],
            transition: {
                duration: 1.5,
                repeat: Infinity,
                ease: "linear"
            }
        }
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

    const handleRefresh = () => {
        setBlogData({
            title: '',
            keywords: '',
            tone: 'informative'
        });
        clearGeneratedContent();
        toast.success('Form has been reset!');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const keywordsArray = blogData.keywords
            .split(',')
            .map(k => k.trim())
            .filter(k => k);

        if (!blogData.title && keywordsArray.length === 0) {
            toast.error('Please provide either a title or keywords');
            return;
        }

        try {
            await generateContent({
                title: blogData.title,
                keywords: keywordsArray,
                tone: blogData.tone
            });
        } catch (error) {
            console.error('Generation error:', error);
            toast.error('Failed to generate content');
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
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Generating Blog</h3>
                <p className="text-gray-600 text-center mb-4">Please wait while we create your content</p>
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

    const renderMarkdown = (content) => {
        if (!content) return '';
        return { __html: marked(content) };
    };

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-20">
            <motion.div
                className="relative mb-6 rounded-xl bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 overflow-hidden will-change-transform"
                variants={headerContainerVariants}
                initial="hidden"
                animate="visible"
                style={{
                    transform: 'translate3d(0, 0, 0)',
                    backfaceVisibility: 'hidden'
                }}
            >
                <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/20 rounded-full -mr-20 -mt-20 blur-3xl transform-gpu" />
                <div className="absolute bottom-0 left-0 w-40 h-40 bg-blue-600/20 rounded-full -ml-20 -mb-20 blur-3xl transform-gpu" />
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
                                <Edit3 className="w-6 h-6 text-white" />
                            </motion.div>
                            <div>
                                <h1 className="text-2xl sm:text-3xl font-bold text-white">
                                    Blog Generator
                                </h1>
                                <p className="mt-1 text-sm sm:text-base text-blue-100">
                                    Create engaging content with AI
                                </p>
                            </div>
                        </motion.div>
                        <motion.div
                            variants={iconVariants}
                            className="hidden sm:flex items-center gap-2"
                        >
                            <Sparkles className="w-5 h-5 text-blue-100" />
                            <span className="text-blue-100 text-sm">AI-Powered</span>
                        </motion.div>
                    </div>
                </div>
            </motion.div>

            <AnimatePresence mode="wait">
                {loading && <ProcessingOverlay key="processing-overlay" />}
            </AnimatePresence>

            <motion.div
                className="bg-white rounded-xl shadow-lg"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <div className="p-6 sm:p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <motion.div className="space-y-4">
                            <label className="block text-sm font-medium text-gray-700">
                                Blog Title
                            </label>
                            <input
                                type="text"
                                value={blogData.title}
                                onChange={(e) => setBlogData({ ...blogData, title: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                                placeholder="Enter your blog title"
                                required
                            />
                        </motion.div>

                        <motion.div className="space-y-4">
                            <label className="block text-sm font-medium text-gray-700">
                                Keywords
                            </label>
                            <input
                                type="text"
                                value={blogData.keywords}
                                onChange={(e) => setBlogData({ ...blogData, keywords: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                                placeholder="technology, innovation, future"
                                required
                            />
                        </motion.div>

                        <motion.div className="space-y-4">
                            <label className="block text-sm font-medium text-gray-700">
                                Tone
                            </label>
                            <select
                                value={blogData.tone}
                                onChange={(e) => setBlogData({ ...blogData, tone: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                            >
                                <option value="informative">Informative</option>
                                <option value="professional">Professional</option>
                                <option value="casual">Casual</option>
                                <option value="formal">Formal</option>
                                <option value="friendly">Friendly</option>
                            </select>
                        </motion.div>

                        <div className="flex flex-col sm:flex-row gap-3 mt-8">
                            <motion.button
                                type="submit"
                                disabled={loading}
                                className={`flex-1 px-6 py-3 rounded-lg font-medium flex items-center justify-center
                                    ${loading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'} text-white
                                    transition duration-200`}
                                whileHover={!loading ? { scale: 1.02 } : {}}
                                whileTap={!loading ? { scale: 0.98 } : {}}
                            >
                                {loading ? (
                                    <div className="flex items-center gap-2">
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        <span>Generating...</span>
                                    </div>
                                ) : (
                                    <span>Generate Blog</span>
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

            <AnimatePresence>
                {generatedContent && (
                    <motion.div
                        className="mt-6 bg-white rounded-xl shadow-lg overflow-hidden"
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        variants={containerVariants}
                    >
                        <div className="p-6 sm:p-8">
                            <motion.h2
                                className="text-xl font-semibold mb-4"
                                variants={typingAnimation}
                            >
                                Generated Content
                            </motion.h2>

                            <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                                {readTime && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.3 }}
                                    >
                                        Reading time: {readTime} minutes
                                    </motion.div>
                                )}
                                {generatedContent.content && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.3 }}
                                    >
                                        Word count: {word_count}
                                    </motion.div>
                                )}
                            </div>

                            <motion.div
                                className="prose max-w-none"
                                variants={typingAnimation}
                            >
                                <div className="mb-6">
                                    <h3 className="text-lg font-medium mb-2">Content:</h3>
                                    <div
                                        className="whitespace-pre-wrap text-gray-700"
                                        dangerouslySetInnerHTML={renderMarkdown(generatedContent.content)}
                                    />
                                </div>

                                {metaDescription && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.5 }}
                                    >
                                        <h3 className="text-lg font-medium mb-2">Meta Description:</h3>
                                        <p className="text-gray-700">{metaDescription}</p>
                                    </motion.div>
                                )}
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}; export default BlogGenerator;