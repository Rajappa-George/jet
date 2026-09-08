"use client";

import { useMemo, useState } from "react";
import {
  UsersRound,
  MessageSquareMore,
  UserPlus,
  IndianRupee,
  Download,
} from "lucide-react";

type DailyData = {
  date: number;
  enquiries: number;
  admissions: number;
  newPayment: number;
  duePayment: number;
};

type BranchData = {
  branch: string;
  activeStudents: number;
  enquiries: number;
  admissions: number;
  businessTarget: number;
  businessAchieved: number;
  feeTarget: number;
  feeCollected: number;
  pendingFees: number;
};

type MonthData = {
  daily: DailyData[];
  branches: BranchData[];
};

const branchNames = [
  "Ariyalur",
  "Guduvancherry",
  "Mayiladuthurai",
  "Perambalur",
  "Thanjavur",
  "Tiruchirappalli",
];

const septemberDaily: DailyData[] = [
  { date: 1, enquiries: 8, admissions: 3, newPayment: 45000, duePayment: 18000 },
  { date: 2, enquiries: 10, admissions: 4, newPayment: 60000, duePayment: 22000 },
  { date: 3, enquiries: 7, admissions: 2, newPayment: 30000, duePayment: 35000 },
  { date: 4, enquiries: 12, admissions: 5, newPayment: 75000, duePayment: 28000 },
  { date: 5, enquiries: 9, admissions: 4, newPayment: 55000, duePayment: 42000 },
  { date: 6, enquiries: 6, admissions: 2, newPayment: 28000, duePayment: 25000 },
  { date: 7, enquiries: 11, admissions: 5, newPayment: 70000, duePayment: 30000 },
  { date: 8, enquiries: 13, admissions: 6, newPayment: 82000, duePayment: 45000 },
  { date: 9, enquiries: 8, admissions: 3, newPayment: 48000, duePayment: 32000 },
  { date: 10, enquiries: 14, admissions: 7, newPayment: 90000, duePayment: 50000 },
  { date: 11, enquiries: 9, admissions: 4, newPayment: 58000, duePayment: 28000 },
  { date: 12, enquiries: 12, admissions: 5, newPayment: 72000, duePayment: 40000 },
  { date: 13, enquiries: 7, admissions: 3, newPayment: 40000, duePayment: 22000 },
  { date: 14, enquiries: 10, admissions: 4, newPayment: 62000, duePayment: 38000 },
  { date: 15, enquiries: 15, admissions: 7, newPayment: 95000, duePayment: 52000 },
  { date: 16, enquiries: 11, admissions: 5, newPayment: 68000, duePayment: 36000 },
  { date: 17, enquiries: 8, admissions: 3, newPayment: 45000, duePayment: 30000 },
  { date: 18, enquiries: 13, admissions: 6, newPayment: 85000, duePayment: 48000 },
  { date: 19, enquiries: 9, admissions: 4, newPayment: 60000, duePayment: 34000 },
  { date: 20, enquiries: 12, admissions: 5, newPayment: 74000, duePayment: 41000 },
  { date: 21, enquiries: 6, admissions: 2, newPayment: 32000, duePayment: 20000 },
  { date: 22, enquiries: 14, admissions: 6, newPayment: 88000, duePayment: 46000 },
  { date: 23, enquiries: 10, admissions: 4, newPayment: 65000, duePayment: 35000 },
  { date: 24, enquiries: 12, admissions: 5, newPayment: 78000, duePayment: 42000 },
  { date: 25, enquiries: 16, admissions: 8, newPayment: 100000, duePayment: 55000 },
  { date: 26, enquiries: 9, admissions: 4, newPayment: 57000, duePayment: 33000 },
  { date: 27, enquiries: 11, admissions: 5, newPayment: 70000, duePayment: 39000 },
  { date: 28, enquiries: 7, admissions: 3, newPayment: 42000, duePayment: 26000 },
  { date: 29, enquiries: 13, admissions: 6, newPayment: 84000, duePayment: 47000 },
  { date: 30, enquiries: 10, admissions: 4, newPayment: 62000, duePayment: 36000 },
];

