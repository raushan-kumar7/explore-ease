import helmet from "helmet";

export const helmetSecurity = () => {
  return helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "https:"],
        objectSrc: ["'none'"],
        fontSrc: ["'self'", "https:"],
        connectSrc: ["'self'", "wss:"],
        mediaSrc: ["'self'"],
        frameSrc: ["'none'"],
      },
    },
  });
};