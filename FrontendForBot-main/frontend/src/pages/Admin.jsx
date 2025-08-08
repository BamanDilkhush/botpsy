import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../api';
import toast from 'react-hot-toast';
import { pageVariants, pageTransition, containerVariants, itemVariants } from '../utils/motionVariants';
import Card from '../components/common/Card';
import Spinner from '../components/common/Spinner';
import Modal from '../components/common/Modal';
import AnimatedButton from '../components/common/AnimatedButton';
import QuestionForm from '../components/admin/QuestionForm';
import { Users, FileQuestion, Trash2, Edit, PlusCircle, ShieldCheck } from 'lucide-react';

const Admin = () => {
    const [users, setUsers] = useState([]);
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalType, setModalType] = useState('');
    const [currentItem, setCurrentItem] = useState(null);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [usersRes, questionsRes] = await Promise.all([
                api.get('/users'),
                api.get('/questions')
            ]);
            setUsers(usersRes.data);
            setQuestions(questionsRes.data);
        } catch (error) {
            toast.error("Failed to fetch admin data.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const openModal = (type, item = null) => {
        setModalType(type);
        setCurrentItem(item);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setCurrentItem(null);
        setModalType('');
    };

    const handleDeleteUser = async (id) => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            try {
                await api.delete(`/users/${id}`);
                toast.success("User deleted.");
                fetchData();
            } catch (error) {
                toast.error(error.response?.data?.message || "Failed to delete user.");
            }
        }
    };

    const handleDeleteQuestion = async (id) => {
        if (window.confirm("Are you sure you want to delete this question?")) {
            try {
                await api.delete(`/questions/${id}`);
                toast.success("Question deleted.");
                fetchData();
            } catch (error) {
                toast.error("Failed to delete question.");
            }
        }
    };

    const handleQuestionSubmit = async (formData) => {
        setIsSubmitting(true);
        try {
            if (modalType === 'editQuestion' && currentItem?._id) {
                await api.put(`/questions/${currentItem._id}`, formData);
                toast.success("Question updated successfully!");
            } else {
                await api.post('/questions', formData);
                toast.success("Question created successfully!");
            }
            fetchData();
            closeModal();
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to submit question.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) return <div className="flex justify-center items-center h-full"><Spinner /></div>;

    const StatCard = ({ icon, title, value, colorClass }) => (
        <Card className={`!bg-gradient-to-br ${colorClass} !text-white !shadow-xl`}>
            <div className="flex items-center">
                <div className="p-3 bg-white/25 rounded-xl mr-4">{icon}</div>
                <div>
                    <p className="text-lg font-medium opacity-90">{title}</p>
                    <p className="text-3xl font-bold">{value}</p>
                </div>
            </div>
        </Card>
    );

    return (
        <motion.div
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
        >
            <motion.div variants={containerVariants} initial="hidden" animate="visible">
                <motion.div variants={itemVariants} className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-2">Admin Control Panel</h1>
                    <p className="text-lg text-gray-500">Manage platform data with ease and precision.</p>
                </motion.div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
                    <motion.div variants={itemVariants}>
                        <StatCard icon={<Users className="w-8 h-8" />} title="Total Users" value={users.length} colorClass="from-blue-500 to-indigo-600" />
                    </motion.div>
                    <motion.div variants={itemVariants}>
                        <StatCard icon={<FileQuestion className="w-8 h-8" />} title="Total Questions" value={questions.length} colorClass="from-green-500 to-teal-600" />
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                    <motion.div variants={itemVariants}>
                        <Card className="!p-0">
                            <div className="flex justify-between items-center p-6 border-b border-gray-200">
                                <h2 className="text-2xl font-bold flex items-center"><Users className="mr-3 text-primary" /> User Management</h2>
                                <AnimatedButton disabled className="opacity-50 cursor-not-allowed">Add User</AnimatedButton>
                            </div>
                            <div className="space-y-1 p-4 max-h-[500px] overflow-y-auto">
                                {users.map(user => (
                                    <div key={user._id} className="flex justify-between items-center p-3 transition-colors duration-200 hover:bg-indigo-50 rounded-lg">
                                        <div>
                                            <p className="font-semibold">{user.name} {user.role === 'admin' && <ShieldCheck className="inline w-4 h-4 text-green-600 ml-1" />}</p>
                                            <p className="text-sm text-text-light">{user.email}</p>
                                        </div>
                                        <div className="flex space-x-2">
                                            <AnimatedButton onClick={() => toast.error('Edit user not implemented yet.')} variant="secondary" className="!p-2" title="Edit User"><Edit className="w-4 h-4" /></AnimatedButton>
                                            <AnimatedButton onClick={() => handleDeleteUser(user._id)} variant="danger" className="!p-2" title="Delete User"><Trash2 className="w-4 h-4" /></AnimatedButton>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </motion.div>

                    <motion.div variants={itemVariants}>
                        <Card className="!p-0">
                            <div className="flex justify-between items-center p-6 border-b border-gray-200">
                                <h2 className="text-2xl font-bold flex items-center"><FileQuestion className="mr-3 text-secondary" /> Question Management</h2>
                                <AnimatedButton onClick={() => openModal('addQuestion')} className="bg-secondary hover:bg-green-700">
                                    <PlusCircle className="mr-2 h-4 w-4" /> Add Question
                                </AnimatedButton>
                            </div>
                            <div className="space-y-1 p-4 max-h-[500px] overflow-y-auto">
                                {questions.map(q => (
                                    <div key={q._id} className="flex justify-between items-center p-3 transition-colors duration-200 hover:bg-green-50 rounded-lg">
                                        <p className="font-semibold truncate pr-4" title={q.question_en}>Q{q.questionId}: {q.question_en}</p>
                                        <div className="flex space-x-2">
                                            <AnimatedButton onClick={() => openModal('editQuestion', q)} variant="secondary" className="!p-2" title="Edit Question"><Edit className="w-4 h-4" /></AnimatedButton>
                                            <AnimatedButton onClick={() => handleDeleteQuestion(q._id)} variant="danger" className="!p-2" title="Delete Question"><Trash2 className="w-4 h-4" /></AnimatedButton>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </motion.div>
                </div>
            </motion.div>

            <Modal
                isOpen={isModalOpen}
                onClose={closeModal}
                title={modalType === 'addQuestion' ? 'Add New Question' : 'Edit Question'}
            >
                <QuestionForm
                    onSubmit={handleQuestionSubmit}
                    initialData={modalType === 'editQuestion' ? currentItem : {}}
                    isSubmitting={isSubmitting}
                />
            </Modal>
        </motion.div>
    );
};

export default Admin;