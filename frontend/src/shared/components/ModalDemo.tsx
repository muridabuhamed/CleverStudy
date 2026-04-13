import React from 'react';
import { motion } from 'motion/react';
import { Modal } from '../components/Modal';
import { CheckCircle, XCircle, AlertTriangle, Info } from 'lucide-react';

export const ModalDemo: React.FC = () => {
  const [isSuccessOpen, setIsSuccessOpen] = React.useState(false);
  const [isWarningOpen, setIsWarningOpen] = React.useState(false);
  const [isInfoOpen, setIsInfoOpen] = React.useState(false);

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8 text-slate-900 dark:text-slate-100">
        Smooth Modal Transitions Demo
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.button
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsSuccessOpen(true)}
          className="p-6 bg-emerald-600 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-shadow"
        >
          Success Modal
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsWarningOpen(true)}
          className="p-6 bg-amber-600 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-shadow"
        >
          Warning Modal
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsInfoOpen(true)}
          className="p-6 bg-indigo-600 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-shadow"
        >
          Info Modal
        </motion.button>
      </div>

      {/* Success Modal */}
      <Modal
        isOpen={isSuccessOpen}
        onClose={() => setIsSuccessOpen(false)}
        maxWidth="sm"
      >
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="flex flex-col items-center text-center"
        >
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-8 h-8 text-emerald-600" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
            Success!
          </h3>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            Your action was completed successfully with smooth animations.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsSuccessOpen(false)}
            className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-colors"
          >
            Got it!
          </motion.button>
        </motion.div>
      </Modal>

      {/* Warning Modal */}
      <Modal
        isOpen={isWarningOpen}
        onClose={() => setIsWarningOpen(false)}
        maxWidth="md"
      >
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="flex flex-col items-center text-center"
        >
          <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="w-8 h-8 text-amber-600" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
            Warning
          </h3>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            This modal demonstrates smooth spring animations and backdrop blur effects.
          </p>
          <div className="flex gap-3 w-full">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsWarningOpen(false)}
              className="flex-1 px-6 py-3 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-semibold hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
            >
              Cancel
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsWarningOpen(false)}
              className="flex-1 px-6 py-3 bg-amber-600 text-white rounded-xl font-semibold hover:bg-amber-700 transition-colors"
            >
              Proceed
            </motion.button>
          </div>
        </motion.div>
      </Modal>

      {/* Info Modal */}
      <Modal
        isOpen={isInfoOpen}
        onClose={() => setIsInfoOpen(false)}
        title="Information"
        maxWidth="lg"
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center flex-shrink-0">
              <Info className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-1">
                Smooth Modal Features
              </h4>
              <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-2">
                <li>✓ Spring-based animations for natural feel</li>
                <li>✓ Backdrop blur with smooth fade</li>
                <li>✓ Staggered content animations</li>
                <li>✓ ESC key support</li>
                <li>✓ Click outside to close</li>
                <li>✓ Prevents body scroll when open</li>
                <li>✓ Fully accessible</li>
              </ul>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};
