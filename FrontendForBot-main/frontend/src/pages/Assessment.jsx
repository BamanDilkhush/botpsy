import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import toast from 'react-hot-toast';
import Spinner from '../components/common/Spinner';
import AnimatedButton from '../components/common/AnimatedButton';
import { ArrowLeft, ArrowRight, User as UserIcon, Baby } from 'lucide-react';
import { pageVariants, pageTransition } from '../utils/motionVariants';

const Assessment = () => {
    const [step, setStep] = useState(0);
    const [userType, setUserType] = useState('self');
    const [age, setAge] = useState('');
    const [language, setLanguage] = useState('en');
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [responses, setResponses] = useState({});
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const getAgeGroup = (age) => {
        if (age >= 2 && age < 5) return '2-5';
        if (age >= 5 && age < 12) return '5-12';
        if (age >= 12 && age < 16) return '12-16';
        if (age >= 16) return '16+';
        return null;
    };

    const fetchQuestions = async () => {
        const ageGroup = getAgeGroup(parseInt(age));
        if (!ageGroup) {
            toast.error("Invalid age for assessment.");
            return;
        }
        setLoading(true);
        try {
            const { data } = await api.get(`/questions/assessment?ageGroup=${ageGroup}&language=${language}`);
            if (data && data.length > 0) {
                setQuestions(data);
                setStep(2);
            } else {
                toast.error(`Sorry, no questions are available for the age group: ${ageGroup}.`);
                setStep(0);
            }
        } catch (error) {
            toast.error("Failed to fetch questions.");
        } finally {
            setLoading(false);
        }
    };

    const handleNext = () => {
        if (step === 0) {
            if (!age) { toast.error("Please enter an age."); return; }
            setStep(1);
        } else if (step === 1) {
            fetchQuestions();
        } else if (step === 2) {
            if (responses[questions[currentQuestionIndex]._id] === undefined) {
                toast.error("Please select an option.");
                return;
            }
            if (currentQuestionIndex < questions.length - 1) {
                setCurrentQuestionIndex(prev => prev + 1);
            } else {
                handleSubmit();
            }
        }
    };

    const handlePrev = () => {
        if (step > 0 && currentQuestionIndex === 0) {
            setStep(prev => prev - 1);
        } else if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(prev => prev - 1);
        }
    };

    const handleOptionSelect = (questionId, optionIndex) => {
        setResponses(prev => ({ ...prev, [questionId]: optionIndex }));
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            await api.post('/assessments', { userType, age, language, responses });
            toast.success("Assessment submitted successfully!");
            navigate('/dashboard');
        } catch (error) {
            toast.error("Failed to submit assessment.");
        } finally {
            setLoading(false);
        }
    };

    const renderStepContent = () => {
        const SelectionCard = ({ onClick, isSelected, icon, text }) => (
            <motion.button
                onClick={onClick}
                className={`p-6 rounded-xl border-2 w-40 h-40 flex flex-col items-center justify-center transition-all duration-200 ${isSelected ? 'border-primary bg-primary/10 scale-105' : 'border-gray-300 bg-white hover:border-primary/50'}`}
                whileHover={{ y: -5 }}
            >
                {icon}
                <span className="mt-2 font-semibold">{text}</span>
            </motion.button>
        );

        switch (step) {
            case 0:
                return (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
                        <h2 className="text-3xl font-bold mb-8">Who is this assessment for?</h2>
                        <div className="flex justify-center gap-6 mb-8">
                            <SelectionCard onClick={() => setUserType('self')} isSelected={userType === 'self'} icon={<UserIcon className="w-12 h-12 text-primary" />} text="For Myself" />
                            <SelectionCard onClick={() => setUserType('child')} isSelected={userType === 'child'} icon={<Baby className="w-12 h-12 text-primary" />} text="For My Child" />
                        </div>
                        <input type="number" value={age} onChange={e => setAge(e.target.value)} placeholder="Enter Age" className="w-full max-w-xs p-3 border border-gray-300 rounded-lg text-center text-lg" />
                    </motion.div>
                );
            case 1:
                return (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
                        <h2 className="text-3xl font-bold mb-8">Choose Assessment Language</h2>
                        <div className="flex justify-center gap-6">
                            <SelectionCard onClick={() => setLanguage('en')} isSelected={language === 'en'} icon={<span className="text-5xl">🇺🇸</span>} text="English" />
                            <SelectionCard onClick={() => setLanguage('hi')} isSelected={language === 'hi'} icon={<span className="text-5xl">🇮🇳</span>} text="हिंदी" />
                        </div>
                    </motion.div>
                );
            case 2:
                if (!questions || questions.length === 0) return <p className="text-center text-text-light">Loading questions...</p>;
                const q = questions[currentQuestionIndex];
                return (
                    <AnimatePresence mode="wait">
                        <motion.div key={currentQuestionIndex} initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -50, opacity: 0 }} transition={{ duration: 0.3 }}>
                            <p className="text-sm text-text-light mb-2">Question {currentQuestionIndex + 1} of {questions.length}</p>
                            <h2 className="text-2xl font-bold mb-6 text-gray-800">{q.question}</h2>
                            <div className="space-y-4">
                                {q.options.map((option, index) => (
                                    <motion.button
                                        key={index}
                                        onClick={() => handleOptionSelect(q._id, index)}
                                        className={`w-full text-left p-4 rounded-lg border-2 font-medium transition-all ${responses[q._id] === index ? 'border-primary bg-primary/10 text-primary-dark scale-105 shadow-lg' : 'border-gray-300 bg-white hover:border-primary/50'}`}
                                        whileHover={{ y: -3 }}
                                    >
                                        {option}
                                    </motion.button>
                                ))}
                            </div>
                        </motion.div>
                    </AnimatePresence>
                );
            default: return null;
        }
    };

    return (
        <motion.div
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
            className="max-w-3xl mx-auto"
        >
            <div className="bg-surface p-8 rounded-2xl shadow-xl">
                {loading ? <div className="flex justify-center items-center min-h-[400px]"><Spinner /></div> : (
                    <>
                        {step === 2 && questions.length > 0 && (
                            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-8">
                                <motion.div
                                    className="bg-gradient-to-r from-green-400 to-blue-500 h-2.5 rounded-full"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                                    transition={{ duration: 0.5, ease: 'easeInOut' }}
                                />
                            </div>
                        )}
                        <div className="min-h-[350px] flex items-center justify-center">
                            {renderStepContent()}
                        </div>
                        <div className="flex justify-between mt-10 pt-6 border-t">
                            <AnimatedButton onClick={handlePrev} variant="secondary" disabled={(step === 0 && currentQuestionIndex === 0) || step === 1}>
                                <ArrowLeft className="w-4 h-4 mr-2" /> Previous
                            </AnimatedButton>
                            <AnimatedButton onClick={handleNext}>
                                {step === 2 && questions.length > 0 && currentQuestionIndex === questions.length - 1 ? 'Finish Assessment' : 'Next'} <ArrowRight className="w-4 h-4 ml-2" />
                            </AnimatedButton>
                        </div>
                    </>
                )}
            </div>
        </motion.div>
    );
};

export default Assessment;