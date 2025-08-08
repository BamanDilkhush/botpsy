import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { BrainCircuit, BarChart, MessageSquare } from 'lucide-react';
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
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-20 -left-20 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
        <div className="absolute top-40 right-0 w-96 h-96 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-4000"></div>
      </div>

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
          className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary-dark to-indigo-700 mb-6"
        >
          Early Insights, Brighter Futures
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="text-lg text-text-light max-w-3xl mx-auto mb-10"
        >
          An intelligent platform for early autism screening, personalized tracking, and supportive guidance for you and your loved ones.
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

      <motion.section
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        className="py-20"
      >
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-800">A Comprehensive Toolkit</h2>
          <p className="mt-4 text-lg text-text-light">Everything you need to understand and support development.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard icon={<BrainCircuit className="w-8 h-8" />}>
            AI-Powered Assessment
          </FeatureCard>
          <FeatureCard icon={<BarChart className="w-8 h-8" />}>
            Progress Tracking
          </FeatureCard>
          <FeatureCard icon={<MessageSquare className="w-8 h-8" />}>
            Personalized Insights
          </FeatureCard>
        </div>
      </motion.section>
    </motion.div>
  );
};

export default Home;