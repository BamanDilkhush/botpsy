import React from 'react';
import { motion } from 'framer-motion';
import { BrainCircuit } from 'lucide-react';

const AuthLayout = ({ children }) => {
    return (
        <div className="min-h-[75vh] flex items-center justify-center">
            <div className="flex w-full max-w-4xl bg-surface rounded-2xl shadow-2xl overflow-hidden">
                {/* Decorative Side Panel */}
                <div className="hidden md:block w-1/2 bg-gradient-to-br from-primary to-indigo-600 p-8 text-white relative overflow-hidden">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, ease: 'easeOut' }}
                        className="z-10 relative"
                    >
                        <BrainCircuit className="w-12 h-12 mb-4" />
                        <h2 className="text-3xl font-bold mb-2">Welcome to BotPsych</h2>
                        <p className="opacity-90">Your personal guide to understanding and navigating the path to mental wellness.</p>
                    </motion.div>
                    {/* Background Blobs */}
                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full filter blur-xl"></div>
                    <div className="absolute -bottom-16 -left-10 w-48 h-48 bg-white/10 rounded-full filter blur-xl"></div>
                </div>

                {/* Form Side */}
                <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default AuthLayout;