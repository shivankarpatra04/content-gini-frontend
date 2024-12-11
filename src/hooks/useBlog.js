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
            const { status, data, error } = response.data;

            if (status === 'completed') {
                setProgress(100);
                clearInterval(pollingRef.current);
                onComplete(data);
                return true;
            } else if (status === 'failed') {
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

    const generateContent = async (formData) => {
        setLoading(true);
        setProgress(0);
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Authentication required');
            }

            const { title, keywords, tone } = formData;
            const response = await api.post('/blog/generate', {
                title,
                keywords,
                tone
            });
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

    const cleanup = useCallback(() => {
        if (pollingRef.current) {
            clearInterval(pollingRef.current);
        }
    }, []);

    const clearAnalysis = () => {
        setAnalysisResult(null);
        setProgress(0);
    };

    const clearGeneratedContent = () => {
        setGeneratedContent(null);
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

    const getScoreInterpretation = (score) => {
        if (!score) return '';
        if (score >= 90) return 'Excellent - Professional quality content';
        if (score >= 80) return 'Very Good - Minor improvements possible';
        if (score >= 70) return 'Good - Some areas need attention';
        if (score >= 60) return 'Fair - Significant improvements needed';
        return 'Needs Improvement - Major revision required';
    };

    const formatTopics = (topics) => {
        if (!topics) return [];
        return topics.map(t => ({
            topic: t.topic,
            confidence: (t.confidence * 100).toFixed(1) + '%'
        }));
    };

    return {
        loading,
        progress,
        analysisResult,
        generatedContent,
        analyzeContent,
        generateContent,
        clearAnalysis,
        clearGeneratedContent,
        formatQualityMetrics,
        formatKeywords,
        formatTopics,
        cleanup,
        qualityScore: analysisResult?.quality_analysis?.overall_score,
        scoreInterpretation: getScoreInterpretation(analysisResult?.quality_analysis?.overall_score),
        sentiment: analysisResult?.sentiment_analysis?.sentiment,
        sentimentConfidence: analysisResult?.sentiment_analysis?.confidence,
        topics: analysisResult?.topic_analysis?.topics || [],
        recommendations: analysisResult?.quality_analysis?.recommendations || [],
        readTime: generatedContent?.estimated_read_time,
        metaDescription: generatedContent?.meta_description,
        error: generatedContent?.error,
        word_count: generatedContent?.word_count,
    };
};

export default useBlog;