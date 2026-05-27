// components/staff/LeaveStatusBadge.tsx
"use client";

interface LeaveStatusBadgeProps {
  status: "pending" | "approved" | "rejected";
}

export default function LeaveStatusBadge({ status }: LeaveStatusBadgeProps) {
  const getStatusStyles = () => {
    switch (status) {
      case "approved":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "rejected":
        return "bg-rose-50 text-rose-700 border-rose-200";
      case "pending":
      default:
        return "bg-amber-50 text-amber-700 border-amber-200";
    }
  };

  const getStatusLabel = () => {
    switch (status) {
      case "approved":
        return "Approved";
      case "rejected":
        return "Rejected";
      case "pending":
      default:
        return "Pending";
    }
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusStyles()}`}
    >
      {getStatusLabel()}
    </span>
  );
}
