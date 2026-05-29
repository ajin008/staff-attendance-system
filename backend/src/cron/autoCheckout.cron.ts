import cron from "node-cron";

import { autoCheckOutStaffService } from "../Service/attendance.service";

export const startAutoCheckoutCron = () => {
  // EVERY 15 MINUTES
  cron.schedule("*/15 * * * *", async () => {
    console.log("Auto checkout cron running...");

    try {
      await autoCheckOutStaffService();
    } catch (error) {
      console.error("Auto checkout cron failed:", error);
    }
  });
};
