"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  MoreVertical,
  Pencil,
  Plus,
  Power,
  PowerOff,
  X,
} from "lucide-react";

type BranchStatus = "Active" | "Inactive";

type Branch = {
  id: string;
  branchName: string;
  code: string;
  spocName: string;
  spocContact: string;
  secondaryContact: string;
  email: string;
  address: string;
  status: BranchStatus;
};

const initialBranches: Branch[] = [
  {
    id: "BR001",
    branchName: "Ariyalur",
    code: "ARY",
    spocName: "Rajesh Kumar",
    spocContact: "9876543210",
    secondaryContact: "9876500001",
    email: "ariyalur@jetmis.in",
    address: "Ariyalur, Tamil Nadu",
    status: "Active",
  },
  {
    id: "BR002",
    branchName: "Guduvancherry",
    code: "GUV",
    spocName: "Suresh Kumar",
    spocContact: "9876543211",
    secondaryContact: "9876500002",
    email: "guduvancherry@jetmis.in",
    address: "Guduvancherry, Tamil Nadu",
    status: "Active",
  },
  {
    id: "BR003",
    branchName: "Mayiladuthurai",
    code: "MYL",
    spocName: "Karthik R",
    spocContact: "9876543212",
    secondaryContact: "9876500003",
    email: "mayiladuthurai@jetmis.in",
    address: "Mayiladuthurai, Tamil Nadu",
    status: "Active",
  },
  {
    id: "BR004",
    branchName: "Perambalur",
    code: "PMB",
    spocName: "Vignesh K",
    spocContact: "9876543213",
    secondaryContact: "9876500004",
    email: "perambalur@jetmis.in",
    address: "Perambalur, Tamil Nadu",
    status: "Active",
  },
  {
    id: "BR005",
    branchName: "Thanjavur",
    code: "TNJ",
    spocName: "Arun Kumar",
    spocContact: "9876543214",
    secondaryContact: "9876500005",
    email: "thanjavur@jetmis.in",
    address: "Thanjavur, Tamil Nadu",
    status: "Active",
  },
  {
    id: "BR006",
    branchName: "Tiruchirappalli",
    code: "TRY",
    spocName: "Prakash M",
    spocContact: "9876543215",
    secondaryContact: "9876500006",
    email: "trichy@jetmis.in",
    address: "Tiruchirappalli, Tamil Nadu",
    status: "Active",
  },
];

