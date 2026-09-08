"use client";

import { useMemo, useState } from "react";
import { Plus, X } from "lucide-react";

type AnalyticsRow = {
  fy: string;
  month: string;
  monthOrder: number;
  branch: string;
  businessTarget: number;
  businessAchieved: number;
  feeTarget: number;
  feeCollected: number;
};

const financialYears = [
  "FY 2025-26",
  "FY 2026-27",
  "FY 2027-28",
];

const branches = [
  "Ariyalur",
  "Guduvancherry",
  "Mayiladuthurai",
  "Perambalur",
  "Thanjavur",
  "Tiruchirappalli",
];

const initialAnalytics: AnalyticsRow[] = [
  {
    fy: "FY 2026-27",
    month: "August 2026",
    monthOrder: 5,
    branch: "Ariyalur",
    businessTarget: 500000,
    businessAchieved: 425000,
    feeTarget: 300000,
    feeCollected: 270000,
  },
  {
    fy: "FY 2026-27",
    month: "August 2026",
    monthOrder: 5,
    branch: "Guduvancherry",
    businessTarget: 600000,
    businessAchieved: 510000,
    feeTarget: 350000,
    feeCollected: 300000,
  },
  {
    fy: "FY 2026-27",
    month: "August 2026",
    monthOrder: 5,
    branch: "Mayiladuthurai",
    businessTarget: 550000,
    businessAchieved: 480000,
    feeTarget: 325000,
    feeCollected: 295000,
  },
  {
    fy: "FY 2026-27",
    month: "August 2026",
    monthOrder: 5,
    branch: "Perambalur",
    businessTarget: 500000,
    businessAchieved: 390000,
    feeTarget: 300000,
    feeCollected: 245000,
  },
  {
    fy: "FY 2026-27",
    month: "August 2026",
    monthOrder: 5,
    branch: "Thanjavur",
    businessTarget: 700000,
    businessAchieved: 620000,
    feeTarget: 400000,
    feeCollected: 365000,
  },
  {
    fy: "FY 2026-27",
    month: "August 2026",
    monthOrder: 5,
    branch: "Tiruchirappalli",
    businessTarget: 1000000,
    businessAchieved: 875000,
    feeTarget: 600000,
    feeCollected: 540000,
  },
  {
    fy: "FY 2026-27",
    month: "July 2026",
    monthOrder: 4,
    branch: "Ariyalur",
    businessTarget: 480000,
    businessAchieved: 410000,
    feeTarget: 280000,
    feeCollected: 250000,
  },
  {
    fy: "FY 2026-27",
    month: "July 2026",
    monthOrder: 4,
    branch: "Guduvancherry",
    businessTarget: 580000,
    businessAchieved: 495000,
    feeTarget: 340000,
    feeCollected: 290000,
  },
  {
    fy: "FY 2026-27",
    month: "July 2026",
    monthOrder: 4,
    branch: "Mayiladuthurai",
    businessTarget: 520000,
    businessAchieved: 455000,
    feeTarget: 310000,
    feeCollected: 280000,
  },
  {
    fy: "FY 2026-27",
    month: "July 2026",
    monthOrder: 4,
    branch: "Perambalur",
    businessTarget: 470000,
    businessAchieved: 360000,
    feeTarget: 275000,
    feeCollected: 230000,
  },
  {
    fy: "FY 2026-27",
    month: "July 2026",
    monthOrder: 4,
    branch: "Thanjavur",
    businessTarget: 680000,
    businessAchieved: 590000,
    feeTarget: 390000,
    feeCollected: 345000,
  },
  {
    fy: "FY 2026-27",
    month: "July 2026",
    monthOrder: 4,
    branch: "Tiruchirappalli",
    businessTarget: 950000,
    businessAchieved: 830000,
    feeTarget: 560000,
    feeCollected: 510000,
  },
];

