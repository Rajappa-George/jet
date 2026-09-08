"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import {
  BarChart3,
  BookOpen,
  ChevronDown,
  ChevronRight,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Settings,
  UserRound,
  UserRoundCog,
  UsersRound,
} from "lucide-react";

type DashboardLayoutProps = {
  children: ReactNode;
};

type MenuKey =
  | "students"
  | "batches"
  | "content"
  | "settings";

const menuItems = {
  students: [
    {
      label: "Student Data",
      href: "/students",
    },
    {
      label: "Fees Details",
      href: "/students/fees",
    },
  ],

  batches: [
    {
      label: "All",
      href: "/batches",
    },
    {
      label: "Completed",
      href: "/batches/completed",
    },
    {
      label: "Ongoing",
      href: "/batches/ongoing",
    },
  ],

  content: [
    {
      label: "Courses",
      href: "/content/courses",
    },
    {
      label: "Course Contents",
      href: "/content/course-contents",
    },
  ],

  settings: [
    {
      label: "Monthly Target",
      href: "/settings/monthly-target",
    },
    {
      label: "Users & Roles",
      href: "/settings/users",
    },
    {
      label: "Branches",
      href: "/settings/branches",
    },
  ],
};

export default function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();

  const [openMenus, setOpenMenus] = useState<
    Record<MenuKey, boolean>
  >({
    students: false,
    batches: false,
    content: false,
    settings: false,
  });

  useEffect(() => {
    setOpenMenus((current) => ({
      ...current,

      students:
        pathname.startsWith("/students") ||
        current.students,

      batches:
        pathname.startsWith("/batches") ||
        current.batches,

      content:
        pathname.startsWith("/content") ||
        current.content,

      settings:
        pathname.startsWith("/settings") ||
        current.settings,
    }));
  }, [pathname]);

  function toggleMenu(menu: MenuKey) {
    setOpenMenus((current) => ({
      ...current,
      [menu]: !current[menu],
    }));
  }

  function isActive(href: string) {
    if (href === "/dashboard") {
      return pathname === "/dashboard";
    }

    return (
      pathname === href ||
      pathname.startsWith(`${href}/`)
    );
  }

  function handleLogout() {
    router.push("/login");
  }

  return (
    <div className="flex min-h-screen bg-neutral-50">
      {/* SIDEBAR */}
      <aside className="sticky top-0 flex h-screen w-64 shrink-0 flex-col border-r border-neutral-200 bg-white">
        {/* BRAND */}
        <div className="shrink-0 border-b border-neutral-200 px-5 py-5">
          <div className="flex items-center gap-3">
            <img
              src="/jet/icon.png"
              alt="JET Skills Logo"
              className="h-12 w-auto shrink-0 object-contain"
            />

            <div>
              <div className="text-lg font-semibold text-neutral-900">
                JET MIS
              </div>

              <div className="text-xs text-neutral-500">
                Institute Management
              </div>
            </div>
          </div>
        </div>

        {/* NAVIGATION */}
        <nav className="min-h-0 flex-1 overflow-y-auto px-3 py-5">
          <div className="space-y-1">
            {/* DASHBOARD */}
            <SidebarLink
              href="/dashboard"
              label="Dashboard"
              icon={
                <LayoutDashboard size={18} />
              }
              active={isActive("/dashboard")}
            />

            {/* LEADS */}
            <SidebarLink
              href="/leads"
              label="Lead Management"
              icon={<UsersRound size={18} />}
              active={isActive("/leads")}
            />

            {/* STUDENT MANAGEMENT */}
            <SidebarParent
              label="Student Management"
              icon={
                <GraduationCap size={18} />
              }
              open={openMenus.students}
              active={pathname.startsWith(
                "/students",
              )}
              onClick={() =>
                toggleMenu("students")
              }
            />

            {openMenus.students && (
              <ChildMenu>
                {menuItems.students.map(
                  (item) => (
                    <ChildLink
                      key={item.href}
                      href={item.href}
                      label={item.label}
                      active={
                        pathname ===
                        item.href
                      }
                    />
                  ),
                )}
              </ChildMenu>
            )}

            {/* BATCH MANAGEMENT */}
            <SidebarParent
              label="Batch Management"
              icon={
                <UsersRound size={18} />
              }
              open={openMenus.batches}
              active={pathname.startsWith(
                "/batches",
              )}
              onClick={() =>
                toggleMenu("batches")
              }
            />

            {openMenus.batches && (
              <ChildMenu>
                {menuItems.batches.map(
                  (item) => (
                    <ChildLink
                      key={item.href}
                      href={item.href}
                      label={item.label}
                      active={
                        pathname ===
                        item.href
                      }
                    />
                  ),
                )}
              </ChildMenu>
            )}

            {/* CONTENT MANAGEMENT */}
            <SidebarParent
              label="Content Management"
              icon={<BookOpen size={18} />}
              open={openMenus.content}
              active={pathname.startsWith(
                "/content",
              )}
              onClick={() =>
                toggleMenu("content")
              }
            />

            {openMenus.content && (
              <ChildMenu>
                {menuItems.content.map(
                  (item) => (
                    <ChildLink
                      key={item.href}
                      href={item.href}
                      label={item.label}
                      active={
                        pathname ===
                        item.href
                      }
                    />
                  ),
                )}
              </ChildMenu>
            )}

            {/* STAFF */}
            <SidebarLink
              href="/staff"
              label="Staff Management"
              icon={
                <UserRoundCog size={18} />
              }
              active={isActive("/staff")}
            />

            {/* REPORTS */}
            <SidebarLink
              href="/reports"
              label="Reports"
              icon={<BarChart3 size={18} />}
              active={isActive("/reports")}
            />

            {/* SETTINGS */}
            <SidebarParent
              label="Settings"
              icon={<Settings size={18} />}
              open={openMenus.settings}
              active={pathname.startsWith(
                "/settings",
              )}
              onClick={() =>
                toggleMenu("settings")
              }
            />

            {openMenus.settings && (
              <ChildMenu>
                {menuItems.settings.map(
                  (item) => (
                    <ChildLink
                      key={item.href}
                      href={item.href}
                      label={item.label}
                      active={
                        pathname ===
                        item.href
                      }
                    />
                  ),
                )}
              </ChildMenu>
            )}
          </div>
        </nav>

        {/* USER / LOGOUT */}
        <div className="shrink-0 border-t border-neutral-200 p-3">
          <div className="mb-2 flex items-center gap-3 rounded-lg px-3 py-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-neutral-100 text-neutral-600">
              <UserRound size={18} />
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-neutral-900">
                Admin
              </p>

              <p className="truncate text-xs text-neutral-500">
                Administrator
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg border border-red-100 bg-red-50 px-3 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-100"
          >
            <LogOut size={17} />
            Logout
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="min-w-0 flex-1">
        {children}
      </main>
    </div>
  );
}

