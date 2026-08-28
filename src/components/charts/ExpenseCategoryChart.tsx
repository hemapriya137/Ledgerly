"use client";

import React from "react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import { formatCurrency } from "@/lib/utils";

interface CategoryData {
  name: string;
  value: number;
  color?: string;
}

interface ExpenseCategoryChartProps {
  data: CategoryData[];
}

const DEFAULT_COLORS = [
  "#06b6d4", // Software (cyan)
  "#f59e0b", // Travel (amber)
  "#6366f1", // Hardware (indigo)
  "#10b981", // Contractor (emerald)
  "#a855f7", // Marketing (purple)
  "#f43f5e", // Office (rose)
  "#94a3b8", // General (slate)
];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const item = payload[0];
    return (
      <div className="rounded-xl border border-emerald-500/30 bg-[#061812]/95 p-3 shadow-2xl backdrop-blur-xl">
        <p className="text-xs font-semibold text-white">{item.name}</p>
        <p className="text-xs font-bold text-emerald-400 mt-0.5">
          {formatCurrency(item.value)}
        </p>
      </div>
    );
  }
  return null;
};

export function ExpenseCategoryChart({ data }: ExpenseCategoryChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center text-slate-400 text-sm">
        No expense category data logged yet.
      </div>
    );
  }

  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
      <div className="w-full md:w-1/2 h-56 relative flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip content={<CustomTooltip />} />
            <Pie
              data={data}
              innerRadius={58}
              outerRadius={80}
              paddingAngle={4}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color || DEFAULT_COLORS[index % DEFAULT_COLORS.length]}
                  stroke="#040d0a"
                  strokeWidth={2}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        {/* Center Total */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-[11px] text-slate-400 font-medium">Total</span>
          <span className="text-sm font-bold text-white">
            {formatCurrency(total)}
          </span>
        </div>
      </div>

      {/* Custom Legend */}
      <div className="w-full md:w-1/2 space-y-2">
        {data.map((item, idx) => {
          const color = item.color || DEFAULT_COLORS[idx % DEFAULT_COLORS.length];
          const pct = total > 0 ? ((item.value / total) * 100).toFixed(0) : 0;
          return (
            <div key={item.name} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: color }}
                />
                <span className="text-slate-300">{item.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-white">
                  {formatCurrency(item.value)}
                </span>
                <span className="text-slate-500 text-[10px] w-7 text-right">
                  {pct}%
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
export default ExpenseCategoryChart;
