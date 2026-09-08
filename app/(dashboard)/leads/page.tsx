"use client";

import {
  CalendarDays,
  Download,
  EllipsisVertical,
  MessageSquareMore,
  Plus,
  UserCheck,
  UsersRound,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

type Source =
  | "Walk-in"
  | "Pamphlet"
  | "Social Media"
  | "Referral"
  | "Other";

type Enquiry = {
  enquiryId: string;
  date: string;
  name: string;
  contact: string;
  email: string;
  guardianName: string;
  guardianContact: string;
  qualification: string;
  course: string;
  source: Source;
  referralName?: string;
  followUpDate?: string;
  committedFee: number;
  remark: string;
};

const sampleEnquiries: Enquiry[] = [
  {
    enquiryId: "ENQ001",
    date: "2026-09-05",
    name: "Arun Kumar",
    contact: "9876543210",
    email: "arun@example.com",
    guardianName: "Ramesh",
    guardianContact: "9876500001",
    qualification: "B.E",
    course: "Full Stack Development",
    source: "Walk-in",
    followUpDate: "2026-09-08",
    committedFee: 30000,
    remark: "Interested",
  },
  {
    enquiryId: "ENQ002",
    date: "2026-09-04",
    name: "Karthik R",
    contact: "9876543211",
    email: "karthik@example.com",
    guardianName: "Rajendran",
    guardianContact: "9876500002",
    qualification: "B.Sc",
    course: "Python Programming",
    source: "Referral",
    referralName: "Siva Kumar",
    followUpDate: "2026-09-09",
    committedFee: 25000,
    remark: "Call after 5 PM",
  },
  {
    enquiryId: "ENQ003",
    date: "2026-09-03",
    name: "Priya S",
    contact: "9876543212",
    email: "priya@example.com",
    guardianName: "Sundar",
    guardianContact: "9876500003",
    qualification: "B.Com",
    course: "Beautician",
    source: "Social Media",
    followUpDate: "2026-09-10",
    committedFee: 20000,
    remark: "Requested details",
  },
  {
    enquiryId: "ENQ004",
    date: "2026-09-02",
    name: "Suresh M",
    contact: "9876543213",
    email: "suresh@example.com",
    guardianName: "Murugan",
    guardianContact: "9876500004",
    qualification: "BCA",
    course: "Data Analytics",
    source: "Pamphlet",
    followUpDate: "2026-09-11",
    committedFee: 35000,
    remark: "Follow up",
  },
  {
    enquiryId: "ENQ005",
    date: "2026-09-01",
    name: "Deepa R",
    contact: "9876543214",
    email: "deepa@example.com",
    guardianName: "Ravi",
    guardianContact: "9876500005",
    qualification: "B.Sc",
    course: "Fashion Designing",
    source: "Social Media",
    followUpDate: "",
    committedFee: 30000,
    remark: "Interested",
  },
  {
    enquiryId: "ENQ006",
    date: "2026-08-30",
    name: "Vignesh K",
    contact: "9876543215",
    email: "vignesh@example.com",
    guardianName: "Kumar",
    guardianContact: "9876500006",
    qualification: "B.E",
    course: "Java Full Stack Development",
    source: "Walk-in",
    followUpDate: "",
    committedFee: 40000,
    remark: "Need batch timing",
  },
  {
    enquiryId: "ENQ007",
    date: "2026-08-28",
    name: "Nandhini P",
    contact: "9876543216",
    email: "nandhini@example.com",
    guardianName: "Prakash",
    guardianContact: "9876500007",
    qualification: "HSC",
    course: "Beautician",
    source: "Referral",
    referralName: "Deepa R",
    followUpDate: "",
    committedFee: 22000,
    remark: "Parents discussion pending",
  },
  {
    enquiryId: "ENQ008",
    date: "2026-08-25",
    name: "Ajith R",
    contact: "9876543217",
    email: "ajith@example.com",
    guardianName: "Rajan",
    guardianContact: "9876500008",
    qualification: "B.Tech",
    course: "Web Development",
    source: "Other",
    followUpDate: "",
    committedFee: 28000,
    remark: "Website enquiry",
  },
  {
    enquiryId: "ENQ009",
    date: "2026-08-22",
    name: "Keerthana S",
    contact: "9876543218",
    email: "keerthana@example.com",
    guardianName: "Selvam",
    guardianContact: "9876500009",
    qualification: "B.Com",
    course: "Fashion Designing",
    source: "Social Media",
    followUpDate: "",
    committedFee: 32000,
    remark: "Interested",
  },
  {
    enquiryId: "ENQ010",
    date: "2026-08-20",
    name: "Mohamed Irfan",
    contact: "9876543219",
    email: "irfan@example.com",
    guardianName: "Abdul Rahman",
    guardianContact: "9876500010",
    qualification: "BCA",
    course: "UI/UX Designing",
    source: "Pamphlet",
    followUpDate: "",
    committedFee: 30000,
    remark: "Need fee details",
  },
];

function formatDate(value?: string) {
  if (!value) return "-";

  const [year, month, day] = value.split("-");
  if (!year || !month || !day) return value;

  return `${day}-${month}-${year}`;
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value || 0);
}

