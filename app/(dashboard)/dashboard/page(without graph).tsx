"use client";

import { useMemo, useState } from "react";
import {
  Users,
  MessageSquareText,
  UserPlus,
  IndianRupee,
  CalendarDays,
  Download,
} from "lucide-react";

type BranchRow = {
  branch: string;

  activeStudents: number;
  enquiries: number;
  newAdmissions: number;

  newBusinessTarget: number;
  newBusinessAchieved: number;

  dueFeeTarget: number;
  dueFeeCollected: number;

  pendingFees: number;
};

const monthlyData: Record<string, BranchRow[]> = {
  "2026-09": [
    {
      branch: "Ariyalur",
      activeStudents: 98,
      enquiries: 31,
      newAdmissions: 18,
      newBusinessTarget: 500000,
      newBusinessAchieved: 420000,
      dueFeeTarget: 200000,
      dueFeeCollected: 145000,
      pendingFees: 82000,
    },
    {
      branch: "Guduvancherry",
      activeStudents: 131,
      enquiries: 42,
      newAdmissions: 22,
      newBusinessTarget: 650000,
      newBusinessAchieved: 570000,
      dueFeeTarget: 250000,
      dueFeeCollected: 185000,
      pendingFees: 96000,
    },
    {
      branch: "Mayiladuthurai",
      activeStudents: 94,
      enquiries: 27,
      newAdmissions: 15,
      newBusinessTarget: 450000,
      newBusinessAchieved: 365000,
      dueFeeTarget: 180000,
      dueFeeCollected: 132000,
      pendingFees: 74000,
    },
    {
      branch: "Perambalur",
      activeStudents: 112,
      enquiries: 35,
      newAdmissions: 19,
      newBusinessTarget: 550000,
      newBusinessAchieved: 470000,
      dueFeeTarget: 220000,
      dueFeeCollected: 158000,
      pendingFees: 88000,
    },
    {
      branch: "Thanjavur",
      activeStudents: 151,
      enquiries: 48,
      newAdmissions: 26,
      newBusinessTarget: 750000,
      newBusinessAchieved: 680000,
      dueFeeTarget: 300000,
      dueFeeCollected: 228000,
      pendingFees: 112000,
    },
    {
      branch: "Tiruchirappalli",
      activeStudents: 180,
      enquiries: 57,
      newAdmissions: 33,
      newBusinessTarget: 900000,
      newBusinessAchieved: 825000,
      dueFeeTarget: 350000,
      dueFeeCollected: 268000,
      pendingFees: 138000,
    },
  ],

  "2026-08": [
    {
      branch: "Ariyalur",
      activeStudents: 91,
      enquiries: 28,
      newAdmissions: 14,
      newBusinessTarget: 480000,
      newBusinessAchieved: 390000,
      dueFeeTarget: 190000,
      dueFeeCollected: 138000,
      pendingFees: 79000,
    },
    {
      branch: "Guduvancherry",
      activeStudents: 124,
      enquiries: 38,
      newAdmissions: 19,
      newBusinessTarget: 620000,
      newBusinessAchieved: 530000,
      dueFeeTarget: 240000,
      dueFeeCollected: 176000,
      pendingFees: 93000,
    },
    {
      branch: "Mayiladuthurai",
      activeStudents: 88,
      enquiries: 24,
      newAdmissions: 13,
      newBusinessTarget: 430000,
      newBusinessAchieved: 340000,
      dueFeeTarget: 170000,
      dueFeeCollected: 125000,
      pendingFees: 71000,
    },
    {
      branch: "Perambalur",
      activeStudents: 105,
      enquiries: 30,
      newAdmissions: 16,
      newBusinessTarget: 520000,
      newBusinessAchieved: 435000,
      dueFeeTarget: 210000,
      dueFeeCollected: 149000,
      pendingFees: 84000,
    },
    {
      branch: "Thanjavur",
      activeStudents: 143,
      enquiries: 43,
      newAdmissions: 22,
      newBusinessTarget: 720000,
      newBusinessAchieved: 640000,
      dueFeeTarget: 285000,
      dueFeeCollected: 215000,
      pendingFees: 106000,
    },
    {
      branch: "Tiruchirappalli",
      activeStudents: 171,
      enquiries: 51,
      newAdmissions: 29,
      newBusinessTarget: 860000,
      newBusinessAchieved: 780000,
      dueFeeTarget: 335000,
      dueFeeCollected: 250000,
      pendingFees: 132000,
    },
  ],
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function DashboardPage() {
  const [selectedMonth, setSelectedMonth] = useState("2026-09");

  const branchData = monthlyData[selectedMonth] ?? [];

  const totals = useMemo(() => {
    return branchData.reduce(
      (total, row) => {
        total.activeStudents += row.activeStudents;
        total.enquiries += row.enquiries;
        total.newAdmissions += row.newAdmissions;
        total.newBusinessTarget += row.newBusinessTarget;
        total.newBusinessAchieved += row.newBusinessAchieved;
        total.dueFeeTarget += row.dueFeeTarget;
        total.dueFeeCollected += row.dueFeeCollected;
        total.pendingFees += row.pendingFees;

        return total;
      },
      {
        activeStudents: 0,
        enquiries: 0,
        newAdmissions: 0,
        newBusinessTarget: 0,
        newBusinessAchieved: 0,
        dueFeeTarget: 0,
        dueFeeCollected: 0,
        pendingFees: 0,
      }
    );
  }, [branchData]);


  function exportBranchPerformance() {
  const headers = [
    "Branch",
    "Active Students",
    "Enquiries",
    "New Admissions",
    "New Business Target",
    "New Business Achieved",
    "Due Fee Collection Target",
    "Due Fee Collected Amount",
    "Pending Fees",
  ];

  const rows = branchData.map((row) => [
    row.branch,
    row.activeStudents,
    row.enquiries,
    row.newAdmissions,
    row.newBusinessTarget,
    row.newBusinessAchieved,
    row.dueFeeTarget,
    row.dueFeeCollected,
    row.pendingFees,
  ]);

  const totalRow = [
    "Total",
    totals.activeStudents,
    totals.enquiries,
    totals.newAdmissions,
    totals.newBusinessTarget,
    totals.newBusinessAchieved,
    totals.dueFeeTarget,
    totals.dueFeeCollected,
    totals.pendingFees,
  ];

  const csv = [
    headers,
    ...rows,
    totalRow,
  ]
    .map((row) =>
      row
        .map((value) => `"${String(value).replace(/"/g, '""')}"`)
        .join(",")
    )
    .join("\n");

  const blob = new Blob(["\uFEFF" + csv], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = `JET-MIS-Branch-Performance-${selectedMonth}.csv`;

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}

  return (
    <div className="min-h-screen bg-white px-6 py-6 lg:px-8">
      {/* HEADER */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold tracking-tight text-neutral-900">
          Dashboard
        </h1>

        {/* REAL MONTH FILTER */}
        <div className="flex items-center gap-2">
          <CalendarDays
            size={18}
            strokeWidth={1.8}
            className="text-neutral-400"
          />

          <input
            type="month"
            value={selectedMonth}
            onChange={(event) => setSelectedMonth(event.target.value)}
            className="h-10 rounded-lg border border-neutral-300 bg-white px-3 text-sm font-medium text-neutral-700 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
          />
        </div>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {/* ACTIVE STUDENTS */}
        <div className="rounded-xl border border-blue-100 bg-blue-50/60 p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-neutral-600">
                Active Students
              </p>

              <p className="mt-2 text-2xl font-semibold text-neutral-900">
                {totals.activeStudents}
              </p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-blue-600">
              <Users size={20} strokeWidth={1.8} />
            </div>
          </div>
        </div>

        {/* NEW ENQUIRIES */}
        <div className="rounded-xl border border-blue-100 bg-blue-50/40 p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-neutral-600">
                New Enquiries
              </p>

              <p className="mt-2 text-2xl font-semibold text-neutral-900">
                {totals.enquiries}
              </p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-blue-600">
              <MessageSquareText size={20} strokeWidth={1.8} />
            </div>
          </div>
        </div>

        {/* NEW ADMISSIONS */}
        <div className="rounded-xl border border-green-100 bg-green-50/60 p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-neutral-600">
                New Admissions
              </p>

              <p className="mt-2 text-2xl font-semibold text-neutral-900">
                {totals.newAdmissions}
              </p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-green-600">
              <UserPlus size={20} strokeWidth={1.8} />
            </div>
          </div>
        </div>

        {/* FEE COLLECTED */}
        <div className="rounded-xl border border-green-100 bg-green-50/60 p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-neutral-600">
                Fee Collected
              </p>

              <p className="mt-2 text-2xl font-semibold text-neutral-900">
                {formatCurrency(totals.dueFeeCollected)}
              </p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-green-600">
              <IndianRupee size={20} strokeWidth={1.8} />
            </div>
          </div>
        </div>
      </div>

      {/* BRANCH PERFORMANCE */}
      <div className="mt-7">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-neutral-900">
            Branch Performance
          </h2>

          <button
            type="button"
            onClick={exportBranchPerformance}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-green-200 bg-green-50 px-4 text-sm font-medium text-green-700 transition hover:border-green-300 hover:bg-green-100"
          >
            <Download size={17} strokeWidth={1.8} />
            Excel
          </button>
        </div>

        <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1450px] text-left">
              <thead className="bg-neutral-50/80">
                <tr className="border-b border-neutral-200">
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-neutral-500">
                    Branch
                  </th>

                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-neutral-500">
                    Active Students
                  </th>

                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-neutral-500">
                    Enquiries
                  </th>

                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-neutral-500">
                    New Admissions
                  </th>

                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-neutral-500">
                    Business Target
                  </th>

                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-neutral-500">
                    Business Achieved
                  </th>

                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-neutral-500">
                    Fee Target
                  </th>

                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-neutral-500">
                    Fee Collected
                  </th>

                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-neutral-500">
                    Pending Fees
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-neutral-100">
                {branchData.map((row) => (
                  <tr
                    key={row.branch}
                    className="transition hover:bg-blue-50/30"
                  >
                    <td className="whitespace-nowrap px-4 py-4 text-sm font-medium text-neutral-900">
                      {row.branch}
                    </td>

                    <td className="px-4 py-4 text-right text-sm text-neutral-700">
                      {row.activeStudents}
                    </td>

                    <td className="px-4 py-4 text-right text-sm text-neutral-700">
                      {row.enquiries}
                    </td>

                    <td className="px-4 py-4 text-right text-sm text-neutral-700">
                      {row.newAdmissions}
                    </td>

                    <td className="px-4 py-4 text-right text-sm text-neutral-700">
                      {formatCurrency(row.newBusinessTarget)}
                    </td>

                    <td className="px-4 py-4 text-right text-sm font-medium text-green-700">
                      {formatCurrency(row.newBusinessAchieved)}
                    </td>

                    <td className="px-4 py-4 text-right text-sm text-neutral-700">
                      {formatCurrency(row.dueFeeTarget)}
                    </td>

                    <td className="px-4 py-4 text-right text-sm font-medium text-green-700">
                      {formatCurrency(row.dueFeeCollected)}
                    </td>

                    <td className="px-4 py-4 text-right text-sm font-medium text-red-600">
                      {formatCurrency(row.pendingFees)}
                    </td>
                  </tr>
                ))}

                {/* TOTAL */}
                <tr className="bg-neutral-50">
                  <td className="px-4 py-4 text-sm font-semibold text-neutral-900">
                    Total
                  </td>

                  <td className="px-4 py-4 text-right text-sm font-semibold text-neutral-900">
                    {totals.activeStudents}
                  </td>

                  <td className="px-4 py-4 text-right text-sm font-semibold text-neutral-900">
                    {totals.enquiries}
                  </td>

                  <td className="px-4 py-4 text-right text-sm font-semibold text-neutral-900">
                    {totals.newAdmissions}
                  </td>

                  <td className="px-4 py-4 text-right text-sm font-semibold text-neutral-900">
                    {formatCurrency(totals.newBusinessTarget)}
                  </td>

                  <td className="px-4 py-4 text-right text-sm font-semibold text-green-700">
                    {formatCurrency(totals.newBusinessAchieved)}
                  </td>

                  <td className="px-4 py-4 text-right text-sm font-semibold text-neutral-900">
                    {formatCurrency(totals.dueFeeTarget)}
                  </td>

                  <td className="px-4 py-4 text-right text-sm font-semibold text-green-700">
                    {formatCurrency(totals.dueFeeCollected)}
                  </td>

                  <td className="px-4 py-4 text-right text-sm font-semibold text-red-600">
                    {formatCurrency(totals.pendingFees)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}