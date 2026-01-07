'use client';

export function FlywheelDiagram() {
  const steps = [
    { label: 'LP Fees', position: 'top' },
    { label: 'Swap to SOL', position: 'right' },
    { label: 'Route', position: 'bottom' },
    { label: 'Rewards', position: 'left' },
  ];

  return (
    <div className="relative w-full aspect-square max-w-md mx-auto">
      {/* Outer ring */}
      <div className="absolute inset-4 rounded-full border-2 border-dashed border-surface-200" />

      {/* Inner circle */}
      <div className="absolute inset-16 rounded-full bg-surface-100 border border-surface-200" />

      {/* Center */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-24 h-24 rounded-full bg-ink-900 flex items-center justify-center">
          <span className="text-white font-semibold text-2xl">E</span>
        </div>
      </div>

      {/* Step nodes */}
      {steps.map((step, index) => {
        const angle = (index * 90 - 90) * (Math.PI / 180);
        const radius = 45;
        const x = 50 + radius * Math.cos(angle);
        const y = 50 + radius * Math.sin(angle);

        return (
          <div
            key={step.label}
            className="absolute transform -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${x}%`, top: `${y}%` }}
          >
            <div className="px-4 py-2 rounded bg-white border border-surface-200 text-body-sm font-medium text-ink-700 whitespace-nowrap shadow-subtle">
              {step.label}
            </div>
          </div>
        );
      })}

      {/* Label */}
      <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-center">
        <div className="text-caption text-ink-500">Continuous Value Creation</div>
      </div>
    </div>
  );
}
