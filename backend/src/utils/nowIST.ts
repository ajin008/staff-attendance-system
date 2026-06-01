// src/utils/nowIST.ts

// import { DateTime } from "luxon";

// export const nowIST = () => DateTime.now().setZone("Asia/Kolkata");

// src/utils/getISTDate.ts

export const nowIST = () =>
  new Date(
    new Date().toLocaleString("en-US", {
      timeZone: "Asia/Kolkata",
    })
  );
