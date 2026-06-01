// src/utils/nowIST.ts

export const nowIST = () =>
  new Date(
    new Date().toLocaleString("en-US", {
      timeZone: "Asia/Kolkata",
    })
  );
