/* eslint-disable react-hooks/set-state-in-effect */
// components/admin/attendance/Attendance.tsx
"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  Loader2,
  Building2,
  Briefcase,
} from "lucide-react";
import { getAllBranches, Branch } from "@/src/services/branch.service";
import { getAllDepartments } from "@/src/services/department.service";
import {
  getAttendanceDataByDate,
  TodayAttendanceData,
  PresentStaff,
  AbsentStaff,
  LateStaff,
} from "@/src/services/attendance.service";
import AttendanceStaffTable from "@/components/admin/attendence/AttendanceStaffTable";

// Department type
interface Department {
  id: number;
  name: string;
}

// Union type for staff from different categories
type StaffUnion = PresentStaff | AbsentStaff | LateStaff;

type SubTabType = "present" | "absent" | "late";

export default function Attendance() {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [selectedBranch, setSelectedBranch] = useState<string>("all");
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [activeSubTab, setActiveSubTab] = useState<SubTabType>("present");
  const [currentCalendarDate, setCurrentCalendarDate] = useState<Date>(
    new Date()
  );
  const [attendanceData, setAttendanceData] =
    useState<TodayAttendanceData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch branches and departments on mount
  useEffect(() => {
    const loadFilters = async () => {
      try {
        const [branchList, deptList] = await Promise.all([
          getAllBranches(),
          getAllDepartments(),
        ]);
        setBranches(branchList || []);
        setDepartments(deptList || []);
      } catch (err) {
        console.error("Failed to load filters:", err);
      }
    };
    loadFilters();
  }, []);

  // Fetch attendance data
  const fetchAttendance = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const yyyy = selectedDate.getFullYear();
      const mm = String(selectedDate.getMonth() + 1).padStart(2, "0");
      const dd = String(selectedDate.getDate()).padStart(2, "0");
      const dateStr = `${yyyy}-${mm}-${dd}`;

      const res = await getAttendanceDataByDate(
        dateStr,
        selectedBranch,
        selectedDepartment
      );
      setAttendanceData(res.data);
    } catch (err) {
      console.error("Failed to load attendance data:", err);
      setError(
        "Unable to fetch attendance records. Please refresh and try again."
      );
    } finally {
      setIsLoading(false);
    }
  }, [selectedDate, selectedBranch, selectedDepartment]);

  useEffect(() => {
    fetchAttendance();
  }, [fetchAttendance]);

  // Calendar helpers
  const getDaysInMonth = (year: number, month: number): number => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number): number => {
    return new Date(year, month, 1).getDay();
  };

  interface CalendarDay {
    day: number;
    month: number;
    year: number;
    isCurrentMonth: boolean;
  }

  const generateCalendarDays = (currentDate: Date): CalendarDay[] => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const totalDays = getDaysInMonth(year, month);
    const firstDayIndex = getFirstDayOfMonth(year, month);
    const days: CalendarDay[] = [];

    // Previous month days
    const prevMonthDays = getDaysInMonth(year, month - 1);
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      days.push({
        day: prevMonthDays - i,
        month: month === 0 ? 11 : month - 1,
        year: month === 0 ? year - 1 : year,
        isCurrentMonth: false,
      });
    }

    // Current month days
    for (let i = 1; i <= totalDays; i++) {
      days.push({
        day: i,
        month,
        year,
        isCurrentMonth: true,
      });
    }

    // Next month days
    const remainingCells = 42 - days.length;
    for (let i = 1; i <= remainingCells; i++) {
      days.push({
        day: i,
        month: month === 11 ? 0 : month + 1,
        year: month === 11 ? year + 1 : year,
        isCurrentMonth: false,
      });
    }

    return days;
  };

  const handlePrevMonth = (): void => {
    setCurrentCalendarDate(
      new Date(
        currentCalendarDate.getFullYear(),
        currentCalendarDate.getMonth() - 1,
        1
      )
    );
  };

  const handleNextMonth = (): void => {
    setCurrentCalendarDate(
      new Date(
        currentCalendarDate.getFullYear(),
        currentCalendarDate.getMonth() + 1,
        1
      )
    );
  };

  const handleSelectDay = (dayObj: CalendarDay): void => {
    const newDate = new Date(dayObj.year, dayObj.month, dayObj.day);
    setSelectedDate(newDate);
  };

  const isToday = (dayObj: CalendarDay): boolean => {
    const today = new Date();
    return (
      dayObj.day === today.getDate() &&
      dayObj.month === today.getMonth() &&
      dayObj.year === today.getFullYear()
    );
  };

  const isSelected = (dayObj: CalendarDay): boolean => {
    return (
      dayObj.day === selectedDate.getDate() &&
      dayObj.month === selectedDate.getMonth() &&
      dayObj.year === selectedDate.getFullYear()
    );
  };

  const isFutureDate = (dayObj: CalendarDay): boolean => {
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    const dateToCheck = new Date(dayObj.year, dayObj.month, dayObj.day);
    return dateToCheck > today;
  };

  const calendarDays = generateCalendarDays(currentCalendarDate);
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const weekdayNames = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  const formatSelectedDate = (): string => {
    return selectedDate.toLocaleDateString("en-US", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const presentCount = attendanceData?.present?.count || 0;
  const absentCount = attendanceData?.absent?.count || 0;
  const lateCount = attendanceData?.late?.count || 0;

  const getActiveList = (): StaffUnion[] => {
    if (!attendanceData) return [];
    if (activeSubTab === "present") return attendanceData.present?.staff || [];
    if (activeSubTab === "absent") return attendanceData.absent?.staff || [];
    return attendanceData.late?.staff || [];
  };

  const subTabConfig = {
    present: {
      label: "Present",
      icon: CheckCircle2,
    },
    absent: {
      label: "Absent",
      icon: XCircle,
    },
    late: {
      label: "Late",
      icon: Clock,
    },
  };

  return (
    <div className="w-full max-w-[1600px] mx-auto px-6 py-8 flex flex-col gap-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl font-light tracking-tight text-slate-800">
            Attendance Registry
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Track daily team check-ins, lates, and absences
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-100 px-3.5 py-2 rounded-xl text-slate-500">
            <Filter className="h-4 w-4 text-slate-400" />
            <span className="text-xs font-mono uppercase tracking-wider">
              Filters
            </span>
          </div>

          <div className="relative flex items-center bg-white border border-slate-200 rounded-xl px-3 py-2 gap-2">
            <Building2 className="h-4 w-4 text-slate-400" />
            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="text-sm bg-transparent border-none outline-none cursor-pointer pr-4 font-medium"
            >
              <option value="all">All Branches</option>
              {branches.map((branch) => (
                <option key={branch.id} value={branch.id.toString()}>
                  {branch.name}
                </option>
              ))}
            </select>
          </div>

          <div className="relative flex items-center bg-white border border-slate-200 rounded-xl px-3 py-2 gap-2">
            <Briefcase className="h-4 w-4 text-slate-400" />
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="text-sm bg-transparent border-none outline-none cursor-pointer pr-4 font-medium"
            >
              <option value="all">All Departments</option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.id.toString()}>
                  {dept.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Calendar Column */}
        <div className="lg:col-span-4 bg-white border border-slate-100 rounded-2xl p-6 shadow-sm sticky top-28">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4 text-slate-400" />
              <h2 className="text-base font-semibold text-slate-800">
                {monthNames[currentCalendarDate.getMonth()]}{" "}
                {currentCalendarDate.getFullYear()}
              </h2>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={handlePrevMonth}
                className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={handleNextMonth}
                className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center mb-3">
            {weekdayNames.map((name) => (
              <span
                key={name}
                className="text-xs font-mono font-medium text-slate-400 uppercase tracking-wider py-1"
              >
                {name}
              </span>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1.5">
            {calendarDays.map((dayObj, index) => {
              const selected = isSelected(dayObj);
              const today = isToday(dayObj);
              const future = isFutureDate(dayObj);

              return (
                <button
                  key={`${dayObj.month}-${dayObj.day}-${index}`}
                  onClick={() => !future && handleSelectDay(dayObj)}
                  disabled={future}
                  className={`
                    h-10 w-full flex items-center justify-center text-sm font-medium rounded-xl transition-all duration-200
                    ${
                      dayObj.isCurrentMonth
                        ? "text-slate-800"
                        : "text-slate-300"
                    }
                    ${selected ? "bg-slate-900 text-white shadow-md" : ""}
                    ${
                      !selected && today
                        ? "border border-slate-900 text-slate-900 bg-slate-50/50"
                        : ""
                    }
                    ${
                      !selected && !today && dayObj.isCurrentMonth
                        ? "hover:bg-slate-50"
                        : ""
                    }
                    ${
                      future
                        ? "opacity-35 cursor-not-allowed"
                        : "cursor-pointer"
                    }
                  `}
                >
                  {dayObj.day}
                </button>
              );
            })}
          </div>

          <div className="border-t border-slate-100 pt-4 mt-4">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block mb-1">
              Selected Date
            </span>
            <span className="text-sm font-medium text-slate-800">
              {formatSelectedDate()}
            </span>
          </div>
        </div>

        {/* Records Column */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {/* Stats Cards - Black & White Only */}
          <div className="grid grid-cols-3 gap-4">
            {(["present", "absent", "late"] as SubTabType[]).map((tab) => {
              const config = subTabConfig[tab];
              const Icon = config.icon;
              const count =
                tab === "present"
                  ? presentCount
                  : tab === "absent"
                  ? absentCount
                  : lateCount;
              const isActive = activeSubTab === tab;

              return (
                <button
                  key={tab}
                  onClick={() => setActiveSubTab(tab)}
                  className={`
                    p-4 rounded-xl border text-left transition-all duration-200
                    ${
                      isActive
                        ? "bg-slate-900 text-white border-slate-900 shadow-md"
                        : "bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50/50"
                    }
                  `}
                >
                  <span
                    className={`text-[10px] font-mono tracking-wider uppercase font-medium ${
                      isActive ? "text-slate-300" : "text-slate-400"
                    }`}
                  >
                    {config.label}
                  </span>
                  <div className="flex items-baseline gap-2 mt-2">
                    <span
                      className={`text-2xl font-bold ${
                        isActive ? "text-white" : "text-slate-800"
                      }`}
                    >
                      {count}
                    </span>
                    <Icon
                      className={`h-4 w-4 ${
                        isActive ? "text-slate-300" : "text-slate-400"
                      }`}
                    />
                  </div>
                </button>
              );
            })}
          </div>

          {/* Table */}
          <div className="min-h-[350px]">
            {isLoading ? (
              <div className="bg-white rounded-xl border border-slate-100 p-12 flex flex-col items-center justify-center gap-4">
                <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
                <p className="text-sm text-slate-400">Loading records...</p>
              </div>
            ) : error ? (
              <div className="bg-rose-50 rounded-xl border border-rose-100 p-8 text-center">
                <p className="text-sm text-rose-600 font-medium">{error}</p>
                <button
                  onClick={fetchAttendance}
                  className="mt-3 px-4 py-2 bg-white border border-rose-200 text-rose-700 rounded-lg text-xs font-medium hover:bg-rose-100/50 transition-colors"
                >
                  Retry
                </button>
              </div>
            ) : (
              <AttendanceStaffTable
                staffList={getActiveList()}
                type={activeSubTab}
                emptyMessage={
                  activeSubTab === "present"
                    ? "No check-ins recorded for this date"
                    : activeSubTab === "absent"
                    ? "All team members are present"
                    : "No late arrivals on this date"
                }
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
