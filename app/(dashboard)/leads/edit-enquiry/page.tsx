"use client";

import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

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
    date: "2026-08-31",
    name: "Arun Kumar",
    contact: "9876543210",
    email: "arun@gmail.com",
    guardianName: "Ramesh Kumar",
    guardianContact: "9876500000",
    qualification: "B.E",
    course: "Full Stack Development",
    source: "Walk-in",
    referralName: "",
    followUpDate: "2026-09-08",
    committedFee: 30000,
    remark: "Interested. Follow up tomorrow.",
  },
  {
    enquiryId: "ENQ002",
    date: "2026-08-30",
    name: "Karthik R",
    contact: "9876543211",
    email: "karthik@gmail.com",
    guardianName: "Rajendran",
    guardianContact: "9876500001",
    qualification: "B.Sc",
    course: "Python Programming",
    source: "Referral",
    referralName: "Suresh",
    followUpDate: "2026-09-10",
    committedFee: 25000,
    remark: "Will confirm after discussion.",
  },
  {
    enquiryId: "ENQ003",
    date: "2026-08-29",
    name: "Priya S",
    contact: "9876543212",
    email: "priya@gmail.com",
    guardianName: "Selvam",
    guardianContact: "9876500002",
    qualification: "B.Com",
    course: "Beautician",
    source: "Social Media",
    referralName: "",
    followUpDate: "",
    committedFee: 20000,
    remark: "",
  },
];

const courseOptions = [
  "Full Stack Development",
  "Python Programming",
  "Beautician",
  "Data Analytics",
  "Fashion Designing",
  "Java Full Stack Development",
  "Web Development",
  "UI/UX Designing",
];

function getLocalDate() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function normalizeEnquiry(item: any): Enquiry {
  const rawSource = String(item.source || "Other");

  const source: Source =
    rawSource === "Walk-in" ||
    rawSource === "Pamphlet" ||
    rawSource === "Social Media" ||
    rawSource === "Referral" ||
    rawSource === "Other"
      ? rawSource
      : rawSource === "Facebook" ||
          rawSource === "Instagram" ||
          rawSource === "Website" ||
          rawSource === "WhatsApp" ||
          rawSource === "Google" ||
          rawSource === "Campaign" ||
          rawSource === "Phone Call"
        ? "Social Media"
        : "Other";

  return {
    enquiryId: item.enquiryId || item.id || "",
    date: item.date || item.enquiryDate || "",
    name: item.name || item.candidateName || "",
    contact: item.contact || item.contactNo || "",
    email: item.email || "",
    guardianName: item.guardianName || "",
    guardianContact: item.guardianContact || "",
    qualification: item.qualification || "",
    course: item.course || "",
    source,
    referralName: item.referralName || "",
    followUpDate: item.followUpDate || "",
    committedFee: Number(item.committedFee || 0),
    remark: item.remark || "",
  };
}

