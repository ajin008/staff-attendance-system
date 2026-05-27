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
    hint: "salary & payslip",
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
];

export default function CardinalNav({
  activeTab,
  onTabChange,
}: {
  activeTab: string;
  onTabChange: (id: string) => void;
}) {
  return (
    <div className="bg-white/80 backdrop-blur-sm sticky top-14.25 z-40">
      <div className="max-w-400 mx-auto px-6">
        <div className="flex gap-1 overflow-x-auto scrollbar-hide">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`
                  group relative px-4 py-2.5 transition-all duration-200 rounded-t-xl
                  ${
                    isActive
                      ? "text-slate-900 bg-gradient-to-t from-slate-50/80 to-transparent"
                      : "text-slate-500 hover:text-slate-700 hover:bg-slate-50/50"
                  }
                `}
              >
                <div className="flex items-center gap-2.5">
                  {/* Icon */}
                  <span
                    className={`
                      transition-all duration-200
                      ${
                        isActive
                          ? "text-emerald-500 scale-105"
                          : "text-slate-400 group-hover:text-slate-500"
                      }
                    `}
                  >
                    {tab.icon}
                  </span>

                  {/* Label */}
                  <span
                    className={`text-sm font-medium tracking-tight ${
                      isActive ? "text-slate-800" : ""
                    }`}
                  >
                    {tab.label}
                  </span>

                  {/* Hint text */}
                  <span className="hidden sm:inline text-[10px] font-mono text-slate-400 group-hover:text-slate-500 transition-colors duration-150">
                    {tab.hint}
                  </span>
                </div>

                {/* Active indicator - organic dot instead of bottom bar */}
                {isActive && (
                  <>
                    <span className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-emerald-400">
                      <span className="absolute inset-0 rounded-full bg-emerald-400 animate-pulse opacity-60"></span>
                    </span>
                    <span className="absolute bottom-0 left-3 right-3 h-px bg-gradient-to-r from-transparent via-emerald-400 to-transparent opacity-60"></span>
                  </>
                )}

                {/* Hover indicator for non-active tabs - subtle underline */}
                {!isActive && (
                  <span className="absolute bottom-0 left-5 right-5 h-px bg-slate-200 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
                )}
              </button>
            );
          })}
        </div>

        {/* Organic shadow line instead of border */}
        <div className="h-px bg-gradient-to-r from-transparent via-slate-100 to-transparent"></div>
      </div>
    </div>
  );
}
