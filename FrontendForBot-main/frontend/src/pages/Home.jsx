import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { BrainCircuit, BarChart, MessageSquare, Sparkles } from 'lucide-react';
import AnimatedButton from '../components/common/AnimatedButton';
import { containerVariants, itemVariants } from '../utils/motionVariants';
import Card from '../components/common/Card';

const FeatureCard = ({ icon, title, children }) => (
  <motion.div
    variants={itemVariants}
    className="bg-surface/70 backdrop-blur-sm rounded-2xl p-8 text-center border border-white/50 shadow-lg"
  >
    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-indigo-500 text-white flex items-center justify-center mx-auto mb-6 shadow-lg">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-text mb-2">{title}</h3>
    <p className="text-text-light">{children}</p>
  </motion.div>
);

const Home = () => {
  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={{
        initial: { opacity: 0 },
        in: { opacity: 1, transition: { staggerChildren: 0.2, duration: 0.5 } },
        out: { opacity: 0 }
      }}
      className="relative overflow-hidden"
    >
      {/* Floating background blobs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-20 -left-20 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
        <div className="absolute top-40 right-0 w-96 h-96 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-4000"></div>
      </div>

      {/* Hero Section */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="text-center py-20 md:py-32"
      >
        <motion.div
          variants={itemVariants}
          className="inline-flex items-center justify-center px-4 py-1 bg-primary/10 rounded-full mb-4 border border-primary/20"
        >
          <span className="text-sm font-medium text-primary">AI-Powered Autism Support</span>
        </motion.div>

        <motion.h1
          variants={itemVariants}
          className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-700 mb-6"
        >
          Early Insights, Brighter Futures
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="text-lg text-text-light max-w-3xl mx-auto mb-10"
        >
          BotPsych is your intelligent companion for autism awareness and support —
          offering early screening, personalized progress tracking, and AI-driven guidance.
        </motion.p>

        <motion.div
          variants={itemVariants}
          className="flex flex-wrap justify-center gap-4"
        >
          <Link to="/assessment">
            <AnimatedButton className="!text-lg !px-8 !py-4">Start Free Assessment</AnimatedButton>
          </Link>
          <Link to="/dashboard">
            <AnimatedButton variant="secondary" className="!text-lg !px-8 !py-4">Explore Dashboard</AnimatedButton>
          </Link>
        </motion.div>
      </motion.section>

      {/* Why BotPsych Section */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        className="py-20 bg-white/70 backdrop-blur-md"
      >
        <div className="max-w-5xl mx-auto text-center px-6">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Why Choose BotPsych?</h2>
          <p className="text-lg text-text-light">
            Early detection and personalized support can change lives.
            BotPsych empowers families and caregivers with tools to better understand
            and track developmental patterns — providing clarity, not confusion.
          </p>
        </div>
      </motion.section>

      {/* How It Works */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        className="py-20"
      >
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-800">How It Works</h2>
          <p className="mt-4 text-lg text-text-light">
            A simple 3-step journey designed to support you every step of the way.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto px-6">
          <FeatureCard icon={<BrainCircuit className="w-8 h-8" />} title="Step 1: Assessment">
            Take an AI-powered screening to get initial insights into developmental patterns.
          </FeatureCard>
          <FeatureCard icon={<BarChart className="w-8 h-8" />} title="Step 2: Dashboard">
            Track your progress over time and visualize improvements or areas of concern.
          </FeatureCard>
          <FeatureCard icon={<MessageSquare className="w-8 h-8" />} title="Step 3: AI Assistant">
            Get personalized guidance and answers from our AI assistant anytime.
          </FeatureCard>
        </div>
      </motion.section>

      {/* CTA */}
      <motion.section
        variants={itemVariants}
        className="py-20 bg-gradient-to-r from-indigo-600 to-blue-600 text-white text-center"
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Begin Your Journey?</h2>
        <p className="mb-8 text-lg opacity-90">Take the first step towards clarity and support.</p>
        <Link to="/assessment">
          <AnimatedButton variant="secondary" className="!text-lg !px-10 !py-5 !bg-white !text-indigo-600">
            Start Assessment
          </AnimatedButton>
        </Link>
      </motion.section>
    </motion.div>
  );
};

export default Home;
