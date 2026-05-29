export const calculateWorkingDays = ({
  month,
  year,
  weeklyOffDays,
}: {
  month: number;
  year: number;
  weeklyOffDays: string[];
}) => {
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  let workingDays = 0;

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);

    const weekday = date
      .toLocaleDateString("en-US", {
        weekday: "long",
      })
      .toLowerCase();

    if (!weeklyOffDays.includes(weekday)) {
      workingDays++;
    }
  }

  return workingDays;
};
