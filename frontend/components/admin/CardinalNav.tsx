// components/admin/CardinalNav.tsx
"use client";

type TabItem = {
  id: string;
  label: string;
  hint: string;
  icon: React.ReactNode;
};

const tabs: TabItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    hint: "overview",
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
    hint: "daily logs",
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
          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
    ),
  },

  {
    id: "floor",
    label: "Floor Map",
    hint: "live tracking",
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
          d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
        />
      </svg>
    ),
  },
  {
    id: "payroll",
    label: "Payroll",
    hint: "compensation",
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
    id: "notifications",
    label: "Notifications",
    hint: "alerts",
    icon: (
      <svg
        className="w-4 h-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0M3.5 18h.5m14.5 0h.5"
        />
        <circle cx="12" cy="18" r="1.5" fill="currentColor" />
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
    <div className="bg-white border-b border-slate-100 sticky top-[69px] z-40">
      <div className="max-w-[1600px] mx-auto px-6">
        <div className="flex gap-6 overflow-x-auto scrollbar-hide">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`
                  group relative py-4 transition-all duration-200 text-left flex items-center gap-2
                  ${
                    isActive
                      ? "text-slate-900 font-semibold"
                      : "text-slate-400 hover:text-slate-600"
                  }
                `}
              >
                {/* Clean, low-opacity Icon toggle */}
                <span
                  className={
                    isActive
                      ? "text-slate-950"
                      : "text-slate-300 group-hover:text-slate-400"
                  }
                >
                  {tab.icon}
                </span>

                {/* Tab Plain Label */}
                <span className="text-sm tracking-tight">{tab.label}</span>

                {/* Inline structural breadcrumb/hint instead of a neon indicator */}
                <span className="hidden sm:inline text-[10px] font-mono text-slate-300 bg-slate-50 border border-slate-100/70 px-1.5 py-0.5 rounded-md">
                  {tab.hint}
                </span>

                {/* Solid minimal crisp underline matching top tier CRM designs */}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#0F0F11]" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
