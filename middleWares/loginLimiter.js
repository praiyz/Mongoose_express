import { rateLimit } from "express-rate-limit";

 export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 35, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
  message: "too many logins attempts , please try again later.",
  standardHeaders: "draft-7", // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
  // store: ... , // Redis, Memcached, etc. See below.
});
