"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import {
  ChevronLeft,
  ChevronRight,
  Download,
  Eye,
  History,
  IndianRupee,
  MoreVertical,
  ReceiptText,
  Search,
  X,
} from "lucide-react";

import * as XLSX from "xlsx";

/* =========================================================
   TYPES
========================================================= */

type FeeStatus =
  | "Paid"
  | "Partially Paid"
  | "Pending"
  | "Overdue";

type PaymentMode = "Cash" | "UPI";

type PaymentHistory = {
  receiptNo: string;
  paymentDate: string;
  amount: number;
  paymentMode: PaymentMode;
  referenceNo: string;
  remark: string;
};

type FeeRecord = {
  admissionId: string;
  admissionDate: string;

  candidateName: string;
  contactNo: string;

  branch: string;
  course: string;

  totalFee: number;
  paidAmount: number;
  balance: number;

  feeStatus: FeeStatus;

  nextDueDate: string;
  lastPaymentDate: string;

  paymentHistory: PaymentHistory[];
};

/* =========================================================
   SAMPLE DATA
========================================================= */

const sampleFees: FeeRecord[] = [
  {
    admissionId: "ADM001",
    admissionDate: "2026-07-01",

    candidateName: "Arun Kumar",
    contactNo: "9876543210",

    branch: "Tiruchirappalli",
    course: "Full Stack Development",

    totalFee: 30000,
    paidAmount: 20000,
    balance: 10000,

    feeStatus: "Partially Paid",

    nextDueDate: "2026-09-15",
    lastPaymentDate: "2026-08-10",

    paymentHistory: [
      {
        receiptNo: "RCPT/2026/0001",
        paymentDate: "2026-07-01",
        amount: 10000,
        paymentMode: "Cash",
        referenceNo: "",
        remark: "Admission payment",
      },
      {
        receiptNo: "RCPT/2026/0002",
        paymentDate: "2026-08-10",
        amount: 10000,
        paymentMode: "UPI",
        referenceNo: "UPI123456",
        remark: "Second payment",
      },
    ],
  },

  {
    admissionId: "ADM002",
    admissionDate: "2026-01-05",

    candidateName: "Priya S",
    contactNo: "9876543211",

    branch: "Thanjavur",
    course: "Python Programming",

    totalFee: 25000,
    paidAmount: 25000,
    balance: 0,

    feeStatus: "Paid",

    nextDueDate: "",
    lastPaymentDate: "2026-03-05",

    paymentHistory: [
      {
        receiptNo: "RCPT/2026/0003",
        paymentDate: "2026-03-05",
        amount: 25000,
        paymentMode: "Cash",
        referenceNo: "",
        remark: "Full payment",
      },
    ],
  },
];

/* =========================================================
   PAGE
========================================================= */

