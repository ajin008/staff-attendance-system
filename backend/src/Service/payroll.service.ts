// Service/payroll.service.ts

import {
  countPayrollStaff,
  findAttendanceByDateRange,
  findPayrollStaff,
  updatePayrollPdf,
} from "../Repository/payroll.repository.js";
import AppError from "../utils/AppError.js";

import { createPayroll } from "../Repository/payroll.repository.js";
import { generatePayslipPdf } from "../utils/generatePayslipPdf.js";

import { findOrganizationById } from "../Repository/organization.repository.js";
import { calculateWorkingDays } from "../utils/calculateWorkingDays.js";
import { nowIST } from "../utils/nowIST.js";

export const getPayrollService = async ({
  organizationId,
  page,
  limit,
  month,
  year,
  search,
}: {
  organizationId: number;

  page: number;

  limit: number;

  month?: string;

  year?: number;

  search?: string;
}) => {
  const skip = (page - 1) * limit;

  // CURRENT DATE
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

  // MONTH

  let selectedMonth = currentDate.getMonth();

  // YEAR
  const selectedYear = year || currentDate.getFullYear();

  // DATE RANGE
  const startDate = new Date(selectedYear, selectedMonth, 1);

  const endDate = new Date(selectedYear, selectedMonth + 1, 0, 23, 59, 59);

  // FETCH STAFF
  const staff = await findPayrollStaff({
    organizationId,

    search,

    skip,

    limit,
  });

  // PAYROLL PREVIEW
  const payrolls = await Promise.all(
    staff.map(async (user) => {
      // ATTENDANCE
      const attendance = await findAttendanceByDateRange({
        userId: user.id,

        startDate,

        endDate,
      });

      // SALARY
      const baseSalary = user.salary || user.department?.defaultSalary || 0;

      // PRESENT DAYS
      const presentDays = attendance.filter(
        (a) => a.attendanceStatus === "present"
      ).length;

      // HALF DAYS
      const halfDays = attendance.filter(
        (a) => a.attendanceStatus === "half-day"
      ).length;

      // TOTAL DAYS IN MONTH
      const totalDaysInMonth = new Date(
        selectedYear,
        selectedMonth + 1,
        0
      ).getDate();

      // ABSENT DAYS
      const absentDays = totalDaysInMonth - presentDays - halfDays;

      // OVERTIME MINUTES
      const overtimeMinutes = attendance.reduce(
        (acc, curr) => acc + curr.overtimeMinutes,
        0
      );

      // OVERTIME HOURS
      const overtimeHours = Number((overtimeMinutes / 60).toFixed(2));

      // OVERTIME RATE
      const overtimeRate =
        user.overtimeHourlyRate || user.department?.overtimeHourlyRate || 0;

      // OVERTIME AMOUNT
      const overtimeAmount = Number((overtimeHours * overtimeRate).toFixed(2));

      // WORKING DAYS
      const workingDays = calculateWorkingDays({
        month: selectedMonth,
        year: selectedYear,
        weeklyOffDays: user.department?.weeklyOffDays || [],
      });

      // DAILY SALARY
      const dailySalary = baseSalary / workingDays;

      // DEDUCTION
      const deduction = absentDays * dailySalary + halfDays * dailySalary * 0.5;

      // NET SALARY
      const netSalary = baseSalary - deduction + overtimeAmount;

      return {
        id: user.id,

        staffId: user.staffId,

        name: user.name,

        email: user.email,

        department: user.department?.name || "-",

        presentDays,

        absentDays,

        overtimeHours,

        overtimeAmount,

        baseSalary,

        deduction: Number(deduction.toFixed(2)),

        bonus: 0,

        netSalary: Number(netSalary.toFixed(2)),

        status: "pending",
      };
    })
  );

  // SUMMARY
  const totalSalary = payrolls.reduce((acc, curr) => acc + curr.baseSalary, 0);

  const totalDeduction = payrolls.reduce(
    (acc, curr) => acc + curr.deduction,
    0
  );

  const netPayable = payrolls.reduce((acc, curr) => acc + curr.netSalary, 0);

  // TOTAL STAFF COUNT
  const total = await countPayrollStaff(organizationId, search);

  return {
    payrolls,

    summary: {
      totalSalary,

      totalDeduction,

      netPayable,
    },

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

  // MONTH MAP
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

  // DATE RANGE
  const startDate = new Date(year, selectedMonth, 1);

  const endDate = new Date(year, selectedMonth + 1, 0, 23, 59, 59);

  // STAFF
  const staff = await findPayrollStaff({
    organizationId,

    search: staffId,

    skip: 0,

    limit: 1,
  });

  if (!staff.length) {
    throw new AppError("Staff not found", 404);
  }

  const user = staff[0];

  // ATTENDANCE
  const attendance = await findAttendanceByDateRange({
    userId: user.id,

    startDate,

    endDate,
  });

  // SALARY
  const baseSalary = user.salary || user.department?.defaultSalary || 0;

  const presentDays = attendance.filter(
    (a) => a.attendanceStatus === "present"
  ).length;

  const halfDays = attendance.filter(
    (a) => a.attendanceStatus === "half-day"
  ).length;

  const totalDaysInMonth = new Date(year, selectedMonth + 1, 0).getDate();

  const absentDays = totalDaysInMonth - presentDays - halfDays;

  const overtimeMinutes = attendance.reduce(
    (acc, curr) => acc + curr.overtimeMinutes,
    0
  );

  const overtimeHours = overtimeMinutes / 60;

  const overtimeRate =
    user.overtimeHourlyRate || user.department?.overtimeHourlyRate || 0;

  const overtimeAmount = overtimeHours * overtimeRate;

  const workingDays = 26;

  const dailySalary = baseSalary / workingDays;

  const deduction = absentDays * dailySalary + halfDays * dailySalary * 0.5;

  const netSalary = baseSalary - deduction + overtimeAmount;

  // CREATE PAYROLL SNAPSHOT
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

  const organization = await findOrganizationById(organizationId);

  if (!organization) {
    throw new AppError("Organization not found", 404);
  }

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