function getMonthKey(value: string) {
  return value?.slice(0, 7) || "";
}

export default function LeadsPage() {
  const router = useRouter();

  const [enquiries, setEnquiries] = useState<Enquiry[]>(sampleEnquiries);
  const [search, setSearch] = useState("");
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    try {
      const saved = JSON.parse(
        localStorage.getItem("jet-mis-enquiries") || "[]"
      ) as Enquiry[];

      if (Array.isArray(saved) && saved.length) {
        const merged = [...sampleEnquiries];

        saved.forEach((savedItem) => {
          const index = merged.findIndex(
            (item) => item.enquiryId === savedItem.enquiryId
          );

          if (index >= 0) merged[index] = savedItem;
          else merged.push(savedItem);
        });

        setEnquiries(merged);
      }
    } catch {
      setEnquiries(sampleEnquiries);
    }
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setOpenMenuId(null);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredEnquiries = useMemo(() => {
    const term = search.trim().toLowerCase();

    if (!term) return enquiries;

    return enquiries.filter((item) =>
      [
        item.enquiryId,
        item.name,
        item.contact,
        item.course,
        item.source,
        item.referralName || "",
        item.remark,
      ].some((value) => value.toLowerCase().includes(term))
    );
  }, [enquiries, search]);

  const thisMonth = new Date().toISOString().slice(0, 7);

  const totalEnquiries = enquiries.length;
  const enquiriesThisMonth = enquiries.filter(
    (item) => getMonthKey(item.date) === thisMonth
  ).length;

  const admissionsThisMonth = useMemo(() => {
    try {
      const admissions = JSON.parse(
        localStorage.getItem("jet-mis-admissions") || "[]"
      );

      if (!Array.isArray(admissions)) return 0;

      return admissions.filter(
        (item) =>
          typeof item?.admissionDate === "string" &&
          getMonthKey(item.admissionDate) === thisMonth
      ).length;
    } catch {
      return 0;
    }
  }, [thisMonth]);

  function persistCustomEnquiries(next: Enquiry[]) {
    const sampleIds = new Set(sampleEnquiries.map((item) => item.enquiryId));
    const custom = next.filter(
      (item) =>
        !sampleIds.has(item.enquiryId) ||
        JSON.stringify(
          sampleEnquiries.find((sample) => sample.enquiryId === item.enquiryId)
        ) !== JSON.stringify(item)
    );

    localStorage.setItem("jet-mis-enquiries", JSON.stringify(custom));
  }

  function deleteEnquiry(item: Enquiry) {
    if (!window.confirm(`Delete enquiry ${item.enquiryId}?`)) return;

    const next = enquiries.filter(
      (enquiry) => enquiry.enquiryId !== item.enquiryId
    );

    setEnquiries(next);
    persistCustomEnquiries(next);
    setOpenMenuId(null);
    alert("Enquiry deleted successfully.");
  }

  function editEnquiry(item: Enquiry) {
    setOpenMenuId(null);
    router.push(`/leads/edit-enquiry?id=${encodeURIComponent(item.enquiryId)}`);
  }

  function convertToAdmission(item: Enquiry) {
    setOpenMenuId(null);

    const params = new URLSearchParams({
      enquiryId: item.enquiryId,
      name: item.name,
      contact: item.contact,
      email: item.email || "",
      guardianName: item.guardianName || "",
      guardianContact: item.guardianContact || "",
      qualification: item.qualification || "",
      course: item.course || "",
      committedFee: String(item.committedFee || 0),
    });

    router.push(`/leads/new-admission?${params.toString()}`);
  }

  function exportExcel() {
    const headers = [
      "Enquiry ID",
      "Enquiry Date",
      "Candidate Name",
      "Contact No",
      "Email",
      "Course Interested",
      "Source",
      "Referral Name",
      "Follow-up Date",
      "Committed Fee",
      "Remark",
    ];

    const rows = filteredEnquiries.map((item) => [
      item.enquiryId,
      item.date,
      item.name,
      item.contact,
      item.email,
      item.course,
      item.source,
      item.referralName || "",
      item.followUpDate || "",
      item.committedFee,
      item.remark,
    ]);

    const csv = [headers, ...rows]
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
    link.download = `JET-MIS-Enquiries-${new Date()
      .toISOString()
      .slice(0, 10)}.csv`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  const summaryCards = [
    {
      title: "Total Enquiries",
      value: totalEnquiries,
      icon: UsersRound,
      card: "border-blue-100 bg-blue-50/50",
      iconStyle: "bg-blue-100 text-blue-600",
    },
    {
      title: "Enquiries This Month",
      value: enquiriesThisMonth,
      icon: MessageSquareMore,
      card: "border-blue-100 bg-blue-50/50",
      iconStyle: "bg-blue-100 text-blue-600",
    },
    {
      title: "Admissions This Month",
      value: admissionsThisMonth,
      icon: UserCheck,
      card: "border-green-100 bg-green-50/50",
      iconStyle: "bg-green-100 text-green-600",
    },
  ];

  return (
    <div className="min-h-screen bg-white p-6 lg:p-8">
      <h1 className="text-2xl font-semibold tracking-tight text-neutral-900">
        Lead Management
      </h1>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {summaryCards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.title}
              className={`rounded-xl border p-5 ${card.card}`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-neutral-500">
                    {card.title}
                  </p>
                  <p className="mt-3 text-2xl font-semibold text-neutral-900">
                    {card.value}
                  </p>
                </div>

                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-lg ${card.iconStyle}`}
                >
                  <Icon size={20} strokeWidth={1.8} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 overflow-hidden rounded-xl border border-neutral-200 bg-white">
        <div className="flex flex-wrap items-center gap-3 border-b border-neutral-200 px-5 py-4">
          <h2 className="mr-auto text-base font-semibold text-neutral-900">
            Enquiries ({filteredEnquiries.length})
          </h2>

          <div className="relative min-w-[260px] flex-1 md:max-w-[420px]">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search enquiries..."
              className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <button
            type="button"
            onClick={() => router.push("/leads/new-enquiry")}
            className="inline-flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 transition hover:bg-blue-100"
          >
            <Plus size={16} strokeWidth={1.8} />
            New Enquiry
          </button>

          <button
            type="button"
            onClick={exportExcel}
            className="inline-flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-4 py-2 text-sm font-medium text-green-700 transition hover:bg-green-100"
          >
            <Download size={16} strokeWidth={1.8} />
            Excel
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full table-fixed text-left text-sm">
            <thead className="border-b border-neutral-200 bg-neutral-50/80 text-xs font-medium uppercase tracking-wide text-neutral-500">
              <tr>
                <th className="w-[9%] px-3 py-3">Enquiry Date</th>
                <th className="w-[13%] px-3 py-3">Candidate Name</th>
                <th className="w-[10%] px-3 py-3">Contact No</th>
                <th className="w-[16%] px-3 py-3">Course Interested</th>
                <th className="w-[12%] px-3 py-3">Source</th>
                <th className="w-[11%] px-3 py-3">Follow-up Date</th>
                <th className="w-[11%] px-3 py-3 text-right">Committed Fee</th>
                <th className="w-[14%] px-3 py-3">Remark</th>
                <th
                  className="w-[60px] px-3 py-3"
                  aria-label="Row actions"
                />
              </tr>
            </thead>

            <tbody>
              {filteredEnquiries.map((item) => (
                <tr
                  key={item.enquiryId}
                  onContextMenu={(event) => {
                    event.preventDefault();

                    const menuWidth = 208;
                    const menuHeight = 145;
                    const gap = 8;

                    const left = Math.min(
                      event.clientX,
                      window.innerWidth - menuWidth - gap
                    );

                    const top = Math.min(
                      event.clientY,
                      window.innerHeight - menuHeight - gap
                    );

                    setMenuPosition({
                      top: Math.max(gap, top),
                      left: Math.max(gap, left),
                    });
                    setOpenMenuId(item.enquiryId);
                  }}
                  className="border-b border-neutral-100 last:border-0 hover:bg-blue-50/30"
                >
                  <td className="whitespace-nowrap px-3 py-3.5">
                    {formatDate(item.date)}
                  </td>

                  <td className="px-3 py-3.5 font-medium text-neutral-900">
                    {item.name}
                  </td>

                  <td className="whitespace-nowrap px-3 py-3.5">
                    {item.contact}
                  </td>

                  <td className="break-words px-3 py-3.5 leading-5">
                    {item.course}
                  </td>

                  <td className="break-words px-3 py-3.5 leading-5">
                    <div>{item.source}</div>
                    {item.source === "Referral" &&
                      item.referralName && (
                        <div className="mt-0.5 text-xs text-neutral-500">
                          {item.referralName}
                        </div>
                      )}
                  </td>

                  <td className="whitespace-nowrap px-3 py-3.5">
                    {item.followUpDate ? (
                      <span className="inline-flex items-center gap-1.5">
                        <CalendarDays
                          size={14}
                          className="text-blue-500"
                        />
                        {formatDate(item.followUpDate)}
                      </span>
                    ) : (
                      "-"
                    )}
                  </td>

                  <td className="whitespace-nowrap px-3 py-3.5 text-right">
                    {formatCurrency(item.committedFee)}
                  </td>

                  <td className="whitespace-normal break-words px-3 py-3.5 align-top leading-5 text-neutral-600">
                    {item.remark || "-"}
                  </td>

                  <td className="relative w-[60px] px-3 py-3.5 text-center">
                    <button
                      type="button"
                      onClick={(event) => {
                        if (openMenuId === item.enquiryId) {
                          setOpenMenuId(null);
                          return;
                        }

                        const rect =
                          event.currentTarget.getBoundingClientRect();
                        const menuWidth = 208;
                        const menuHeight = 145;
                        const gap = 6;

                        let left = rect.right - menuWidth;
                        left = Math.max(
                          gap,
                          Math.min(left, window.innerWidth - menuWidth - gap)
                        );

                        let top = rect.bottom + gap;

                        // For the last rows, open upward instead of creating
                        // a vertical scrollbar inside the table container.
                        if (
                          top + menuHeight >
                          window.innerHeight - gap
                        ) {
                          top = rect.top - menuHeight - gap;
                        }

                        setMenuPosition({
                          top: Math.max(gap, top),
                          left,
                        });
                        setOpenMenuId(item.enquiryId);
                      }}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-md text-neutral-500 transition hover:bg-neutral-100 hover:text-neutral-900"
                      aria-label={`Actions for ${item.name}`}
                    >
                      <EllipsisVertical size={18} />
                    </button>

                    {openMenuId === item.enquiryId && (
                      <div
                        ref={menuRef}
                        style={{
                          top: menuPosition.top,
                          left: menuPosition.left,
                        }}
                        className="fixed z-50 w-52 rounded-xl border border-neutral-200 bg-white p-1.5 text-left shadow-lg"
                      >
                        <button
                          type="button"
                          onClick={() => editEnquiry(item)}
                          className="w-full rounded-lg px-3 py-2 text-left text-sm text-blue-700 hover:bg-blue-50"
                        >
                          Edit Enquiry
                        </button>

                        <button
                          type="button"
                          onClick={() => convertToAdmission(item)}
                          className="w-full rounded-lg px-3 py-2 text-left text-sm text-green-700 hover:bg-green-50"
                        >
                          Convert to Admission
                        </button>

                        <div className="my-1 border-t border-neutral-100" />

                        <button
                          type="button"
                          onClick={() => deleteEnquiry(item)}
                          className="w-full rounded-lg px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                        >
                          Delete Enquiry
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}

              {!filteredEnquiries.length && (
                <tr>
                  <td
                    colSpan={9}
                    className="px-4 py-12 text-center text-neutral-500"
                  >
                    No enquiries found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