export default function FeesDetailsPage() {
  const [fees, setFees] =
    useState<FeeRecord[]>(sampleFees);

  const [search, setSearch] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState("All");

  const [courseFilter, setCourseFilter] =
    useState("All");

  const [rowsPerPage, setRowsPerPage] =
    useState(10);

  const [currentPage, setCurrentPage] =
    useState(1);

  const [openMenuId, setOpenMenuId] =
    useState<string | null>(null);

  const [selectedFee, setSelectedFee] =
    useState<FeeRecord | null>(null);

  const [payFeeRecord, setPayFeeRecord] =
    useState<FeeRecord | null>(null);

  const [historyRecord, setHistoryRecord] =
    useState<FeeRecord | null>(null);

  /* =======================================================
     LOAD ADMISSION DATA
  ======================================================= */

  useEffect(() => {
    try {
      const saved =
        localStorage.getItem(
          "jet-mis-admissions"
        );

      if (!saved) return;

      const parsed = JSON.parse(saved);

      if (!Array.isArray(parsed)) return;

      const mapped: FeeRecord[] =
        parsed.map((item: any) => {
          const totalFee =
            Number(
              item.totalFee ??
                item.committedFee ??
                item.courseFee ??
                0
            ) || 0;

          const paymentHistory =
            Array.isArray(
              item.paymentHistory
            )
              ? item.paymentHistory
              : [];

          const historyPaid =
            paymentHistory.reduce(
              (
                total: number,
                payment: any
              ) =>
                total +
                (Number(
                  payment.amount
                ) || 0),
              0
            );

          const paidAmount =
            Number(
              item.paidAmount ??
                item.totalPaid ??
                historyPaid ??
                0
            ) || 0;

          const balance = Math.max(
            totalFee - paidAmount,
            0
          );

          const nextDueDate =
            item.nextDueDate ?? "";

          return {
            admissionId:
              item.admissionId ??
              item.id ??
              "N/A",

            admissionDate:
              item.admissionDate ??
              "",

            candidateName:
              item.candidateName ??
              item.studentName ??
              item.name ??
              "Unknown",

            contactNo:
              item.contactNo ??
              item.contact ??
              item.phone ??
              "-",

            branch:
              item.branch ?? "",

            course:
              item.course ?? "-",

            totalFee,

            paidAmount,

            balance,

            feeStatus:
              calculateFeeStatus(
                totalFee,
                paidAmount,
                nextDueDate
              ),

            nextDueDate,

            lastPaymentDate:
              item.lastPaymentDate ??
              getLastPaymentDate(
                paymentHistory
              ),

            paymentHistory,
          };
        });

      setFees(mapped);
    } catch (error) {
      console.error(
        "Unable to load fees:",
        error
      );
    }
  }, []);

  /* =======================================================
     SAVE TO LOCAL STORAGE SAFELY
  ======================================================= */

  function persistFees(
    nextFees: FeeRecord[]
  ) {
    setFees(nextFees);

    try {
      const saved =
        localStorage.getItem(
          "jet-mis-admissions"
        );

      const parsed =
        saved &&
        Array.isArray(JSON.parse(saved))
          ? JSON.parse(saved)
          : [];

      if (!parsed.length) {
        localStorage.setItem(
          "jet-mis-admissions",
          JSON.stringify(nextFees)
        );

        return;
      }

      const merged =
        parsed.map((original: any) => {
          const changed =
            nextFees.find(
              (record) =>
                record.admissionId ===
                (original.admissionId ??
                  original.id)
            );

          if (!changed) {
            return original;
          }

          return {
            ...original,

            totalFee:
              changed.totalFee,

            committedFee:
              changed.totalFee,

            paidAmount:
              changed.paidAmount,

            totalPaid:
              changed.paidAmount,

            balance:
              changed.balance,

            feeStatus:
              changed.feeStatus,

            nextDueDate:
              changed.nextDueDate,

            lastPaymentDate:
              changed.lastPaymentDate,

            paymentHistory:
              changed.paymentHistory,
          };
        });

      localStorage.setItem(
        "jet-mis-admissions",
        JSON.stringify(merged)
      );
    } catch (error) {
      console.error(
        "Unable to save fees:",
        error
      );
    }
  }

  /* =======================================================
     COURSES
  ======================================================= */

  const courseOptions = useMemo(() => {
    return Array.from(
      new Set(
        fees
          .map((record) =>
            record.course.trim()
          )
          .filter(Boolean)
      )
    ).sort();
  }, [fees]);

  /* =======================================================
     FILTER
  ======================================================= */

  const filteredFees = useMemo(() => {
    const keyword =
      search.trim().toLowerCase();

    return fees.filter((record) => {
      const matchesSearch =
        !keyword ||
        record.admissionId
          .toLowerCase()
          .includes(keyword) ||
        record.candidateName
          .toLowerCase()
          .includes(keyword) ||
        record.contactNo
          .toLowerCase()
          .includes(keyword) ||
        record.course
          .toLowerCase()
          .includes(keyword) ||
        record.branch
          .toLowerCase()
          .includes(keyword);

      const matchesStatus =
        statusFilter === "All" ||
        record.feeStatus ===
          statusFilter;

      const matchesCourse =
        courseFilter === "All" ||
        record.course ===
          courseFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesCourse
      );
    });
  }, [
    fees,
    search,
    statusFilter,
    courseFilter,
  ]);

  /* =======================================================
     RESET PAGE
  ======================================================= */

  useEffect(() => {
    setCurrentPage(1);
  }, [
    search,
    statusFilter,
    courseFilter,
    rowsPerPage,
  ]);

  /* =======================================================
     PAGINATION
  ======================================================= */

  const totalRows =
    filteredFees.length;

  const totalPages = Math.max(
    1,
    Math.ceil(
      totalRows / rowsPerPage
    )
  );

  useEffect(() => {
    if (
      currentPage > totalPages
    ) {
      setCurrentPage(totalPages);
    }
  }, [
    currentPage,
    totalPages,
  ]);

  const startIndex =
    (currentPage - 1) *
    rowsPerPage;

  const endIndex = Math.min(
    startIndex + rowsPerPage,
    totalRows
  );

  const paginatedFees =
    filteredFees.slice(
      startIndex,
      endIndex
    );

  /* =======================================================
     PAY FEES
  ======================================================= */

  function handlePayment({
    admissionId,
    amount,
    paymentDate,
    paymentMode,
    referenceNo,
    nextDueDate,
    remark,
  }: {
    admissionId: string;
    amount: number;
    paymentDate: string;
    paymentMode: PaymentMode;
    referenceNo: string;
    nextDueDate: string;
    remark: string;
  }) {
    const nextFees: FeeRecord[] =
      fees.map((record) => {
        if (
          record.admissionId !==
          admissionId
        ) {
          return record;
        }

        const newPaidAmount =
          Math.min(
            record.totalFee,
            record.paidAmount +
              amount
          );

        const newBalance =
          Math.max(
            record.totalFee -
              newPaidAmount,
            0
          );

        const receiptNo =
          generateReceiptNumber(
            fees
          );

        const newPayment:
          PaymentHistory = {
          receiptNo,
          paymentDate,
          amount,
          paymentMode,
          referenceNo:
            paymentMode === "UPI"
              ? referenceNo
              : "",
          remark,
        };

        return {
          ...record,

          paidAmount:
            newPaidAmount,

          balance:
            newBalance,

          nextDueDate:
            newBalance === 0
              ? ""
              : nextDueDate,

          lastPaymentDate:
            paymentDate,

          feeStatus:
            calculateFeeStatus(
              record.totalFee,
              newPaidAmount,
              newBalance === 0
                ? ""
                : nextDueDate
            ),

          paymentHistory: [
            ...record.paymentHistory,
            newPayment,
          ],
        };
      });

    persistFees(nextFees);

    setPayFeeRecord(null);
  }

  /* =======================================================
     EXCEL
  ======================================================= */

  function exportToExcel() {
    const rows =
      filteredFees.map(
        (record, index) => ({
          "S.No": index + 1,

          "Admission ID":
            record.admissionId,

          "Candidate Name":
            record.candidateName,

          "Contact No.":
            record.contactNo,

          Branch:
            record.branch,

          Course:
            record.course,

          "Total Fee":
            record.totalFee,

          "Paid Amount":
            record.paidAmount,

          Balance:
            record.balance,

          "Fee Status":
            record.feeStatus,

          "Next Due Date":
            record.nextDueDate,

          "Last Payment Date":
            record.lastPaymentDate,

          "No. of Payments":
            record.paymentHistory.length,
        })
      );

    const worksheet =
      XLSX.utils.json_to_sheet(
        rows
      );

    worksheet["!cols"] = [
      { wch: 7 },
      { wch: 16 },
      { wch: 24 },
      { wch: 16 },
      { wch: 20 },
      { wch: 28 },
      { wch: 16 },
      { wch: 16 },
      { wch: 16 },
      { wch: 18 },
      { wch: 18 },
      { wch: 20 },
      { wch: 18 },
    ];

    const workbook =
      XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Fees Details"
    );

    const today =
      new Date()
        .toISOString()
        .slice(0, 10);

    XLSX.writeFile(
      workbook,
      `JET-MIS-Fees-Details-${today}.xlsx`
    );
  }

  return (
    <div className="min-h-full w-full bg-white px-5 py-6">
      {/* HEADER */}

      <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-neutral-900">
            Fees Details
          </h1>

          <p className="mt-1 text-sm text-neutral-500">
            Manage student fee
            collections, balances and
            payment history.
          </p>
        </div>

        <button
          type="button"
          onClick={exportToExcel}
          className="inline-flex h-10 items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-4 text-sm font-medium text-green-700 transition hover:bg-green-100"
        >
          <Download size={16} />
          Excel
        </button>
      </div>

      {/* FILTER BAR */}

      <div className="mb-4 flex flex-wrap items-center gap-3">
        {/* SMALL SEARCH */}

        <div className="relative w-[250px]">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
          />

          <input
            type="text"
            value={search}
            onChange={(event) =>
              setSearch(
                event.target.value
              )
            }
            placeholder="Search student..."
            className="h-10 w-full rounded-lg border border-neutral-200 bg-white pl-9 pr-3 text-sm text-neutral-700 outline-none transition focus:border-blue-300 focus:ring-2 focus:ring-blue-50"
          />
        </div>

        {/* FEE STATUS */}

        <select
          value={statusFilter}
          onChange={(event) =>
            setStatusFilter(
              event.target.value
            )
          }
          className={filterClass}
        >
          <option value="All">
            All Fee Status
          </option>

          <option value="Paid">
            Paid
          </option>

          <option value="Partially Paid">
            Partially Paid
          </option>

          <option value="Pending">
            Pending
          </option>

          <option value="Overdue">
            Overdue
          </option>
        </select>

        {/* COURSE */}

        <select
          value={courseFilter}
          onChange={(event) =>
            setCourseFilter(
              event.target.value
            )
          }
          className={filterClass}
        >
          <option value="All">
            All Courses
          </option>

          {courseOptions.map(
            (course) => (
              <option
                key={course}
                value={course}
              >
                {course}
              </option>
            )
          )}
        </select>

        <span className="ml-auto text-sm text-neutral-500">
          {filteredFees.length} record
          {filteredFees.length !== 1
            ? "s"
            : ""}
        </span>
      </div>

      {/* TABLE */}

      <div className="rounded-lg border border-neutral-200 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full table-fixed">
            <thead>
              <tr className="bg-neutral-50">
                <th
                  className={`${thClass} w-[10%]`}
                >
                  Admission ID
                </th>

                <th
                  className={`${thClass} w-[15%]`}
                >
                  Candidate Name
                </th>

                <th
                  className={`${thClass} w-[11%]`}
                >
                  Contact No.
                </th>

                <th
                  className={`${thClass} w-[15%]`}
                >
                  Course
                </th>

                <th
                  className={`${thClass} w-[10%]`}
                >
                  Total Fee
                </th>

                <th
                  className={`${thClass} w-[10%]`}
                >
                  Paid
                </th>

                <th
                  className={`${thClass} w-[10%]`}
                >
                  Balance
                </th>

                <th
                  className={`${thClass} w-[10%]`}
                >
                  Fee Status
                </th>

                <th
                  className={`${thClass} w-[6%]`}
                >
                  Next Due
                </th>

                <th className="w-[3%]" />
              </tr>
            </thead>

            <tbody>
              {paginatedFees.length >
              0 ? (
                paginatedFees.map(
                  (record) => (
                    <tr
                      key={
                        record.admissionId
                      }
                      className="border-t border-neutral-100 transition hover:bg-blue-50/30"
                    >
                      <td className={tdClass}>
                        <span className="font-medium text-neutral-800">
                          {
                            record.admissionId
                          }
                        </span>
                      </td>

                      <td className={tdClass}>
                        <span className="font-medium text-neutral-900">
                          {
                            record.candidateName
                          }
                        </span>
                      </td>

                      <td className={tdClass}>
                        {
                          record.contactNo
                        }
                      </td>

                      <td className={tdClass}>
                        <div className="line-clamp-2">
                          {record.course}
                        </div>
                      </td>

                      <td className={tdClass}>
                        {formatCurrency(
                          record.totalFee
                        )}
                      </td>

                      <td className={tdClass}>
                        <span className="font-medium text-green-700">
                          {formatCurrency(
                            record.paidAmount
                          )}
                        </span>
                      </td>

                      <td className={tdClass}>
                        <span
                          className={
                            record.balance >
                            0
                              ? "font-medium text-red-600"
                              : "font-medium text-neutral-700"
                          }
                        >
                          {formatCurrency(
                            record.balance
                          )}
                        </span>
                      </td>

                      <td className={tdClass}>
                        <FeeStatusBadge
                          status={
                            record.feeStatus
                          }
                        />
                      </td>

                      <td className={tdClass}>
                        {record.nextDueDate ||
                          "-"}
                      </td>

                      <td className="relative px-2 py-3 text-right">
                        <button
                          type="button"
                          onClick={() =>
                            setOpenMenuId(
                              openMenuId ===
                                record.admissionId
                                ? null
                                : record.admissionId
                            )
                          }
                          className="inline-flex h-8 w-8 items-center justify-center rounded-md text-neutral-500 transition hover:bg-neutral-100"
                        >
                          <MoreVertical
                            size={18}
                          />
                        </button>

                        {openMenuId ===
                          record.admissionId && (
                          <FeeActionMenu
                            record={
                              record
                            }
                            onClose={() =>
                              setOpenMenuId(
                                null
                              )
                            }
                            onView={() => {
                              setSelectedFee(
                                record
                              );
                              setOpenMenuId(
                                null
                              );
                            }}
                            onPay={() => {
                              setPayFeeRecord(
                                record
                              );
                              setOpenMenuId(
                                null
                              );
                            }}
                            onHistory={() => {
                              setHistoryRecord(
                                record
                              );
                              setOpenMenuId(
                                null
                              );
                            }}
                          />
                        )}
                      </td>
                    </tr>
                  )
                )
              ) : (
                <tr>
                  <td
                    colSpan={10}
                    className="px-4 py-14 text-center text-sm text-neutral-500"
                  >
                    No fee records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION FOOTER */}

        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-neutral-200 px-4 py-3">
          <div className="flex items-center gap-3">
            <span className="text-sm text-neutral-500">
              Rows per page
            </span>

            <select
              value={rowsPerPage}
              onChange={(event) =>
                setRowsPerPage(
                  Number(
                    event.target.value
                  )
                )
              }
              className="h-9 rounded-md border border-neutral-200 bg-white px-2 text-sm text-neutral-700 outline-none"
            >
              <option value={10}>
                10
              </option>

              <option value={20}>
                20
              </option>

              <option value={30}>
                30
              </option>

              <option value={50}>
                50
              </option>
            </select>

            <span className="text-sm text-neutral-500">
              {totalRows === 0
                ? 0
                : startIndex + 1}
              -{endIndex} of {totalRows}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={
                currentPage === 1
              }
              onClick={() =>
                setCurrentPage(
                  (page) =>
                    Math.max(
                      1,
                      page - 1
                    )
                )
              }
              className={
                paginationButton
              }
            >
              <ChevronLeft
                size={16}
              />
              Previous
            </button>

            <PageNumbers
              currentPage={
                currentPage
              }
              totalPages={
                totalPages
              }
              onPageChange={
                setCurrentPage
              }
            />

            <button
              type="button"
              disabled={
                currentPage ===
                totalPages
              }
              onClick={() =>
                setCurrentPage(
                  (page) =>
                    Math.min(
                      totalPages,
                      page + 1
                    )
                )
              }
              className={
                paginationButton
              }
            >
              Next
              <ChevronRight
                size={16}
              />
            </button>
          </div>
        </div>
      </div>

      {/* VIEW FEE DETAILS */}

      {selectedFee && (
        <FeeDetailsModal
          record={selectedFee}
          onClose={() =>
            setSelectedFee(null)
          }
          onPay={() => {
            setPayFeeRecord(
              selectedFee
            );
            setSelectedFee(null);
          }}
          onHistory={() => {
            setHistoryRecord(
              selectedFee
            );
            setSelectedFee(null);
          }}
        />
      )}

      {/* PAY FEES */}

      {payFeeRecord && (
        <PayFeesModal
          record={payFeeRecord}
          onClose={() =>
            setPayFeeRecord(null)
          }
          onSave={handlePayment}
        />
      )}

      {/* HISTORY */}

      {historyRecord && (
        <FeesHistoryModal
          record={historyRecord}
          onClose={() =>
            setHistoryRecord(null)
          }
        />
      )}
    </div>
  );
}

