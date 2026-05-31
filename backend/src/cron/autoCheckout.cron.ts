import cron from "node-cron";
import { autoCheckOutStaffService } from "./autoCheckOut.js";

export const startAutoCheckoutCron = () => {
  cron.schedule("*/3 * * * *", async () => {
    console.log("Auto checkout cron running...");
    try {
      await autoCheckOutStaffService();
    } catch (error) {
      console.error("Auto checkout cron failed:", error);
    }
  });
};
