import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { BrainCircuit, BarChart, MessageSquare, Sparkles } from 'lucide-react';
import AnimatedButton from '../components/common/AnimatedButton';
import { containerVariants, itemVariants } from '../utils/motionVariants';

const FeatureCard = ({ icon, title, children, accent = 'bg-white' }) => (
  <motion.div
    variants={itemVariants}
    className="relative bg-white rounded-2xl p-8 shadow-md flex flex-col items-center text-center min-h-[18rem] overflow-hidden"
  >
    <div
      className="w-16 h-16 rounded-full flex items-center justify-center mb-6 shadow-sm"
      style={{ background: 'rgba(37,99,235,0.08)' }}
    >
      {icon}
    </div>

    <h3 className="text-xl font-semibold text-gray-800 mb-3">{title}</h3>
    <p className="text-gray-600 max-w-[36rem]">{children}</p>

    {/* subtle decorative circle behind title (non-overlapping, purely visual) */}
    <div className="absolute -bottom-8 -right-8 w-24 h-24 rounded-full opacity-10 pointer-events-none" style={{ background: '#2563EB' }} />
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
        in: { opacity: 1, transition: { staggerChildren: 0.12, duration: 0.45 } },
        out: { opacity: 0 }
      }}
      className="relative overflow-visible"
    >
      {/* soft page blobs (kept very subtle & small so they don't overlap cards) */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="hidden md:block absolute left-8 top-12 w-60 h-60 rounded-full bg-blue-100/40 filter blur-3xl"></div>
        <div className="hidden md:block absolute right-8 top-28 w-72 h-72 rounded-full bg-green-100/30 filter blur-3xl"></div>
      </div>

      {/* Hero Section */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="text-center py-16 md:py-28"
      >
        <motion.div
          variants={itemVariants}
          className="inline-flex items-center justify-center px-4 py-1 bg-primary/10 rounded-full mb-4 border border-primary/20"
        >
          <span className="text-sm font-medium text-primary">AI-Powered Autism Support</span>
        </motion.div>

        <motion.h1
          variants={itemVariants}
          className="text-3xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-700 mb-4 md:mb-6 leading-tight"
        >
          Early Insights, Brighter Futures
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="text-base md:text-lg text-text-light max-w-3xl mx-auto mb-8 px-4"
        >
          BotPsych is your intelligent companion for autism awareness and support — offering early screening, personalized progress tracking, and AI-driven guidance.
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

      {/* Why BotPsych */}
      <motion.section
  variants={containerVariants}
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true, amount: 0.3 }}
  className="py-12 md:py-16 bg-gray-50"
>
  <div className="max-w-6xl mx-auto px-6">
    <div className="text-center mb-12">
      <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Why Choose BotPsych?</h2>
      <p className="mt-3 text-gray-600 text-base md:text-lg max-w-2xl mx-auto">
        Early detection and personalized support can change lives. Here’s how BotPsych empowers you.
      </p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <FeatureCard
        icon={<Sparkles className="w-6 h-6 text-[#2563EB]" />}
        title="Early Detection"
      >
        Identify developmental patterns sooner with AI-powered insights — helping you take the right steps early.
      </FeatureCard>

      <FeatureCard
        icon={<BrainCircuit className="w-6 h-6 text-[#10B981]" />}
        title="Personalized Support"
      >
        Get recommendations tailored to your progress, not generic advice — making guidance more relevant and useful.
      </FeatureCard>

      <FeatureCard
        icon={<MessageSquare className="w-6 h-6 text-[#F97316]" />}
        title="Clarity, Not Confusion"
      >
        Simplify complex information with easy-to-understand visuals, tools, and guidance that caregivers can trust.
      </FeatureCard>
    </div>
  </div>
</motion.section>

      {/* Clean Features Grid (replaces the previous overlapping decorative layout) */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.25 }}
        className="py-12 md:py-16"
      >
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-10">
            <h3 className="text-2xl md:text-3xl font-bold">How It Works</h3>
            <p className="mt-2 text-gray-600">A simple 3-step journey designed to support you every step of the way.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard icon={<BrainCircuit className="w-6 h-6 text-[#2563EB]" />} title="Assessment">
              Take a short, AI-powered screening to get an initial risk-level indication. Results are for guidance, not diagnosis.
            </FeatureCard>

            <FeatureCard icon={<BarChart className="w-6 h-6 text-[#10B981]" />} title="Dashboard">
              View results over time, track progress visually, and share summaries with clinicians or caregivers.
            </FeatureCard>

            <FeatureCard icon={<MessageSquare className="w-6 h-6 text-[#F97316]" />} title="AI Assistant">
              Ask questions, get explanations, and receive personalized suggestions from our built-in AI companion.
            </FeatureCard>
          </div>
        </div>
      </motion.section>

      {/* CTA */}
      <motion.section
        variants={itemVariants}
        className="py-12 md:py-16 bg-gradient-to-r from-indigo-600 to-blue-600 text-white text-center rounded-tl-2xl rounded-tr-2xl"
      >
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">Ready to Begin Your Journey?</h2>
          <p className="mb-6 text-gray-100/90">Take the first step towards clarity and support.</p>
          <Link to="/assessment">
            <AnimatedButton variant="secondary" className="!text-lg !px-10 !py-4 !bg-white !text-indigo-600">
              Start Assessment
            </AnimatedButton>
          </Link>
        </div>
      </motion.section>
    </motion.div>
  );
};

export default Home;