const septemberBranches: BranchData[] = [
  { branch: "Ariyalur", activeStudents: 125, enquiries: 48, admissions: 18, businessTarget: 600000, businessAchieved: 480000, feeTarget: 350000, feeCollected: 290000, pendingFees: 160000 },
  { branch: "Guduvancherry", activeStudents: 210, enquiries: 72, admissions: 28, businessTarget: 900000, businessAchieved: 760000, feeTarget: 520000, feeCollected: 430000, pendingFees: 210000 },
  { branch: "Mayiladuthurai", activeStudents: 145, enquiries: 54, admissions: 21, businessTarget: 700000, businessAchieved: 590000, feeTarget: 400000, feeCollected: 335000, pendingFees: 175000 },
  { branch: "Perambalur", activeStudents: 118, enquiries: 43, admissions: 16, businessTarget: 550000, businessAchieved: 445000, feeTarget: 320000, feeCollected: 265000, pendingFees: 145000 },
  { branch: "Thanjavur", activeStudents: 235, enquiries: 82, admissions: 32, businessTarget: 1000000, businessAchieved: 860000, feeTarget: 580000, feeCollected: 485000, pendingFees: 230000 },
  { branch: "Tiruchirappalli", activeStudents: 268, enquiries: 95, admissions: 38, businessTarget: 1200000, businessAchieved: 1050000, feeTarget: 680000, feeCollected: 590000, pendingFees: 265000 },
];

function scaleDaily(source: DailyData[], factor: number): DailyData[] {
  return source.map((item) => ({
    date: item.date,
    enquiries: Math.round(item.enquiries * factor),
    admissions: Math.round(item.admissions * factor),
    newPayment: Math.round(item.newPayment * factor),
    duePayment: Math.round(item.duePayment * factor * 0.95),
  }));
}

function scaleBranches(source: BranchData[], factor: number): BranchData[] {
  return source.map((branch) => ({
    ...branch,
    activeStudents: Math.round(branch.activeStudents * factor),
    enquiries: Math.round(branch.enquiries * factor),
    admissions: Math.round(branch.admissions * factor),
    businessAchieved: Math.round(branch.businessAchieved * factor),
    feeCollected: Math.round(branch.feeCollected * factor),
    pendingFees: Math.round(branch.pendingFees * (2 - factor)),
  }));
}

const monthlyData: Record<string, MonthData> = {
  "2026-07": {
    daily: scaleDaily(septemberDaily, 0.72),
    branches: scaleBranches(septemberBranches, 0.82),
  },
  "2026-08": {
    daily: scaleDaily(septemberDaily, 0.86),
    branches: scaleBranches(septemberBranches, 0.91),
  },
  "2026-09": {
    daily: septemberDaily,
    branches: septemberBranches,
  },
};

