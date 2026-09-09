import React from 'react';

export interface SparklineProps {
  data: number[];
  width?: number;
  height?: number;
  color?: string;
  fillColor?: string;
  strokeWidth?: number;
}

export const Sparkline: React.FC<SparklineProps> = ({
  data,
  width = 120,
  height = 36,
  color = '#dc2626',
  fillColor = '#fee2e2',
  strokeWidth = 2,
}) => {
  if (!data || data.length < 2) {
    return <div style={{ width, height }} className="bg-slate-50 rounded" />;
  }

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min === 0 ? 1 : max - min;
  const padding = 4;

  const points = data.map((val, idx) => {
    const x = padding + (idx / (data.length - 1)) * (width - 2 * padding);
    const y = height - padding - ((val - min) / range) * (height - 2 * padding);
    return { x, y };
  });

  const pathD = points.reduce((acc, pt, idx) => {
    return idx === 0 ? `M ${pt.x},${pt.y}` : `${acc} L ${pt.x},${pt.y}`;
  }, '');

  const areaD = `${pathD} L ${points[points.length - 1].x},${height} L ${points[0].x},${height} Z`;

  return (
    <svg width={width} height={height} className="overflow-visible inline-block">
      {fillColor && <path d={areaD} fill={fillColor} opacity={0.5} />}
      <path
        d={pathD}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Last point indicator */}
      <circle
        cx={points[points.length - 1].x}
        cy={points[points.length - 1].y}
        r={3}
        fill={color}
      />
    </svg>
  );
};