/* =========================================================
   3 DOT MENU
========================================================= */

function FeeActionMenu({
  record,
  onClose,
  onView,
  onPay,
  onHistory,
}: {
  record: FeeRecord;
  onClose: () => void;
  onView: () => void;
  onPay: () => void;
  onHistory: () => void;
}) {
  const menuRef =
    useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(
      event: MouseEvent
    ) {
      if (
        menuRef.current &&
        !menuRef.current.contains(
          event.target as Node
        )
      ) {
        onClose();
      }
    }

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, [onClose]);

  return (
    <div
      ref={menuRef}
      className="absolute right-3 top-11 z-50 w-52 rounded-lg border border-neutral-200 bg-white p-1 text-left shadow-lg"
    >
      <button
        type="button"
        onClick={onView}
        className={menuItemClass}
      >
        <Eye size={15} />
        View Fee Details
      </button>

      {record.balance > 0 && (
        <button
          type="button"
          onClick={onPay}
          className={menuItemClass}
        >
          <IndianRupee size={15} />
          Pay Fees
        </button>
      )}

      <button
        type="button"
        onClick={onHistory}
        className={menuItemClass}
      >
        <History size={15} />
        Fees History
      </button>
    </div>
  );
}

/* =========================================================
   PAY FEES MODAL
========================================================= */