export default function MonthlyTargetPage() {
  const [selectedFY, setSelectedFY] =
    useState("FY 2026-27");

  const [analytics, setAnalytics] =
    useState<AnalyticsRow[]>(initialAnalytics);

  const [assignOpen, setAssignOpen] =
    useState(false);

  const [targetFY, setTargetFY] =
    useState("FY 2026-27");

  const [targetMonth, setTargetMonth] =
    useState("");

  const [targetBranch, setTargetBranch] =
    useState("");

  const [businessTarget, setBusinessTarget] =
    useState("");

  const [feeTarget, setFeeTarget] =
    useState("");

  const [error, setError] = useState("");

  const filteredAnalytics = useMemo(() => {
    return analytics
      .filter((row) => row.fy === selectedFY)
      .sort((a, b) => {
        if (a.monthOrder !== b.monthOrder) {
          return b.monthOrder - a.monthOrder;
        }

        return a.branch.localeCompare(
          b.branch,
        );
      });
  }, [analytics, selectedFY]);

  function money(value: number) {
    return `₹${value.toLocaleString(
      "en-IN",
    )}`;
  }

  function percentage(
    achieved: number,
    target: number,
  ) {
    if (!target) return 0;

    return Math.round(
      (achieved / target) * 100,
    );
  }

  function getMonthDetails(value: string) {
    const [year, month] = value
      .split("-")
      .map(Number);

    const label = new Date(
      year,
      month - 1,
      1,
    ).toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });

    const monthOrder =
      month >= 4
        ? month - 3
        : month + 9;

    return {
      label,
      monthOrder,
    };
  }

  function openAssignTarget() {
    setTargetFY(selectedFY);
    setTargetMonth("");
    setTargetBranch("");
    setBusinessTarget("");
    setFeeTarget("");
    setError("");
    setAssignOpen(true);
  }

  function saveTarget() {
    if (
      !targetFY ||
      !targetMonth ||
      !targetBranch ||
      !businessTarget ||
      !feeTarget
    ) {
      setError(
        "Please fill all required fields.",
      );
      return;
    }

    const business =
      Number(businessTarget);

    const fee =
      Number(feeTarget);

    if (business <= 0 || fee <= 0) {
      setError(
        "Target values must be greater than 0.",
      );
      return;
    }

    const month =
      getMonthDetails(targetMonth);

    setAnalytics((current) => {
      const existing = current.some(
        (row) =>
          row.fy === targetFY &&
          row.month === month.label &&
          row.branch === targetBranch,
      );

      if (existing) {
        return current.map((row) =>
          row.fy === targetFY &&
          row.month === month.label &&
          row.branch === targetBranch
            ? {
                ...row,
                businessTarget:
                  business,
                feeTarget: fee,
              }
            : row,
        );
      }

      return [
        ...current,
        {
          fy: targetFY,
          month: month.label,
          monthOrder:
            month.monthOrder,
          branch: targetBranch,
          businessTarget:
            business,
          businessAchieved: 0,
          feeTarget: fee,
          feeCollected: 0,
        },
      ];
    });

    const savedTargets =
      JSON.parse(
        localStorage.getItem(
          "jet-mis-monthly-targets",
        ) || "[]",
      );

    const nextTargets = [
      ...savedTargets.filter(
        (item: {
          fy: string;
          month: string;
          branch: string;
        }) =>
          !(
            item.fy === targetFY &&
            item.month === month.label &&
            item.branch ===
              targetBranch
          ),
      ),
      {
        fy: targetFY,
        month: month.label,
        branch: targetBranch,
        businessTarget:
          business,
        feeTarget: fee,
      },
    ];

    localStorage.setItem(
      "jet-mis-monthly-targets",
      JSON.stringify(nextTargets),
    );

    setSelectedFY(targetFY);
    setAssignOpen(false);
  }

  return (
    <div className="min-h-full bg-white p-6">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-neutral-900">
            Monthly Target
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedFY}
            onChange={(event) =>
              setSelectedFY(
                event.target.value,
              )
            }
            className="h-10 rounded-lg border border-neutral-200 bg-white px-3 text-sm font-medium text-neutral-700 outline-none transition focus:border-blue-300 focus:ring-2 focus:ring-blue-50"
          >
            {financialYears.map(
              (fy) => (
                <option
                  key={fy}
                  value={fy}
                >
                  {fy}
                </option>
              ),
            )}
          </select>

          <button
            type="button"
            onClick={openAssignTarget}
            className="inline-flex h-10 items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-4 text-sm font-medium text-blue-700 transition hover:bg-blue-100"
          >
            <Plus size={16} />
            Assign Target
          </button>
        </div>
      </div>

      <section>
        <div className="mb-4">
          <h2 className="text-base font-semibold text-neutral-900">
            Analytics
          </h2>

          <p className="mt-1 text-sm text-neutral-500">
            Previous month target and
            achieved details for all
            branches.
          </p>
        </div>

        <div className="overflow-x-auto rounded-lg border border-neutral-200 bg-white">
          <table className="w-full min-w-[1100px]">
            <thead>
              <tr className="bg-neutral-50">
                <th
                  className={thClass}
                >
                  Month
                </th>

                <th
                  className={thClass}
                >
                  Branch
                </th>

                <th
                  className={thClass}
                >
                  Business Target
                </th>

                <th
                  className={thClass}
                >
                  Business Achieved
                </th>

                <th
                  className={thClass}
                >
                  Achievement %
                </th>

                <th
                  className={thClass}
                >
                  Fee Target
                </th>

                <th
                  className={thClass}
                >
                  Fee Collected
                </th>

                <th
                  className={thClass}
                >
                  Collection %
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredAnalytics.length >
              0 ? (
                filteredAnalytics.map(
                  (row) => {
                    const businessPercent =
                      percentage(
                        row.businessAchieved,
                        row.businessTarget,
                      );

                    const feePercent =
                      percentage(
                        row.feeCollected,
                        row.feeTarget,
                      );

                    return (
                      <tr
                        key={`${row.fy}-${row.month}-${row.branch}`}
                        className="border-t border-neutral-100 hover:bg-blue-50/30"
                      >
                        <td
                          className={
                            tdClass
                          }
                        >
                          {row.month}
                        </td>

                        <td
                          className={`${tdClass} font-medium text-neutral-900`}
                        >
                          {row.branch}
                        </td>

                        <td
                          className={
                            tdClass
                          }
                        >
                          {money(
                            row.businessTarget,
                          )}
                        </td>

                        <td
                          className={
                            tdClass
                          }
                        >
                          {money(
                            row.businessAchieved,
                          )}
                        </td>

                        <td
                          className={
                            tdClass
                          }
                        >
                          <PercentText
                            value={
                              businessPercent
                            }
                          />
                        </td>

                        <td
                          className={
                            tdClass
                          }
                        >
                          {money(
                            row.feeTarget,
                          )}
                        </td>

                        <td
                          className={
                            tdClass
                          }
                        >
                          {money(
                            row.feeCollected,
                          )}
                        </td>

                        <td
                          className={
                            tdClass
                          }
                        >
                          <PercentText
                            value={
                              feePercent
                            }
                          />
                        </td>
                      </tr>
                    );
                  },
                )
              ) : (
                <tr>
                  <td
                    colSpan={8}
                    className="px-4 py-12 text-center text-sm text-neutral-500"
                  >
                    No analytics data
                    available for{" "}
                    {selectedFY}.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {assignOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/25 p-4">
          <div className="w-full max-w-lg rounded-xl border border-neutral-200 bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-neutral-200 px-5 py-4">
              <div>
                <h3 className="font-semibold text-neutral-900">
                  Assign Target
                </h3>

                <p className="mt-1 text-sm text-neutral-500">
                  Enter monthly target
                  values for a branch.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setAssignOpen(false)
                }
                className="flex h-8 w-8 items-center justify-center rounded-md text-neutral-500 hover:bg-neutral-100"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4 p-5">
              <div>
                <label
                  className={
                    labelClass
                  }
                >
                  Financial Year
                </label>

                <select
                  value={targetFY}
                  onChange={(event) =>
                    setTargetFY(
                      event.target.value,
                    )
                  }
                  className={
                    inputClass
                  }
                >
                  {financialYears.map(
                    (fy) => (
                      <option
                        key={fy}
                        value={fy}
                      >
                        {fy}
                      </option>
                    ),
                  )}
                </select>
              </div>

              <div>
                <label
                  className={
                    labelClass
                  }
                >
                  Month
                </label>

                <input
                  type="month"
                  value={targetMonth}
                  onChange={(event) =>
                    setTargetMonth(
                      event.target.value,
                    )
                  }
                  className={
                    inputClass
                  }
                />
              </div>

              <div>
                <label
                  className={
                    labelClass
                  }
                >
                  Branch
                </label>

                <select
                  value={
                    targetBranch
                  }
                  onChange={(event) =>
                    setTargetBranch(
                      event.target.value,
                    )
                  }
                  className={
                    inputClass
                  }
                >
                  <option value="">
                    Select Branch
                  </option>

                  {branches.map(
                    (branch) => (
                      <option
                        key={branch}
                        value={branch}
                      >
                        {branch}
                      </option>
                    ),
                  )}
                </select>
              </div>

              <div>
                <label
                  className={
                    labelClass
                  }
                >
                  Business Target
                </label>

                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-neutral-400">
                    ₹
                  </span>

                  <input
                    type="number"
                    min="1"
                    value={
                      businessTarget
                    }
                    onChange={(event) =>
                      setBusinessTarget(
                        event.target.value,
                      )
                    }
                    placeholder="Enter business target"
                    className={`${inputClass} pl-7`}
                  />
                </div>
              </div>

              <div>
                <label
                  className={
                    labelClass
                  }
                >
                  Fee Target
                </label>

                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-neutral-400">
                    ₹
                  </span>

                  <input
                    type="number"
                    min="1"
                    value={feeTarget}
                    onChange={(event) =>
                      setFeeTarget(
                        event.target.value,
                      )
                    }
                    placeholder="Enter fee target"
                    className={`${inputClass} pl-7`}
                  />
                </div>
              </div>

              {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                  {error}
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 border-t border-neutral-200 px-5 py-4">
              <button
                type="button"
                onClick={() =>
                  setAssignOpen(false)
                }
                className="h-10 rounded-lg border border-neutral-200 bg-white px-4 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={saveTarget}
                className="h-10 rounded-lg border border-blue-200 bg-blue-50 px-4 text-sm font-medium text-blue-700 hover:bg-blue-100"
              >
                Save Target
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function PercentText({
  value,
}: {
  value: number;
}) {
  return (
    <span
      className={
        value >= 100
          ? "font-medium text-green-700"
          : value >= 80
            ? "font-medium text-neutral-700"
            : "font-medium text-red-600"
      }
    >
      {value}%
    </span>
  );
}

const thClass =
  "px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-neutral-500";

const tdClass =
  "px-4 py-3.5 text-sm text-neutral-600";

const labelClass =
  "mb-1.5 block text-sm font-medium text-neutral-700";

const inputClass =
  "h-10 w-full rounded-lg border border-neutral-200 bg-white px-3 text-sm text-neutral-800 outline-none transition focus:border-blue-300 focus:ring-2 focus:ring-blue-50";