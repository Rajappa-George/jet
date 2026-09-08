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

type UserRole =
  | "Super Admin"
  | "Admin"
  | "Branch Manager"
  | "Staff";

type UserStatus = "Active" | "Inactive";

type UserRecord = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  branch: string;
  status: UserStatus;
};

const branches = [
  "All Branches",
  "Ariyalur",
  "Guduvancherry",
  "Mayiladuthurai",
  "Perambalur",
  "Thanjavur",
  "Tiruchirappalli",
];

const roles: UserRole[] = [
  "Super Admin",
  "Admin",
  "Branch Manager",
  "Staff",
];

const initialUsers: UserRecord[] = [
  {
    id: "USR001",
    name: "Admin",
    email: "admin@jetmis.in",
    role: "Super Admin",
    branch: "All Branches",
    status: "Active",
  },
  {
    id: "USR002",
    name: "Ariyalur Manager",
    email: "ariyalur@jetmis.in",
    role: "Branch Manager",
    branch: "Ariyalur",
    status: "Active",
  },
  {
    id: "USR003",
    name: "Trichy Manager",
    email: "trichy@jetmis.in",
    role: "Branch Manager",
    branch: "Tiruchirappalli",
    status: "Active",
  },
  {
    id: "USR004",
    name: "Thanjavur Staff",
    email: "thanjavur.staff@jetmis.in",
    role: "Staff",
    branch: "Thanjavur",
    status: "Inactive",
  },
];

