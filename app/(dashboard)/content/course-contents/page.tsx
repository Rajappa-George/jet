"use client";

import { FileText } from "lucide-react";

export default function CourseContentsPage() {
  return (
    <div className="min-h-full bg-white p-6">
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <FileText size={26} />
          </div>

          <h1 className="text-2xl font-semibold text-neutral-900">
            Course Contents
          </h1>

          <p className="mt-2 max-w-md text-sm leading-6 text-neutral-500">
            Course content management will be available here.
            You will be able to manage modules, syllabus,
            materials and course-wise content.
          </p>

          <div className="mt-5 inline-flex rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-2 text-sm font-medium text-neutral-600">
            Coming Soon
          </div>
        </div>
      </div>
    </div>
  );
}