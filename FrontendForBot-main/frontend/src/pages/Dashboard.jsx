import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import api from '../api';
import useAuth from '../hooks/useAuth';
import { pageVariants, pageTransition, containerVariants, itemVariants } from '../utils/motionVariants';
import Card from '../components/common/Card';
import Spinner from '../components/common/Spinner';
import AnimatedButton from '../components/common/AnimatedButton';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { FileText, Activity, UserCheck, MessageSquare } from 'lucide-react';

const Dashboard = () => {
    const [assessments, setAssessments] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        const fetchAssessments = async () => {
            try {
                const { data } = await api.get('/assessments');
                setAssessments(data);
            } catch (error) {
                console.error("Failed to fetch assessments", error);
            } finally {
                setLoading(false);
            }
        };
        fetchAssessments();
    }, []);

    const latestAssessment = assessments[0];
    const chartData = assessments.map(a => ({
        name: new Date(a.createdAt).toLocaleDateString(),
        score: a.score,
    })).reverse();
    
    const riskLevelInfo = {
        'Low Risk': { color: 'text-green-500', bg: 'bg-green-100' },
        'Moderate Risk': { color: 'text-yellow-500', bg: 'bg-yellow-100' },
        'High Risk': { color: 'text-red-500', bg: 'bg-red-100' },
        'N/A': { color: 'text-gray-500', bg: 'bg-gray-100' },
    };
    const riskInfo = riskLevelInfo[latestAssessment?.riskLevel.label || 'N/A'];


    if (loading) {
        return <div className="flex justify-center items-center h-full"><Spinner /></div>;
    }

    return (
        <motion.div
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
        >
            <motion.div variants={containerVariants} initial="hidden" animate="visible">
                <motion.h1 variants={itemVariants} className="text-4xl font-bold mb-2 text-gray-800">Welcome, {user.name}</motion.h1>
                <motion.p variants={itemVariants} className="text-lg text-text-light mb-8">Here's your personalized progress dashboard.</motion.p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <motion.div variants={itemVariants}>
                        <Card className="!bg-blue-500 !text-white">
                            <UserCheck className="w-8 h-8 opacity-80 mb-2" />
                            <h3 className="font-bold text-lg">Assessments Taken</h3>
                            <p className="text-3xl font-extrabold">{assessments.length}</p>
                        </Card>
                    </motion.div>
                    <motion.div variants={itemVariants}>
                        <Card className="!bg-green-500 !text-white">
                            <FileText className="w-8 h-8 opacity-80 mb-2" />
                            <h3 className="font-bold text-lg">Latest Score</h3>
                            <p className="text-3xl font-extrabold">
                                {latestAssessment ? `${latestAssessment.score} / ${latestAssessment.maxScore}` : 'N/A'}
                            </p>
                        </Card>
                    </motion.div>
                    <motion.div variants={itemVariants}>
                        <Card className={`${riskInfo.bg}`}>
                            <Activity className={`w-8 h-8 ${riskInfo.color} mb-2`} />
                            <h3 className="font-bold text-lg text-gray-700">Risk Level</h3>
                            <p className={`text-2xl font-bold ${riskInfo.color}`}>
                                {latestAssessment ? latestAssessment.riskLevel.label : 'N/A'}
                            </p>
                        </Card>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mb-8">
                    <motion.div variants={itemVariants} className="lg:col-span-3">
                        <Card>
                            <h2 className="text-2xl font-bold mb-4 text-gray-700">Your Progress Over Time</h2>
                            {assessments.length > 0 ? (
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={chartData}>
                                        <XAxis dataKey="name" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Bar dataKey="score" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            ) : (
                                <p className="text-center text-text-light py-16">Take an assessment to see your progress!</p>
                            )}
                        </Card>
                    </motion.div>
                    
                    <motion.div variants={itemVariants} className="lg:col-span-2 space-y-8">
                        <Card className="flex flex-col justify-center items-center text-center h-full bg-gradient-to-br from-primary to-indigo-600 text-white">
                            <MessageSquare className="w-12 h-12 mb-4" />
                            <h2 className="text-2xl font-bold mb-2">Have Questions?</h2>
                            <p className="mb-4 opacity-90">Our AI Assistant can provide insights and answer your questions.</p>
                            <Link to="/ai-assistant">
                                <AnimatedButton variant="secondary" className="!bg-white !text-primary-dark">
                                    Talk to AI
                                </AnimatedButton>
                            </Link>
                        </Card>
                    </motion.div>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default Dashboard;