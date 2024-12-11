import { useState, useCallback, useRef } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});


const useBlog = () => {
    const [loading, setLoading] = useState(false);
    const [analysisResult, setAnalysisResult] = useState(null);
    const [generatedContent, setGeneratedContent] = useState(null);
    const [progress, setProgress] = useState(0);
    const pollingRef = useRef(null);

    const pollJobStatus = useCallback(async (jobId, onComplete) => {
        try {
            const response = await api.get(`/blog/status/${jobId}`);
            const { success, status, data, error } = response.data;

            if (status === 'completed' && success) {
                setProgress(100);
                clearInterval(pollingRef.current);
                onComplete(data);
                return true;
            } else if (!success || error) {
                clearInterval(pollingRef.current);
                throw new Error(error || 'Processing failed');
            } else {
                setProgress((prev) => Math.min(prev + 10, 90));
            }
            return false;
        } catch (error) {
            clearInterval(pollingRef.current);
            throw error;
        }
    }, []);

    const startPolling = useCallback(async (jobId, onComplete) => {
        setProgress(10);
        pollingRef.current = setInterval(async () => {
            try {
                await pollJobStatus(jobId, onComplete);
            } catch (error) {
                toast.error(error.message);
                setLoading(false);
            }
        }, 2000);

        // Stop polling after 5 minutes
        setTimeout(() => {
            if (pollingRef.current) {
                clearInterval(pollingRef.current);
                setLoading(false);
                toast.error('Request timed out. Please try again.');
            }
        }, 300000);
    }, [pollJobStatus]);

    const analyzeContent = async (text) => {
        setLoading(true);
        setProgress(0);
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Authentication required');
            }

            const response = await api.post('/blog/analyze', { text });
            const { jobId } = response.data;

            await startPolling(jobId, (data) => {
                setAnalysisResult(data);
                setLoading(false);
                toast.success('Analysis completed successfully!');
            });

        } catch (error) {
            setLoading(false);
            setProgress(0);
            if (error.response?.status === 401) {
                toast.error('Please login to analyze content');
            } else {
                toast.error(error.response?.data?.error || 'Failed to analyze content');
            }
            throw error;
        }
    };

    const cleanup = useCallback(() => {
        if (pollingRef.current) {
            clearInterval(pollingRef.current);
        }
    }, []);

    const clearAnalysis = () => {
        setAnalysisResult(null);
        setProgress(0);
    };

    const formatQualityMetrics = (metrics) => {
        if (!metrics) return null;
        return {
            wordCount: metrics.word_count || 0,
            sentenceCount: metrics.sentence_count || 0,
            avgSentenceLength: metrics.avg_sentence_length?.toFixed(2) || 0,
            avgWordLength: metrics.avg_word_length?.toFixed(2) || 0,
        };
    };

    const formatKeywords = (keywords) => {
        if (!keywords) return [];
        return keywords.map(k => ({
            keyword: k.keyword,
            relevance: (k.relevance * 100).toFixed(1) + '%'
        }));
    };

    const formatTopics = (topics) => {
        if (!topics) return [];
        return topics.map(t => ({
            topic: t.topic,
            confidence: (t.confidence * 100).toFixed(1) + '%'
        }));
    };

    // Get formatted analysis data
    const getAnalysisData = () => {
        if (!analysisResult) return null;

        return {
            qualityAnalysis: {
                scores: analysisResult.quality_analysis.scores,
                metrics: formatQualityMetrics(analysisResult.quality_analysis.metrics),
                overallScore: (analysisResult.quality_analysis.overall_score * 100).toFixed(1),
                interpretation: analysisResult.quality_analysis.interpretation,
                recommendations: analysisResult.quality_analysis.recommendations
            },
            keywords: formatKeywords(analysisResult.keywords),
            sentiment: {
                type: analysisResult.sentiment.sentiment,
                confidence: (analysisResult.sentiment.confidence * 100).toFixed(1)
            },
            topics: formatTopics(analysisResult.topics)
        };
    };

    const generateContent = async (formData) => {
        setLoading(true);
        setProgress(0);
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Authentication required');
            }

            const response = await api.post('/blog/generate', formData);
            const { jobId } = response.data;

            await startPolling(jobId, (data) => {
                setGeneratedContent(data);
                setLoading(false);
                toast.success('Content generated successfully!');
            });

        } catch (error) {
            setLoading(false);
            setProgress(0);
            if (error.response?.status === 401) {
                toast.error('Please login to generate content');
            } else {
                toast.error(error.response?.data?.error || 'Failed to generate content');
            }
            throw error;
        }
    };

    const clearGeneratedContent = () => {
        setGeneratedContent(null);
        setProgress(0);
    };

    const formatGeneratedContent = (content) => {
        if (!content) return null;

        return {
            content: content.content || '',
            metadata: {
                readTime: content.estimated_read_time || '0 min',
                wordCount: content.word_count || 0,
                metaDescription: content.meta_description || '',
                title: content.title || '',
                keywords: content.keywords || [],
                tone: content.tone || 'neutral'
            }
        };
    };

    return {
        // Analysis-related
        loading,
        progress,
        analysisResult,
        analyzeContent,
        clearAnalysis,
        cleanup,
        getAnalysisData,
        formatQualityMetrics,
        formatKeywords,
        formatTopics,

        // Generation-related
        generatedContent: formatGeneratedContent(generatedContent),
        generateContent,
        clearGeneratedContent,
        readTime: generatedContent?.estimated_read_time || '0 min',
        metaDescription: generatedContent?.meta_description || '',
        word_count: generatedContent?.word_count || 0,
    };
};

export default useBlog;