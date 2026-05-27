export const getISTDate = () => {
  const date = new Date();

  // ADD 1 DAY
  date.setDate(date.getDate() + 1);

  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",

    year: "numeric",

    month: "2-digit",

    day: "2-digit",
  }).format(date);
};