export default function EditEnquiryPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const enquiryId = searchParams.get("id") || "";

  const today = useMemo(() => getLocalDate(), []);

  const [enquiryDate, setEnquiryDate] = useState("");
  const [candidateName, setCandidateName] = useState("");
  const [contactNo, setContactNo] = useState("");
  const [email, setEmail] = useState("");
  const [qualification, setQualification] = useState("");
  const [guardianName, setGuardianName] = useState("");
  const [guardianContact, setGuardianContact] = useState("");
  const [course, setCourse] = useState("");
  const [source, setSource] = useState<Source | "">("");
  const [referralName, setReferralName] = useState("");
  const [committedFee, setCommittedFee] = useState("");
  const [remark, setRemark] = useState("");
  const [followUpDate, setFollowUpDate] = useState("");

  const [loaded, setLoaded] = useState(false);
  const [recordFound, setRecordFound] = useState(false);
  const [originalWasSaved, setOriginalWasSaved] = useState(false);
  const [error, setError] = useState("");

  function onlyNumbers(value: string, maxLength: number) {
    return value.replace(/\D/g, "").slice(0, maxLength);
  }

  useEffect(() => {
    if (!enquiryId) {
      setError("Enquiry ID is missing.");
      setLoaded(true);
      return;
    }

    try {
      const savedRaw = JSON.parse(
        localStorage.getItem("jet-mis-enquiries") || "[]"
      );

      const saved: Enquiry[] = Array.isArray(savedRaw)
        ? savedRaw.map(normalizeEnquiry)
        : [];

      const savedRecord = saved.find(
        (item) =>
          item.enquiryId.toLowerCase() === enquiryId.toLowerCase()
      );

      const sampleRecord = sampleEnquiries.find(
        (item) =>
          item.enquiryId.toLowerCase() === enquiryId.toLowerCase()
      );

      const enquiry = savedRecord || sampleRecord;

      if (!enquiry) {
        setError("Enquiry record not found.");
        setLoaded(true);
        return;
      }

      setEnquiryDate(enquiry.date);
      setCandidateName(enquiry.name);
      setContactNo(enquiry.contact);
      setEmail(enquiry.email);
      setQualification(enquiry.qualification);
      setGuardianName(enquiry.guardianName);
      setGuardianContact(enquiry.guardianContact);
      setCourse(enquiry.course);
      setSource(enquiry.source);
      setReferralName(enquiry.referralName || "");
      setCommittedFee(
        enquiry.committedFee ? String(enquiry.committedFee) : ""
      );
      setRemark(enquiry.remark);
      setFollowUpDate(enquiry.followUpDate || "");

      setOriginalWasSaved(Boolean(savedRecord));
      setRecordFound(true);
      setLoaded(true);
    } catch {
      setError("Unable to load this enquiry.");
      setLoaded(true);
    }
  }, [enquiryId]);

  const minFollowUpDate = useMemo(() => {
    if (!enquiryDate) return "";
    return enquiryDate > today ? enquiryDate : today;
  }, [enquiryDate, today]);

  function handleEnquiryDateChange(value: string) {
    setEnquiryDate(value);

    // Keep an existing historical follow-up date while editing.
    // Only clear it when it becomes earlier than the newly selected enquiry date.
    if (followUpDate && followUpDate < value) {
      setFollowUpDate("");
    }
  }

  function handleSourceChange(value: Source | "") {
    setSource(value);
    if (value !== "Referral") {
      setReferralName("");
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!enquiryDate) {
      setError("Enquiry Date is required.");
      return;
    }

    if (enquiryDate > today) {
      setError("Enquiry Date cannot be a future date.");
      return;
    }

    if (!candidateName.trim()) {
      setError("Candidate Name is required.");
      return;
    }

    if (!/^\d{10}$/.test(contactNo)) {
      setError("Contact No must contain 10 digits.");
      return;
    }

    if (guardianContact && !/^\d{10}$/.test(guardianContact)) {
      setError("Guardian Contact No must contain 10 digits.");
      return;
    }

    if (!course) {
      setError("Course Interested is required.");
      return;
    }

    if (!source) {
      setError("Source is required.");
      return;
    }

    if (source === "Referral" && !referralName.trim()) {
      setError("Referral Name is required for Referral source.");
      return;
    }

    if (!committedFee || Number(committedFee) <= 0) {
      setError("Committed Fee is required.");
      return;
    }

    if (followUpDate && followUpDate < enquiryDate) {
      setError("Follow-up Date cannot be before Enquiry Date.");
      return;
    }

    const updatedEnquiry: Enquiry = {
      enquiryId,
      date: enquiryDate,
      name: candidateName.trim(),
      contact: contactNo,
      email: email.trim(),
      qualification: qualification.trim(),
      guardianName: guardianName.trim(),
      guardianContact,
      course,
      source,
      referralName:
        source === "Referral" ? referralName.trim() : "",
      followUpDate,
      committedFee: Number(committedFee),
      remark: remark.trim(),
    };

    try {
      const savedRaw = JSON.parse(
        localStorage.getItem("jet-mis-enquiries") || "[]"
      );

      const saved: Enquiry[] = Array.isArray(savedRaw)
        ? savedRaw.map(normalizeEnquiry)
        : [];

      let updatedSaved: Enquiry[];

      if (originalWasSaved) {
        updatedSaved = saved.map((item) =>
          item.enquiryId.toLowerCase() === enquiryId.toLowerCase()
            ? updatedEnquiry
            : item
        );
      } else {
        const existingIndex = saved.findIndex(
          (item) =>
            item.enquiryId.toLowerCase() === enquiryId.toLowerCase()
        );

        if (existingIndex >= 0) {
          updatedSaved = saved.map((item, index) =>
            index === existingIndex ? updatedEnquiry : item
          );
        } else {
          updatedSaved = [...saved, updatedEnquiry];
        }
      }

      localStorage.setItem(
        "jet-mis-enquiries",
        JSON.stringify(updatedSaved)
      );

      alert("Enquiry updated successfully.");
      router.push("/leads");
    } catch {
      setError("Unable to save the enquiry. Please try again.");
    }
  }

  if (!loaded) {
    return (
      <div className="min-h-screen bg-white p-6">
        <p className="text-sm text-neutral-500">Loading enquiry...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="p-6">
        <Link
          href="/leads"
          className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-neutral-600 transition hover:text-black"
        >
          <ArrowLeft size={17} strokeWidth={1.8} />
          Back to Lead Management
        </Link>

        <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-xl font-semibold tracking-tight text-neutral-900">
            Edit Enquiry
          </h1>

          {enquiryId && (
            <span className="text-sm font-medium text-neutral-500">
              {enquiryId}
            </span>
          )}
        </div>

        {!recordFound ? (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {error || "Enquiry record not found."}
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              <Field label="Enquiry ID" required>
                <input
                  value={enquiryId}
                  disabled
                  className="input-style bg-neutral-50 text-neutral-500"
                />
              </Field>

              <Field label="Enquiry Date" required>
                <input
                  type="date"
                  value={enquiryDate}
                  max={today}
                  onChange={(e) =>
                    handleEnquiryDateChange(e.target.value)
                  }
                  className="input-style"
                  required
                />
              </Field>

              <Field label="Candidate Name" required>
                <input
                  type="text"
                  value={candidateName}
                  onChange={(e) => setCandidateName(e.target.value)}
                  placeholder="Enter candidate name"
                  className="input-style"
                  required
                />
              </Field>

              <Field label="Contact No" required>
                <input
                  type="text"
                  inputMode="numeric"
                  value={contactNo}
                  onChange={(e) =>
                    setContactNo(onlyNumbers(e.target.value, 10))
                  }
                  placeholder="10 digit mobile number"
                  className="input-style"
                  required
                />
              </Field>

              <Field label="Email">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email"
                  className="input-style"
                />
              </Field>

              <Field label="Qualification">
                <input
                  type="text"
                  value={qualification}
                  onChange={(e) => setQualification(e.target.value)}
                  placeholder="Enter qualification"
                  className="input-style"
                />
              </Field>

              <Field label="Father / Guardian Name">
                <input
                  type="text"
                  value={guardianName}
                  onChange={(e) => setGuardianName(e.target.value)}
                  placeholder="Enter guardian name"
                  className="input-style"
                />
              </Field>

              <Field label="Guardian Contact No">
                <input
                  type="text"
                  inputMode="numeric"
                  value={guardianContact}
                  onChange={(e) =>
                    setGuardianContact(
                      onlyNumbers(e.target.value, 10)
                    )
                  }
                  placeholder="10 digit mobile number"
                  className="input-style"
                />
              </Field>

              <Field label="Course Interested" required>
                <select
                  value={course}
                  onChange={(e) => setCourse(e.target.value)}
                  className="input-style"
                  required
                >
                  <option value="">Select Course</option>

                  {!courseOptions.includes(course) && course && (
                    <option value={course}>{course}</option>
                  )}

                  {courseOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Source" required>
                <select
                  value={source}
                  onChange={(e) =>
                    handleSourceChange(
                      e.target.value as Source | ""
                    )
                  }
                  className="input-style"
                  required
                >
                  <option value="">Select Source</option>
                  <option value="Walk-in">Walk-in</option>
                  <option value="Pamphlet">Pamphlet</option>
                  <option value="Social Media">Social Media</option>
                  <option value="Referral">Referral</option>
                  <option value="Other">Other</option>
                </select>
              </Field>

              {source === "Referral" && (
                <Field label="Referral Name" required>
                  <input
                    type="text"
                    value={referralName}
                    onChange={(e) =>
                      setReferralName(e.target.value)
                    }
                    placeholder="Enter referral name"
                    className="input-style"
                    required
                  />
                </Field>
              )}

              <Field label="Committed Fee" required>
                <input
                  type="number"
                  min="1"
                  value={committedFee}
                  onChange={(e) =>
                    setCommittedFee(e.target.value)
                  }
                  placeholder="Enter committed fee"
                  className="input-style"
                  required
                />
              </Field>

              <div className="md:col-span-2 lg:col-span-3">
                <Field label="Remark">
                  <textarea
                    rows={3}
                    value={remark}
                    onChange={(e) => setRemark(e.target.value)}
                    placeholder="Enter enquiry remark..."
                    className="textarea-style"
                  />
                </Field>
              </div>

              <Field label="Follow-up Date">
                <input
                  type="date"
                  value={followUpDate}
                  min={
                    followUpDate && followUpDate < today
                      ? undefined
                      : minFollowUpDate
                  }
                  onChange={(e) =>
                    setFollowUpDate(e.target.value)
                  }
                  className="input-style"
                />
              </Field>
            </div>

            {error && (
              <div className="mt-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                {error}
              </div>
            )}

            <div className="mt-7 flex justify-end gap-3 border-t border-neutral-100 pt-5">
              <Link
                href="/leads"
                className="inline-flex h-10 items-center justify-center rounded-lg border border-neutral-200 bg-white px-4 text-sm font-medium text-neutral-600 transition hover:bg-neutral-50"
              >
                Cancel
              </Link>

              <button
                type="submit"
                className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-5 text-sm font-medium text-blue-700 transition hover:bg-blue-100"
              >
                <Save size={16} />
                Save Changes
              </button>
            </div>
          </form>
        )}
      </div>

      <style jsx global>{`
        .input-style {
          height: 44px;
          width: 100%;
          border-radius: 8px;
          border: 1px solid rgb(229 229 229);
          background: white;
          padding: 0 12px;
          font-size: 14px;
          color: rgb(38 38 38);
          outline: none;
          transition:
            border-color 0.15s ease,
            box-shadow 0.15s ease;
        }

        .input-style:focus {
          border-color: rgb(147 197 253);
          box-shadow: 0 0 0 3px rgb(239 246 255);
        }

        .input-style::placeholder,
        .textarea-style::placeholder {
          color: rgb(163 163 163);
        }

        .textarea-style {
          width: 100%;
          resize: vertical;
          border-radius: 8px;
          border: 1px solid rgb(229 229 229);
          background: white;
          padding: 10px 12px;
          font-size: 14px;
          color: rgb(38 38 38);
          outline: none;
          transition:
            border-color 0.15s ease,
            box-shadow 0.15s ease;
        }

        .textarea-style:focus {
          border-color: rgb(147 197 253);
          box-shadow: 0 0 0 3px rgb(239 246 255);
        }
      `}</style>
    </div>
  );
}

function Field({
  label,
  required,
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
          <span className="ml-1 text-red-500">*</span>
        )}
      </div>
      {children}
    </label>
  );
}