export default function BranchesPage() {
  const [branches, setBranches] =
    useState<Branch[]>(initialBranches);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState("All");

  const [formOpen, setFormOpen] =
    useState(false);

  const [editingBranch, setEditingBranch] =
    useState<Branch | null>(null);

  const [openMenuId, setOpenMenuId] =
    useState<string | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(
        "jet-mis-branches"
      );

      if (!saved) return;

      const parsed = JSON.parse(saved);

      if (Array.isArray(parsed)) {
        setBranches(parsed);
      }
    } catch {
      // Keep sample branches if saved data is invalid.
    }
  }, []);

  function persistBranches(nextBranches: Branch[]) {
    setBranches(nextBranches);

    localStorage.setItem(
      "jet-mis-branches",
      JSON.stringify(nextBranches)
    );
  }

  const filteredBranches = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return branches.filter((branch) => {
      const matchesSearch =
        !keyword ||
        branch.branchName
          .toLowerCase()
          .includes(keyword) ||
        branch.code
          .toLowerCase()
          .includes(keyword) ||
        branch.spocName
          .toLowerCase()
          .includes(keyword) ||
        branch.spocContact.includes(keyword) ||
        branch.email
          .toLowerCase()
          .includes(keyword) ||
        branch.address
          .toLowerCase()
          .includes(keyword);

      const matchesStatus =
        statusFilter === "All" ||
        branch.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [branches, search, statusFilter]);

  function openAddBranch() {
    setEditingBranch(null);
    setOpenMenuId(null);
    setFormOpen(true);
  }

  function openEditBranch(branch: Branch) {
    setEditingBranch(branch);
    setOpenMenuId(null);
    setFormOpen(true);
  }

  function toggleBranchStatus(branch: Branch) {
    const nextStatus: BranchStatus =
      branch.status === "Active"
        ? "Inactive"
        : "Active";

    const nextBranches = branches.map((item) =>
      item.id === branch.id
        ? {
            ...item,
            status: nextStatus,
          }
        : item
    );

    persistBranches(nextBranches);
    setOpenMenuId(null);
  }

  function saveBranch(
    data: Omit<Branch, "id" | "status">
  ) {
    if (editingBranch) {
      const duplicateCode = branches.some(
        (branch) =>
          branch.id !== editingBranch.id &&
          branch.code.toLowerCase() ===
            data.code.toLowerCase()
      );

      if (duplicateCode) {
        return false;
      }

      const nextBranches = branches.map((branch) =>
        branch.id === editingBranch.id
          ? {
              ...branch,
              ...data,
            }
          : branch
      );

      persistBranches(nextBranches);
    } else {
      const duplicateCode = branches.some(
        (branch) =>
          branch.code.toLowerCase() ===
          data.code.toLowerCase()
      );

      if (duplicateCode) {
        return false;
      }

      const newBranch: Branch = {
        id: generateBranchId(branches),
        ...data,
        status: "Active",
      };

      persistBranches([
        ...branches,
        newBranch,
      ]);
    }

    setFormOpen(false);
    setEditingBranch(null);

    return true;
  }

  return (
    <div className="min-h-full bg-white p-6">
      {/* HEADER */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-neutral-900">
            Branch Management
          </h1>

          <p className="mt-1 text-sm text-neutral-500">
            Manage branch information and SPOC details.
          </p>
        </div>

        <button
          type="button"
          onClick={openAddBranch}
          className="inline-flex h-10 items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-4 text-sm font-medium text-blue-700 transition hover:bg-blue-100"
        >
          <Plus size={16} />
          Add Branch
        </button>
      </div>

      {/* FILTERS */}
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <input
          type="text"
          value={search}
          onChange={(event) =>
            setSearch(event.target.value)
          }
          placeholder="Search branch, code, SPOC, contact..."
          className="h-10 min-w-[300px] flex-1 rounded-lg border border-neutral-200 bg-white px-3 text-sm text-neutral-800 outline-none transition focus:border-blue-300 focus:ring-2 focus:ring-blue-50"
        />

        <select
          value={statusFilter}
          onChange={(event) =>
            setStatusFilter(event.target.value)
          }
          className="h-10 rounded-lg border border-neutral-200 bg-white px-3 text-sm text-neutral-700 outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-50"
        >
          <option value="All">All Status</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
      </div>

        {/* TABLE */}
        <div className="overflow-visible rounded-lg border border-neutral-200 bg-white">
        <div className="overflow-x-auto">
            <table className="w-full table-fixed">
            <thead>
                <tr className="bg-neutral-50">
                <th className={`${thClass} w-[12%]`}>
                    Branch Name
                </th>

                <th className={`${thClass} w-[6%]`}>
                    Code
                </th>

                <th className={`${thClass} w-[11%]`}>
                    SPOC Name
                </th>

                <th className={`${thClass} w-[11%]`}>
                    SPOC Contact
                </th>

                <th className={`${thClass} w-[11%]`}>
                    Secondary Contact
                </th>

                <th className={`${thClass} w-[15%]`}>
                    E-mail
                </th>

                <th className={`${thClass} w-[20%]`}>
                    Address
                </th>

                <th className={`${thClass} w-[9%]`}>
                    Status
                </th>

                <th className="w-[5%] px-2 py-3" />
                </tr>
            </thead>

            <tbody>
                {filteredBranches.length > 0 ? (
                filteredBranches.map((branch) => (
                    <tr
                    key={branch.id}
                    className="border-t border-neutral-100 transition hover:bg-blue-50/30"
                    >
                    <td className={tdClass}>
                        <div className="break-words font-medium text-neutral-900">
                        {branch.branchName}
                        </div>
                    </td>

                    <td className={tdClass}>
                        <span className="break-words">
                        {branch.code}
                        </span>
                    </td>

                    <td className={tdClass}>
                        <div className="break-words">
                        {branch.spocName}
                        </div>
                    </td>

                    <td className={tdClass}>
                        <div className="break-all">
                        {branch.spocContact}
                        </div>
                    </td>

                    <td className={tdClass}>
                        <div className="break-all">
                        {branch.secondaryContact || "-"}
                        </div>
                    </td>

                    <td className={tdClass}>
                        <div
                        className="break-all"
                        title={branch.email}
                        >
                        {branch.email}
                        </div>
                    </td>

                    <td className={tdClass}>
                        <div
                        className="line-clamp-2 break-words leading-5"
                        title={branch.address}
                        >
                        {branch.address}
                        </div>
                    </td>

                    <td className={tdClass}>
                        <StatusBadge
                        status={branch.status}
                        />
                    </td>

                    <td className="relative px-2 py-3 text-right">
                        <button
                        type="button"
                        onClick={() =>
                            setOpenMenuId(
                            openMenuId === branch.id
                                ? null
                                : branch.id
                            )
                        }
                        className="inline-flex h-8 w-8 items-center justify-center rounded-md text-neutral-500 transition hover:bg-neutral-100 hover:text-neutral-800"
                        aria-label="Branch actions"
                        >
                        <MoreVertical size={18} />
                        </button>

                        {openMenuId === branch.id && (
                        <ActionMenu
                            branch={branch}
                            onEdit={() =>
                            openEditBranch(branch)
                            }
                            onStatusChange={() =>
                            toggleBranchStatus(branch)
                            }
                            onClose={() =>
                            setOpenMenuId(null)
                            }
                        />
                        )}
                    </td>
                    </tr>
                ))
                ) : (
                <tr>
                    <td
                    colSpan={9}
                    className="px-4 py-12 text-center text-sm text-neutral-500"
                    >
                    No branches found.
                    </td>
                </tr>
                )}
            </tbody>
            </table>
        </div>
        </div>

      {/* ADD / EDIT MODAL */}
      {formOpen && (
        <BranchFormModal
          branch={editingBranch}
          onClose={() => {
            setFormOpen(false);
            setEditingBranch(null);
          }}
          onSave={saveBranch}
        />
      )}
    </div>
  );
}

function BranchFormModal({
  branch,
  onClose,
  onSave,
}: {
  branch: Branch | null;
  onClose: () => void;
  onSave: (
    data: Omit<Branch, "id" | "status">
  ) => boolean;
}) {
  const [branchName, setBranchName] =
    useState(branch?.branchName ?? "");

  const [code, setCode] =
    useState(branch?.code ?? "");

  const [spocName, setSpocName] =
    useState(branch?.spocName ?? "");

  const [spocContact, setSpocContact] =
    useState(branch?.spocContact ?? "");

  const [
    secondaryContact,
    setSecondaryContact,
  ] = useState(
    branch?.secondaryContact ?? ""
  );

  const [email, setEmail] =
    useState(branch?.email ?? "");

  const [address, setAddress] =
    useState(branch?.address ?? "");

  const [error, setError] = useState("");

  function submit() {
    const cleanBranchName =
      branchName.trim();

    const cleanCode =
      code.trim().toUpperCase();

    const cleanSpocName =
      spocName.trim();

    const cleanSpocContact =
      spocContact.trim();

    const cleanSecondary =
      secondaryContact.trim();

    const cleanEmail =
      email.trim().toLowerCase();

    const cleanAddress =
      address.trim();

    if (
      !cleanBranchName ||
      !cleanCode ||
      !cleanSpocName ||
      !cleanSpocContact ||
      !cleanEmail ||
      !cleanAddress
    ) {
      setError(
        "Please fill all required fields."
      );
      return;
    }

    if (
      !/^[A-Z0-9]{2,10}$/.test(
        cleanCode
      )
    ) {
      setError(
        "Branch code must contain 2 to 10 letters or numbers."
      );
      return;
    }

    if (
      !/^\d{10}$/.test(
        cleanSpocContact
      )
    ) {
      setError(
        "SPOC contact must be a 10-digit number."
      );
      return;
    }

    if (
      cleanSecondary &&
      !/^\d{10}$/.test(cleanSecondary)
    ) {
      setError(
        "Secondary contact must be a 10-digit number."
      );
      return;
    }

    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        cleanEmail
      )
    ) {
      setError(
        "Please enter a valid email address."
      );
      return;
    }

    const saved = onSave({
      branchName: cleanBranchName,
      code: cleanCode,
      spocName: cleanSpocName,
      spocContact: cleanSpocContact,
      secondaryContact: cleanSecondary,
      email: cleanEmail,
      address: cleanAddress,
    });

    if (!saved) {
      setError(
        "This branch code is already in use."
      );
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/25 p-4">
      <div className="w-full max-w-2xl rounded-xl border border-neutral-200 bg-white shadow-xl">
        {/* MODAL HEADER */}
        <div className="flex items-center justify-between border-b border-neutral-200 px-5 py-4">
          <div>
            <h2 className="font-semibold text-neutral-900">
              {branch
                ? "Edit Branch"
                : "Add Branch"}
            </h2>

            <p className="mt-1 text-sm text-neutral-500">
              Enter branch and SPOC information.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-md text-neutral-500 hover:bg-neutral-100"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* FORM */}
        <div className="grid gap-4 p-5 md:grid-cols-2">
          <div>
            <label className={labelClass}>
              Branch Name *
            </label>

            <input
              type="text"
              value={branchName}
              onChange={(event) =>
                setBranchName(
                  event.target.value
                )
              }
              placeholder="Enter branch name"
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>
              Branch Code *
            </label>

            <input
              type="text"
              value={code}
              onChange={(event) =>
                setCode(
                  event.target.value
                    .toUpperCase()
                )
              }
              placeholder="Example: TRY"
              maxLength={10}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>
              SPOC Name *
            </label>

            <input
              type="text"
              value={spocName}
              onChange={(event) =>
                setSpocName(
                  event.target.value
                )
              }
              placeholder="Enter SPOC name"
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>
              SPOC Contact *
            </label>

            <input
              type="tel"
              value={spocContact}
              onChange={(event) =>
                setSpocContact(
                  event.target.value
                    .replace(/\D/g, "")
                    .slice(0, 10)
                )
              }
              placeholder="10-digit number"
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>
              Secondary Contact
            </label>

            <input
              type="tel"
              value={secondaryContact}
              onChange={(event) =>
                setSecondaryContact(
                  event.target.value
                    .replace(/\D/g, "")
                    .slice(0, 10)
                )
              }
              placeholder="Optional"
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>
              E-mail *
            </label>

            <input
              type="email"
              value={email}
              onChange={(event) =>
                setEmail(
                  event.target.value
                )
              }
              placeholder="branch@example.com"
              className={inputClass}
            />
          </div>

          <div className="md:col-span-2">
            <label className={labelClass}>
              Address *
            </label>

            <textarea
              value={address}
              onChange={(event) =>
                setAddress(
                  event.target.value
                )
              }
              placeholder="Enter complete branch address"
              rows={3}
              className="w-full resize-none rounded-lg border border-neutral-200 bg-white px-3 py-2.5 text-sm text-neutral-800 outline-none transition focus:border-blue-300 focus:ring-2 focus:ring-blue-50"
            />
          </div>

          {error && (
            <div className="md:col-span-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          )}
        </div>

        {/* MODAL FOOTER */}
        <div className="flex justify-end gap-2 border-t border-neutral-200 px-5 py-4">
          <button
            type="button"
            onClick={onClose}
            className="h-10 rounded-lg border border-neutral-200 bg-white px-4 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={submit}
            className="h-10 rounded-lg border border-blue-200 bg-blue-50 px-4 text-sm font-medium text-blue-700 hover:bg-blue-100"
          >
            {branch
              ? "Save Changes"
              : "Add Branch"}
          </button>
        </div>
      </div>
    </div>
  );
}

function ActionMenu({
  branch,
  onEdit,
  onStatusChange,
  onClose,
}: {
  branch: Branch;
  onEdit: () => void;
  onStatusChange: () => void;
  onClose: () => void;
}) {
  const menuRef =
    useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleOutsideClick(
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
      handleOutsideClick
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );
    };
  }, [onClose]);

  return (
    <div
      ref={menuRef}
      className="absolute right-4 top-11 z-30 w-48 rounded-lg border border-neutral-200 bg-white p-1 text-left shadow-lg"
    >
      <button
        type="button"
        onClick={onEdit}
        className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-50"
      >
        <Pencil size={15} />
        Edit Branch
      </button>

      <button
        type="button"
        onClick={onStatusChange}
        className={`flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm ${
          branch.status === "Active"
            ? "text-red-600 hover:bg-red-50"
            : "text-green-700 hover:bg-green-50"
        }`}
      >
        {branch.status === "Active" ? (
          <>
            <PowerOff size={15} />
            Deactivate Branch
          </>
        ) : (
          <>
            <Power size={15} />
            Activate Branch
          </>
        )}
      </button>
    </div>
  );
}

function StatusBadge({
  status,
}: {
  status: BranchStatus;
}) {
  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${
        status === "Active"
          ? "border-green-200 bg-green-50 text-green-700"
          : "border-neutral-200 bg-neutral-50 text-neutral-500"
      }`}
    >
      {status}
    </span>
  );
}

function generateBranchId(
  branches: Branch[]
) {
  const maxNumber = branches.reduce(
    (max, branch) => {
      const number = Number(
        branch.id.replace(/\D/g, "")
      );

      return Number.isFinite(number)
        ? Math.max(max, number)
        : max;
    },
    0
  );

  return `BR${String(
    maxNumber + 1
  ).padStart(3, "0")}`;
}

const thClass =
  "px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-neutral-500";

const tdClass =
  "px-4 py-3.5 text-sm text-neutral-600";

const labelClass =
  "mb-1.5 block text-sm font-medium text-neutral-700";

const inputClass =
  "h-10 w-full rounded-lg border border-neutral-200 bg-white px-3 text-sm text-neutral-800 outline-none transition focus:border-blue-300 focus:ring-2 focus:ring-blue-50";