function PayFeesModal({
  record,
  onClose,
  onSave,
}: {
  record: FeeRecord;
  onClose: () => void;
  onSave: (data: {
    admissionId: string;
    amount: number;
    paymentDate: string;
    paymentMode: PaymentMode;
    referenceNo: string;
    nextDueDate: string;
    remark: string;
  }) => void;
}) {
  const today =
    new Date()
      .toISOString()
      .slice(0, 10);

  const [amount, setAmount] =
    useState("");

  const [paymentDate, setPaymentDate] =
    useState(today);

  const [paymentMode, setPaymentMode] =
    useState<PaymentMode>("Cash");

  const [referenceNo, setReferenceNo] =
    useState("");

  const [nextDueDate, setNextDueDate] =
    useState("");

  const [remark, setRemark] =
    useState("");

  const [error, setError] =
    useState("");

  function submitPayment() {
    const paymentAmount =
      Number(amount);

    if (
      !paymentAmount ||
      paymentAmount <= 0
    ) {
      setError(
        "Enter a valid payment amount."
      );

      return;
    }

    if (
      paymentAmount >
      record.balance
    ) {
      setError(
        `Payment cannot exceed the balance of ${formatCurrency(
          record.balance
        )}.`
      );

      return;
    }

    if (!paymentDate) {
      setError(
        "Select payment date."
      );

      return;
    }

    if (paymentDate > today) {
      setError(
        "Payment date cannot be a future date."
      );

      return;
    }

    if (
      paymentMode === "UPI" &&
      !referenceNo.trim()
    ) {
      setError(
        "Enter UPI reference number."
      );

      return;
    }

    const remaining =
      record.balance -
      paymentAmount;

    if (
      remaining > 0 &&
      !nextDueDate
    ) {
      setError(
        "Select the next due date for the remaining balance."
      );

      return;
    }

    if (
      remaining > 0 &&
      nextDueDate < paymentDate
    ) {
      setError(
        "Next due date cannot be before payment date."
      );

      return;
    }

    setError("");

    onSave({
      admissionId:
        record.admissionId,
      amount: paymentAmount,
      paymentDate,
      paymentMode,
      referenceNo:
        paymentMode === "UPI"
          ? referenceNo.trim()
          : "",
      nextDueDate:
        remaining > 0
          ? nextDueDate
          : "",
      remark: remark.trim(),
    });
  }

  const remainingBalance =
    Math.max(
      record.balance -
        (Number(amount) || 0),
      0
    );

  return (
    <ModalShell
      title="Pay Fees"
      subtitle={`${record.admissionId} · ${record.candidateName}`}
      onClose={onClose}
      maxWidth="max-w-2xl"
    >
      <div className="space-y-5">
        <div className="grid gap-3 sm:grid-cols-3">
          <AmountCard
            label="Total Fee"
            amount={
              record.totalFee
            }
          />

          <AmountCard
            label="Paid"
            amount={
              record.paidAmount
            }
          />

          <AmountCard
            label="Balance"
            amount={
              record.balance
            }
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <FormField
            label="Payment Amount"
            type="number"
            value={amount}
            onChange={setAmount}
            required
          />

          <FormField
            label="Payment Date"
            type="date"
            value={paymentDate}
            onChange={setPaymentDate}
            required
          />

          <div>
            <label className={labelClass}>
              Payment Mode{" "}
              <span className="text-red-500">
                *
              </span>
            </label>

            <select
              value={paymentMode}
              onChange={(event) => {
                const mode =
                  event.target.value ===
                  "UPI"
                    ? "UPI"
                    : "Cash";

                setPaymentMode(mode);

                if (mode === "Cash") {
                  setReferenceNo("");
                }
              }}
              className={inputClass}
            >
              <option value="Cash">
                Cash
              </option>

              <option value="UPI">
                UPI
              </option>
            </select>
          </div>

          {paymentMode === "UPI" && (
            <FormField
              label="UPI Reference No."
              value={referenceNo}
              onChange={setReferenceNo}
              required
            />
          )}

          {remainingBalance > 0 && (
            <FormField
              label="Next Due Date"
              type="date"
              value={nextDueDate}
              onChange={
                setNextDueDate
              }
              required
            />
          )}

          <div className="sm:col-span-2">
            <label className={labelClass}>
              Remark
            </label>

            <textarea
              rows={3}
              value={remark}
              onChange={(event) =>
                setRemark(
                  event.target.value
                )
              }
              className={`${inputClass} h-auto py-2.5`}
              placeholder="Optional payment remark"
            />
          </div>
        </div>

        {amount && (
          <div className="rounded-lg border border-blue-100 bg-blue-50/50 p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-neutral-600">
                Remaining Balance
              </span>

              <span className="font-semibold text-neutral-900">
                {formatCurrency(
                  remainingBalance
                )}
              </span>
            </div>
          </div>
        )}

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <div className="flex justify-end gap-2 border-t border-neutral-100 pt-4">
          <button
            type="button"
            onClick={onClose}
            className={secondaryButton}
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={submitPayment}
            className={primaryButton}
          >
            <IndianRupee
              size={15}
            />
            Record Payment
          </button>
        </div>
      </div>
    </ModalShell>
  );
}

