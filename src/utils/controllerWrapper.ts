import type { NextFunction, Request, Response } from "express";

type ControllerFunction = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void>;

export const asyncWrapper = (fn: ControllerFunction): ControllerFunction => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await fn(req, res, next);
    } catch (error: unknown) {
      res.failure({ msg: error instanceof Error ? error.message : String(error) });
    }
  };
};
