import { nowIST } from "./nowIST.js";

export const todayStart = (): Date => {
  const now = nowIST();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
};

export const startOfDay = (date = nowIST()): Date => {
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    0,
    0,
    0,
    0
  );
};

export const endOfDay = (date = nowIST()): Date => {
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    23,
    59,
    59,
    999
  );
};