function createEmptyMonthData(): MonthData {
  return {
    daily: [],
    branches: branchNames.map((branch) => ({
      branch,
      activeStudents: 0,
      enquiries: 0,
      admissions: 0,
      businessTarget: 0,
      businessAchieved: 0,
      feeTarget: 0,
      feeCollected: 0,
      pendingFees: 0,
    })),
  };
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

function compactCurrency(value: number) {
  if (value >= 100000) return `₹${(value / 100000).toFixed(1)}L`;
  if (value >= 1000) return `₹${Math.round(value / 1000)}K`;
  return `₹${Math.round(value)}`;
}

function WeeklyConversionChart({ data }: { data: DailyData[] }) {
  const weekly = useMemo(() => {
    const weeks = [
      { label: "Week 1", start: 1, end: 7 },
      { label: "Week 2", start: 8, end: 14 },
      { label: "Week 3", start: 15, end: 21 },
      { label: "Week 4", start: 22, end: 28 },
      { label: "Week 5", start: 29, end: 31 },
    ];

    return weeks
      .map((week) => {
        const rows = data.filter(
          (item) => item.date >= week.start && item.date <= week.end
        );
        const enquiries = rows.reduce((sum, item) => sum + item.enquiries, 0);
        const admissions = rows.reduce((sum, item) => sum + item.admissions, 0);

        return {
          label: week.label,
          enquiries,
          admissions,
          notConverted: Math.max(enquiries - admissions, 0),
        };
      })
      .filter((week) => week.enquiries > 0);
  }, [data]);

  if (weekly.length === 0) {
    return (
      <div className="flex min-h-[360px] flex-col rounded-xl border border-neutral-200 bg-white p-5">
        <h2 className="text-base font-semibold text-neutral-900">Enquiry Conversion</h2>
        <div className="flex flex-1 items-center justify-center text-sm text-neutral-400">
          No data available for the selected month.
        </div>
      </div>
    );
  }

  const totalEnquiries = weekly.reduce((sum, w) => sum + w.enquiries, 0);
  const totalAdmissions = weekly.reduce((sum, w) => sum + w.admissions, 0);
  const conversionRate = totalEnquiries
    ? (totalAdmissions / totalEnquiries) * 100
    : 0;

  const width = 680;
  const height = 270;
  const padding = { top: 25, right: 20, bottom: 45, left: 48 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;
  const maxValue = Math.max(...weekly.map((w) => w.enquiries), 1);
  const slotWidth = chartWidth / weekly.length;
  const barWidth = Math.min(64, slotWidth * 0.5);

  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-5">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-neutral-900">Enquiry Conversion</h2>
          <p className="mt-1 text-xs text-neutral-500">Weekly enquiry conversion for the selected month</p>
        </div>

        <div className="rounded-lg border border-green-100 bg-green-50 px-3 py-2 text-right">
          <div className="text-[11px] font-medium uppercase tracking-wide text-green-700">Conversion Rate</div>
          <div className="mt-0.5 text-lg font-semibold text-green-700">{conversionRate.toFixed(1)}%</div>
        </div>
      </div>

      <div className="mb-3 flex gap-4 text-xs text-neutral-600">
        <div className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-sm bg-green-500" />Admissions</div>
        <div className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-sm bg-blue-200" />Not Converted</div>
      </div>

      <div className="overflow-x-auto">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full min-w-[520px]">
          {[0, 0.25, 0.5, 0.75, 1].map((tick) => {
            const value = maxValue * tick;
            const y = padding.top + chartHeight - (value / maxValue) * chartHeight;
            return (
              <g key={tick}>
                <line x1={padding.left} y1={y} x2={width - padding.right} y2={y} stroke="#e5e7eb" strokeDasharray="4 4" />
                <text x={padding.left - 10} y={y + 4} textAnchor="end" fontSize="10" fill="#737373">{Math.round(value)}</text>
              </g>
            );
          })}

          {weekly.map((week, index) => {
            const x = padding.left + index * slotWidth + slotWidth / 2 - barWidth / 2;
            const admissionsHeight = (week.admissions / maxValue) * chartHeight;
            const notConvertedHeight = (week.notConverted / maxValue) * chartHeight;
            const bottom = padding.top + chartHeight;
            const admissionsY = bottom - admissionsHeight;
            const notConvertedY = admissionsY - notConvertedHeight;

            return (
              <g key={week.label}>
                <rect x={x} y={notConvertedY} width={barWidth} height={notConvertedHeight} rx="6" fill="#bfdbfe" />
                <rect x={x} y={admissionsY} width={barWidth} height={admissionsHeight} rx="6" fill="#22c55e" />
                <text x={x + barWidth / 2} y={Math.max(notConvertedY - 7, 12)} textAnchor="middle" fontSize="10" fontWeight="600" fill="#525252">{week.enquiries}</text>
                <text x={x + barWidth / 2} y={height - 15} textAnchor="middle" fontSize="10" fill="#737373">{week.label}</text>
              </g>
            );
          })}
        </svg>
      </div>

      <div className="mt-2 flex justify-between border-t border-neutral-100 pt-3 text-xs text-neutral-500">
        <span>Total Enquiries: {totalEnquiries}</span>
        <span>Total Admissions: {totalAdmissions}</span>
      </div>
    </div>
  );
}

function CollectionTrendChart({ data }: { data: DailyData[] }) {
  if (data.length === 0) {
    return (
      <div className="flex min-h-[360px] flex-col rounded-xl border border-neutral-200 bg-white p-5">
        <h2 className="text-base font-semibold text-neutral-900">Daily Collection Trend</h2>
        <div className="flex flex-1 items-center justify-center text-sm text-neutral-400">No data available for the selected month.</div>
      </div>
    );
  }

  const width = 700;
  const height = 270;
  const padding = { top: 25, right: 25, bottom: 40, left: 58 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;
  const maxValue = Math.max(...data.flatMap((d) => [d.newPayment, d.duePayment]), 1);

  const getX = (index: number) => padding.left + (index / Math.max(data.length - 1, 1)) * chartWidth;
  const getY = (value: number) => padding.top + chartHeight - (value / maxValue) * chartHeight;

  const newPaymentPoints = data.map((d, i) => `${getX(i)},${getY(d.newPayment)}`).join(" ");
  const duePaymentPoints = data.map((d, i) => `${getX(i)},${getY(d.duePayment)}`).join(" ");
  const totalNew = data.reduce((sum, d) => sum + d.newPayment, 0);
  const totalDue = data.reduce((sum, d) => sum + d.duePayment, 0);

  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-5">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-neutral-900">Daily Collection Trend</h2>
          <p className="mt-1 text-xs text-neutral-500">New and due fee collections by date</p>
        </div>

        <div className="flex gap-2 text-xs">
          <div className="rounded-lg border border-blue-100 bg-blue-50 px-3 py-2">
            <div className="text-neutral-500">New Payment</div>
            <div className="font-semibold text-blue-700">{compactCurrency(totalNew)}</div>
          </div>
          <div className="rounded-lg border border-green-100 bg-green-50 px-3 py-2">
            <div className="text-neutral-500">Due Payment</div>
            <div className="font-semibold text-green-700">{compactCurrency(totalDue)}</div>
          </div>
        </div>
      </div>

      <div className="mb-3 flex gap-4 text-xs text-neutral-600">
        <div className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-blue-500" />New Payment</div>
        <div className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-green-500" />Due Payment</div>
      </div>

      <div className="overflow-x-auto">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full min-w-[560px]">
          {[0, 0.25, 0.5, 0.75, 1].map((tick) => {
            const value = maxValue * tick;
            const y = getY(value);
            return (
              <g key={tick}>
                <line x1={padding.left} y1={y} x2={width - padding.right} y2={y} stroke="#e5e7eb" strokeDasharray="4 4" />
                <text x={padding.left - 10} y={y + 4} textAnchor="end" fontSize="10" fill="#737373">{compactCurrency(value)}</text>
              </g>
            );
          })}

          {data.map((item, index) => {
            if (index !== 0 && index !== data.length - 1 && (index + 1) % 5 !== 0) return null;
            return (
              <text key={item.date} x={getX(index)} y={height - 12} textAnchor="middle" fontSize="10" fill="#737373">{item.date}</text>
            );
          })}

          <polyline points={newPaymentPoints} fill="none" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          <polyline points={duePaymentPoints} fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

          {data.map((item, index) => (
            <g key={item.date}>
              <circle cx={getX(index)} cy={getY(item.newPayment)} r="2.8" fill="#3b82f6" />
              <circle cx={getX(index)} cy={getY(item.duePayment)} r="2.8" fill="#22c55e" />
            </g>
          ))}
        </svg>
      </div>
      <div className="mt-1 text-center text-xs text-neutral-400">Date</div>
    </div>
  );
}

export default function DashboardPage() {
  const [selectedMonth, setSelectedMonth] = useState("2026-09");

  // Month-filter correction: unknown months no longer fall back to September.
  const data = useMemo(
    () => monthlyData[selectedMonth] ?? createEmptyMonthData(),
    [selectedMonth]
  );

  const totals = useMemo(() => {
    const activeStudents = data.branches.reduce((sum, b) => sum + b.activeStudents, 0);
    const enquiries = data.daily.reduce((sum, d) => sum + d.enquiries, 0);
    const admissions = data.daily.reduce((sum, d) => sum + d.admissions, 0);
    const feeCollected = data.daily.reduce((sum, d) => sum + d.newPayment + d.duePayment, 0);
    return { activeStudents, enquiries, admissions, feeCollected };
  }, [data]);

  const branchTotals = useMemo(() => {
    return data.branches.reduce(
      (t, b) => ({
        activeStudents: t.activeStudents + b.activeStudents,
        enquiries: t.enquiries + b.enquiries,
        admissions: t.admissions + b.admissions,
        businessTarget: t.businessTarget + b.businessTarget,
        businessAchieved: t.businessAchieved + b.businessAchieved,
        feeTarget: t.feeTarget + b.feeTarget,
        feeCollected: t.feeCollected + b.feeCollected,
        pendingFees: t.pendingFees + b.pendingFees,
      }),
      { activeStudents: 0, enquiries: 0, admissions: 0, businessTarget: 0, businessAchieved: 0, feeTarget: 0, feeCollected: 0, pendingFees: 0 }
    );
  }, [data]);

  function exportBranchPerformance() {
    const headers = ["Branch", "Active Students", "Enquiries", "New Admissions", "Business Target", "Business Achieved", "Fee Target", "Fee Collected", "Pending Fees"];
    const rows: (string | number)[][] = data.branches.map((b) => [
      b.branch, b.activeStudents, b.enquiries, b.admissions, b.businessTarget, b.businessAchieved, b.feeTarget, b.feeCollected, b.pendingFees,
    ]);
    rows.push(["Total", branchTotals.activeStudents, branchTotals.enquiries, branchTotals.admissions, branchTotals.businessTarget, branchTotals.businessAchieved, branchTotals.feeTarget, branchTotals.feeCollected, branchTotals.pendingFees]);

    const csv = [headers, ...rows]
      .map((row) => row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(","))
      .join("\n");

    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `JET-MIS-Branch-Performance-${selectedMonth}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  const cards = [
    { title: "Active Students", value: totals.activeStudents.toLocaleString("en-IN"), icon: UsersRound, box: "border-blue-100 bg-blue-50/50", iconBox: "bg-blue-100 text-blue-600" },
    { title: "New Enquiries", value: totals.enquiries.toLocaleString("en-IN"), icon: MessageSquareMore, box: "border-blue-100 bg-blue-50/50", iconBox: "bg-blue-100 text-blue-600" },
    { title: "New Admissions", value: totals.admissions.toLocaleString("en-IN"), icon: UserPlus, box: "border-green-100 bg-green-50/50", iconBox: "bg-green-100 text-green-600" },
    { title: "Fee Collected", value: formatCurrency(totals.feeCollected), icon: IndianRupee, box: "border-green-100 bg-green-50/50", iconBox: "bg-green-100 text-green-600" },
  ];

  return (
    <div className="min-h-screen bg-white p-6 lg:p-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold tracking-tight text-neutral-900">Dashboard</h1>
        <input
          type="month"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-700 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.title} className={`rounded-xl border p-5 ${card.box}`}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-neutral-500">{card.title}</p>
                  <p className="mt-3 text-2xl font-semibold tracking-tight text-neutral-900">{card.value}</p>
                </div>
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${card.iconBox}`}>
                  <Icon size={20} strokeWidth={1.8} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 grid gap-5 xl:grid-cols-2">
        <WeeklyConversionChart data={data.daily} />
        <CollectionTrendChart data={data.daily} />
      </div>

      <div className="mt-6 overflow-hidden rounded-xl border border-neutral-200 bg-white">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-neutral-200 px-5 py-4">
          <h2 className="text-base font-semibold text-neutral-900">Branch Performance</h2>
          <button type="button" onClick={exportBranchPerformance} className="inline-flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-4 py-2 text-sm font-medium text-green-700 transition hover:bg-green-100">
            <Download size={16} strokeWidth={1.8} /> Excel
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1250px] border-collapse text-left text-sm">
            <thead className="bg-neutral-50/80 text-xs font-medium uppercase tracking-wide text-neutral-500">
              <tr>
                <th className="px-4 py-3">Branch</th>
                <th className="px-4 py-3 text-center">Active Students</th>
                <th className="px-4 py-3 text-center">Enquiries</th>
                <th className="px-4 py-3 text-center">New Admissions</th>
                <th className="px-4 py-3 text-right">Business Target</th>
                <th className="px-4 py-3 text-right">Business Achieved</th>
                <th className="px-4 py-3 text-right">Fee Target</th>
                <th className="px-4 py-3 text-right">Fee Collected</th>
                <th className="px-4 py-3 text-right">Pending Fees</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {data.branches.map((b) => (
                <tr key={b.branch} className="transition hover:bg-blue-50/30">
                  <td className="px-4 py-4 font-medium text-neutral-900">{b.branch}</td>
                  <td className="px-4 py-4 text-center">{b.activeStudents}</td>
                  <td className="px-4 py-4 text-center">{b.enquiries}</td>
                  <td className="px-4 py-4 text-center">{b.admissions}</td>
                  <td className="px-4 py-4 text-right">{formatCurrency(b.businessTarget)}</td>
                  <td className="px-4 py-4 text-right font-medium text-green-700">{formatCurrency(b.businessAchieved)}</td>
                  <td className="px-4 py-4 text-right">{formatCurrency(b.feeTarget)}</td>
                  <td className="px-4 py-4 text-right font-medium text-green-700">{formatCurrency(b.feeCollected)}</td>
                  <td className="px-4 py-4 text-right font-medium text-red-600">{formatCurrency(b.pendingFees)}</td>
                </tr>
              ))}
              <tr className="bg-neutral-50 font-semibold text-neutral-900">
                <td className="px-4 py-4">Total</td>
                <td className="px-4 py-4 text-center">{branchTotals.activeStudents}</td>
                <td className="px-4 py-4 text-center">{branchTotals.enquiries}</td>
                <td className="px-4 py-4 text-center">{branchTotals.admissions}</td>
                <td className="px-4 py-4 text-right">{formatCurrency(branchTotals.businessTarget)}</td>
                <td className="px-4 py-4 text-right text-green-700">{formatCurrency(branchTotals.businessAchieved)}</td>
                <td className="px-4 py-4 text-right">{formatCurrency(branchTotals.feeTarget)}</td>
                <td className="px-4 py-4 text-right text-green-700">{formatCurrency(branchTotals.feeCollected)}</td>
                <td className="px-4 py-4 text-right text-red-600">{formatCurrency(branchTotals.pendingFees)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