export default function UsersPage() {
  const [users, setUsers] =
    useState<UserRecord[]>(initialUsers);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState("All");

  const [formOpen, setFormOpen] =
    useState(false);

  const [editingUser, setEditingUser] =
    useState<UserRecord | null>(null);

  const [openMenuId, setOpenMenuId] =
    useState<string | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(
        "jet-mis-users",
      );

      if (!saved) return;

      const parsed = JSON.parse(saved);

      if (Array.isArray(parsed)) {
        setUsers(parsed);
      }
    } catch {
      // Keep sample data if localStorage is invalid.
    }
  }, []);

  function persistUsers(
    nextUsers: UserRecord[],
  ) {
    setUsers(nextUsers);

    localStorage.setItem(
      "jet-mis-users",
      JSON.stringify(nextUsers),
    );
  }

  const filteredUsers = useMemo(() => {
    const keyword =
      search.trim().toLowerCase();

    return users.filter((user) => {
      const matchesSearch =
        !keyword ||
        user.name
          .toLowerCase()
          .includes(keyword) ||
        user.email
          .toLowerCase()
          .includes(keyword) ||
        user.role
          .toLowerCase()
          .includes(keyword) ||
        user.branch
          .toLowerCase()
          .includes(keyword);

      const matchesStatus =
        statusFilter === "All" ||
        user.status === statusFilter;

      return (
        matchesSearch &&
        matchesStatus
      );
    });
  }, [users, search, statusFilter]);

  function openAddUser() {
    setEditingUser(null);
    setOpenMenuId(null);
    setFormOpen(true);
  }

  function openEditUser(
    user: UserRecord,
  ) {
    setEditingUser(user);
    setOpenMenuId(null);
    setFormOpen(true);
  }

  function toggleUserStatus(
    user: UserRecord,
  ) {
    const nextStatus: UserStatus =
      user.status === "Active"
        ? "Inactive"
        : "Active";

    const nextUsers = users.map(
      (item) =>
        item.id === user.id
          ? {
              ...item,
              status: nextStatus,
            }
          : item,
    );

    persistUsers(nextUsers);
    setOpenMenuId(null);
  }

  function saveUser(
    data: Omit<
      UserRecord,
      "id" | "status"
    >,
  ) {
    if (editingUser) {
      const nextUsers = users.map(
        (user) =>
          user.id === editingUser.id
            ? {
                ...user,
                ...data,
              }
            : user,
      );

      persistUsers(nextUsers);
    } else {
      const newUser: UserRecord = {
        id: generateUserId(users),
        ...data,
        status: "Active",
      };

      persistUsers([
        ...users,
        newUser,
      ]);
    }

    setFormOpen(false);
    setEditingUser(null);
  }

  return (
    <div className="min-h-full bg-white p-6">
      {/* HEADER */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-neutral-900">
            Users & Roles
          </h1>

          <p className="mt-1 text-sm text-neutral-500">
            Manage MIS users, roles and
            branch access.
          </p>
        </div>

        <button
          type="button"
          onClick={openAddUser}
          className="inline-flex h-10 items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-4 text-sm font-medium text-blue-700 transition hover:bg-blue-100"
        >
          <Plus size={16} />
          Add User
        </button>
      </div>

      {/* TOOLBAR */}
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <input
          type="text"
          value={search}
          onChange={(event) =>
            setSearch(event.target.value)
          }
          placeholder="Search name, email, role or branch..."
          className="h-10 min-w-[280px] flex-1 rounded-lg border border-neutral-200 bg-white px-3 text-sm text-neutral-800 outline-none transition focus:border-blue-300 focus:ring-2 focus:ring-blue-50"
        />

        <select
          value={statusFilter}
          onChange={(event) =>
            setStatusFilter(
              event.target.value,
            )
          }
          className="h-10 rounded-lg border border-neutral-200 bg-white px-3 text-sm text-neutral-700 outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-50"
        >
          <option value="All">
            All Status
          </option>
          <option value="Active">
            Active
          </option>
          <option value="Inactive">
            Inactive
          </option>
        </select>
      </div>

      {/* TABLE */}
      <div className="overflow-visible rounded-lg border border-neutral-200 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead>
              <tr className="bg-neutral-50">
                <th className={thClass}>
                  Name
                </th>

                <th className={thClass}>
                  Email
                </th>

                <th className={thClass}>
                  Role
                </th>

                <th className={thClass}>
                  Branch
                </th>

                <th className={thClass}>
                  Status
                </th>

                <th className="w-14 px-4 py-3" />
              </tr>
            </thead>

            <tbody>
              {filteredUsers.length >
              0 ? (
                filteredUsers.map(
                  (user) => (
                    <tr
                      key={user.id}
                      className="border-t border-neutral-100 transition hover:bg-blue-50/30"
                    >
                      <td className={tdClass}>
                        <div className="font-medium text-neutral-900">
                          {user.name}
                        </div>

                        <div className="mt-0.5 text-xs text-neutral-400">
                          {user.id}
                        </div>
                      </td>

                      <td className={tdClass}>
                        {user.email}
                      </td>

                      <td className={tdClass}>
                        {user.role}
                      </td>

                      <td className={tdClass}>
                        {user.branch}
                      </td>

                      <td className={tdClass}>
                        <StatusBadge
                          status={
                            user.status
                          }
                        />
                      </td>

                      <td className="relative px-4 py-3 text-right">
                        <button
                          type="button"
                          onClick={() =>
                            setOpenMenuId(
                              openMenuId ===
                                user.id
                                ? null
                                : user.id,
                            )
                          }
                          className="inline-flex h-8 w-8 items-center justify-center rounded-md text-neutral-500 transition hover:bg-neutral-100 hover:text-neutral-800"
                          aria-label="User actions"
                        >
                          <MoreVertical
                            size={18}
                          />
                        </button>

                        {openMenuId ===
                          user.id && (
                          <ActionMenu
                            user={user}
                            onEdit={() =>
                              openEditUser(
                                user,
                              )
                            }
                            onStatusChange={() =>
                              toggleUserStatus(
                                user,
                              )
                            }
                            onClose={() =>
                              setOpenMenuId(
                                null,
                              )
                            }
                          />
                        )}
                      </td>
                    </tr>
                  ),
                )
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-12 text-center text-sm text-neutral-500"
                  >
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {formOpen && (
        <UserFormModal
          user={editingUser}
          onClose={() => {
            setFormOpen(false);
            setEditingUser(null);
          }}
          onSave={saveUser}
        />
      )}
    </div>
  );
}

function UserFormModal({
  user,
  onClose,
  onSave,
}: {
  user: UserRecord | null;
  onClose: () => void;
  onSave: (
    data: Omit<
      UserRecord,
      "id" | "status"
    >,
  ) => void;
}) {
  const [name, setName] = useState(
    user?.name ?? "",
  );

  const [email, setEmail] = useState(
    user?.email ?? "",
  );

  const [role, setRole] =
    useState<UserRole>(
      user?.role ?? "Staff",
    );

  const [branch, setBranch] =
    useState(
      user?.branch ?? "",
    );

  const [error, setError] =
    useState("");

  function handleRoleChange(
    nextRole: UserRole,
  ) {
    setRole(nextRole);

    if (
      nextRole === "Super Admin" ||
      nextRole === "Admin"
    ) {
      setBranch("All Branches");
    } else if (
      branch === "All Branches"
    ) {
      setBranch("");
    }
  }

  function submit() {
    const cleanName = name.trim();
    const cleanEmail =
      email.trim().toLowerCase();

    if (
      !cleanName ||
      !cleanEmail ||
      !role ||
      !branch
    ) {
      setError(
        "Please fill all required fields.",
      );
      return;
    }

    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        cleanEmail,
      )
    ) {
      setError(
        "Please enter a valid email address.",
      );
      return;
    }

    onSave({
      name: cleanName,
      email: cleanEmail,
      role,
      branch,
    });
  }

  const allBranchAccess =
    role === "Super Admin" ||
    role === "Admin";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/25 p-4">
      <div className="w-full max-w-lg rounded-xl border border-neutral-200 bg-white shadow-xl">
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-neutral-200 px-5 py-4">
          <div>
            <h2 className="font-semibold text-neutral-900">
              {user
                ? "Edit User"
                : "Add User"}
            </h2>

            <p className="mt-1 text-sm text-neutral-500">
              Configure user access and
              role.
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
        <div className="space-y-4 p-5">
          <div>
            <label
              className={labelClass}
            >
              Name
            </label>

            <input
              type="text"
              value={name}
              onChange={(event) =>
                setName(
                  event.target.value,
                )
              }
              placeholder="Enter user name"
              className={inputClass}
            />
          </div>

          <div>
            <label
              className={labelClass}
            >
              Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(event) =>
                setEmail(
                  event.target.value,
                )
              }
              placeholder="Enter email address"
              className={inputClass}
            />
          </div>

          <div>
            <label
              className={labelClass}
            >
              Role
            </label>

            <select
              value={role}
              onChange={(event) =>
                handleRoleChange(
                  event.target
                    .value as UserRole,
                )
              }
              className={inputClass}
            >
              {roles.map((item) => (
                <option
                  key={item}
                  value={item}
                >
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              className={labelClass}
            >
              Branch
            </label>

            <select
              value={branch}
              disabled={allBranchAccess}
              onChange={(event) =>
                setBranch(
                  event.target.value,
                )
              }
              className={`${inputClass} disabled:cursor-not-allowed disabled:bg-neutral-50 disabled:text-neutral-500`}
            >
              <option value="">
                Select Branch
              </option>

              {branches
                .filter(
                  (item) =>
                    allBranchAccess ||
                    item !==
                      "All Branches",
                )
                .map((item) => (
                  <option
                    key={item}
                    value={item}
                  >
                    {item}
                  </option>
                ))}
            </select>
          </div>

          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          )}
        </div>

        {/* FOOTER */}
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
            {user
              ? "Save Changes"
              : "Add User"}
          </button>
        </div>
      </div>
    </div>
  );
}