/* =========================================================
   FEE DETAILS
========================================================= */

function FeeDetailsModal({
  record,
  onClose,
  onPay,
  onHistory,
}: {
  record: FeeRecord;
  onClose: () => void;
  onPay: () => void;
  onHistory: () => void;
}) {
  return (
    <ModalShell
      title="Fee Details"
      subtitle={`${record.admissionId} · ${record.candidateName}`}
      onClose={onClose}
      maxWidth="max-w-4xl"
    >
      <div className="space-y-7">
        <DetailSection title="Student Details">
          <Detail
            label="Admission ID"
            value={
              record.admissionId
            }
          />

          <Detail
            label="Candidate Name"
            value={
              record.candidateName
            }
          />

          <Detail
            label="Contact No."
            value={
              record.contactNo
            }
          />

          <Detail
            label="Branch"
            value={
              record.branch || "-"
            }
          />

          <Detail
            label="Course"
            value={record.course}
          />

          <Detail
            label="Admission Date"
            value={
              record.admissionDate ||
              "-"
            }
          />
        </DetailSection>

        <DetailSection title="Fee Summary">
          <Detail
            label="Total Fee"
            value={formatCurrency(
              record.totalFee
            )}
          />

          <Detail
            label="Paid Amount"
            value={formatCurrency(
              record.paidAmount
            )}
          />

          <Detail
            label="Balance"
            value={formatCurrency(
              record.balance
            )}
          />

          <Detail
            label="Fee Status"
            value={
              record.feeStatus
            }
          />

          <Detail
            label="Next Due Date"
            value={
              record.nextDueDate ||
              "-"
            }
          />

          <Detail
            label="Last Payment"
            value={
              record.lastPaymentDate ||
              "-"
            }
          />
        </DetailSection>

        <div className="flex flex-wrap justify-end gap-2 border-t border-neutral-100 pt-4">
          <button
            type="button"
            onClick={onHistory}
            className={secondaryButton}
          >
            <History size={15} />
            Fees History
          </button>

          {record.balance > 0 && (
            <button
              type="button"
              onClick={onPay}
              className={primaryButton}
            >
              <IndianRupee
                size={15}
              />
              Pay Fees
            </button>
          )}
        </div>
      </div>
    </ModalShell>
  );
}

