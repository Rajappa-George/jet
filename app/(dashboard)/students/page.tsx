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
  FileCheck2,
  GraduationCap,
  MoreVertical,
  Pencil,
  Search,
  UserX,
  X,
} from "lucide-react";

import * as XLSX from "xlsx";

/* =========================================================
   TYPES
========================================================= */

type StudentStatus = "Active" | "Completed" | "Dropped";

type CertificateStatus =
  | "N/A"
  | "Pending"
  | "Requested"
  | "Certified";

type LoginRole = "Branch" | "Project Manager" | "Admin";

type Student = {
  admissionId: string;
  admissionDate: string;

  candidateName: string;
  contactNo: string;
  email: string;

  guardianName: string;
  guardianContact: string;

  qualification: string;

  branch: string;
  course: string;

  startDate: string;
  endDate: string;

  source: string;
  referralName: string;

  committedFee: number;
  paidAmount: number;

  status: StudentStatus;
  certificateStatus: CertificateStatus;

  certificateRequestDate?: string;
  certifiedDate?: string;

  remark: string;
};

/* =========================================================
   TEMP ROLE
   Later replace with logged-in user role
========================================================= */

const CURRENT_ROLE: LoginRole = "Branch";

/* =========================================================
   SAMPLE DATA
========================================================= */

const sampleStudents: Student[] = [
  {
    admissionId: "ADM001",
    admissionDate: "2026-07-01",

    candidateName: "Arun Kumar",
    contactNo: "9876543210",
    email: "arun@example.com",

    guardianName: "Kumar",
    guardianContact: "9876500001",

    qualification: "B.E",

    branch: "Tiruchirappalli",
    course: "Full Stack Development",

    startDate: "2026-07-01",
    endDate: "2026-12-31",

    source: "Walk-in",
    referralName: "",

    committedFee: 30000,
    paidAmount: 20000,

    status: "Active",
    certificateStatus: "N/A",

    remark: "Regular attendance",
  },
  {
    admissionId: "ADM002",
    admissionDate: "2026-01-05",

    candidateName: "Priya S",
    contactNo: "9876543211",
    email: "priya@example.com",

    guardianName: "Suresh",
    guardianContact: "9876500002",

    qualification: "B.Sc",

    branch: "Thanjavur",
    course: "Python Programming",

    startDate: "2026-01-10",
    endDate: "2026-06-30",

    source: "Referral",
    referralName: "Karthik",

    committedFee: 25000,
    paidAmount: 25000,

    status: "Completed",
    certificateStatus: "Pending",

    remark: "Course completed",
  },
  {
    admissionId: "ADM003",
    admissionDate: "2026-02-01",

    candidateName: "Vignesh K",
    contactNo: "9876543212",
    email: "vignesh@example.com",

    guardianName: "Kannan",
    guardianContact: "9876500003",

    qualification: "BCA",

    branch: "Ariyalur",
    course: "Web Development",

    startDate: "2026-02-10",
    endDate: "2026-07-10",

    source: "Social Media",
    referralName: "",

    committedFee: 28000,
    paidAmount: 15000,

    status: "Dropped",
    certificateStatus: "N/A",

    remark: "Discontinued",
  },
];

/* =========================================================
   PAGE
========================================================= */

