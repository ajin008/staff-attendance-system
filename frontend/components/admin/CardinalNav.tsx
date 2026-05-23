// components/admin/CardinalNav.tsx
"use client";

type TabItem = {
  id: string;
  label: string;
  hint: string; // subtle helper text that appears on hover
  icon: React.ReactNode;
};

const tabs: TabItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    hint: "today's overview",
    icon: (
      <svg
        className="w-4 h-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
        />
      </svg>
    ),
  },
  {
    id: "attendance",
    label: "Attendance",
    hint: "check in / out",
    icon: (
      <svg
        className="w-4 h-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
  {
    id: "staff",
    label: "Staff",
    hint: "view team",
    icon: (
      <svg
        className="w-4 h-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
        />
      </svg>
    ),
  },
  {
    id: "salary",
    label: "Salary",
    hint: "payroll",
    icon: (
      <svg
        className="w-4 h-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
  {
    id: "reports",
    label: "Reports",
    hint: "download data",
    icon: (
      <svg
        className="w-4 h-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
    ),
  },
];

export default function CardinalNav({
  activeTab,
  onTabChange,
}: {
  activeTab: string;
  onTabChange: (id: string) => void;
}) {
  return (
    <div className="border-b border-slate-100 bg-white sticky top-[57px] z-40">
      <div className="max-w-[1600px] mx-auto px-6">
        <div className="flex gap-1 overflow-x-auto scrollbar-hide">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`
                  group relative px-5 py-3 transition-all duration-200
                  ${
                    isActive
                      ? "text-slate-900"
                      : "text-slate-500 hover:text-slate-700"
                  }
                `}
              >
                <div className="flex items-center gap-2.5">
                  {/* Icon always visible, changes subtly when active */}
                  <span
                    className={`
                    transition-all duration-200
                    ${
                      isActive
                        ? "text-slate-900 scale-105"
                        : "text-slate-400 group-hover:text-slate-500"
                    }
                  `}
                  >
                    {tab.icon}
                  </span>

                  {/* Label - clear, bold enough to read */}
                  <span className="text-sm font-medium tracking-tight">
                    {tab.label}
                  </span>

                  {/* Hint text - appears only on hover, so power users get context */}
                  <span className="hidden sm:inline text-[11px] text-slate-400 group-hover:text-slate-500 transition-colors duration-150">
                    {tab.hint}
                  </span>
                </div>

                {/* Active indicator - thick enough to see, organic curve */}
                {isActive && (
                  <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-slate-900 rounded-full">
                    <span className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-full"></span>
                  </span>
                )}

                {/* Hover indicator for non-active tabs */}
                {!isActive && (
                  <span className="absolute bottom-0 left-5 right-5 h-0.5 bg-slate-200 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
