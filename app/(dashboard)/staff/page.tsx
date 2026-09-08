"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  UserRound,
  UsersRound,
  GraduationCap,
  UserCheck,
  Plus,
  Search,
  Download,
  MoreVertical,
  Eye,
  UserRoundCheck,
  UserRoundX,
  Pencil,
  X,
  Save,
} from "lucide-react";

type EmployeeStatus = "Active" | "Inactive";
type EmployeeCategory = "Administrative" | "Trainer" | "Faculty";
type EmploymentType = "Full-Time" | "Part-Time" | "Freelancer";

type Employee = {
  empId: string;
  name: string;
  contact: string;
  branch: string;
  employeeCategory: EmployeeCategory;
  designation: string;
  employmentType: EmploymentType;
  joiningDate: string;
  status: EmployeeStatus;

  // Optional fields used by Add Employee / profile view
  dob?: string;
  gender?: string;
  email?: string;
  address?: string;
  qualification?: string;
  experience?: string;
};

const sampleEmployees: Employee[] = [
  {
    empId: "EMP001",
    name: "Rajappa George",
    contact: "9876543210",
    branch: "Tiruchirappalli",
    employeeCategory: "Administrative",
    designation: "Project Coordinator",
    employmentType: "Full-Time",
    joiningDate: "2026-06-01",
    status: "Active",
    email: "rajappa@example.com",
    qualification: "MBA",
    experience: "6 Years",
  },
  {
    empId: "EMP002",
    name: "Nayanthara",
    contact: "9876543211",
    branch: "Thanjavur",
    employeeCategory: "Faculty",
    designation: "Beautician Faculty",
    employmentType: "Part-Time",
    joiningDate: "2026-07-15",
    status: "Active",
    email: "nayanthara@example.com",
    qualification: "Diploma",
    experience: "4 Years",
  },
  {
    empId: "EMP003",
    name: "Jagadeesan",
    contact: "9876543212",
    branch: "Perambalur",
    employeeCategory: "Administrative",
    designation: "Regional Manager",
    employmentType: "Full-Time",
    joiningDate: "2026-05-10",
    status: "Active",
    qualification: "B.Com",
    experience: "8 Years",
  },
  {
    empId: "EMP004",
    name: "Simbran",
    contact: "9876543213",
    branch: "Mayiladuthurai",
    employeeCategory: "Trainer",
    designation: "Software Trainer",
    employmentType: "Freelancer",
    joiningDate: "2026-04-20",
    status: "Inactive",
    qualification: "B.E",
    experience: "3 Years",
  },
];

const branches = [
  "Ariyalur",
  "Guduvancherry",
  "Mayiladuthurai",
  "Perambalur",
  "Thanjavur",
  "Tiruchirappalli",
];

