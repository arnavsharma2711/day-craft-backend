import type { NextFunction, Request, Response } from "express";

export default function notFoundHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  res.failure({
    msg: `🔍 - Not Found - ${req.originalUrl}`,
  });

  next();
}
