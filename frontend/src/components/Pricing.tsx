import React, { useState } from 'react';
import { motion } from 'motion/react';
import { CheckCircle, Sparkles, ArrowRight, Zap } from 'lucide-react';
import { AppState } from '@/App';

interface PricingPlan {
  name: string;
  price: {
    monthly: string;
    annual: string;
  };
  description: string;
  features: string[];
  buttonText: string;
  highlighted?: boolean;
  badge?: string;
}

const plans: PricingPlan[] = [
  {
    name: 'Free',
    price: { monthly: '0', annual: '0' },
    description: 'Perfect for individuals exploring the basics.',
    features: [
      '3 PDF uploads / month',
      'Standard AI analysis',
      '5 AI-generated quizzes',
      'Standard support'
    ],
    buttonText: 'Get Started Free',
  },
  {
    name: 'Pro',
    price: { monthly: '9.99', annual: '7.99' },
    description: 'The complete suite for dedicated students.',
    features: [
      'Unlimited PDF uploads',
      'Deep semantic analysis',
      'Unlimited quizzes & flashcards',
      'AI Chat Assistant',
      'Smart progress analytics'
    ],
    buttonText: 'Start Free Trial',
    highlighted: true,
    badge: 'MOST POPULAR',
  },
  {
    name: 'Premium',
    price: { monthly: '19.99', annual: '15.99' },
    description: 'Power tools for researchers and teams.',
    features: [
      'Everything in Pro',
      'Cross-document synthesis',
      'Advanced data visualization',
      'Priority 24/7 support',
      'Shared team workspace'
    ],
    buttonText: 'Contact Sales',
  }
];

interface PricingProps {
  onNavigate: (state: AppState) => void;
}

export const Pricing: React.FC<PricingProps> = ({ onNavigate }) => {
  const [isAnnual, setIsAnnual] = useState(false);

  return (
    <section id="pricing" className="py-32 relative overflow-hidden transition-colors duration-500">
      {/* Background Orbs to match the rest of the website */}
      <div className="absolute inset-0 -z-10 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 -left-20 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 -right-20 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 relative z-10">
        <div className="text-center mb-24">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-5xl md:text-6xl font-black text-slate-900 dark:text-white mb-6 tracking-tight leading-tight"
          >
            Simple, <span className="text-indigo-600">Transparent</span> Pricing
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-12 font-medium"
          >
            Choose the perfect plan for your academic journey. No hidden fees.
          </motion.p>

          {/* Toggle Switch */}
          <div className="flex items-center justify-center gap-6 mt-10">
            <span className={`text-sm font-bold transition-colors ${!isAnnual ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}>Monthly Billing</span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className="relative w-[60px] h-[32px] bg-slate-200/50 dark:bg-slate-800/50 backdrop-blur-md rounded-full p-1.5 transition-all focus:outline-none ring-offset-white dark:ring-offset-slate-950 focus:ring-2 focus:ring-indigo-500 border border-slate-300/20"
            >
              <motion.div
                animate={{ x: isAnnual ? 28 : 0 }}
                className="w-5 h-5 bg-indigo-600 rounded-full shadow-lg"
              />
            </button>
            <div className="flex items-center gap-3">
              <span className={`text-sm font-bold transition-colors ${isAnnual ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}>Annual Billing</span>
              <span className="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 text-[10px] font-black uppercase tracking-widest border border-emerald-200 dark:border-emerald-800">
                Save 20%
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch lg:px-4">
          {plans.map((plan, index) => (
            <PricingCard key={plan.name} plan={plan} isAnnual={isAnnual} index={index} onNavigate={onNavigate} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="mt-20 text-center"
        >
          <p className="text-slate-500 dark:text-slate-400 text-sm font-bold mb-4 italic">
            No credit card required to start your free trial. Cancel anytime.
          </p>
          <div className="h-px w-24 bg-slate-200 dark:bg-slate-800 mx-auto" />
        </motion.div>
      </div>
    </section>
  );
};

const PricingCard: React.FC<{ plan: PricingPlan; isAnnual: boolean; index: number; onNavigate: (state: AppState) => void }> = ({ plan, isAnnual, index, onNavigate }) => {
  const price = isAnnual ? plan.price.annual : plan.price.monthly;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.1 * index, duration: 0.6, ease: "easeOut" }}
      className={`relative flex flex-col p-8 rounded-[2rem] border transition-all duration-500 group max-w-md mx-auto w-full ${
        plan.highlighted
          ? 'border-indigo-500 ring-4 ring-indigo-500/5 shadow-2xl bg-white/80 dark:bg-slate-900/60 backdrop-blur-2xl scale-105 z-10'
          : 'border-slate-200 dark:border-white/5 shadow-sm bg-white/40 dark:bg-slate-900/20 backdrop-blur-xl hover:bg-white/60 dark:hover:bg-slate-900/30 hover:border-slate-300 dark:hover:border-white/10'
      }`}
    >
      {plan.badge && (
        <div className="absolute -top-[1.1rem] left-1/2 -translate-x-1/2 z-20">
          <span className="bg-indigo-600 text-white px-5 py-2 rounded-full text-[10px] font-black tracking-[0.2em] whitespace-nowrap shadow-[0_10px_30px_rgba(79,70,229,0.3)]">
            {plan.badge}
          </span>
        </div>
      )}

      <div className="mb-8">
        <div className="flex items-center gap-2.5 mb-3">
          <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{plan.name}</h3>
          {plan.highlighted && <Sparkles className="w-5 h-5 text-indigo-500" />}
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-400 font-medium leading-relaxed">{plan.description}</p>
      </div>

      <div className="mb-8">
        <div className="flex items-baseline gap-1.5">
          <span className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter">${price}</span>
          <span className="text-slate-500 dark:text-slate-500 font-bold text-base">/mo</span>
        </div>
      </div>

      <div className="h-px w-full bg-slate-100 dark:bg-slate-800/50 mb-8" />

      <div className="flex-1 space-y-4 mb-10">
        {plan.features.map((feature, i) => (
          <div key={i} className="flex items-start gap-3">
            <div className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${
              plan.highlighted ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
            }`}>
              <CheckCircle className="w-3.5 h-3.5" />
            </div>
            <span className="text-slate-700 dark:text-slate-300 text-[14px] font-bold tracking-tight leading-snug">{feature}</span>
          </div>
        ))}
      </div>

      <motion.button
        whileHover={{ scale: 1.02, y: -4 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => onNavigate('SIGNUP')}
        className={`w-full py-4 rounded-xl font-black text-base transition-all flex items-center justify-center gap-2.5 overflow-hidden relative group/btn ${
          plan.highlighted
            ? 'bg-indigo-600 text-white shadow-[0_15px_40px_rgba(79,70,229,0.4)] hover:bg-indigo-700'
            : 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 shadow-xl'
        }`}
      >
        <span className="relative z-10">{plan.buttonText}</span>
        <ArrowRight className="w-4.5 h-4.5 group-hover/btn:translate-x-1.5 transition-transform relative z-10" />
        
        {/* Animated Shine Effect for Pro button */}
        {plan.highlighted && (
          <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/btn:animate-[shine_1.5s_infinite] pointer-events-none" />
        )}
      </motion.button>
    </motion.div>
  );
};