export default function StaffManagementPage() {
  const router = useRouter();

  const [employees, setEmployees] = useState<Employee[]>(sampleEmployees);
  const [search, setSearch] = useState("");
  const [branchFilter, setBranchFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });

  const [viewEmployee, setViewEmployee] = useState<Employee | null>(null);
  const [editEmployee, setEditEmployee] = useState<Employee | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("jet-mis-employees");
    if (!saved) return;

    try {
      const savedEmployees = JSON.parse(saved) as Employee[];

      // Saved records override matching sample records.
      const merged = [...sampleEmployees];

      savedEmployees.forEach((savedEmployee) => {
        const index = merged.findIndex(
          (item) => item.empId === savedEmployee.empId
        );

        if (index >= 0) {
          merged[index] = {
            ...merged[index],
            ...savedEmployee,
          };
        } else {
          merged.push(savedEmployee);
        }
      });

      setEmployees(merged);
    } catch {
      // Keep sample data if localStorage is invalid.
    }
  }, []);

  function persistEmployees(nextEmployees: Employee[]) {
    setEmployees(nextEmployees);

    // Store the full current list so status/edit changes remain after refresh.
    localStorage.setItem(
      "jet-mis-employees",
      JSON.stringify(nextEmployees)
    );
  }

  const filteredEmployees = useMemo(() => {
    const query = search.trim().toLowerCase();

    return employees.filter((employee) => {
      const matchesSearch =
        !query ||
        employee.empId.toLowerCase().includes(query) ||
        employee.name.toLowerCase().includes(query) ||
        employee.contact.includes(query) ||
        employee.designation.toLowerCase().includes(query) ||
        employee.employeeCategory.toLowerCase().includes(query);

      const matchesBranch =
        branchFilter === "All" || employee.branch === branchFilter;

      const matchesCategory =
        categoryFilter === "All" ||
        employee.employeeCategory === categoryFilter;

      const matchesStatus =
        statusFilter === "All" || employee.status === statusFilter;

      return (
        matchesSearch &&
        matchesBranch &&
        matchesCategory &&
        matchesStatus
      );
    });
  }, [
    employees,
    search,
    branchFilter,
    categoryFilter,
    statusFilter,
  ]);

  const totalEmployees = employees.length;

  const activeEmployees = employees.filter(
    (employee) => employee.status === "Active"
  ).length;

  const trainersFaculty = employees.filter(
    (employee) =>
      employee.employeeCategory === "Trainer" ||
      employee.employeeCategory === "Faculty"
  ).length;

  const administrativeEmployees = employees.filter(
    (employee) => employee.employeeCategory === "Administrative"
  ).length;

  function openActionMenu(
    event: React.MouseEvent<HTMLButtonElement>,
    empId: string
  ) {
    event.stopPropagation();

    const rect = event.currentTarget.getBoundingClientRect();
    const menuWidth = 210;
    const menuHeight = 145;

    let top = rect.bottom + 6;
    let left = rect.right - menuWidth;

    if (top + menuHeight > window.innerHeight - 12) {
      top = rect.top - menuHeight - 6;
    }

    if (left < 12) left = 12;
    if (left + menuWidth > window.innerWidth - 12) {
      left = window.innerWidth - menuWidth - 12;
    }

    setMenuPosition({ top, left });
    setOpenMenuId((current) => (current === empId ? null : empId));
  }

  function changeStatus(empId: string, status: EmployeeStatus) {
    const nextEmployees = employees.map((employee) =>
      employee.empId === empId
        ? { ...employee, status }
        : employee
    );

    persistEmployees(nextEmployees);
    setOpenMenuId(null);

    if (viewEmployee?.empId === empId) {
      setViewEmployee((current) =>
        current ? { ...current, status } : current
      );
    }
  }

  function handleSaveEdit(updatedEmployee: Employee) {
    const nextEmployees = employees.map((employee) =>
      employee.empId === updatedEmployee.empId
        ? updatedEmployee
        : employee
    );

    persistEmployees(nextEmployees);

    if (viewEmployee?.empId === updatedEmployee.empId) {
      setViewEmployee(updatedEmployee);
    }

    setEditEmployee(null);
  }

  function exportExcel() {
    const headers = [
      "Emp ID",
      "Employee Name",
      "Contact",
      "Branch",
      "Designation",
      "Employee Category",
      "Employment Type",
      "Joining Date",
      "Status",
    ];

    const rows = filteredEmployees.map((employee) => [
      employee.empId,
      employee.name,
      employee.contact,
      employee.branch,
      employee.designation,
      employee.employeeCategory,
      employee.employmentType,
      employee.joiningDate,
      employee.status,
    ]);

    const csv = [headers, ...rows]
      .map((row) =>
        row
          .map((value) => `"${String(value ?? "").replace(/"/g, '""')}"`)
          .join(",")
      )
      .join("\n");

    const blob = new Blob(["\uFEFF" + csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `JET-MIS-Employees-${new Date()
      .toISOString()
      .slice(0, 10)}.csv`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  const menuEmployee =
    openMenuId !== null
      ? employees.find((employee) => employee.empId === openMenuId)
      : null;

  return (
    <div
      className="min-h-screen bg-white p-6"
      onClick={() => setOpenMenuId(null)}
    >
      <div className="mb-6">
        <h1 className="text-xl font-semibold tracking-tight text-neutral-900">
          Staff Management
        </h1>
      </div>

      <div className="mb-7 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          title="Total Employees"
          value={totalEmployees}
          icon={<UsersRound size={20} />}
          style="blue"
        />

        <SummaryCard
          title="Active Employees"
          value={activeEmployees}
          icon={<UserCheck size={20} />}
          style="green"
        />

        <SummaryCard
          title="Trainers / Faculty"
          value={trainersFaculty}
          icon={<GraduationCap size={20} />}
          style="blue"
        />

        <SummaryCard
          title="Administrative"
          value={administrativeEmployees}
          icon={<UserRound size={20} />}
          style="neutral"
        />
      </div>

      <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
        <div className="flex flex-wrap items-center gap-3 border-b border-neutral-200 p-4">
          <div className="mr-auto">
            <h2 className="font-semibold text-neutral-900">
              Employees ({filteredEmployees.length})
            </h2>
          </div>

          <div className="relative w-full sm:w-64 lg:w-72">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
            />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search employee..."
              className="h-10 w-full rounded-lg border border-neutral-200 bg-white pl-9 pr-3 text-sm outline-none transition focus:border-blue-300 focus:ring-2 focus:ring-blue-50"
            />
          </div>

          <select
            value={branchFilter}
            onChange={(e) => setBranchFilter(e.target.value)}
            className="h-10 rounded-lg border border-neutral-200 bg-white px-3 text-sm text-neutral-700 outline-none"
          >
            <option value="All">All Branches</option>

            {branches.map((branch) => (
              <option key={branch} value={branch}>
                {branch}
              </option>
            ))}
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="h-10 rounded-lg border border-neutral-200 bg-white px-3 text-sm text-neutral-700 outline-none"
          >
            <option value="All">All Categories</option>
            <option value="Administrative">Administrative</option>
            <option value="Trainer">Trainer</option>
            <option value="Faculty">Faculty</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-10 rounded-lg border border-neutral-200 bg-white px-3 text-sm text-neutral-700 outline-none"
          >
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>

          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              router.push("/staff/add-employee");
            }}
            className="inline-flex h-10 items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-4 text-sm font-medium text-blue-700 transition hover:bg-blue-100"
          >
            <Plus size={16} />
            Add Employee
          </button>

          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              exportExcel();
            }}
            className="inline-flex h-10 items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-4 text-sm font-medium text-green-700 transition hover:bg-green-100"
          >
            <Download size={16} />
            Excel
          </button>
        </div>

        <table className="w-full table-fixed">
          <thead className="bg-neutral-50/80">
            <tr className="border-b border-neutral-200">
              <TableHead className="w-[10%]">Emp ID</TableHead>
              <TableHead className="w-[17%]">Employee Name</TableHead>
              <TableHead className="w-[13%]">Branch</TableHead>
              <TableHead className="w-[16%]">Designation</TableHead>
              <TableHead className="w-[15%]">Employee Category</TableHead>
              <TableHead className="w-[12%]">Employment</TableHead>
              <TableHead className="w-[11%]">Joining Date</TableHead>
              <TableHead className="w-[8%]">Status</TableHead>
              <TableHead className="w-[44px]">{""}</TableHead>
            </tr>
          </thead>

          <tbody>
            {filteredEmployees.map((employee) => (
              <tr
                key={employee.empId}
                className="border-b border-neutral-100 transition last:border-b-0 hover:bg-blue-50/30"
              >
                <TableCell>
                  <span className="font-medium text-neutral-800">
                    {employee.empId}
                  </span>
                </TableCell>

                <TableCell>
                  <div className="font-medium text-neutral-900">
                    {employee.name}
                  </div>

                  <div className="mt-0.5 text-xs text-neutral-500">
                    {employee.contact}
                  </div>
                </TableCell>

                <TableCell>{employee.branch}</TableCell>

                <TableCell>
                  <span className="break-words">
                    {employee.designation}
                  </span>
                </TableCell>

                <TableCell>
                  <CategoryBadge category={employee.employeeCategory} />
                </TableCell>

                <TableCell>{employee.employmentType}</TableCell>

                <TableCell>{formatDate(employee.joiningDate)}</TableCell>

                <TableCell>
                  <StatusBadge status={employee.status} />
                </TableCell>

                <TableCell>
                  <button
                    type="button"
                    onClick={(event) =>
                      openActionMenu(event, employee.empId)
                    }
                    className="flex h-8 w-8 items-center justify-center rounded-md text-neutral-500 transition hover:bg-neutral-100 hover:text-neutral-900"
                  >
                    <MoreVertical size={17} />
                  </button>
                </TableCell>
              </tr>
            ))}

            {filteredEmployees.length === 0 && (
              <tr>
                <td
                  colSpan={9}
                  className="px-4 py-14 text-center text-sm text-neutral-500"
                >
                  No employees found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 3-dot action menu */}
      {menuEmployee && openMenuId && (
        <div
          onClick={(event) => event.stopPropagation()}
          className="fixed z-50 w-[210px] overflow-hidden rounded-lg border border-neutral-200 bg-white p-1.5 shadow-lg"
          style={{
            top: menuPosition.top,
            left: menuPosition.left,
          }}
        >
          <ActionButton
            icon={<Eye size={16} />}
            label="View Employee"
            onClick={() => {
              setViewEmployee(menuEmployee);
              setOpenMenuId(null);
            }}
          />

          <ActionButton
            icon={<UserRoundCheck size={16} />}
            label="Change to Active"
            disabled={menuEmployee.status === "Active"}
            onClick={() =>
              changeStatus(menuEmployee.empId, "Active")
            }
          />

          <ActionButton
            icon={<UserRoundX size={16} />}
            label="Change to Inactive"
            danger
            disabled={menuEmployee.status === "Inactive"}
            onClick={() =>
              changeStatus(menuEmployee.empId, "Inactive")
            }
          />
        </div>
      )}

      {/* View Employee panel */}
      {viewEmployee && (
        <ModalShell
          title="Employee Profile"
          onClose={() => setViewEmployee(null)}
        >
          <div className="grid gap-4 md:grid-cols-2">
            <Detail label="Emp ID" value={viewEmployee.empId} />
            <Detail label="Employee Name" value={viewEmployee.name} />
            <Detail label="Contact" value={viewEmployee.contact} />
            <Detail label="Email" value={viewEmployee.email || "—"} />
            <Detail label="Date of Birth" value={formatDate(viewEmployee.dob)} />
            <Detail label="Gender" value={viewEmployee.gender || "—"} />
            <Detail label="Branch" value={viewEmployee.branch} />
            <Detail
              label="Employee Category"
              value={viewEmployee.employeeCategory}
            />
            <Detail
              label="Designation"
              value={viewEmployee.designation}
            />
            <Detail
              label="Employment Type"
              value={viewEmployee.employmentType}
            />
            <Detail
              label="Joining Date"
              value={formatDate(viewEmployee.joiningDate)}
            />
            <Detail label="Status" value={viewEmployee.status} />
            <Detail
              label="Qualification"
              value={viewEmployee.qualification || "—"}
            />
            <Detail
              label="Experience"
              value={viewEmployee.experience || "—"}
            />

            <div className="md:col-span-2">
              <Detail
                label="Address"
                value={viewEmployee.address || "—"}
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end border-t border-neutral-200 pt-5">
            <button
              type="button"
              onClick={() => {
                setEditEmployee({ ...viewEmployee });
                setViewEmployee(null);
              }}
              className="inline-flex h-10 items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-4 text-sm font-medium text-blue-700 transition hover:bg-blue-100"
            >
              <Pencil size={16} />
              Edit Employee
            </button>
          </div>
        </ModalShell>
      )}

      {/* Edit Employee panel */}
      {editEmployee && (
        <EditEmployeeModal
          employee={editEmployee}
          onClose={() => setEditEmployee(null)}
          onSave={handleSaveEdit}
        />
      )}
    </div>
  );
}

