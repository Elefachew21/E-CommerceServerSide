// middlewares/rateLimiter.js

import rateLimit,{ipKeyGenerator} from "express-rate-limit";

 export const loginLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10,              // max 5 requests per IP
  message: "Too many login attempts from this IP, try again after 1 minute",

    keyGenerator: (req) => ipKeyGenerator(req),


               });
export const registerLimiter = rateLimit({ max: 5, windowMs: 60 * 1000 });
export const publicLimiter = rateLimit({ max: 100, windowMs: 60 * 1000 });
export const orderLimiter = rateLimit({ max: 10, windowMs: 60 * 1000 });