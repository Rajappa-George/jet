"use client";

import { useEffect, useMemo, useState } from "react";

type BatchStatus = "Upcoming" | "Ongoing" | "Completed";

type Batch = {
  batchId: string;
  batchName: string;
  course: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  maxStudents: number;
  students: string[];
  trainers: string[];
};

type Props = {
  filter?: "all" | "ongoing" | "completed";
};

const sampleBatches: Batch[] = [
  {
    batchId: "BAT001",
    batchName: "Python Morning Batch",
    course: "Python Programming",
    startDate: "2026-08-01",
    endDate: "2026-10-31",
    startTime: "09:00",
    endTime: "11:00",
    maxStudents: 25,
    students: [],
    trainers: [],
  },
  {
    batchId: "BAT002",
    batchName: "Full Stack Batch",
    course: "Full Stack Development",
    startDate: "2026-06-01",
    endDate: "2026-08-31",
    startTime: "10:00",
    endTime: "12:00",
    maxStudents: 20,
    students: [],
    trainers: [],
  },
];

function getBatchStatus(
  startDate: string,
  endDate: string
): BatchStatus {
  const today = new Date();

  today.setHours(0, 0, 0, 0);

  const start = new Date(startDate);
  const end = new Date(endDate);

  start.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);

  if (today < start) {
    return "Upcoming";
  }

  if (today > end) {
    return "Completed";
  }

  return "Ongoing";
}

export default function BatchManagement({
  filter = "all",
}: Props) {
  const [batches, setBatches] =
    useState<Batch[]>(sampleBatches);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(
        "jet-mis-batches"
      );

      if (!saved) return;

      const parsed = JSON.parse(saved);

      if (Array.isArray(parsed)) {
        setBatches(parsed);
      }
    } catch {
      // Keep sample data
    }
  }, []);

  const filteredBatches = useMemo(() => {
    return batches.filter((batch) => {
      const status = getBatchStatus(
        batch.startDate,
        batch.endDate
      );

      if (filter === "ongoing") {
        return status === "Ongoing";
      }

      if (filter === "completed") {
        return status === "Completed";
      }

      return true;
    });
  }, [batches, filter]);

  const pageTitle =
    filter === "ongoing"
      ? "Ongoing Batches"
      : filter === "completed"
        ? "Completed Batches"
        : "All Batches";

  return (
    <div className="min-h-full bg-white p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-neutral-900">
          {pageTitle}
        </h1>

        <p className="mt-1 text-sm text-neutral-500">
          {filteredBatches.length} batch
          {filteredBatches.length !== 1 ? "es" : ""}
        </p>
      </div>

      <div className="overflow-hidden rounded-lg border border-neutral-200">
        <table className="w-full">
          <thead>
            <tr className="bg-neutral-50">
              <th className={thClass}>Batch ID</th>
              <th className={thClass}>Batch Name</th>
              <th className={thClass}>Course</th>
              <th className={thClass}>Start Date</th>
              <th className={thClass}>End Date</th>
              <th className={thClass}>Timing</th>
              <th className={thClass}>Students</th>
              <th className={thClass}>Trainers</th>
              <th className={thClass}>Status</th>
            </tr>
          </thead>

          <tbody>
            {filteredBatches.length > 0 ? (
              filteredBatches.map((batch) => {
                const status = getBatchStatus(
                  batch.startDate,
                  batch.endDate
                );

                return (
                  <tr
                    key={batch.batchId}
                    className="border-t border-neutral-100 hover:bg-blue-50/30"
                  >
                    <td className={tdClass}>
                      {batch.batchId}
                    </td>

                    <td className={tdClass}>
                      <span className="font-medium text-neutral-900">
                        {batch.batchName}
                      </span>
                    </td>

                    <td className={tdClass}>
                      {batch.course}
                    </td>

                    <td className={tdClass}>
                      {batch.startDate}
                    </td>

                    <td className={tdClass}>
                      {batch.endDate}
                    </td>

                    <td className={tdClass}>
                      {batch.startTime} - {batch.endTime}
                    </td>

                    <td className={tdClass}>
                      {batch.students?.length ?? 0}
                    </td>

                    <td className={tdClass}>
                      {batch.trainers?.length ?? 0}
                    </td>

                    <td className={tdClass}>
                      <StatusBadge status={status} />
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan={9}
                  className="px-4 py-12 text-center text-sm text-neutral-500"
                >
                  No batches found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatusBadge({
  status,
}: {
  status: BatchStatus;
}) {
  const style =
    status === "Completed"
      ? "border-neutral-200 bg-neutral-50 text-neutral-600"
      : status === "Ongoing"
        ? "border-green-200 bg-green-50 text-green-700"
        : "border-blue-200 bg-blue-50 text-blue-700";

  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${style}`}
    >
      {status}
    </span>
  );
}

const thClass =
  "px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-neutral-500";

const tdClass =
  "px-4 py-3 text-sm text-neutral-600";