function EditEmployeeModal({
  employee,
  onClose,
  onSave,
}: {
  employee: Employee;
  onClose: () => void;
  onSave: (employee: Employee) => void;
}) {
  const [form, setForm] = useState<Employee>(employee);
  const [error, setError] = useState("");

  function updateField<K extends keyof Employee>(
    field: K,
    value: Employee[K]
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
    setError("");
  }

  function handleSave() {
    if (!form.name.trim()) {
      setError("Employee Name is required.");
      return;
    }

    if (!/^\d{10}$/.test(form.contact)) {
      setError("Contact number must contain exactly 10 digits.");
      return;
    }

    if (!form.branch) {
      setError("Branch is required.");
      return;
    }

    if (!form.designation.trim()) {
      setError("Designation is required.");
      return;
    }

    if (!form.joiningDate) {
      setError("Joining Date is required.");
      return;
    }

    onSave({
      ...form,
      empId: form.empId.trim().toUpperCase(),
      name: form.name.trim(),
      contact: form.contact.trim(),
      email: form.email?.trim(),
      designation: form.designation.trim(),
      qualification: form.qualification?.trim(),
      experience: form.experience?.trim(),
      address: form.address?.trim(),
    });
  }

  return (
    <ModalShell title="Edit Employee" onClose={onClose} wide>
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        <Field label="Emp ID">
          <input
            value={form.empId}
            disabled
            className={`${inputClass} bg-neutral-50 text-neutral-500`}
          />
        </Field>

        <Field label="Employee Name" required>
          <input
            value={form.name}
            onChange={(e) => updateField("name", e.target.value)}
            className={inputClass}
          />
        </Field>

        <Field label="Contact" required>
          <input
            value={form.contact}
            onChange={(e) =>
              updateField(
                "contact",
                e.target.value.replace(/\D/g, "").slice(0, 10)
              )
            }
            inputMode="numeric"
            className={inputClass}
          />
        </Field>

        <Field label="Email">
          <input
            type="email"
            value={form.email || ""}
            onChange={(e) => updateField("email", e.target.value)}
            className={inputClass}
          />
        </Field>

        <Field label="Date of Birth">
          <input
            type="date"
            value={form.dob || ""}
            onChange={(e) => updateField("dob", e.target.value)}
            className={inputClass}
          />
        </Field>

        <Field label="Gender">
          <select
            value={form.gender || ""}
            onChange={(e) => updateField("gender", e.target.value)}
            className={inputClass}
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </Field>

        <Field label="Branch" required>
          <select
            value={form.branch}
            onChange={(e) => updateField("branch", e.target.value)}
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

        <Field label="Employee Category" required>
          <select
            value={form.employeeCategory}
            onChange={(e) =>
              updateField(
                "employeeCategory",
                e.target.value as EmployeeCategory
              )
            }
            className={inputClass}
          >
            <option value="Administrative">Administrative</option>
            <option value="Trainer">Trainer</option>
            <option value="Faculty">Faculty</option>
          </select>
        </Field>

        <Field label="Designation" required>
          <input
            value={form.designation}
            onChange={(e) =>
              updateField("designation", e.target.value)
            }
            className={inputClass}
          />
        </Field>

        <Field label="Employment Type" required>
          <select
            value={form.employmentType}
            onChange={(e) =>
              updateField(
                "employmentType",
                e.target.value as EmploymentType
              )
            }
            className={inputClass}
          >
            <option value="Full-Time">Full-Time</option>
            <option value="Part-Time">Part-Time</option>
            <option value="Freelancer">Freelancer</option>
          </select>
        </Field>

        <Field label="Joining Date" required>
          <input
            type="date"
            value={form.joiningDate}
            onChange={(e) =>
              updateField("joiningDate", e.target.value)
            }
            className={inputClass}
          />
        </Field>

        <Field label="Status" required>
          <select
            value={form.status}
            onChange={(e) =>
              updateField(
                "status",
                e.target.value as EmployeeStatus
              )
            }
            className={inputClass}
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </Field>

        <Field label="Qualification">
          <input
            value={form.qualification || ""}
            onChange={(e) =>
              updateField("qualification", e.target.value)
            }
            className={inputClass}
          />
        </Field>

        <Field label="Experience">
          <input
            value={form.experience || ""}
            onChange={(e) =>
              updateField("experience", e.target.value)
            }
            className={inputClass}
          />
        </Field>

        <div className="md:col-span-2 lg:col-span-3">
          <Field label="Address">
            <textarea
              rows={3}
              value={form.address || ""}
              onChange={(e) =>
                updateField("address", e.target.value)
              }
              className={`${inputClass} h-auto resize-none py-2.5`}
            />
          </Field>
        </div>
      </div>

      {error && (
        <div className="mt-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="mt-6 flex justify-end gap-3 border-t border-neutral-200 pt-5">
        <button
          type="button"
          onClick={onClose}
          className="h-10 rounded-lg border border-neutral-200 bg-white px-4 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50"
        >
          Cancel
        </button>

        <button
          type="button"
          onClick={handleSave}
          className="inline-flex h-10 items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-4 text-sm font-medium text-blue-700 transition hover:bg-blue-100"
        >
          <Save size={16} />
          Save Changes
        </button>
      </div>
    </ModalShell>
  );
}

function ModalShell({
  title,
  children,
  onClose,
  wide = false,
}: {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
  wide?: boolean;
}) {
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/20 p-4">
      <div
        className={`max-h-[90vh] w-full overflow-y-auto rounded-xl border border-neutral-200 bg-white shadow-xl ${
          wide ? "max-w-5xl" : "max-w-3xl"
        }`}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-neutral-200 bg-white px-5 py-4">
          <h2 className="text-lg font-semibold text-neutral-900">
            {title}
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-md text-neutral-500 transition hover:bg-neutral-100 hover:text-neutral-900"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

function ActionButton({
  icon,
  label,
  onClick,
  disabled = false,
  danger = false,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  disabled?: boolean;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left text-sm transition ${
        disabled
          ? "cursor-not-allowed text-neutral-300"
          : danger
          ? "text-red-600 hover:bg-red-50"
          : "text-neutral-700 hover:bg-neutral-50"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

function SummaryCard({
  title,
  value,
  icon,
  style,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
  style: "blue" | "green" | "neutral";
}) {
  const styles = {
    blue: {
      card: "border-blue-100 bg-blue-50/60",
      icon: "bg-white text-blue-600",
    },
    green: {
      card: "border-green-100 bg-green-50/60",
      icon: "bg-white text-green-600",
    },
    neutral: {
      card: "border-neutral-200 bg-neutral-50",
      icon: "bg-white text-neutral-600",
    },
  };

  return (
    <div className={`rounded-xl border p-5 ${styles[style].card}`}>
      <div className="flex items-start justify-between">
        <div>
          <div className="text-sm font-medium text-neutral-500">
            {title}
          </div>

          <div className="mt-2 text-2xl font-semibold text-neutral-900">
            {value}
          </div>
        </div>

        <div
          className={`flex h-10 w-10 items-center justify-center rounded-lg border border-black/5 ${styles[style].icon}`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}

function CategoryBadge({
  category,
}: {
  category: EmployeeCategory;
}) {
  if (category === "Trainer") {
    return (
      <span className="inline-flex rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
        Trainer
      </span>
    );
  }

  if (category === "Faculty") {
    return (
      <span className="inline-flex rounded-full border border-violet-200 bg-violet-50 px-2.5 py-1 text-xs font-medium text-violet-700">
        Faculty
      </span>
    );
  }

  return (
    <span className="inline-flex rounded-full border border-neutral-200 bg-neutral-50 px-2.5 py-1 text-xs font-medium text-neutral-600">
      Administrative
    </span>
  );
}

function StatusBadge({
  status,
}: {
  status: EmployeeStatus;
}) {
  if (status === "Active") {
    return (
      <span className="inline-flex rounded-full border border-green-200 bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700">
        Active
      </span>
    );
  }

  return (
    <span className="inline-flex rounded-full border border-neutral-200 bg-neutral-50 px-2.5 py-1 text-xs font-medium text-neutral-600">
      Inactive
    </span>
  );
}

function TableHead({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <th
      className={`px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide text-neutral-500 ${className}`}
    >
      {children}
    </th>
  );
}

function TableCell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <td className="whitespace-normal break-words px-3 py-3.5 align-middle text-sm text-neutral-600">
      {children}
    </td>
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
        {required && <span className="ml-1 text-red-500">*</span>}
      </span>
      {children}
    </label>
  );
}

function Detail({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-neutral-200 bg-neutral-50/50 px-4 py-3">
      <div className="text-xs font-medium uppercase tracking-wide text-neutral-400">
        {label}
      </div>
      <div className="mt-1 text-sm font-medium text-neutral-800">
        {value || "—"}
      </div>
    </div>
  );
}

function formatDate(date?: string) {
  if (!date) return "—";

  const [year, month, day] = date.split("-");

  if (!year || !month || !day) return date;

  return `${day}/${month}/${year}`;
}

const inputClass =
  "h-10 w-full rounded-lg border border-neutral-200 bg-white px-3 text-sm text-neutral-800 outline-none transition placeholder:text-neutral-400 focus:border-blue-300 focus:ring-2 focus:ring-blue-50";
