import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency: string = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(date: string | Date): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(d);
}

export function getStatusBadge(status: string) {
  switch (status?.toUpperCase()) {
    case "PAID":
      return {
        label: "Paid",
        bg: "bg-emerald-500/15 border-emerald-500/30 text-emerald-400",
        dot: "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]",
      };
    case "SENT":
      return {
        label: "Sent / Pending",
        bg: "bg-amber-500/15 border-amber-500/30 text-amber-300",
        dot: "bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]",
      };
    case "OVERDUE":
      return {
        label: "Overdue",
        bg: "bg-rose-500/15 border-rose-500/30 text-rose-400",
        dot: "bg-rose-400 shadow-[0_0_8px_rgba(244,63,94,0.8)]",
      };
    case "DRAFT":
    default:
      return {
        label: "Draft",
        bg: "bg-slate-500/15 border-slate-500/30 text-slate-300",
        dot: "bg-slate-400",
      };
  }
}

export function getCategoryBadge(category: string) {
  switch (category?.toLowerCase()) {
    case "software":
      return { bg: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20" };
    case "hardware":
      return { bg: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20" };
    case "travel":
      return { bg: "bg-amber-500/10 text-amber-400 border-amber-500/20" };
    case "contractor":
      return { bg: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" };
    case "marketing":
      return { bg: "bg-purple-500/10 text-purple-400 border-purple-500/20" };
    case "office":
      return { bg: "bg-rose-500/10 text-rose-400 border-rose-500/20" };
    default:
      return { bg: "bg-slate-500/10 text-slate-300 border-slate-500/20" };
  }
}
