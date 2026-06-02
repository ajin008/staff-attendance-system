export const calculateLeaveDays = (
  leaves: {
    startDate: string;
    endDate: string;
  }[]
) => {
  let totalLeaveDays = 0;

  for (const leave of leaves) {
    const start = new Date(leave.startDate);
    const end = new Date(leave.endDate);

    const days =
      Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;

    totalLeaveDays += days;
  }

  return totalLeaveDays;
};
