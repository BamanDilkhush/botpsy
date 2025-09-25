import React from 'react';
import { motion } from 'framer-motion';
import { BrainCircuit } from 'lucide-react';

const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-[75vh] flex items-center justify-center">
      <div className="flex w-full max-w-4xl bg-surface rounded-2xl shadow-2xl overflow-hidden">
        {/* Decorative Side Panel (updated to match #2563EB color family) */}
        <div className="hidden md:block w-1/2 bg-gradient-to-br from-[#2563EB] via-[#2C55F0] to-[#6B6BFF] p-8 text-white relative overflow-hidden">
          {/* Optional dark overlay for extra depth */}
          <div className="absolute inset-0 bg-black/12"></div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="z-10 relative"
          >
            {/* lucide icons use currentColor, so text-white makes icon white */}
            <BrainCircuit className="w-12 h-12 mb-4 text-white" />
            <h2 className="text-3xl font-bold mb-2">Welcome to BotPsych</h2>
            <p className="opacity-90">Your personal guide to understanding and navigating the path to mental wellness.</p>
          </motion.div>

          {/* Background Blobs (subtler, matching the new blue) */}
          <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full filter blur-xl" style={{ background: 'rgba(255,255,255,0.08)' }} />
          <div className="absolute -bottom-16 -left-10 w-48 h-48 rounded-full filter blur-xl" style={{ background: 'rgba(255,255,255,0.06)' }} />
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
