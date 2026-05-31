import rateLimit from "express-rate-limit";

// export const generalRateLimit = rateLimit({
//   windowMs: 15 * 60 * 1000,
//   max: 50,
//   message: {
//     message: "Too many request ,try again later",
//   },
// });

// export const loginRateLimit = rateLimit({
//   windowMs: 15 * 60 * 1000,
//   max: 5,
//   message: {
//     message: "Too many login attempts, please try again after 15 minutes",
//   },
// });

export const authRateLimit = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 10,
  message: {
    success: false,
    code: "TOO_MANY_ATTEMPTS",
    message: "Too many login attempts. Try again after 10 minutes.",
  },
  skipSuccessfulRequests: true,
});

export const writeRateLimit = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 100,
  message: {
    success: false,
    code: "WRITE_LIMIT_EXCEEDED",
    message: "Too many requests. Please slow down.",
  },
});

export const readRateLimit = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 500,
  message: {
    success: false,
    code: "READ_LIMIT_EXCEEDED",
    message: "Too many requests. Try again later.",
  },
});

export const searchRateLimit = rateLimit({
  windowMs: 30 * 1000,
  max: 30,
  message: {
    success: false,
    code: "SEARCH_LIMIT_EXCEEDED",
    message: "Too many search requests.",
  },
});

export const notificationRateLimit = rateLimit({
  windowMs: 30 * 1000,
  max: 100,
  message: {
    success: false,
    code: "NOTIFICATION_LIMIT_EXCEEDED",
    message: "Too many notification requests.",
  },
});

export const heavyRateLimit = rateLimit({
  windowMs: 30 * 60 * 1000,
  max: 20,
  message: {
    success: false,
    code: "HEAVY_OPERATION_LIMIT",
    message: "Report generation limit reached. Try again in 30 minutes.",
  },
});