/* =========================================================
   PAYMENT HISTORY
========================================================= */

function FeesHistoryModal({
  record,
  onClose,
}: {
  record: FeeRecord;
  onClose: () => void;
}) {
  return (
    <ModalShell
      title="Fees History"
      subtitle={`${record.admissionId} · ${record.candidateName}`}
      onClose={onClose}
      maxWidth="max-w-5xl"
    >
      <div className="mb-5 grid gap-3 sm:grid-cols-3">
        <AmountCard
          label="Total Fee"
          amount={
            record.totalFee
          }
        />

        <AmountCard
          label="Total Paid"
          amount={
            record.paidAmount
          }
        />

        <AmountCard
          label="Balance"
          amount={
            record.balance
          }
        />
      </div>

      <div className="overflow-x-auto rounded-lg border border-neutral-200">
        <table className="w-full">
          <thead>
            <tr className="bg-neutral-50">
              <th className={historyTh}>
                Receipt No.
              </th>

              <th className={historyTh}>
                Date
              </th>

              <th className={historyTh}>
                Amount
              </th>

              <th className={historyTh}>
                Mode
              </th>

              <th className={historyTh}>
                Reference
              </th>

              <th className={historyTh}>
                Remark
              </th>
            </tr>
          </thead>

          <tbody>
            {record.paymentHistory
              .length > 0 ? (
              [...record.paymentHistory]
                .reverse()
                .map((payment) => (
                  <tr
                    key={
                      payment.receiptNo
                    }
                    className="border-t border-neutral-100"
                  >
                    <td className={historyTd}>
                      <span className="font-medium text-neutral-800">
                        {
                          payment.receiptNo
                        }
                      </span>
                    </td>

                    <td className={historyTd}>
                      {
                        payment.paymentDate
                      }
                    </td>

                    <td className={historyTd}>
                      {formatCurrency(
                        payment.amount
                      )}
                    </td>

                    <td className={historyTd}>
                      {
                        payment.paymentMode
                      }
                    </td>

                    <td className={historyTd}>
                      {payment.referenceNo ||
                        "-"}
                    </td>

                    <td className={historyTd}>
                      {payment.remark ||
                        "-"}
                    </td>
                  </tr>
                ))
            ) : (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-12 text-center text-sm text-neutral-500"
                >
                  No payment history available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-5 flex justify-end">
        <button
          type="button"
          onClick={onClose}
          className={
            secondaryButton
          }
        >
          Close
        </button>
      </div>
    </ModalShell>
  );
}

/* =========================================================
   PAGINATION
========================================================= */

function PageNumbers({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (
    page: number
  ) => void;
}) {
  const pages =
    getVisiblePages(
      currentPage,
      totalPages
    );

  return (
    <div className="hidden items-center gap-1 sm:flex">
      {pages.map(
        (page, index) =>
          page === "..." ? (
            <span
              key={`dots-${index}`}
              className="px-2 text-sm text-neutral-400"
            >
              ...
            </span>
          ) : (
            <button
              key={page}
              type="button"
              onClick={() =>
                onPageChange(page)
              }
              className={`h-9 min-w-9 rounded-md border px-2 text-sm ${
                currentPage === page
                  ? "border-blue-200 bg-blue-50 font-medium text-blue-700"
                  : "border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50"
              }`}
            >
              {page}
            </button>
          )
      )}
    </div>
  );
}

function getVisiblePages(
  current: number,
  total: number
): Array<number | "..."> {
  if (total <= 5) {
    return Array.from(
      { length: total },
      (_, index) =>
        index + 1
    );
  }

  if (current <= 3) {
    return [
      1,
      2,
      3,
      4,
      "...",
      total,
    ];
  }

  if (
    current >=
    total - 2
  ) {
    return [
      1,
      "...",
      total - 3,
      total - 2,
      total - 1,
      total,
    ];
  }

  return [
    1,
    "...",
    current - 1,
    current,
    current + 1,
    "...",
    total,
  ];
}

/* =========================================================
   HELPERS
========================================================= */

function calculateFeeStatus(
  totalFee: number,
  paidAmount: number,
  nextDueDate: string
): FeeStatus {
  if (
    totalFee > 0 &&
    paidAmount >= totalFee
  ) {
    return "Paid";
  }

  const today =
    new Date()
      .toISOString()
      .slice(0, 10);

  if (
    nextDueDate &&
    nextDueDate < today &&
    paidAmount < totalFee
  ) {
    return "Overdue";
  }

  if (
    paidAmount > 0 &&
    paidAmount < totalFee
  ) {
    return "Partially Paid";
  }

  return "Pending";
}

function getLastPaymentDate(
  paymentHistory: any[]
) {
  if (
    !Array.isArray(
      paymentHistory
    ) ||
    paymentHistory.length === 0
  ) {
    return "";
  }

  const dates =
    paymentHistory
      .map(
        (payment) =>
          payment.paymentDate
      )
      .filter(Boolean)
      .sort();

  return (
    dates[
      dates.length - 1
    ] ?? ""
  );
}

function generateReceiptNumber(
  records: FeeRecord[]
) {
  let count = 0;

  records.forEach((record) => {
    count +=
      record.paymentHistory.length;
  });

  const year =
    new Date().getFullYear();

  return `RCPT/${year}/${String(
    count + 1
  ).padStart(4, "0")}`;
}

function formatCurrency(
  amount: number
) {
  return `₹${Number(
    amount || 0
  ).toLocaleString("en-IN")}`;
}

/* =========================================================
   BADGE
========================================================= */

function FeeStatusBadge({
  status,
}: {
  status: FeeStatus;
}) {
  let style =
    "border-neutral-200 bg-neutral-50 text-neutral-600";

  if (status === "Paid") {
    style =
      "border-green-200 bg-green-50 text-green-700";
  }

  if (
    status ===
    "Partially Paid"
  ) {
    style =
      "border-blue-200 bg-blue-50 text-blue-700";
  }

  if (status === "Pending") {
    style =
      "border-amber-200 bg-amber-50 text-amber-700";
  }

  if (status === "Overdue") {
    style =
      "border-red-200 bg-red-50 text-red-600";
  }

  return (
    <span
      className={`inline-flex whitespace-nowrap rounded-full border px-2.5 py-1 text-xs font-medium ${style}`}
    >
      {status}
    </span>
  );
}

/* =========================================================
   MODAL
========================================================= */

function ModalShell({
  title,
  subtitle,
  children,
  onClose,
  maxWidth,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  onClose: () => void;
  maxWidth: string;
}) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/25 p-4">
      <div
        className={`max-h-[90vh] w-full overflow-y-auto rounded-xl border border-neutral-200 bg-white shadow-xl ${maxWidth}`}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-neutral-200 bg-white px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold text-neutral-900">
              {title}
            </h2>

            {subtitle && (
              <p className="mt-1 text-sm text-neutral-500">
                {subtitle}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-8 w-8 items-center justify-center rounded-md text-neutral-500 hover:bg-neutral-100"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   DETAILS
========================================================= */

function DetailSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div>
      <h3 className="mb-4 border-b border-neutral-100 pb-2 text-sm font-semibold text-neutral-800">
        {title}
      </h3>

      <div className="grid gap-x-8 gap-y-5 md:grid-cols-2 lg:grid-cols-3">
        {children}
      </div>
    </div>
  );
}

function Detail({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <div className="text-xs font-medium uppercase tracking-wide text-neutral-400">
        {label}
      </div>

      <div className="mt-1 break-words text-sm font-medium text-neutral-800">
        {value}
      </div>
    </div>
  );
}

function AmountCard({
  label,
  amount,
}: {
  label: string;
  amount: number;
}) {
  return (
    <div className="rounded-lg border border-neutral-200 bg-neutral-50/60 p-4">
      <div className="text-xs font-medium uppercase tracking-wide text-neutral-500">
        {label}
      </div>

      <div className="mt-2 text-lg font-semibold text-neutral-900">
        {formatCurrency(
          amount
        )}
      </div>
    </div>
  );
}

function FormField({
  label,
  value,
  onChange,
  type = "text",
  required = false,
}: {
  label: string;
  value: string;
  onChange: (
    value: string
  ) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className={labelClass}>
        {label}

        {required && (
          <span className="ml-1 text-red-500">
            *
          </span>
        )}
      </label>

      <input
        type={type}
        value={value}
        onChange={(event) =>
          onChange(
            event.target.value
          )
        }
        className={inputClass}
      />
    </div>
  );
}

/* =========================================================
   CLASSES
========================================================= */

const filterClass =
  "h-10 min-w-[145px] rounded-lg border border-neutral-200 bg-white px-3 text-sm text-neutral-700 outline-none transition focus:border-blue-300";

const thClass =
  "px-2.5 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-neutral-500";

const tdClass =
  "px-2.5 py-3 text-[13px] align-middle text-neutral-600";

const historyTh =
  "whitespace-nowrap px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-neutral-500";

const historyTd =
  "whitespace-nowrap px-4 py-3 text-sm text-neutral-600";

const menuItemClass =
  "flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-neutral-700 transition hover:bg-neutral-50";

const paginationButton =
  "inline-flex h-9 items-center gap-1 rounded-md border border-neutral-200 bg-white px-3 text-sm text-neutral-600 transition hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-40";

const labelClass =
  "mb-1.5 block text-sm font-medium text-neutral-700";

const inputClass =
  "h-10 w-full rounded-lg border border-neutral-200 bg-white px-3 text-sm text-neutral-800 outline-none transition focus:border-blue-300 focus:ring-2 focus:ring-blue-50";

const primaryButton =
  "inline-flex h-10 items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-4 text-sm font-medium text-blue-700 transition hover:bg-blue-100";

const secondaryButton =
  "inline-flex h-10 items-center gap-2 rounded-lg border border-neutral-200 bg-white px-4 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50";