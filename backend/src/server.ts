import dotenv from "dotenv";
dotenv.config();
import app from "./app";

import { startAutoCheckoutCron } from "./cron/autoCheckout.cron";

const port = process.env.PORT || 5000;

const start = async () => {
  startAutoCheckoutCron();
  console.log("Cron jobs initialized.");
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
};

start();
