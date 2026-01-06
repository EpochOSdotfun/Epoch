'use client';

import { motion } from 'framer-motion';

export function FlywheelDiagram() {
  const steps = [
    { label: 'LP Fees', position: 'top', color: '#00ff88' },
    { label: 'Swap to SOL', position: 'right', color: '#00d4ff' },
    { label: 'Route', position: 'bottom', color: '#ffaa00' },
    { label: 'Rewards', position: 'left', color: '#00ff88' },
  ];

  return (
    <div className="relative w-full aspect-square max-w-md mx-auto">
      {/* Outer rotating ring */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        className="absolute inset-4 rounded-full border-2 border-dashed border-accent-primary/30"
      />

      {/* Inner circle */}
      <div className="absolute inset-16 rounded-full bg-gradient-to-br from-accent-primary/10 to-accent-secondary/10 border border-border-default" />

      {/* Center logo */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-24 h-24 rounded-full bg-gradient-to-br from-accent-primary to-accent-secondary flex items-center justify-center"
        >
          <span className="text-bg-primary font-display font-bold text-2xl">⚡</span>
        </motion.div>
      </div>

      {/* Step nodes */}
      {steps.map((step, index) => {
        const angle = (index * 90 - 90) * (Math.PI / 180);
        const radius = 45; // percentage
        const x = 50 + radius * Math.cos(angle);
        const y = 50 + radius * Math.sin(angle);

        return (
          <motion.div
            key={step.label}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.2, duration: 0.5 }}
            className="absolute transform -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${x}%`, top: `${y}%` }}
          >
            <div
              className="px-4 py-2 rounded-lg border text-sm font-medium whitespace-nowrap"
              style={{
                backgroundColor: `${step.color}10`,
                borderColor: `${step.color}40`,
                color: step.color,
              }}
            >
              {step.label}
            </div>
          </motion.div>
        );
      })}

      {/* Animated particles */}
      {[0, 1, 2, 3].map((i) => (
        <motion.div
          key={i}
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'linear',
            delay: i * 2,
          }}
          className="absolute inset-0"
          style={{ transformOrigin: 'center' }}
        >
          <motion.div
            className="absolute w-2 h-2 rounded-full bg-accent-primary"
            style={{ top: '10%', left: '50%', transform: 'translateX(-50%)' }}
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.div>
      ))}

      {/* Labels */}
      <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-center">
        <div className="text-text-muted text-sm">Continuous Value Creation</div>
      </div>
    </div>
  );
}

