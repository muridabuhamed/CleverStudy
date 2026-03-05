import React from 'react';
import { motion } from 'motion/react';
import { Loader2, BrainCircuit, Search, FileCheck } from 'lucide-react';

export const Processing: React.FC = () => {
  const [step, setStep] = React.useState(0);
  const steps = [
    "Reading PDF content...",
    "Extracting key concepts...",
    "Identifying important topics...",
    "Generating exam questions...",
    "Finalizing your study guide..."
  ];

  React.useEffect(() => {
    const interval = setInterval(() => {
      setStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-4">
      <div className="relative mb-12">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          className="w-32 h-32 border-4 border-indigo-100 border-t-indigo-600 rounded-full"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <BrainCircuit className="w-12 h-12 text-indigo-600 animate-pulse" />
        </div>
      </div>

      <motion.div
        key={step}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <h2 className="text-2xl font-bold text-slate-900">Analyzing your document</h2>
        <p className="text-slate-500 text-lg max-w-md mx-auto">
          {steps[step]}
        </p>
      </motion.div>

      <div className="mt-12 flex gap-4">
        <StatusIcon active={step >= 1} icon={<Search className="w-4 h-4" />} />
        <StatusIcon active={step >= 3} icon={<BrainCircuit className="w-4 h-4" />} />
        <StatusIcon active={step >= 4} icon={<FileCheck className="w-4 h-4" />} />
      </div>
    </div>
  );
};

const StatusIcon = ({ active, icon }: { active: boolean; icon: React.ReactNode }) => (
  <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
    active ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400'
  }`}>
    {icon}
  </div>
);
