export const getISTDate = () => {
  const date = new Date();

  date.setDate(date.getDate());

  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",

    year: "numeric",

    month: "2-digit",

    day: "2-digit",
  }).format(date);
};
