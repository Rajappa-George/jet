"use client";

import { ArrowLeft, Save } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  FormEvent,
  useEffect,
  useMemo,
  useState,
} from "react";

type Installment = {
  amount: string;
  date: string;
};

type SavedAdmission = {
  admissionId?: string;
};

const courseOptions = [
  "Full Stack Development",
  "Java Full Stack Development",
  "Python Programming",
  "Web Development",
  "Data Analytics",
  "UI/UX Designing",
  "Beautician",
  "Fashion Designing",
];

function getLocalDate() {
  const now = new Date();

  const year = now.getFullYear();
  const month = String(
    now.getMonth() + 1
  ).padStart(2, "0");
  const day = String(
    now.getDate()
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export default function NewAdmissionPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  /* =========================================================
     CONVERTED ENQUIRY
  ========================================================= */

  const enquiryId =
    searchParams.get("enquiryId") || "";

  /* =========================================================
     ADMISSION DETAILS
  ========================================================= */

  const [admissionId, setAdmissionId] =
    useState("");

  const [admissionDate, setAdmissionDate] =
    useState(getLocalDate());

  /* =========================================================
     STUDENT DETAILS
  ========================================================= */

  const [studentName, setStudentName] =
    useState(
      searchParams.get("name") || ""
    );

  const [dob, setDob] = useState("");

  const [contactNo, setContactNo] =
    useState(
      searchParams.get("contact") || ""
    );

  const [email, setEmail] = useState(
    searchParams.get("email") || ""
  );

  const [guardianName, setGuardianName] =
    useState(
      searchParams.get(
        "guardianName"
      ) || ""
    );

  const [
    guardianContact,
    setGuardianContact,
  ] = useState(
    searchParams.get(
      "guardianContact"
    ) || ""
  );

  const [motherName, setMotherName] =
    useState("");

  const [aadhaarNo, setAadhaarNo] =
    useState("");

  const [
    qualification,
    setQualification,
  ] = useState(
    searchParams.get(
      "qualification"
    ) || ""
  );

  const [course, setCourse] = useState(
    searchParams.get("course") || ""
  );

  /* =========================================================
     PAYMENT DETAILS
  ========================================================= */

  const [totalFee, setTotalFee] =
    useState(
      searchParams.get(
        "committedFee"
      ) || ""
    );

  const [paidAmount, setPaidAmount] =
    useState("");

  const [
    installmentCount,
    setInstallmentCount,
  ] = useState("1");

  const [installments, setInstallments] =
    useState<Installment[]>([
      {
        amount: "",
        date: "",
      },
    ]);

  /* =========================================================
     AMOUNT CALCULATION
  ========================================================= */

  const totalFeeNumber =
    Number(totalFee) || 0;

  const paidAmountNumber =
    Number(paidAmount) || 0;

  const balance = useMemo(() => {
    return Math.max(
      totalFeeNumber -
        paidAmountNumber,
      0
    );
  }, [
    totalFeeNumber,
    paidAmountNumber,
  ]);

  /* =========================================================
     INSTALLMENT ROW MANAGEMENT
  ========================================================= */

  useEffect(() => {
    const count =
      Number(installmentCount) || 1;

    setInstallments((current) => {
      return Array.from(
        { length: count },
        (_, index) =>
          current[index] || {
            amount: "",
            date: "",
          }
      );
    });
  }, [installmentCount]);

  function updateInstallment(
    index: number,
    field: keyof Installment,
    value: string
  ) {
    setInstallments((current) =>
      current.map(
        (installment, i) =>
          i === index
            ? {
                ...installment,
                [field]: value,
              }
            : installment
      )
    );
  }

  const installmentTotal =
    installments.reduce(
      (sum, installment) =>
        sum +
        (Number(
          installment.amount
        ) || 0),
      0
    );

  /* =========================================================
     INPUT HELPERS
  ========================================================= */

  function handleContactChange(
    value: string
  ) {
    setContactNo(
      value
        .replace(/\D/g, "")
        .slice(0, 10)
    );
  }

  function handleGuardianContactChange(
    value: string
  ) {
    setGuardianContact(
      value
        .replace(/\D/g, "")
        .slice(0, 10)
    );
  }

  function handleAadhaarChange(
    value: string
  ) {
    setAadhaarNo(
      value
        .replace(/\D/g, "")
        .slice(0, 12)
    );
  }

  /* =========================================================
     SAVE
  ========================================================= */

  function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const formattedAdmissionId =
      admissionId.trim().toUpperCase();

    /* REQUIRED FIELDS */

    if (!formattedAdmissionId) {
      alert(
        "Please enter Admission ID."
      );
      return;
    }

    if (!admissionDate) {
      alert(
        "Please select Admission Date."
      );
      return;
    }

    if (!studentName.trim()) {
      alert(
        "Please enter student name as per Aadhaar Card."
      );
      return;
    }

    if (!dob) {
      alert(
        "Please select Date of Birth."
      );
      return;
    }

    if (!contactNo) {
      alert(
        "Please enter Contact No."
      );
      return;
    }

    if (contactNo.length !== 10) {
      alert(
        "Contact No must contain 10 digits."
      );
      return;
    }

    if (!guardianName.trim()) {
      alert(
        "Please enter Father / Guardian Name."
      );
      return;
    }

    if (
      guardianContact &&
      guardianContact.length !== 10
    ) {
      alert(
        "Father / Guardian Contact No must contain 10 digits."
      );
      return;
    }

    if (!aadhaarNo) {
      alert(
        "Please enter Aadhaar Card No."
      );
      return;
    }

    if (aadhaarNo.length !== 12) {
      alert(
        "Aadhaar Card No must contain 12 digits."
      );
      return;
    }

    if (!course) {
      alert(
        "Please select Course."
      );
      return;
    }

    if (
      !totalFee ||
      totalFeeNumber <= 0
    ) {
      alert(
        "Please enter a valid Total Fee."
      );
      return;
    }

    if (paidAmountNumber < 0) {
      alert(
        "Paid amount cannot be negative."
      );
      return;
    }

    if (
      paidAmountNumber >
      totalFeeNumber
    ) {
      alert(
        "Paid amount cannot be greater than Total Fee."
      );
      return;
    }

    /* INSTALLMENT VALIDATION */

    if (balance > 0) {
      if (!installmentCount) {
        alert(
          "Please select number of installments."
        );
        return;
      }

      for (
        let i = 0;
        i < installments.length;
        i++
      ) {
        const installment =
          installments[i];

        if (
          !installment.amount ||
          Number(
            installment.amount
          ) <= 0
        ) {
          alert(
            `Please enter a valid amount for Installment ${
              i + 1
            }.`
          );
          return;
        }

        if (!installment.date) {
          alert(
            `Please select a commitment date for Installment ${
              i + 1
            }.`
          );
          return;
        }
      }

      if (
        installmentTotal !==
        balance
      ) {
        alert(
          `Installment total must equal the balance amount of ₹${balance.toLocaleString(
            "en-IN"
          )}.`
        );
        return;
      }
    }

    /* DUPLICATE ADMISSION ID */

    let existingAdmissions:
      SavedAdmission[] = [];

    try {
      const saved = JSON.parse(
        localStorage.getItem(
          "jet-mis-admissions"
        ) || "[]"
      );

      if (Array.isArray(saved)) {
        existingAdmissions =
          saved;
      }
    } catch {
      existingAdmissions = [];
    }

    const duplicate =
      existingAdmissions.some(
        (item) =>
          item.admissionId
            ?.trim()
            .toUpperCase() ===
          formattedAdmissionId
      );

    if (duplicate) {
      alert(
        `Admission ID ${formattedAdmissionId} already exists. Please enter a different Admission ID.`
      );
      return;
    }

    /* CREATE ADMISSION */

    const admission = {
      admissionId:
        formattedAdmissionId,

      admissionDate,

      enquiryId:
        enquiryId || null,

      studentName:
        studentName.trim(),

      dob,

      contactNo,

      email: email.trim(),

      guardianName:
        guardianName.trim(),

      guardianContact,

      motherName:
        motherName.trim(),

      aadhaarNo,

      qualification:
        qualification.trim(),

      course,

      totalFee:
        totalFeeNumber,

      paid:
        paidAmountNumber,

      balance,

      installmentCount:
        balance > 0
          ? Number(
              installmentCount
            )
          : 0,

      installments:
        balance > 0
          ? installments.map(
              (item) => ({
                amount:
                  Number(
                    item.amount
                  ),
                date: item.date,
              })
            )
          : [],

      status:
        balance === 0
          ? "Completed"
          : "Active",
    };

    const updatedAdmissions = [
      ...existingAdmissions,
      admission,
    ];

    localStorage.setItem(
      "jet-mis-admissions",
      JSON.stringify(
        updatedAdmissions
      )
    );

    alert(
      "Admission saved successfully."
    );

    router.push("/students");
  }

  /* =========================================================
     UI
  ========================================================= */

  return (
    <div className="min-h-screen bg-white">
      <div className="p-6">
        {/* =================================================
            BACK ROW
        ================================================= */}

        <div className="mb-5">
          <button
            type="button"
            onClick={() =>
              router.push("/leads")
            }
            className="inline-flex items-center gap-2 text-sm font-medium text-neutral-600 transition hover:text-black"
          >
            <ArrowLeft
              size={17}
              strokeWidth={1.8}
            />

            Back to Lead Management
          </button>
        </div>

        {/* =================================================
            TITLE
        ================================================= */}

        <div className="mb-7">
          <h1 className="text-xl font-semibold tracking-tight text-neutral-900">
            Admission Form
          </h1>

          <p className="mt-1 text-sm text-neutral-500">
            Enter student admission
            and payment details.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          {/* =================================================
              ADMISSION DETAILS
          ================================================= */}

          <section className="rounded-lg border border-neutral-200 bg-white">
            <div className="border-b border-neutral-200 px-5 py-4">
              <h2 className="text-base font-semibold text-neutral-900">
                Admission Details
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-5 p-5 md:grid-cols-2">
              <Field
                label="Admission ID"
                required
              >
                <input
                  type="text"
                  value={admissionId}
                  onChange={(e) =>
                    setAdmissionId(
                      e.target.value
                    )
                  }
                  placeholder="Eg: TRY/SEP001"
                  className="input-style uppercase"
                />
              </Field>

              <Field
                label="Admission Date"
                required
              >
                <input
                  type="date"
                  value={admissionDate}
                  onChange={(e) =>
                    setAdmissionDate(
                      e.target.value
                    )
                  }
                  className="input-style"
                />
              </Field>
            </div>
          </section>

          {/* =================================================
              STUDENT DETAILS
          ================================================= */}

          <section className="rounded-lg border border-neutral-200 bg-white">
            <div className="border-b border-neutral-200 px-5 py-4">
              <h2 className="text-base font-semibold text-neutral-900">
                Student Details
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-5 p-5 md:grid-cols-2 xl:grid-cols-3">
              <Field
                label="Name as per Aadhaar Card"
                required
              >
                <input
                  value={studentName}
                  onChange={(e) =>
                    setStudentName(
                      e.target.value
                    )
                  }
                  placeholder="Enter student name"
                  className="input-style"
                />
              </Field>

              <Field
                label="Date of Birth"
                required
              >
                <input
                  type="date"
                  value={dob}
                  onChange={(e) =>
                    setDob(
                      e.target.value
                    )
                  }
                  className="input-style"
                />
              </Field>

              <Field
                label="Contact No"
                required
              >
                <input
                  inputMode="numeric"
                  value={contactNo}
                  onChange={(e) =>
                    handleContactChange(
                      e.target.value
                    )
                  }
                  maxLength={10}
                  placeholder="10 digit contact no"
                  className="input-style"
                />
              </Field>

              <Field label="Email">
                <input
                  type="email"
                  value={email}
                  onChange={(e) =>
                    setEmail(
                      e.target.value
                    )
                  }
                  placeholder="Enter email"
                  className="input-style"
                />
              </Field>

              <Field
                label="Father / Guardian Name"
                required
              >
                <input
                  value={guardianName}
                  onChange={(e) =>
                    setGuardianName(
                      e.target.value
                    )
                  }
                  placeholder="Enter father / guardian name"
                  className="input-style"
                />
              </Field>

              <Field label="Father / Guardian Contact No">
                <input
                  inputMode="numeric"
                  value={
                    guardianContact
                  }
                  onChange={(e) =>
                    handleGuardianContactChange(
                      e.target.value
                    )
                  }
                  maxLength={10}
                  placeholder="10 digit contact no"
                  className="input-style"
                />
              </Field>

              <Field label="Mother Name">
                <input
                  value={motherName}
                  onChange={(e) =>
                    setMotherName(
                      e.target.value
                    )
                  }
                  placeholder="Enter mother name"
                  className="input-style"
                />
              </Field>

              <Field
                label="Aadhaar Card No"
                required
              >
                <input
                  inputMode="numeric"
                  value={aadhaarNo}
                  onChange={(e) =>
                    handleAadhaarChange(
                      e.target.value
                    )
                  }
                  maxLength={12}
                  placeholder="12 digit Aadhaar no"
                  className="input-style"
                />
              </Field>

              <Field label="Qualification">
                <input
                  value={qualification}
                  onChange={(e) =>
                    setQualification(
                      e.target.value
                    )
                  }
                  placeholder="Enter qualification"
                  className="input-style"
                />
              </Field>

              <Field
                label="Course"
                required
              >
                <select
                  value={course}
                  onChange={(e) =>
                    setCourse(
                      e.target.value
                    )
                  }
                  className="input-style"
                >
                  <option value="">
                    Select course
                  </option>

                  {courseOptions.map(
                    (item) => (
                      <option
                        key={item}
                        value={item}
                      >
                        {item}
                      </option>
                    )
                  )}
                </select>
              </Field>
            </div>
          </section>

          {/* =================================================
              PAYMENT DETAILS
          ================================================= */}

          <section className="rounded-lg border border-neutral-200 bg-white">
            <div className="border-b border-neutral-200 px-5 py-4">
              <h2 className="text-base font-semibold text-neutral-900">
                Payment Details
              </h2>
            </div>

            <div className="p-5">
              <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                <Field
                  label="Total Fee"
                  required
                >
                  <input
                    type="number"
                    min="0"
                    value={totalFee}
                    onChange={(e) =>
                      setTotalFee(
                        e.target.value
                      )
                    }
                    placeholder="Enter total fee"
                    className="input-style"
                  />
                </Field>

                <Field label="Paid">
                  <input
                    type="number"
                    min="0"
                    value={paidAmount}
                    onChange={(e) =>
                      setPaidAmount(
                        e.target.value
                      )
                    }
                    placeholder="Enter paid amount"
                    className="input-style"
                  />
                </Field>

                <Field label="Balance">
                  <div className="flex h-10 items-center rounded-md border border-neutral-200 bg-neutral-50 px-3 text-sm font-semibold text-neutral-900">
                    ₹
                    {balance.toLocaleString(
                      "en-IN"
                    )}
                  </div>
                </Field>
              </div>

              {/* INSTALLMENTS */}

              {balance > 0 && (
                <div className="mt-7 border-t border-neutral-200 pt-6">
                  <div className="mb-5 max-w-xs">
                    <Field
                      label="No. of Installments"
                      required
                    >
                      <select
                        value={
                          installmentCount
                        }
                        onChange={(e) =>
                          setInstallmentCount(
                            e.target.value
                          )
                        }
                        className="input-style"
                      >
                        {[1, 2, 3, 4, 5].map(
                          (
                            count
                          ) => (
                            <option
                              key={
                                count
                              }
                              value={
                                count
                              }
                            >
                              {
                                count
                              }
                            </option>
                          )
                        )}
                      </select>
                    </Field>
                  </div>

                  <div className="space-y-3">
                    {installments.map(
                      (
                        installment,
                        index
                      ) => (
                        <div
                          key={index}
                          className="rounded-lg border border-neutral-200 bg-neutral-50 p-4"
                        >
                          <div className="mb-4 text-sm font-semibold text-neutral-900">
                            Installment{" "}
                            {index + 1}
                          </div>

                          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <Field
                              label="Commit Amount"
                              required
                            >
                              <input
                                type="number"
                                min="0"
                                value={
                                  installment.amount
                                }
                                onChange={(
                                  e
                                ) =>
                                  updateInstallment(
                                    index,
                                    "amount",
                                    e
                                      .target
                                      .value
                                  )
                                }
                                placeholder="Enter amount"
                                className="input-style bg-white"
                              />
                            </Field>

                            <Field
                              label="Commit Date"
                              required
                            >
                              <input
                                type="date"
                                value={
                                  installment.date
                                }
                                onChange={(
                                  e
                                ) =>
                                  updateInstallment(
                                    index,
                                    "date",
                                    e
                                      .target
                                      .value
                                  )
                                }
                                className="input-style bg-white"
                              />
                            </Field>
                          </div>
                        </div>
                      )
                    )}
                  </div>

                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-md border border-neutral-200 bg-white px-4 py-3 text-sm">
                    <span className="text-neutral-500">
                      Installment
                      Total
                    </span>

                    <div className="flex items-center gap-6">
                      <span className="font-semibold text-neutral-900">
                        ₹
                        {installmentTotal.toLocaleString(
                          "en-IN"
                        )}
                      </span>

                      <span className="text-neutral-500">
                        Balance:{" "}
                        <span className="font-semibold text-neutral-900">
                          ₹
                          {balance.toLocaleString(
                            "en-IN"
                          )}
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* =================================================
              ACTIONS
          ================================================= */}

          <div className="flex justify-end gap-3 pb-6">
            <button
              type="button"
              onClick={() =>
                router.push("/leads")
              }
              className="h-10 rounded-md border border-neutral-300 bg-white px-5 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50 hover:text-black"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="inline-flex h-10 items-center gap-2 rounded-md bg-black px-5 text-sm font-medium text-white transition hover:bg-neutral-800"
            >
              <Save
                size={17}
                strokeWidth={1.8}
              />

              Save Admission
            </button>
          </div>
        </form>
      </div>

      {/* =====================================================
          LOCAL INPUT STYLE
      ===================================================== */}

      <style jsx>{`
        .input-style {
          height: 40px;
          width: 100%;
          border-radius: 6px;
          border: 1px solid
            rgb(212 212 212);
          background: white;
          padding: 0 12px;
          font-size: 14px;
          color: rgb(23 23 23);
          outline: none;
          transition:
            border-color 150ms,
            box-shadow 150ms;
        }

        .input-style:focus {
          border-color: black;
          box-shadow: 0 0 0 1px
            black;
        }

        .input-style::placeholder {
          color: rgb(163 163 163);
        }
      `}</style>
    </div>
  );
}

/* =========================================================
   FIELD COMPONENT
========================================================= */

function Field({
  label,
  required = false,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <div className="mb-1.5 text-sm font-medium text-neutral-700">
        {label}

        {required && (
          <span className="ml-1 text-red-500">
            *
          </span>
        )}
      </div>

      {children}
    </label>
  );
}