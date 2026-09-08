"use client";

import { ArrowLeft, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

type EmployeeCategory =
  | "Administrative"
  | "Trainer"
  | "Faculty";

type EmploymentType =
  | "Full-Time"
  | "Part-Time"
  | "Freelancer";

type EmployeeStatus = "Active" | "Inactive";

type EmployeeForm = {
  empId: string;
  name: string;
  dob: string;
  gender: string;
  contact: string;
  email: string;
  address: string;
  branch: string;
  employeeCategory: EmployeeCategory | "";
  designation: string;
  employmentType: EmploymentType | "";
  joiningDate: string;
  status: EmployeeStatus;
  qualification: string;
  experience: string;
};

const branches = [
  "Ariyalur",
  "Guduvancherry",
  "Mayiladuthurai",
  "Perambalur",
  "Thanjavur",
  "Tiruchirappalli",
];

const initialForm: EmployeeForm = {
  empId: "",
  name: "",
  dob: "",
  gender: "",
  contact: "",
  email: "",
  address: "",
  branch: "",
  employeeCategory: "",
  designation: "",
  employmentType: "",
  joiningDate: "",
  status: "Active",
  qualification: "",
  experience: "",
};

export default function AddEmployeePage() {
  const router = useRouter();

  const [form, setForm] =
    useState<EmployeeForm>(initialForm);

  const [error, setError] = useState("");

  function updateField(
    field: keyof EmployeeForm,
    value: string
  ) {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));

    setError("");
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (
      !form.empId.trim() ||
      !form.name.trim() ||
      !form.dob ||
      !form.gender ||
      !form.contact.trim() ||
      !form.branch ||
      !form.employeeCategory ||
      !form.designation.trim() ||
      !form.employmentType ||
      !form.joiningDate
    ) {
      setError("Please fill all required fields.");
      return;
    }

    if (!/^\d{10}$/.test(form.contact)) {
      setError(
        "Contact number must contain exactly 10 digits."
      );
      return;
    }

    const savedEmployees = JSON.parse(
      localStorage.getItem("jet-mis-employees") || "[]"
    );

    const duplicate = savedEmployees.some(
      (employee: EmployeeForm) =>
        employee.empId.trim().toLowerCase() ===
        form.empId.trim().toLowerCase()
    );

    if (duplicate) {
      setError("This Employee ID already exists.");
      return;
    }

    const newEmployee = {
      ...form,
      empId: form.empId.trim().toUpperCase(),
      name: form.name.trim(),
      contact: form.contact.trim(),
      email: form.email.trim(),
      designation: form.designation.trim(),
      qualification: form.qualification.trim(),
      experience: form.experience.trim(),
      createdAt: new Date().toISOString(),
    };

    localStorage.setItem(
      "jet-mis-employees",
      JSON.stringify([...savedEmployees, newEmployee])
    );

    alert("Employee added successfully.");

    router.push("/staff");
  }

  return (
    <div className="min-h-screen bg-white p-6">
      {/* Back */}
      <button
        type="button"
        onClick={() => router.push("/staff")}
        className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-neutral-500 transition hover:text-neutral-900"
      >
        <ArrowLeft size={17} />
        Staff Management
      </button>

      {/* Heading */}
      <div className="mb-7">
        <h1 className="text-xl font-semibold text-neutral-900">
          Add Employee
        </h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-x-5 gap-y-5 md:grid-cols-2 lg:grid-cols-3">
          {/* EMP ID */}
          <Field label="Emp ID" required>
            <input
              value={form.empId}
              onChange={(e) =>
                updateField("empId", e.target.value)
              }
              placeholder="EMP001"
              className={inputClass}
            />
          </Field>

          {/* NAME */}
          <Field label="Employee Name" required>
            <input
              value={form.name}
              onChange={(e) =>
                updateField("name", e.target.value)
              }
              placeholder="Enter employee name"
              className={inputClass}
            />
          </Field>

          {/* DOB */}
          <Field label="Date of Birth" required>
            <input
              type="date"
              value={form.dob}
              onChange={(e) =>
                updateField("dob", e.target.value)
              }
              className={inputClass}
            />
          </Field>

          {/* GENDER */}
          <Field label="Gender" required>
            <select
              value={form.gender}
              onChange={(e) =>
                updateField("gender", e.target.value)
              }
              className={inputClass}
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </Field>

          {/* CONTACT */}
          <Field label="Contact" required>
            <input
              value={form.contact}
              onChange={(e) =>
                updateField(
                  "contact",
                  e.target.value
                    .replace(/\D/g, "")
                    .slice(0, 10)
                )
              }
              inputMode="numeric"
              placeholder="10 digit mobile number"
              className={inputClass}
            />
          </Field>

          {/* EMAIL */}
          <Field label="Email">
            <input
              type="email"
              value={form.email}
              onChange={(e) =>
                updateField("email", e.target.value)
              }
              placeholder="employee@example.com"
              className={inputClass}
            />
          </Field>

          {/* BRANCH */}
          <Field label="Branch" required>
            <select
              value={form.branch}
              onChange={(e) =>
                updateField("branch", e.target.value)
              }
              className={inputClass}
            >
              <option value="">Select Branch</option>

              {branches.map((branch) => (
                <option key={branch} value={branch}>
                  {branch}
                </option>
              ))}
            </select>
          </Field>

          {/* CATEGORY */}
          <Field
            label="Employee Category"
            required
          >
            <select
              value={form.employeeCategory}
              onChange={(e) =>
                updateField(
                  "employeeCategory",
                  e.target.value
                )
              }
              className={inputClass}
            >
              <option value="">
                Select Category
              </option>

              <option value="Administrative">
                Administrative
              </option>

              <option value="Trainer">
                Trainer
              </option>

              <option value="Faculty">
                Faculty
              </option>
            </select>
          </Field>

          {/* DESIGNATION */}
          <Field label="Designation" required>
            <input
              value={form.designation}
              onChange={(e) =>
                updateField(
                  "designation",
                  e.target.value
                )
              }
              placeholder="e.g. German Trainer"
              className={inputClass}
            />
          </Field>

          {/* EMPLOYMENT TYPE */}
          <Field
            label="Employment Type"
            required
          >
            <select
              value={form.employmentType}
              onChange={(e) =>
                updateField(
                  "employmentType",
                  e.target.value
                )
              }
              className={inputClass}
            >
              <option value="">
                Select Employment Type
              </option>

              <option value="Full-Time">
                Full-Time
              </option>

              <option value="Part-Time">
                Part-Time
              </option>

              <option value="Freelancer">
                Freelancer
              </option>
            </select>
          </Field>

          {/* JOINING DATE */}
          <Field label="Joining Date" required>
            <input
              type="date"
              value={form.joiningDate}
              onChange={(e) =>
                updateField(
                  "joiningDate",
                  e.target.value
                )
              }
              className={inputClass}
            />
          </Field>

          {/* STATUS */}
          <Field label="Status" required>
            <select
              value={form.status}
              onChange={(e) =>
                updateField("status", e.target.value)
              }
              className={inputClass}
            >
              <option value="Active">
                Active
              </option>

              <option value="Inactive">
                Inactive
              </option>
            </select>
          </Field>

          {/* QUALIFICATION */}
          <Field label="Qualification">
            <input
              value={form.qualification}
              onChange={(e) =>
                updateField(
                  "qualification",
                  e.target.value
                )
              }
              placeholder="e.g. B.E / B.Sc / M.A"
              className={inputClass}
            />
          </Field>

          {/* EXPERIENCE */}
          <Field label="Experience">
            <input
              value={form.experience}
              onChange={(e) =>
                updateField(
                  "experience",
                  e.target.value
                )
              }
              placeholder="e.g. 3 Years"
              className={inputClass}
            />
          </Field>

          {/* ADDRESS */}
          <div className="md:col-span-2 lg:col-span-3">
            <Field label="Address">
              <textarea
                rows={3}
                value={form.address}
                onChange={(e) =>
                  updateField(
                    "address",
                    e.target.value
                  )
                }
                placeholder="Enter employee address"
                className={`${inputClass} resize-none py-2.5`}
              />
            </Field>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mt-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Actions */}
        <div className="mt-8 flex justify-end gap-3 border-t border-neutral-200 pt-5">
          <button
            type="button"
            onClick={() => router.push("/staff")}
            className="h-10 rounded-lg border border-neutral-200 bg-white px-5 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="inline-flex h-10 items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-5 text-sm font-medium text-blue-700 transition hover:bg-blue-100"
          >
            <Save size={16} />
            Save Employee
          </button>
        </div>
      </form>
    </div>
  );
}

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
      <span className="mb-1.5 block text-sm font-medium text-neutral-700">
        {label}

        {required && (
          <span className="ml-1 text-red-500">
            *
          </span>
        )}
      </span>

      {children}
    </label>
  );
}

const inputClass =
  "h-10 w-full rounded-lg border border-neutral-200 bg-white px-3 text-sm text-neutral-800 outline-none transition placeholder:text-neutral-400 focus:border-blue-300 focus:ring-2 focus:ring-blue-50";