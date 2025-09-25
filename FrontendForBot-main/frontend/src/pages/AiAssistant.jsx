import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { pageVariants, pageTransition } from '../utils/motionVariants';
import { generateGeminiResponse } from '../api/gemini';
import Card from '../components/common/Card';
import AnimatedButton from '../components/common/AnimatedButton';
import { Send, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import ChatMessage from '../components/ai/ChatMessage';

const AiAssistant = () => {
    const [messages, setMessages] = useState([
        { role: 'model', parts: [{ text: "Hello! I'm your AI assistant. Ask me anything about autism, developmental milestones, or coping strategies." }] }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const chatEndRef = useRef(null);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage = { role: 'user', parts: [{ text: input }] };
        setMessages(prev => [...prev, userMessage]);
        const currentInput = input;
        setInput('');
        setIsLoading(true);

        try {
            // Pass the existing message history to maintain conversation context
            const geminiHistory = messages.map(msg => ({
                role: msg.role,
                parts: msg.parts
            }));

            const responseText = await generateGeminiResponse(currentInput, geminiHistory);
            const modelMessage = { role: 'model', parts: [{ text: responseText }] };
            setMessages(prev => [...prev, modelMessage]);
        } catch (error) {
            toast.error("Sorry, I couldn't get a response. Please try again.");
            // Optional: remove the user's message if the API call fails
            setMessages(prev => prev.filter(msg => msg !== userMessage));
        } finally {
            setIsLoading(false);
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
            <Card className="!p-0">
                <div className="flex items-center p-6 border-b border-gray-200 bg-[#2563EB] text-white rounded-t-xl">
                    <Sparkles className="w-8 h-8 mr-3 text-white" />
                    <h1 className="text-3xl font-bold">AI Assistant</h1>
                </div>

                <div className="h-[60vh] flex flex-col p-6">
                    <div className="flex-grow overflow-y-auto pr-4 mb-4 space-y-4">
                        <AnimatePresence>
                            {messages.map((msg, index) => (
                                <motion.div
                                    key={index}
                                    layout
                                    initial={{ opacity: 0, y: 12 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 8 }}
                                >
                                    <ChatMessage msg={msg} isUser={msg.role === 'user'} />
                                </motion.div>
                            ))}
                        </AnimatePresence>

                        {isLoading && (
                            <motion.div layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-start gap-3">
                                <div className="w-10 h-10 rounded-full bg-[#2563EB]/10 flex items-center justify-center flex-shrink-0">
                                    <svg className="w-6 h-6 text-[#2563EB]" viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="3" /></svg>
                                </div>
                                <div className="max-w-md p-3 rounded-2xl bg-gray-100 text-text rounded-bl-none">
                                    <div className="flex items-center space-x-1">
                                        <span className="w-2 h-2 bg-[#2563EB] rounded-full animate-pulse" />
                                        <span className="w-2 h-2 bg-[#2563EB] rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
                                        <span className="w-2 h-2 bg-[#2563EB] rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        <div ref={chatEndRef} />
                    </div>

                    <form onSubmit={handleSendMessage} className="flex items-center gap-3 pt-4 border-t">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask a question..."
                            className="flex-grow p-3 border bg-gray-50 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2563EB]"
                            disabled={isLoading}
                        />
                        <AnimatedButton type="submit" className="!p-3" disabled={isLoading}>
                            <Send className="w-5 h-5" />
                        </AnimatedButton>
                    </form>
                </div>
            </Card>
        </motion.div>
    );
};

export default AiAssistant;
