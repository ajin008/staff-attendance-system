// Service/payroll.service.ts

import {
  countPayrollStaff,
  findApprovedLeavesByDateRange,
  findAttendanceByDateRange,
  findExistingPayroll,
  findPayrollByMonth,
  findPayrollStaff,
  findPayrollStaffByStaffId,
  getPayrollSummary,
  updatePayrollPdf,
} from "../Repository/payroll.repository.js";
import AppError from "../utils/AppError.js";

import { createPayroll } from "../Repository/payroll.repository.js";
import { generatePayslipPdf } from "../utils/generatePayslipPdf.js";

import { findOrganizationById } from "../Repository/organization.repository.js";
import { calculateWorkingDays } from "../utils/calculateWorkingDays.js";
import { nowIST } from "../utils/nowIST.js";
import { calculateLeaveDays } from "../utils/payrole/payroll.utils.js";
import { bulkJobStatus } from "../utils/payrole/bulkJobStatus.js";

export const getPayrollService = async ({
  organizationId,
  page,
  limit,
  month,
  year,
  search,
  department,
}: {
  organizationId: number;
  page: number;
  limit: number;
  month?: string;
  year?: number;
  search?: string;
  department?: number | string;
}) => {
  const skip = (page - 1) * limit;

  const currentDate = nowIST();

  const monthMap: Record<string, number> = {
    january: 0,
    february: 1,
    march: 2,
    april: 3,
    may: 4,
    june: 5,
    july: 6,
    august: 7,
    september: 8,
    october: 9,
    november: 10,
    december: 11,
  };

  let selectedMonth = currentDate.getMonth();

  if (month) {
    if (!isNaN(Number(month))) {
      selectedMonth = Number(month) - 1;
    } else {
      selectedMonth = monthMap[month.toLowerCase()];
    }
  }

  const selectedYear = year || currentDate.getFullYear();

  const startDate = new Date(selectedYear, selectedMonth, 1);

  const endDate = new Date(selectedYear, selectedMonth + 1, 0, 23, 59, 59);

  const staff = await findPayrollStaff({
    organizationId,
    search,
    department: department?.toString(),
    skip,
    limit,
  });

  const payrolls = await Promise.all(
    staff.map(async (user) => {
      // ATTENDANCE
      const attendance = await findAttendanceByDateRange({
        userId: user.id,
        startDate,
        endDate,
      });

      const presentDays = attendance.filter(
        (a) => a.attendanceStatus === "present"
      ).length;

      const halfDays = attendance.filter(
        (a) =>
          a.attendanceStatus === "half_day" || a.attendanceStatus === "half-day"
      ).length;

      // OVERTIME
      const overtimeMinutes = attendance.reduce(
        (acc, curr) => acc + curr.overtimeMinutes,
        0
      );

      const overtimeHours = Number((overtimeMinutes / 60).toFixed(2));

      // LEAVES
      const leaves = await findApprovedLeavesByDateRange({
        userId: user.id,
        startDate: startDate.toISOString().split("T")[0],
        endDate: endDate.toISOString().split("T")[0],
      });

      const leaveDays = calculateLeaveDays(leaves);

      // WORKING DAYS
      const workingDays = calculateWorkingDays({
        month: selectedMonth,
        year: selectedYear,
        weeklyOffDays: user.department?.weeklyOffDays || [],
      });

      // ABSENT
      const absentDays = Math.max(
        0,
        workingDays - presentDays - leaveDays - halfDays
      );

      // PAYSLIP GENERATED?
      const payroll = await findPayrollByMonth({
        userId: user.id,
        startDate,
        endDate,
      });

      return {
        id: user.id,

        staffId: user.staffId,

        name: user.name,

        department: user.department?.name || "-",

        presentDays,

        leaveDays,

        absentDays,

        overtimeHours,

        payslipGenerated: !!payroll,

        payrollId: payroll?.id ?? null,
        pdfUrl: payroll?.pdfUrl
          ? `${process.env.BASE_URL}/uploads/payslips/${payroll.pdfUrl}`
          : null,
      };
    })
  );

  const total = await countPayrollStaff(
    organizationId,
    search,
    department?.toString()
  );

  return {
    payrolls,

    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const generatePayslipService = async ({
  organizationId,
  adminId,
  month,
  year,
  staffId,
}: {
  organizationId: number;
  adminId: number;
  month: string;
  year: number;
  staffId?: string;
}) => {
  const currentDate = nowIST();

  const monthMap: Record<string, number> = {
    january: 0,
    february: 1,
    march: 2,
    april: 3,
    may: 4,
    june: 5,
    july: 6,
    august: 7,
    september: 8,
    october: 9,
    november: 10,
    december: 11,
  };

  let selectedMonth = currentDate.getMonth();

  if (!isNaN(Number(month))) {
    selectedMonth = Number(month) - 1;
  } else {
    selectedMonth = monthMap[month.toLowerCase()];
  }

  if (selectedMonth < 0 || selectedMonth > 11 || isNaN(selectedMonth)) {
    throw new AppError("Invalid month", 400);
  }

  const startDate = new Date(year, selectedMonth, 1);

  const endDate = new Date(year, selectedMonth + 1, 0, 23, 59, 59);

  // STAFF
  const user = await findPayrollStaffByStaffId({
    organizationId,
    staffId: staffId!,
  });

  if (!user) {
    throw new AppError("Staff not found", 404);
  }

  // DUPLICATE CHECK
  const existingPayroll = await findExistingPayroll({
    userId: user.id,
    startDate,
    endDate,
  });

  if (existingPayroll) {
    throw new AppError("Payroll already processed for this month", 409);
  }

  // ATTENDANCE
  const attendance = await findAttendanceByDateRange({
    userId: user.id,
    startDate,
    endDate,
  });

  const presentDays = attendance.filter(
    (a) => a.attendanceStatus === "present"
  ).length;

  const halfDays = attendance.filter(
    (a) =>
      a.attendanceStatus === "half_day" || a.attendanceStatus === "half-day"
  ).length;

  // LEAVES
  const leaves = await findApprovedLeavesByDateRange({
    userId: user.id,
    startDate: startDate.toISOString().split("T")[0],
    endDate: endDate.toISOString().split("T")[0],
  });

  const leaveDays = calculateLeaveDays(leaves);

  // WORKING DAYS
  const workingDays = calculateWorkingDays({
    month: selectedMonth,
    year,
    weeklyOffDays: user.department?.weeklyOffDays || [],
  });

  // ABSENT
  const absentDays = Math.max(
    0,
    workingDays - presentDays - leaveDays - halfDays
  );

  // OVERTIME
  const overtimeMinutes = attendance.reduce(
    (acc, curr) => acc + curr.overtimeMinutes,
    0
  );

  const overtimeHours = overtimeMinutes / 60;

  // SALARY
  const baseSalary = user.salary || user.department?.defaultSalary || 0;

  const overtimeRate =
    user.overtimeHourlyRate || user.department?.overtimeHourlyRate || 0;

  const overtimeAmount = overtimeHours * overtimeRate;

  const dailySalary = baseSalary / workingDays;

  const deduction = absentDays * dailySalary + halfDays * dailySalary * 0.5;

  const netSalary = baseSalary - deduction + overtimeAmount;

  // PAYROLL SNAPSHOT
  const payroll = await createPayroll({
    userId: user.id,

    organizationId,

    payrollStartDate: startDate,

    payrollEndDate: endDate,

    basicSalary: baseSalary,

    presentDays,

    absentDays,

    halfDays,

    overtimeMinutes,

    deductions: Number(deduction.toFixed(2)),

    overtimePay: Number(overtimeAmount.toFixed(2)),

    netSalary: Number(netSalary.toFixed(2)),
  });

  // ORGANIZATION
  const organization = await findOrganizationById(organizationId);

  if (!organization) {
    throw new AppError("Organization not found", 404);
  }

  // PDF
  const pdfFileName = await generatePayslipPdf({
    payroll,
    user,
    month,
    year,
    companyName: organization.companyName,
  });

  await updatePayrollPdf(payroll.id, pdfFileName);

  return {
    payroll,

    url: `${process.env.BASE_URL}/uploads/payslips/${pdfFileName}`,
  };
};

export const getPayrollSummaryService = async ({
  organizationId,
  month,
  year,
}: {
  organizationId: number;
  month?: string;
  year?: number;
}) => {
  const currentDate = nowIST();

  const monthMap: Record<string, number> = {
    january: 0,
    february: 1,
    march: 2,
    april: 3,
    may: 4,
    june: 5,
    july: 6,
    august: 7,
    september: 8,
    october: 9,
    november: 10,
    december: 11,
  };

  let selectedMonth = currentDate.getMonth();

  if (month) {
    if (!isNaN(Number(month))) {
      selectedMonth = Number(month) - 1;
    } else {
      selectedMonth = monthMap[month.toLowerCase()];
    }
  }

  const selectedYear = year || currentDate.getFullYear();

  const startDate = new Date(selectedYear, selectedMonth, 1);

  const endDate = new Date(selectedYear, selectedMonth + 1, 0, 23, 59, 59);

  // Payroll records for selected month
  const payrollSummary = await getPayrollSummary({
    organizationId,
    startDate,
    endDate,
  });

  // All staff for salary liability
  const staff = await findPayrollStaff({
    organizationId,
    skip: 0,
    limit: 10000,
  });

  const totalSalary = staff.reduce((acc, user) => {
    const salary = user.salary || user.department?.defaultSalary || 0;

    return acc + salary;
  }, 0);

  return {
    totalSalary,

    totalPaid: payrollSummary._sum.netSalary || 0,

    processedPayrolls: payrollSummary._count.id || 0,
  };
};

export const processAllPayslipsService = async ({
  organizationId,
  adminId,
  month,
  year,
  departmentId,
}: {
  organizationId: number;
  adminId: number;
  month: string;
  year: number;
  departmentId?: number;
}) => {
  const key = `${organizationId}-${month}-${year}-${departmentId || "all"}`;

  const existingJob = bulkJobStatus[key];

  if (existingJob?.status === "processing") {
    throw new AppError("Payroll generation already running", 400);
  }

  const monthMap: Record<string, number> = {
    january: 0,
    february: 1,
    march: 2,
    april: 3,
    may: 4,
    june: 5,
    july: 6,
    august: 7,
    september: 8,
    october: 9,
    november: 10,
    december: 11,
  };

  let selectedMonth = monthMap[month.toLowerCase()];

  if (selectedMonth === undefined) {
    throw new AppError("Invalid month", 400);
  }

  const startDate = new Date(year, selectedMonth, 1);

  const endDate = new Date(year, selectedMonth + 1, 0, 23, 59, 59);

  const staff = await findPayrollStaff({
    organizationId,
    department: departmentId?.toString(),
    skip: 0,
    limit: 10000,
  });

  if (!staff.length) {
    throw new AppError("No staff found", 404);
  }

  bulkJobStatus[key] = {
    total: staff.length,
    processed: 0,
    failed: 0,
    done: false,
    status: "processing",
  };

  setImmediate(async () => {
    for (const user of staff) {
      try {
        const existingPayroll = await findExistingPayroll({
          userId: user.id,
          startDate,
          endDate,
        });

        if (!existingPayroll) {
          await generatePayslipService({
            organizationId,
            adminId,
            month,
            year,
            staffId: user.staffId!,
          });
        }

        bulkJobStatus[key].processed++;
      } catch (error) {
        console.error(`Failed payroll generation for ${user.staffId}:`, error);

        bulkJobStatus[key].failed++;
      }
    }

    bulkJobStatus[key].done = true;

    bulkJobStatus[key].status =
      bulkJobStatus[key].failed > 0 ? "failed" : "completed";
  });

  return {
    message: "Payroll generation started",
    total: staff.length,
    processed: 0,
    failed: 0,
    status: "processing",
  };
};
