"use client";

import { FormEvent, useMemo, useState } from "react";
import { ArrowLeft, Save } from "lucide-react";
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

const COURSE_OPTIONS = [
  "Full Stack Development",
  "Python Programming",
  "Java Full Stack Development",
  "Web Development",
  "Data Analytics",
  "UI/UX Designing",
  "Beautician",
  "Fashion Designing",
];

const SOURCE_OPTIONS: Source[] = [
  "Walk-in",
  "Pamphlet",
  "Social Media",
  "Referral",
  "Other",
];

function getLocalDate() {
  const now = new Date();
  const offset = now.getTimezoneOffset();
  const local = new Date(now.getTime() - offset * 60 * 1000);
  return local.toISOString().split("T")[0];
}

function normalizeDigits(value: string) {
  return value.replace(/\D/g, "");
}

export default function NewEnquiryPage() {
  const router = useRouter();
  const today = useMemo(() => getLocalDate(), []);

  const [enquiryDate, setEnquiryDate] = useState(today);
  const [candidateName, setCandidateName] = useState("");
  const [contact, setContact] = useState("");
  const [email, setEmail] = useState("");
  const [guardianName, setGuardianName] = useState("");
  const [guardianContact, setGuardianContact] = useState("");
  const [qualification, setQualification] = useState("");
  const [course, setCourse] = useState("");
  const [source, setSource] = useState<Source | "">("");
  const [referralName, setReferralName] = useState("");
  const [followUpDate, setFollowUpDate] = useState("");
  const [committedFee, setCommittedFee] = useState("");
  const [remark, setRemark] = useState("");
  const [error, setError] = useState("");

  const minFollowUpDate = useMemo(() => {
    if (!enquiryDate) return today;
    return enquiryDate > today ? enquiryDate : today;
  }, [enquiryDate, today]);

  function validate() {
    setError("");

    if (!enquiryDate) return "Enquiry date is required.";
    if (enquiryDate > today) {
      return "Enquiry date cannot be a future date.";
    }

    if (!candidateName.trim()) return "Candidate name is required.";

    if (!/^\d{10}$/.test(contact)) {
      return "Contact number must be exactly 10 digits.";
    }

    if (
      guardianContact &&
      !/^\d{10}$/.test(guardianContact)
    ) {
      return "Guardian contact number must be exactly 10 digits.";
    }

    if (!course) return "Please select a course.";
    if (!source) return "Please select a source.";

    if (source === "Referral" && !referralName.trim()) {
      return "Referral name is required when source is Referral.";
    }

    if (followUpDate) {
      if (followUpDate < enquiryDate) {
        return "Follow-up date cannot be before the enquiry date.";
      }

      if (followUpDate < today) {
        return "Follow-up date cannot be in the past.";
      }
    }

    const fee = Number(committedFee || 0);
    if (fee < 0) return "Committed fee cannot be negative.";

    return "";
  }

  function generateEnquiryId(existing: Enquiry[]) {
    const numbers = existing
      .map((item) => Number(item.enquiryId.replace(/\D/g, "")))
      .filter((value) => Number.isFinite(value));

    const next = Math.max(10, ...numbers, 0) + 1;
    return `ENQ${String(next).padStart(3, "0")}`;
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    const existing: Enquiry[] = JSON.parse(
      localStorage.getItem("jet-mis-enquiries") || "[]"
    );

    const newEnquiry: Enquiry = {
      enquiryId: generateEnquiryId(existing),
      date: enquiryDate,
      name: candidateName.trim(),
      contact,
      email: email.trim(),
      guardianName: guardianName.trim(),
      guardianContact,
      qualification: qualification.trim(),
      course,
      source: source as Source,
      referralName:
        source === "Referral" ? referralName.trim() : "",
      followUpDate,
      committedFee: Number(committedFee || 0),
      remark: remark.trim(),
    };

    localStorage.setItem(
      "jet-mis-enquiries",
      JSON.stringify([...existing, newEnquiry])
    );

    alert("Enquiry saved successfully.");
    router.push("/leads");
  }

  return (
    <div className="min-h-screen bg-white p-6 lg:p-8">
      <div className="mb-5">
        <button
          type="button"
          onClick={() => router.push("/leads")}
          className="inline-flex items-center gap-2 text-sm font-medium text-neutral-600 transition hover:text-black"
        >
          <ArrowLeft size={17} strokeWidth={1.8} />
          Back to Lead Management
        </button>
      </div>

      <div className="mx-auto max-w-5xl">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold tracking-tight text-neutral-900">
            New Enquiry
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                  Enquiry Date *
                </label>
                <input
                  type="date"
                  value={enquiryDate}
                  max={today}
                  onChange={(e) => {
                    const value = e.target.value;
                    setEnquiryDate(value);

                    if (followUpDate && followUpDate < value) {
                      setFollowUpDate("");
                    }
                  }}
                  required
                  className="w-full rounded-lg border border-neutral-200 px-3 py-2.5 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                />
                <p className="mt-1 text-xs text-neutral-400">
                  Future enquiry dates are not allowed.
                </p>
              </div>


            
              <div>
                <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                  Candidate Name *
                </label>
                <input
                  type="text"
                  value={candidateName}
                  onChange={(e) => setCandidateName(e.target.value)}
                  placeholder="Enter candidate name"
                  required
                  className="w-full rounded-lg border border-neutral-200 px-3 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                  Contact No *
                </label>
                <input
                  type="tel"
                  inputMode="numeric"
                  maxLength={10}
                  value={contact}
                  onChange={(e) =>
                    setContact(normalizeDigits(e.target.value).slice(0, 10))
                  }
                  placeholder="10 digit mobile number"
                  required
                  className="w-full rounded-lg border border-neutral-200 px-3 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email address"
                  className="w-full rounded-lg border border-neutral-200 px-3 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                  Qualification
                </label>
                <input
                  type="text"
                  value={qualification}
                  onChange={(e) => setQualification(e.target.value)}
                  placeholder="Enter qualification"
                  className="w-full rounded-lg border border-neutral-200 px-3 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                  Father / Guardian Name
                </label>
                <input
                  type="text"
                  value={guardianName}
                  onChange={(e) => setGuardianName(e.target.value)}
                  placeholder="Enter guardian name"
                  className="w-full rounded-lg border border-neutral-200 px-3 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                  Father / Guardian Contact No
                </label>
                <input
                  type="tel"
                  inputMode="numeric"
                  maxLength={10}
                  value={guardianContact}
                  onChange={(e) =>
                    setGuardianContact(
                      normalizeDigits(e.target.value).slice(0, 10)
                    )
                  }
                  placeholder="10 digit mobile number"
                  className="w-full rounded-lg border border-neutral-200 px-3 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                />
              </div>
            
              <div>
                <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                  Course Interested *
                </label>
                <select
                  value={course}
                  onChange={(e) => setCourse(e.target.value)}
                  required
                  className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="">Select course</option>
                  {COURSE_OPTIONS.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                  Source *
                </label>
                <select
                  value={source}
                  onChange={(e) => {
                    const value = e.target.value as Source | "";
                    setSource(value);

                    if (value !== "Referral") {
                      setReferralName("");
                    }
                  }}
                  required
                  className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="">Select source</option>
                  {SOURCE_OPTIONS.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>

              {source === "Referral" && (
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                    Referral Name *
                  </label>
                  <input
                    type="text"
                    value={referralName}
                    onChange={(e) => setReferralName(e.target.value)}
                    placeholder="Enter referral name"
                    required
                    className="w-full rounded-lg border border-neutral-200 px-3 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              )}

              <div>
                <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                  Committed Fee
                </label>
                <input
                  type="number"
                  min="0"
                  value={committedFee}
                  onChange={(e) => setCommittedFee(e.target.value)}
                  placeholder="Enter committed fee"
                  className="w-full rounded-lg border border-neutral-200 px-3 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div className="md:col-span-2 lg:col-span-3">
                <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                  Remark
                </label>
                <textarea
                  rows={3}
                  value={remark}
                  onChange={(e) => setRemark(e.target.value)}
                  placeholder="Enter remark"
                  className="w-full resize-none rounded-lg border border-neutral-200 px-3 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                  Follow-up Date
                </label>
                <input
                  type="date"
                  value={followUpDate}
                  min={minFollowUpDate}
                  onChange={(e) => setFollowUpDate(e.target.value)}
                  className="w-full rounded-lg border border-neutral-200 px-3 py-2.5 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                />
                <p className="mt-1 text-xs text-neutral-400">
                  Must be today or later.
                </p>
              </div>
            </div>

          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => router.push("/leads")}
              className="rounded-lg border border-neutral-200 bg-white px-4 py-2.5 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-4 py-2.5 text-sm font-medium text-blue-700 transition hover:bg-blue-100"
            >
              <Save size={16} strokeWidth={1.8} />
              Save Enquiry
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
