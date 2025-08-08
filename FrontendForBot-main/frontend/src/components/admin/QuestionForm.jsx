import React, { useState, useEffect } from 'react';
import AnimatedButton from '../common/AnimatedButton';

const QuestionForm = ({ onSubmit, initialData = {}, isSubmitting }) => {
    const [formData, setFormData] = useState({
        questionId: '',
        question_en: '',
        question_hi: '',
        options_en: '',
        options_hi: '',
        weightage: '',
        ageGroup: '',
        category: '',
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                questionId: initialData.questionId || '',
                question_en: initialData.question_en || '',
                question_hi: initialData.question_hi || '',
                options_en: (initialData.options_en || []).join(', '),
                options_hi: (initialData.options_hi || []).join(', '),
                weightage: (initialData.weightage || []).join(', '),
                ageGroup: (initialData.ageGroup || []).join(', '),
                category: initialData.category || '',
            });
        }
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const processedData = {
            ...formData,
            questionId: Number(formData.questionId),
            options_en: formData.options_en.split(',').map(s => s.trim()),
            options_hi: formData.options_hi.split(',').map(s => s.trim()),
            weightage: formData.weightage.split(',').map(Number),
            ageGroup: formData.ageGroup.split(',').map(s => s.trim()),
        };
        onSubmit(processedData);
    };

    const renderInput = (name, label, type = 'text', fullWidth = false) => (
        <div className={fullWidth ? 'md:col-span-2' : ''}>
            <label htmlFor={name} className="block text-sm font-medium text-text-light mb-1">
                {label}
            </label>
            {type === 'textarea' ? (
                <textarea
                    id={name}
                    name={name}
                    value={formData[name]}
                    onChange={handleChange}
                    required
                    className="w-full p-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
                    rows={2}
                />
            ) : (
                <input
                    id={name}
                    name={name}
                    type={type}
                    value={formData[name]}
                    onChange={handleChange}
                    required
                    className="w-full p-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
                />
            )}
        </div>
    );

    return (
        <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 bg-gray-50 p-4 rounded-lg">
                {renderInput('questionId', 'Question ID (e.g., 101)', 'number')}
                {renderInput('category', 'Category (e.g., Social)')}
                {renderInput('question_en', 'Question (English)', 'textarea', true)}
                {renderInput('question_hi', 'Question (Hindi)', 'textarea', true)}
                {renderInput('options_en', 'Options EN (comma-separated)', 'textarea', true)}
                {renderInput('options_hi', 'Options HI (comma-separated)', 'textarea', true)}
                {renderInput('weightage', 'Weightage (comma-separated numbers)')}
                {renderInput('ageGroup', 'Age Groups (e.g., 2-5, 16+)')}
            </div>
            <div className="flex justify-end pt-4 sticky bottom-0 bg-surface pb-2">
                <AnimatedButton type="submit" disabled={isSubmitting} className="w-full md:w-auto">
                    {isSubmitting ? 'Submitting...' : (initialData._id ? 'Update Question' : 'Create Question')}
                </AnimatedButton>
            </div>
        </form>
    );
};

export default QuestionForm;