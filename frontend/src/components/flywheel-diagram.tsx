'use client';

import { useEffect, useRef } from 'react';

export function FlywheelDiagram() {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const paths = svgRef.current?.querySelectorAll('.animate-path');
    paths?.forEach((path, i) => {
      const el = path as SVGPathElement;
      const length = el.getTotalLength();
      el.style.strokeDasharray = `${length}`;
      el.style.strokeDashoffset = `${length}`;
      el.style.animation = `drawPath 1.5s ease-out ${i * 0.15}s forwards`;
    });
  }, []);

  return (
    <div className="relative">
      <style jsx>{`
        @keyframes drawPath {
          to {
            stroke-dashoffset: 0;
          }
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        .label-group {
          opacity: 0;
          animation: fadeIn 0.5s ease-out forwards;
        }
      `}</style>

      <svg
        ref={svgRef}
        viewBox="0 0 900 400"
        className="w-full h-auto"
        aria-label="Flywheel distribution diagram"
      >
        {/* Background grid pattern */}
        <defs>
          <pattern
            id="grid"
            width="40"
            height="40"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 40 0 L 0 0 0 40"
              fill="none"
              stroke="var(--border-dim)"
              strokeWidth="0.5"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" opacity="0.3" />

        {/* Main flow paths */}
        {/* LP Fees -> Treasury */}
        <path
          className="animate-path"
          d="M 80 200 Q 150 200 180 200"
          stroke="var(--accent)"
          strokeWidth="1.5"
          fill="none"
        />
        
        {/* Treasury -> Split */}
        <path
          className="animate-path"
          d="M 280 200 Q 350 200 400 200"
          stroke="var(--accent)"
          strokeWidth="1.5"
          fill="none"
        />

        {/* Split -> Rewards */}
        <path
          className="animate-path"
          d="M 440 200 Q 480 200 520 120 Q 560 80 620 80"
          stroke="var(--accent)"
          strokeWidth="1.5"
          fill="none"
        />

        {/* Split -> Buyback */}
        <path
          className="animate-path"
          d="M 440 200 Q 520 200 620 200"
          stroke="var(--accent)"
          strokeWidth="1.5"
          fill="none"
        />

        {/* Split -> Auto LP */}
        <path
          className="animate-path"
          d="M 440 200 Q 480 200 520 280 Q 560 320 620 320"
          stroke="var(--accent)"
          strokeWidth="1.5"
          fill="none"
        />

        {/* Buyback -> Burn */}
        <path
          className="animate-path"
          d="M 720 200 Q 760 200 820 200"
          stroke="var(--accent)"
          strokeWidth="1.5"
          fill="none"
          opacity="0.6"
        />

        {/* Node: LP Fees */}
        <g className="label-group" style={{ animationDelay: '0.3s' }}>
          <circle
            cx="60"
            cy="200"
            r="24"
            fill="var(--bg-secondary)"
            stroke="var(--border)"
            strokeWidth="1"
          />
          <text
            x="60"
            y="204"
            textAnchor="middle"
            className="text-[10px] fill-[var(--text-secondary)]"
          >
            LP
          </text>
          <text
            x="60"
            y="244"
            textAnchor="middle"
            className="text-[11px] fill-[var(--text-muted)] uppercase tracking-wider"
          >
            Fees
          </text>
        </g>

        {/* Node: Treasury */}
        <g className="label-group" style={{ animationDelay: '0.5s' }}>
          <rect
            x="180"
            y="165"
            width="100"
            height="70"
            fill="var(--bg-secondary)"
            stroke="var(--accent)"
            strokeWidth="1"
          />
          <text
            x="230"
            y="195"
            textAnchor="middle"
            className="text-[11px] fill-[var(--text-primary)] uppercase tracking-wider"
          >
            Treasury
          </text>
          <text
            x="230"
            y="215"
            textAnchor="middle"
            className="text-[10px] fill-[var(--text-muted)]"
          >
            Controller PDA
          </text>
        </g>

        {/* Node: Router (split point) */}
        <g className="label-group" style={{ animationDelay: '0.7s' }}>
          <circle
            cx="440"
            cy="200"
            r="20"
            fill="var(--bg-primary)"
            stroke="var(--accent)"
            strokeWidth="1"
          />
          <text
            x="440"
            y="254"
            textAnchor="middle"
            className="text-[10px] fill-[var(--text-muted)] uppercase tracking-wider"
          >
            Router
          </text>
        </g>

        {/* Node: Rewards Distribution */}
        <g className="label-group" style={{ animationDelay: '0.9s' }}>
          <rect
            x="620"
            y="50"
            width="100"
            height="60"
            fill="var(--bg-secondary)"
            stroke="var(--border)"
            strokeWidth="1"
          />
          <text
            x="670"
            y="75"
            textAnchor="middle"
            className="text-[11px] fill-[var(--text-primary)]"
          >
            Rewards
          </text>
          <text
            x="670"
            y="92"
            textAnchor="middle"
            className="text-[10px] fill-[var(--accent)]"
          >
            50%
          </text>
          {/* Arrow to holders */}
          <path
            d="M 720 80 L 780 80"
            stroke="var(--border)"
            strokeWidth="1"
            strokeDasharray="3 3"
          />
          <text
            x="800"
            y="84"
            className="text-[9px] fill-[var(--text-muted)]"
          >
            → Holders
          </text>
        </g>

        {/* Node: Buyback */}
        <g className="label-group" style={{ animationDelay: '1.1s' }}>
          <rect
            x="620"
            y="170"
            width="100"
            height="60"
            fill="var(--bg-secondary)"
            stroke="var(--border)"
            strokeWidth="1"
          />
          <text
            x="670"
            y="195"
            textAnchor="middle"
            className="text-[11px] fill-[var(--text-primary)]"
          >
            Buyback
          </text>
          <text
            x="670"
            y="212"
            textAnchor="middle"
            className="text-[10px] fill-[var(--accent)]"
          >
            30%
          </text>
        </g>

        {/* Node: Burn */}
        <g className="label-group" style={{ animationDelay: '1.3s' }}>
          <circle
            cx="850"
            cy="200"
            r="20"
            fill="var(--bg-primary)"
            stroke="var(--border)"
            strokeWidth="1"
            strokeDasharray="3 3"
          />
          <text
            x="850"
            y="204"
            textAnchor="middle"
            className="text-[9px] fill-[var(--text-muted)]"
          >
            🔥
          </text>
          <text
            x="850"
            y="240"
            textAnchor="middle"
            className="text-[9px] fill-[var(--text-muted)]"
          >
            Burn
          </text>
        </g>

        {/* Node: Auto LP */}
        <g className="label-group" style={{ animationDelay: '1.1s' }}>
          <rect
            x="620"
            y="290"
            width="100"
            height="60"
            fill="var(--bg-secondary)"
            stroke="var(--border)"
            strokeWidth="1"
          />
          <text
            x="670"
            y="315"
            textAnchor="middle"
            className="text-[11px] fill-[var(--text-primary)]"
          >
            Auto LP
          </text>
          <text
            x="670"
            y="332"
            textAnchor="middle"
            className="text-[10px] fill-[var(--accent)]"
          >
            20%
          </text>
        </g>

        {/* Flow arrows */}
        <polygon
          points="176,196 184,200 176,204"
          fill="var(--accent)"
          className="label-group"
          style={{ animationDelay: '0.4s' }}
        />
        <polygon
          points="396,196 404,200 396,204"
          fill="var(--accent)"
          className="label-group"
          style={{ animationDelay: '0.6s' }}
        />

        {/* Percentage labels on paths */}
        <text
          x="540"
          y="72"
          className="text-[9px] fill-[var(--text-muted)] label-group"
          style={{ animationDelay: '0.8s' }}
        >
          50%
        </text>
        <text
          x="570"
          y="195"
          className="text-[9px] fill-[var(--text-muted)] label-group"
          style={{ animationDelay: '0.8s' }}
        >
          30%
        </text>
        <text
          x="540"
          y="320"
          className="text-[9px] fill-[var(--text-muted)] label-group"
          style={{ animationDelay: '0.8s' }}
        >
          20%
        </text>
      </svg>

      {/* Legend */}
      <div className="mt-8 flex flex-wrap gap-8 text-xs text-[var(--text-muted)]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-px bg-[var(--accent)]" />
          <span>Active flow</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-px border-t border-dashed border-[var(--border)]" />
          <span>Distribution</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 border border-[var(--accent)]" />
          <span>On-chain account</span>
        </div>
      </div>
    </div>
  );
}
