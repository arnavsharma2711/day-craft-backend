import type { Request, Response, NextFunction } from "express";
export default (_req: Request, res: Response, next: NextFunction) => {
  res.success = ({ data = {} }) =>
    res.status(200).json({ success: true, err: null, data });
  res.invalid = (payload: Express.ResponsePayload) =>
    res.status(200).json({
      success: false,
      err: payload.msg || "Invalid Parameters",
      code: payload.code,
      data: null,
    });
  res.failure = (payload: Express.ResponsePayload) =>
    res.status(200).json({
      success: false,
      err: payload.msg || "Something went wrong! We're looking into it.",
      code: payload.code,
      data: null,
    });
  res.unauthorized = (payload: Express.ResponsePayload) =>
    res.status(401).json({
      success: false,
      err: payload.msg || "Authentication Failed",
      data: null,
    });

  res.badData = (payload: Express.ResponsePayload) =>
    res.status(422).json({
      success: false,
      err: payload.msg || "Unprocessable Entity",
      data: null,
    });

  next();
};
