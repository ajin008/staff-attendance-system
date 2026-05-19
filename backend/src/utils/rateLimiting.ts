import rateLimit from "express-rate-limit";

export const generalRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  message: {
    message: "Too many request ,try again later",
  },
});

export const loginRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: {
    message: "Too many login attempts, please try again after 15 minutes",
  },
});
