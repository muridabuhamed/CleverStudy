import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle, Sparkles, Zap, Shield, ArrowRight } from 'lucide-react';

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
  icon: React.ReactNode;
}

const plans: PricingPlan[] = [
  {
    name: 'Free',
    price: { monthly: '0', annual: '0' },
    description: 'Perfect to get started',
    features: [
      'Upload limited PDFs',
      'Basic AI analysis',
      'Limited quizzes',
      'Standard support'
    ],
    buttonText: 'Get Started Free',
    icon: <Shield className="w-6 h-6" />
  },
  {
    name: 'Pro',
    price: { monthly: '9.99', annual: '7.99' },
    description: 'Best for serious students',
    features: [
      'Unlimited PDF uploads',
      'Full AI analysis',
      'Unlimited quizzes & flashcards',
      'AI Chat Assistant',
      'Progress analytics'
    ],
    buttonText: 'Upgrade to Pro',
    highlighted: true,
    badge: 'Most Popular',
    icon: <Sparkles className="w-6 h-6" />
  },
  {
    name: 'Premium',
    price: { monthly: '19.99', annual: '15.99' },
    description: 'For power users & teams',
    features: [
      'Everything in Pro',
      'Faster AI responses',
      'Advanced analytics',
      'Priority support'
    ],
    buttonText: 'Go Premium',
    icon: <Zap className="w-6 h-6" />
  }
];

export const Pricing: React.FC = () => {
  const [isAnnual, setIsAnnual] = useState(false);

  return (
    <section id="pricing" className="py-32 relative overflow-hidden">
      {/* Background Orbs for Pricing Section */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-400/20 text-indigo-300 text-sm font-bold mb-6 backdrop-blur-sm"
          >
            <Sparkles className="w-4 h-4" />
            Pricing
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-black text-white mb-6"
          >
            Simple, Transparent Pricing
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xl text-slate-400 max-w-2xl mx-auto mb-12"
          >
            Choose the plan that fits your study needs
          </motion.p>

          {/* Toggle */}
          <div className="flex items-center justify-center gap-4 mb-16">
            <span className={`text-sm font-bold transition-colors ${!isAnnual ? 'text-white' : 'text-slate-500'}`}>Monthly</span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className="relative w-14 h-7 bg-white/10 backdrop-blur-md rounded-full border border-white/20 p-1 transition-colors hover:border-white/40"
            >
              <motion.div
                animate={{ x: isAnnual ? 28 : 0 }}
                className="w-5 h-5 bg-gradient-to-br from-indigo-400 to-violet-500 rounded-full shadow-lg"
              />
            </button>
            <div className="flex items-center gap-2">
              <span className={`text-sm font-bold transition-colors ${isAnnual ? 'text-white' : 'text-slate-500'}`}>Annual</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-[10px] font-black uppercase tracking-wider">
                Save 20%
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan, index) => (
            <PricingCard key={plan.name} plan={plan} isAnnual={isAnnual} index={index} />
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="text-center mt-12 text-slate-500 text-sm font-medium"
        >
          No credit card required. Cancel anytime.
        </motion.p>
      </div>
    </section>
  );
};

const PricingCard: React.FC<{ plan: PricingPlan; isAnnual: boolean; index: number }> = ({ plan, isAnnual, index }) => {
  const price = isAnnual ? plan.price.annual : plan.price.monthly;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.1 * index, duration: 0.5 }}
      whileHover={{ y: -10 }}
      className={`relative flex flex-col p-8 rounded-3xl backdrop-blur-xl border transition-all duration-500 group ${
        plan.highlighted
          ? 'bg-indigo-500/10 border-indigo-400/40 shadow-2xl shadow-indigo-500/20'
          : 'bg-white/5 border-white/10 hover:border-white/20'
      }`}
    >
      {plan.badge && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-gradient-to-r from-indigo-500 to-violet-600 rounded-full text-white text-xs font-black shadow-lg shadow-indigo-500/40 z-20">
          {plan.badge}
        </div>
      )}

      <div className="flex items-center gap-3 mb-6">
        <div className={`p-2.5 rounded-xl ${plan.highlighted ? 'bg-indigo-500 text-white' : 'bg-white/10 text-slate-300'}`}>
          {plan.icon}
        </div>
        <h3 className="text-2xl font-bold text-white">{plan.name}</h3>
      </div>

      <div className="mb-6">
        <div className="flex items-baseline gap-1">
          <span className="text-5xl font-black text-white">${price}</span>
          <span className="text-slate-400 font-bold">/month</span>
        </div>
        <p className="text-slate-400 mt-2 font-medium">{plan.description}</p>
      </div>

      <div className="h-px bg-white/10 w-full mb-8" />

      <div className="flex-1 space-y-4 mb-10">
        {plan.features.map((feature, i) => (
          <div key={i} className="flex items-start gap-3">
            <CheckCircle className={`w-5 h-5 mt-0.5 shrink-0 ${plan.highlighted ? 'text-indigo-400' : 'text-slate-500'}`} />
            <span className="text-slate-300 text-sm font-medium leading-tight">{feature}</span>
          </div>
        ))}
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={`w-full py-4 rounded-2xl font-black text-lg transition-all flex items-center justify-center gap-2 ${
          plan.highlighted
            ? 'bg-white text-indigo-900 shadow-xl shadow-white/10 hover:shadow-white/20'
            : 'bg-slate-900/50 text-white border border-white/10 hover:bg-slate-900/80 hover:border-white/20'
        }`}
      >
        {plan.buttonText}
        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
      </motion.button>
    </motion.div>
  );
};
