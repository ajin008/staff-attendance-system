export const calculatePayrollMetrics = (
  attendance: {
    attendanceStatus: string;
    overtimeMinutes: number;
  }[],
  totalDaysInMonth: number
) => {
  const presentDays = attendance.filter(
    (a) => a.attendanceStatus === "present"
  ).length;

  const halfDays = attendance.filter(
    (a) => a.attendanceStatus === "half_day"
  ).length;

  const absentDays = totalDaysInMonth - presentDays - halfDays;

  const overtimeMinutes = attendance.reduce(
    (acc, curr) => acc + curr.overtimeMinutes,
    0
  );

  const overtimeHours = Number((overtimeMinutes / 60).toFixed(2));

  return {
    presentDays,
    halfDays,
    absentDays,
    overtimeMinutes,
    overtimeHours,
  };
};