function ActionMenu({
  user,
  onEdit,
  onStatusChange,
  onClose,
}: {
  user: UserRecord;
  onEdit: () => void;
  onStatusChange: () => void;
  onClose: () => void;
}) {
  const menuRef =
    useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(
      event: MouseEvent,
    ) {
      if (
        menuRef.current &&
        !menuRef.current.contains(
          event.target as Node,
        )
      ) {
        onClose();
      }
    }

    document.addEventListener(
      "mousedown",
      handleClick,
    );

    return () =>
      document.removeEventListener(
        "mousedown",
        handleClick,
      );
  }, [onClose]);

  return (
    <div
      ref={menuRef}
      className="absolute right-4 top-11 z-30 w-48 rounded-lg border border-neutral-200 bg-white p-1 shadow-lg"
    >
      <button
        type="button"
        onClick={onEdit}
        className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-neutral-700 hover:bg-neutral-50"
      >
        <Pencil size={15} />
        Edit User
      </button>

      <button
        type="button"
        onClick={onStatusChange}
        className={`flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm ${
          user.status === "Active"
            ? "text-red-600 hover:bg-red-50"
            : "text-green-700 hover:bg-green-50"
        }`}
      >
        {user.status === "Active" ? (
          <>
            <PowerOff size={15} />
            Deactivate User
          </>
        ) : (
          <>
            <Power size={15} />
            Activate User
          </>
        )}
      </button>
    </div>
  );
}

function StatusBadge({
  status,
}: {
  status: UserStatus;
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

function generateUserId(
  users: UserRecord[],
) {
  const maxNumber = users.reduce(
    (max, user) => {
      const number = Number(
        user.id.replace(
          /\D/g,
          "",
        ),
      );

      return Number.isFinite(number)
        ? Math.max(max, number)
        : max;
    },
    0,
  );

  return `USR${String(
    maxNumber + 1,
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