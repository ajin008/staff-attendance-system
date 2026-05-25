// utils/time.ts

export const parseTimeToMinutes = (time: string): number => {
  const [hours, minutes] = time.split(":").map(Number);

  return hours * 60 + minutes;
};

export const calculateWorkedMinutes = (
  checkIn: Date,
  checkOut: Date
): number => {
  return Math.floor((checkOut.getTime() - checkIn.getTime()) / (1000 * 60));
};

export const calculateLateMinutes = (
  shiftStart: string,
  checkInTime: Date,
  graceMinutes: number
): number => {
  const shiftStartMinutes = parseTimeToMinutes(shiftStart);

  const actualMinutes = checkInTime.getHours() * 60 + checkInTime.getMinutes();

  const late = actualMinutes - shiftStartMinutes;

  if (late <= graceMinutes) {
    return 0;
  }

  return late;
};

export const calculateOvertimeMinutes = (
  shiftEnd: string,
  checkOutTime: Date
): number => {
  const shiftEndMinutes = parseTimeToMinutes(shiftEnd);

  const actualMinutes =
    checkOutTime.getHours() * 60 + checkOutTime.getMinutes();

  if (actualMinutes <= shiftEndMinutes) {
    return 0;
  }

  return actualMinutes - shiftEndMinutes;
};

export const calculateEarlyExitMinutes = (
  shiftEnd: string,
  checkOutTime: Date
): number => {
  const shiftEndMinutes = parseTimeToMinutes(shiftEnd);

  const actualMinutes =
    checkOutTime.getHours() * 60 + checkOutTime.getMinutes();

  if (actualMinutes >= shiftEndMinutes) {
    return 0;
  }

  return shiftEndMinutes - actualMinutes;
};

export const calculateShiftMinutes = (
  shiftStart: string,
  shiftEnd: string
): number => {
  return parseTimeToMinutes(shiftEnd) - parseTimeToMinutes(shiftStart);
};
