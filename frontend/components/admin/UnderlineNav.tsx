// components/admin/UnderlineNav.tsx
"use client";

const tabs = ["dashboard", "reports", "attendance", "staff", "salary"];

export default function UnderlineNav({
  activeTab,
  onTabChange,
}: {
  activeTab: string;
  onTabChange: (id: string) => void;
}) {
  return (
    <div className="border-b border-slate-100">
      <div className="flex gap-8">
        {tabs.map((tab) => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => onTabChange(tab)}
              className={`
                relative pb-3 text-sm font-medium transition-all duration-200
                ${
                  isActive
                    ? "text-slate-900"
                    : "text-slate-400 hover:text-slate-600"
                }
              `}
            >
              {tab}
              {/* Hand-drawn style underline - offset and organic */}
              {isActive && (
                <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-slate-900">
                  <span className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900"></span>
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