export default function StudentDataPage() {
  const [students, setStudents] =
    useState<Student[]>(sampleStudents);

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] = useState("All");

  const [courseFilter, setCourseFilter] = useState("All");

  const [certificateFilter, setCertificateFilter] =
    useState("All");

  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [currentPage, setCurrentPage] = useState(1);

  const [openMenuId, setOpenMenuId] =
    useState<string | null>(null);

  const [viewStudent, setViewStudent] =
    useState<Student | null>(null);

  const [editStudent, setEditStudent] =
    useState<Student | null>(null);

  /* =======================================================
     LOAD LOCAL STORAGE
  ======================================================= */

  useEffect(() => {
    try {
      const saved = localStorage.getItem("jet-mis-admissions");

      if (!saved) return;

      const parsed = JSON.parse(saved);

      if (!Array.isArray(parsed)) return;

      const mapped: Student[] = parsed.map((item: any) => {
        const status = normalizeStudentStatus(
          item.studentStatus ?? item.status
        );

        return {
          admissionId:
            item.admissionId ??
            item.id ??
            "N/A",

          admissionDate:
            item.admissionDate ?? "",

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

          email:
            item.email ?? "",

          guardianName:
            item.guardianName ?? "",

          guardianContact:
            item.guardianContact ?? "",

          qualification:
            item.qualification ?? "",

          branch:
            item.branch ?? "",

          course:
            item.course ?? "-",

          startDate:
            item.startDate ??
            item.courseStartDate ??
            "",

          endDate:
            item.endDate ??
            item.courseEndDate ??
            "",

          source:
            item.source ?? "",

          referralName:
            item.referralName ?? "",

          committedFee:
            Number(
              item.committedFee ??
                item.totalFee ??
                item.courseFee ??
                0
            ) || 0,

          paidAmount:
            Number(
              item.paidAmount ??
                item.totalPaid ??
                0
            ) || 0,

          status,

          certificateStatus:
            normalizeCertificateStatus(
              item.certificateStatus,
              status
            ),

          certificateRequestDate:
            item.certificateRequestDate ?? "",

          certifiedDate:
            item.certifiedDate ?? "",

          remark:
            item.remark ?? "",
        };
      });

      setStudents(mapped);
    } catch (error) {
      console.error("Student load failed:", error);
    }
  }, []);

  /* =======================================================
     SAVE WITHOUT LOSING OTHER ADMISSION FIELDS
  ======================================================= */

  function persistStudents(nextStudents: Student[]) {
    setStudents(nextStudents);

    try {
      const saved = localStorage.getItem("jet-mis-admissions");

      const originalAdmissions =
        saved && Array.isArray(JSON.parse(saved))
          ? JSON.parse(saved)
          : [];

      const mergedAdmissions = originalAdmissions.length
        ? originalAdmissions.map((original: any) => {
            const changed = nextStudents.find(
              (student) =>
                student.admissionId ===
                (original.admissionId ?? original.id)
            );

            if (!changed) return original;

            return {
              ...original,

              admissionId:
                changed.admissionId,

              admissionDate:
                changed.admissionDate,

              candidateName:
                changed.candidateName,

              name:
                changed.candidateName,

              contactNo:
                changed.contactNo,

              contact:
                changed.contactNo,

              email:
                changed.email,

              guardianName:
                changed.guardianName,

              guardianContact:
                changed.guardianContact,

              qualification:
                changed.qualification,

              branch:
                changed.branch,

              course:
                changed.course,

              startDate:
                changed.startDate,

              endDate:
                changed.endDate,

              source:
                changed.source,

              referralName:
                changed.referralName,

              committedFee:
                changed.committedFee,

              paidAmount:
                changed.paidAmount,

              studentStatus:
                changed.status,

              status:
                changed.status,

              certificateStatus:
                changed.certificateStatus,

              certificateRequestDate:
                changed.certificateRequestDate,

              certifiedDate:
                changed.certifiedDate,

              remark:
                changed.remark,
            };
          })
        : nextStudents;

      localStorage.setItem(
        "jet-mis-admissions",
        JSON.stringify(mergedAdmissions)
      );
    } catch (error) {
      console.error("Student save failed:", error);
    }
  }

  /* =======================================================
     COURSE OPTIONS
  ======================================================= */

  const courseOptions = useMemo(() => {
    return Array.from(
      new Set(
        students
          .map((student) => student.course.trim())
          .filter(Boolean)
      )
    ).sort();
  }, [students]);

  /* =======================================================
     FILTER
  ======================================================= */

  const filteredStudents = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return students.filter((student) => {
      const matchesSearch =
        !keyword ||
        student.admissionId
          .toLowerCase()
          .includes(keyword) ||
        student.candidateName
          .toLowerCase()
          .includes(keyword) ||
        student.contactNo
          .toLowerCase()
          .includes(keyword) ||
        student.course
          .toLowerCase()
          .includes(keyword) ||
        student.remark
          .toLowerCase()
          .includes(keyword);

      const matchesStatus =
        statusFilter === "All" ||
        student.status === statusFilter;

      const matchesCourse =
        courseFilter === "All" ||
        student.course === courseFilter;

      const matchesCertificate =
        certificateFilter === "All" ||
        student.certificateStatus ===
          certificateFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesCourse &&
        matchesCertificate
      );
    });
  }, [
    students,
    search,
    statusFilter,
    courseFilter,
    certificateFilter,
  ]);

  /* =======================================================
     RESET PAGINATION
  ======================================================= */

  useEffect(() => {
    setCurrentPage(1);
  }, [
    search,
    statusFilter,
    courseFilter,
    certificateFilter,
    rowsPerPage,
  ]);

  const totalRows = filteredStudents.length;

  const totalPages = Math.max(
    1,
    Math.ceil(totalRows / rowsPerPage)
  );

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const startIndex =
    (currentPage - 1) * rowsPerPage;

  const endIndex = Math.min(
    startIndex + rowsPerPage,
    totalRows
  );

  const paginatedStudents =
    filteredStudents.slice(
      startIndex,
      endIndex
    );

  /* =======================================================
     MARK COMPLETED / DROPPED
  ======================================================= */

  function markStudentStatus(
    student: Student,
    newStatus: StudentStatus
  ) {
    const nextStudents: Student[] =
      students.map((item) => {
        if (
          item.admissionId !== student.admissionId
        ) {
          return item;
        }

        if (newStatus === "Completed") {
          return {
            ...item,
            status: "Completed",
            certificateStatus:
              item.certificateStatus === "Certified" ||
              item.certificateStatus === "Requested"
                ? item.certificateStatus
                : "Pending",
          };
        }

        if (newStatus === "Dropped") {
          return {
            ...item,
            status: "Dropped",
            certificateStatus: "N/A",
            certificateRequestDate: "",
            certifiedDate: "",
          };
        }

        return {
          ...item,
          status: "Active",
          certificateStatus: "N/A",
        };
      });

    persistStudents(nextStudents);
    setOpenMenuId(null);
  }

  /* =======================================================
     CERTIFICATE REQUEST
  ======================================================= */

  function requestCertificate(student: Student) {
    const today = new Date()
      .toISOString()
      .slice(0, 10);

    const nextStudents: Student[] =
      students.map((item) =>
        item.admissionId === student.admissionId
          ? {
              ...item,
              certificateStatus: "Requested",
              certificateRequestDate: today,
            }
          : item
      );

    persistStudents(nextStudents);
    setOpenMenuId(null);
  }

  /* =======================================================
     EDIT
  ======================================================= */

  function saveEditedStudent(updatedStudent: Student) {
    const nextStudents =
      students.map((item) =>
        item.admissionId ===
        updatedStudent.admissionId
          ? updatedStudent
          : item
      );

    persistStudents(nextStudents);

    setEditStudent(null);
  }

  /* =======================================================
     EXCEL
  ======================================================= */

  function exportToExcel() {
    const rows = filteredStudents.map(
      (student, index) => ({
        "S.No": index + 1,
        "Admission ID":
          student.admissionId,
        "Admission Date":
          student.admissionDate,
        "Candidate Name":
          student.candidateName,
        "Contact No":
          student.contactNo,
        Email:
          student.email,
        "Guardian Name":
          student.guardianName,
        "Guardian Contact":
          student.guardianContact,
        Qualification:
          student.qualification,
        Branch:
          student.branch,
        Course:
          student.course,
        "Start Date":
          student.startDate,
        "End Date":
          student.endDate,
        Source:
          student.source,
        "Referral Name":
          student.referralName,
        "Committed Fee":
          student.committedFee,
        "Paid Amount":
          student.paidAmount,
        Status:
          student.status,
        "Certificate Status":
          student.certificateStatus,
        "Certificate Request Date":
          student.certificateRequestDate ?? "",
        "Certified Date":
          student.certifiedDate ?? "",
        Remark:
          student.remark,
      })
    );

    const worksheet =
      XLSX.utils.json_to_sheet(rows);

    worksheet["!cols"] = [
      { wch: 7 },
      { wch: 16 },
      { wch: 16 },
      { wch: 24 },
      { wch: 16 },
      { wch: 28 },
      { wch: 22 },
      { wch: 18 },
      { wch: 18 },
      { wch: 20 },
      { wch: 28 },
      { wch: 14 },
      { wch: 14 },
      { wch: 18 },
      { wch: 18 },
      { wch: 16 },
      { wch: 16 },
      { wch: 14 },
      { wch: 20 },
      { wch: 22 },
      { wch: 18 },
      { wch: 35 },
    ];

    const workbook =
      XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Student Data"
    );

    const today = new Date()
      .toISOString()
      .slice(0, 10);

    XLSX.writeFile(
      workbook,
      `JET-MIS-Student-Data-${today}.xlsx`
    );
  }

  return (
    <div className="min-h-full w-full bg-white px-5 py-6">
      {/* HEADER */}

      <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-neutral-900">
            Student Data
          </h1>

          <p className="mt-1 text-sm text-neutral-500">
            Manage student academic details and certificate requests.
          </p>
        </div>

        <button
          type="button"
          onClick={exportToExcel}
          className="inline-flex h-10 items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-4 text-sm font-medium text-green-700 hover:bg-green-100"
        >
          <Download size={16} />
          Excel
        </button>
      </div>

      {/* FILTERS */}

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="relative w-[250px]">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
          />

          <input
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Search student..."
            className="h-10 w-full rounded-lg border border-neutral-200 bg-white pl-9 pr-3 text-sm outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-50"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(event) =>
            setStatusFilter(event.target.value)
          }
          className={filterClass}
        >
          <option value="All">
            All Status
          </option>

          <option value="Active">
            Active
          </option>

          <option value="Completed">
            Completed
          </option>

          <option value="Dropped">
            Dropped
          </option>
        </select>

        <select
          value={courseFilter}
          onChange={(event) =>
            setCourseFilter(event.target.value)
          }
          className={filterClass}
        >
          <option value="All">
            All Courses
          </option>

          {courseOptions.map((course) => (
            <option
              key={course}
              value={course}
            >
              {course}
            </option>
          ))}
        </select>

        <select
          value={certificateFilter}
          onChange={(event) =>
            setCertificateFilter(
              event.target.value
            )
          }
          className={filterClass}
        >
          <option value="All">
            All Certificates
          </option>

          <option value="N/A">
            N/A
          </option>

          <option value="Pending">
            Pending
          </option>

          <option value="Requested">
            Requested
          </option>

          <option value="Certified">
            Certified
          </option>
        </select>

        <span className="ml-auto text-sm text-neutral-500">
          {filteredStudents.length} student
          {filteredStudents.length !== 1
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
                <th className={`${thClass} w-[10%]`}>
                  Admission ID
                </th>

                <th className={`${thClass} w-[15%]`}>
                  Candidate Name
                </th>

                <th className={`${thClass} w-[11%]`}>
                  Contact No.
                </th>

                <th className={`${thClass} w-[15%]`}>
                  Course
                </th>

                <th className={`${thClass} w-[10%]`}>
                  Start Date
                </th>

                <th className={`${thClass} w-[10%]`}>
                  End Date
                </th>

                <th className={`${thClass} w-[9%]`}>
                  Status
                </th>

                <th className={`${thClass} w-[12%]`}>
                  Certificate Status
                </th>

                <th className={`${thClass} w-[5%]`}>
                  Remark
                </th>

                <th className="w-[3%]" />
              </tr>
            </thead>

            <tbody>
              {paginatedStudents.length ? (
                paginatedStudents.map((student) => (
                  <tr
                    key={student.admissionId}
                    className="border-t border-neutral-100 hover:bg-blue-50/30"
                  >
                    <td className={tdClass}>
                      <span className="font-medium text-neutral-800">
                        {student.admissionId}
                      </span>
                    </td>

                    <td className={tdClass}>
                      <span className="font-medium text-neutral-900">
                        {student.candidateName}
                      </span>
                    </td>

                    <td className={tdClass}>
                      {student.contactNo}
                    </td>

                    <td className={tdClass}>
                      <div className="line-clamp-2">
                        {student.course}
                      </div>
                    </td>

                    <td className={tdClass}>
                      {student.startDate || "-"}
                    </td>

                    <td className={tdClass}>
                      {student.endDate || "-"}
                    </td>

                    <td className={tdClass}>
                      <StatusBadge status={student.status} />
                    </td>

                    <td className={tdClass}>
                      <CertificateBadge
                        status={student.certificateStatus}
                      />
                    </td>

                    <td className={tdClass}>
                      <div
                        title={student.remark}
                        className="line-clamp-2"
                      >
                        {student.remark || "-"}
                      </div>
                    </td>

                    <td className="relative px-2 py-3 text-right">
                      <button
                        type="button"
                        onClick={() =>
                          setOpenMenuId(
                            openMenuId ===
                              student.admissionId
                              ? null
                              : student.admissionId
                          )
                        }
                        className="inline-flex h-8 w-8 items-center justify-center rounded-md text-neutral-500 hover:bg-neutral-100"
                      >
                        <MoreVertical size={18} />
                      </button>

                      {openMenuId ===
                        student.admissionId && (
                        <StudentActionMenu
                          student={student}
                          role={CURRENT_ROLE}
                          onClose={() =>
                            setOpenMenuId(null)
                          }
                          onView={() => {
                            setViewStudent(student);
                            setOpenMenuId(null);
                          }}
                          onEdit={() => {
                            setEditStudent(student);
                            setOpenMenuId(null);
                          }}
                          onComplete={() =>
                            markStudentStatus(
                              student,
                              "Completed"
                            )
                          }
                          onDrop={() =>
                            markStudentStatus(
                              student,
                              "Dropped"
                            )
                          }
                          onCertificateRequest={() =>
                            requestCertificate(student)
                          }
                        />
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={10}
                    className="px-4 py-14 text-center text-sm text-neutral-500"
                  >
                    No students found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* FOOTER */}

        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-neutral-200 px-4 py-3">
          <div className="flex items-center gap-3">
            <span className="text-sm text-neutral-500">
              Rows per page
            </span>

            <select
              value={rowsPerPage}
              onChange={(event) =>
                setRowsPerPage(
                  Number(event.target.value)
                )
              }
              className="h-9 rounded-md border border-neutral-200 bg-white px-2 text-sm outline-none"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={30}>30</option>
              <option value={50}>50</option>
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
              disabled={currentPage === 1}
              onClick={() =>
                setCurrentPage((page) =>
                  Math.max(page - 1, 1)
                )
              }
              className={paginationButton}
            >
              <ChevronLeft size={16} />
              Previous
            </button>

            <PageNumbers
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />

            <button
              type="button"
              disabled={
                currentPage === totalPages
              }
              onClick={() =>
                setCurrentPage((page) =>
                  Math.min(
                    page + 1,
                    totalPages
                  )
                )
              }
              className={paginationButton}
            >
              Next
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* VIEW MODAL */}

      {viewStudent && (
        <ViewStudentModal
          student={viewStudent}
          onClose={() =>
            setViewStudent(null)
          }
          onEdit={() => {
            setEditStudent(viewStudent);
            setViewStudent(null);
          }}
        />
      )}

      {/* EDIT MODAL */}

      {editStudent && (
        <EditStudentModal
          student={editStudent}
          onClose={() =>
            setEditStudent(null)
          }
          onSave={saveEditedStudent}
        />
      )}
    </div>
  );
}

/* =========================================================
   ACTION MENU
========================================================= */

function StudentActionMenu({
  student,
  role,
  onClose,
  onView,
  onEdit,
  onComplete,
  onDrop,
  onCertificateRequest,
}: {
  student: Student;
  role: LoginRole;

  onClose: () => void;
  onView: () => void;
  onEdit: () => void;
  onComplete: () => void;
  onDrop: () => void;
  onCertificateRequest: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleOutside(event: MouseEvent) {
      if (
        ref.current &&
        !ref.current.contains(
          event.target as Node
        )
      ) {
        onClose();
      }
    }

    document.addEventListener(
      "mousedown",
      handleOutside
    );

    return () =>
      document.removeEventListener(
        "mousedown",
        handleOutside
      );
  }, [onClose]);

  const isActive =
    student.status === "Active";

  const canRequestCertificate =
    role === "Branch" &&
    student.status === "Completed" &&
    student.certificateStatus === "Pending";

  return (
    <div
      ref={ref}
      className="absolute right-3 top-11 z-50 w-56 rounded-lg border border-neutral-200 bg-white p-1 text-left shadow-lg"
    >
      <button
        type="button"
        onClick={onView}
        className={menuItemClass}
      >
        <Eye size={15} />
        View
      </button>

      <button
        type="button"
        onClick={onEdit}
        className={menuItemClass}
      >
        <Pencil size={15} />
        Edit
      </button>

      {isActive && (
        <>
          <button
            type="button"
            onClick={onComplete}
            className={menuItemClass}
          >
            <GraduationCap size={15} />
            Mark as Completed
          </button>

          <button
            type="button"
            onClick={onDrop}
            className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-red-600 hover:bg-red-50"
          >
            <UserX size={15} />
            Mark Dropped
          </button>
        </>
      )}

      {canRequestCertificate && (
        <>
          <div className="my-1 border-t border-neutral-100" />

          <button
            type="button"
            onClick={onCertificateRequest}
            className={menuItemClass}
          >
            <FileCheck2 size={15} />
            Certificate Request
          </button>
        </>
      )}
    </div>
  );
}

/* =========================================================
   VIEW MODAL
========================================================= */

function ViewStudentModal({
  student,
  onClose,
  onEdit,
}: {
  student: Student;
  onClose: () => void;
  onEdit: () => void;
}) {
  const balance = Math.max(
    student.committedFee -
      student.paidAmount,
    0
  );

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/25 p-4">
      <div className="max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-xl border border-neutral-200 bg-white shadow-xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-neutral-200 bg-white px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold text-neutral-900">
              Student Details
            </h2>

            <p className="mt-1 text-sm text-neutral-500">
              {student.admissionId}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-8 w-8 items-center justify-center rounded-md text-neutral-500 hover:bg-neutral-100"
          >
            <X size={18} />
          </button>
        </div>

        <div className="space-y-7 p-6">
          <DetailSection title="Admission Details">
            <Detail
              label="Admission ID"
              value={student.admissionId}
            />

            <Detail
              label="Admission Date"
              value={
                student.admissionDate || "-"
              }
            />

            <Detail
              label="Branch"
              value={student.branch || "-"}
            />

            <Detail
              label="Source"
              value={student.source || "-"}
            />

            <Detail
              label="Referral Name"
              value={
                student.referralName || "-"
              }
            />
          </DetailSection>

          <DetailSection title="Candidate Details">
            <Detail
              label="Candidate Name"
              value={student.candidateName}
            />

            <Detail
              label="Contact No."
              value={student.contactNo}
            />

            <Detail
              label="Email"
              value={student.email || "-"}
            />

            <Detail
              label="Qualification"
              value={
                student.qualification || "-"
              }
            />
          </DetailSection>

          <DetailSection title="Guardian Details">
            <Detail
              label="Guardian Name"
              value={
                student.guardianName || "-"
              }
            />

            <Detail
              label="Guardian Contact"
              value={
                student.guardianContact || "-"
              }
            />
          </DetailSection>

          <DetailSection title="Course Details">
            <Detail
              label="Course"
              value={student.course}
            />

            <Detail
              label="Start Date"
              value={student.startDate || "-"}
            />

            <Detail
              label="End Date"
              value={student.endDate || "-"}
            />

            <Detail
              label="Student Status"
              value={student.status}
            />
          </DetailSection>

          <DetailSection title="Certificate Details">
            <Detail
              label="Certificate Status"
              value={
                student.certificateStatus
              }
            />

            <Detail
              label="Request Date"
              value={
                student.certificateRequestDate ||
                "-"
              }
            />

            <Detail
              label="Certified Date"
              value={
                student.certifiedDate || "-"
              }
            />
          </DetailSection>

          <DetailSection title="Fee Summary">
            <Detail
              label="Committed Fee"
              value={`₹${student.committedFee.toLocaleString(
                "en-IN"
              )}`}
            />

            <Detail
              label="Paid Amount"
              value={`₹${student.paidAmount.toLocaleString(
                "en-IN"
              )}`}
            />

            <Detail
              label="Balance"
              value={`₹${balance.toLocaleString(
                "en-IN"
              )}`}
            />
          </DetailSection>

          <DetailSection title="Remark">
            <div className="md:col-span-2 lg:col-span-3">
              <Detail
                label="Remark"
                value={student.remark || "-"}
              />
            </div>
          </DetailSection>
        </div>

        <div className="sticky bottom-0 flex justify-end gap-2 border-t border-neutral-200 bg-white px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="h-10 rounded-lg border border-neutral-200 bg-white px-4 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
          >
            Close
          </button>

          <button
            type="button"
            onClick={onEdit}
            className="inline-flex h-10 items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-4 text-sm font-medium text-blue-700 hover:bg-blue-100"
          >
            <Pencil size={15} />
            Edit Student
          </button>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   EDIT MODAL
========================================================= */

function EditStudentModal({
  student,
  onClose,
  onSave,
}: {
  student: Student;
  onClose: () => void;
  onSave: (student: Student) => void;
}) {
  const [form, setForm] =
    useState<Student>({ ...student });

  function updateField(
    field: keyof Student,
    value: string | number
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/25 p-4">
      <div className="max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-xl border border-neutral-200 bg-white shadow-xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-neutral-200 bg-white px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold text-neutral-900">
              Edit Student
            </h2>

            <p className="mt-1 text-sm text-neutral-500">
              {student.admissionId}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-8 w-8 items-center justify-center rounded-md text-neutral-500 hover:bg-neutral-100"
          >
            <X size={18} />
          </button>
        </div>

        <div className="grid gap-5 p-6 md:grid-cols-2 lg:grid-cols-3">
          <FormField
            label="Admission ID"
            value={form.admissionId}
            disabled
            onChange={() => {}}
          />

          <FormField
            type="date"
            label="Admission Date"
            value={form.admissionDate}
            onChange={(value) =>
              updateField(
                "admissionDate",
                value
              )
            }
          />

          <FormField
            label="Candidate Name"
            value={form.candidateName}
            onChange={(value) =>
              updateField(
                "candidateName",
                value
              )
            }
          />

          <FormField
            label="Contact No."
            value={form.contactNo}
            onChange={(value) =>
              updateField(
                "contactNo",
                value
              )
            }
          />

          <FormField
            type="email"
            label="Email"
            value={form.email}
            onChange={(value) =>
              updateField("email", value)
            }
          />

          <FormField
            label="Qualification"
            value={form.qualification}
            onChange={(value) =>
              updateField(
                "qualification",
                value
              )
            }
          />

          <FormField
            label="Guardian Name"
            value={form.guardianName}
            onChange={(value) =>
              updateField(
                "guardianName",
                value
              )
            }
          />

          <FormField
            label="Guardian Contact"
            value={form.guardianContact}
            onChange={(value) =>
              updateField(
                "guardianContact",
                value
              )
            }
          />

          <FormField
            label="Branch"
            value={form.branch}
            onChange={(value) =>
              updateField("branch", value)
            }
          />

          <FormField
            label="Course"
            value={form.course}
            onChange={(value) =>
              updateField("course", value)
            }
          />

          <FormField
            type="date"
            label="Start Date"
            value={form.startDate}
            onChange={(value) =>
              updateField(
                "startDate",
                value
              )
            }
          />

          <FormField
            type="date"
            label="End Date"
            value={form.endDate}
            onChange={(value) =>
              updateField(
                "endDate",
                value
              )
            }
          />

          <FormField
            label="Source"
            value={form.source}
            onChange={(value) =>
              updateField("source", value)
            }
          />

          <FormField
            label="Referral Name"
            value={form.referralName}
            onChange={(value) =>
              updateField(
                "referralName",
                value
              )
            }
          />

          <FormField
            type="number"
            label="Committed Fee"
            value={String(
              form.committedFee
            )}
            onChange={(value) =>
              updateField(
                "committedFee",
                Number(value)
              )
            }
          />

          <FormField
            type="number"
            label="Paid Amount"
            value={String(
              form.paidAmount
            )}
            onChange={(value) =>
              updateField(
                "paidAmount",
                Number(value)
              )
            }
          />

          <div className="md:col-span-2 lg:col-span-3">
            <label className="mb-1.5 block text-sm font-medium text-neutral-700">
              Remark
            </label>

            <textarea
              value={form.remark}
              onChange={(event) =>
                updateField(
                  "remark",
                  event.target.value
                )
              }
              rows={4}
              className="w-full resize-none rounded-lg border border-neutral-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-50"
            />
          </div>
        </div>

        <div className="sticky bottom-0 flex justify-end gap-2 border-t border-neutral-200 bg-white px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="h-10 rounded-lg border border-neutral-200 bg-white px-4 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={() => onSave(form)}
            className="h-10 rounded-lg border border-blue-200 bg-blue-50 px-4 text-sm font-medium text-blue-700 hover:bg-blue-100"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   HELPERS
========================================================= */

function normalizeStudentStatus(
  value: unknown
): StudentStatus {
  if (value === "Completed") {
    return "Completed";
  }

  if (value === "Dropped") {
    return "Dropped";
  }

  return "Active";
}

function normalizeCertificateStatus(
  value: unknown,
  status: StudentStatus
): CertificateStatus {
  if (status !== "Completed") {
    return "N/A";
  }

  if (value === "Certified") {
    return "Certified";
  }

  if (value === "Requested") {
    return "Requested";
  }

  if (value === "Pending") {
    return "Pending";
  }

  return "Pending";
}

function StatusBadge({
  status,
}: {
  status: StudentStatus;
}) {
  const style =
    status === "Active"
      ? "border-green-200 bg-green-50 text-green-700"
      : status === "Completed"
        ? "border-blue-200 bg-blue-50 text-blue-700"
        : "border-red-200 bg-red-50 text-red-600";

  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${style}`}
    >
      {status}
    </span>
  );
}

function CertificateBadge({
  status,
}: {
  status: CertificateStatus;
}) {
  let style =
    "border-neutral-200 bg-neutral-50 text-neutral-600";

  if (status === "Pending") {
    style =
      "border-amber-200 bg-amber-50 text-amber-700";
  }

  if (status === "Requested") {
    style =
      "border-blue-200 bg-blue-50 text-blue-700";
  }

  if (status === "Certified") {
    style =
      "border-green-200 bg-green-50 text-green-700";
  }

  return (
    <span
      className={`inline-flex whitespace-nowrap rounded-full border px-2.5 py-1 text-xs font-medium ${style}`}
    >
      {status}
    </span>
  );
}

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

function FormField({
  label,
  value,
  onChange,
  type = "text",
  disabled = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  disabled?: boolean;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-neutral-700">
        {label}
      </label>

      <input
        type={type}
        value={value}
        disabled={disabled}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className={`h-10 w-full rounded-lg border px-3 text-sm outline-none ${
          disabled
            ? "cursor-not-allowed border-neutral-200 bg-neutral-100 text-neutral-500"
            : "border-neutral-200 bg-white text-neutral-800 focus:border-blue-300 focus:ring-2 focus:ring-blue-50"
        }`}
      />
    </div>
  );
}

/* =========================================================
   PAGE NUMBERS
========================================================= */

function PageNumbers({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  const pages =
    getVisiblePages(
      currentPage,
      totalPages
    );

  return (
    <div className="hidden items-center gap-1 sm:flex">
      {pages.map((page, index) =>
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
      (_, index) => index + 1
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

  if (current >= total - 2) {
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
   CLASSES
========================================================= */

const filterClass =
  "h-10 min-w-[145px] rounded-lg border border-neutral-200 bg-white px-3 text-sm text-neutral-700 outline-none focus:border-blue-300";

const thClass =
  "px-2.5 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-neutral-500";

const tdClass =
  "px-2.5 py-3 text-[13px] align-middle text-neutral-600";

const menuItemClass =
  "flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-50";

const paginationButton =
  "inline-flex h-9 items-center gap-1 rounded-md border border-neutral-200 bg-white px-3 text-sm text-neutral-600 hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-40";