function SidebarLink({
  href,
  label,
  icon,
  active,
}: {
  href: string;
  label: string;
  icon: ReactNode;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
        active
          ? "bg-blue-50 text-blue-700"
          : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900"
      }`}
    >
      <span
        className={
          active
            ? "text-blue-600"
            : "text-neutral-400"
        }
      >
        {icon}
      </span>

      <span>{label}</span>
    </Link>
  );
}

function SidebarParent({
  label,
  icon,
  open,
  active,
  onClick,
}: {
  label: string;
  icon: ReactNode;
  open: boolean;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition ${
        active
          ? "bg-blue-50 text-blue-700"
          : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900"
      }`}
    >
      <span
        className={
          active
            ? "text-blue-600"
            : "text-neutral-400"
        }
      >
        {icon}
      </span>

      <span className="flex-1">
        {label}
      </span>

      {open ? (
        <ChevronDown size={16} />
      ) : (
        <ChevronRight size={16} />
      )}
    </button>
  );
}

function ChildMenu({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="ml-5 mt-1 space-y-1 border-l border-neutral-200 pl-4">
      {children}
    </div>
  );
}

function ChildLink({
  href,
  label,
  active,
}: {
  href: string;
  label: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={`block rounded-md px-3 py-2 text-sm transition ${
        active
          ? "bg-blue-50 font-medium text-blue-700"
          : "text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900"
      }`}
    >
      {label}
    </Link>
  );
}