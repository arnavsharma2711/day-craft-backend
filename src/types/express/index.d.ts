export {};

declare global {
  namespace Express {
    export type ResponsePayload = {
      msg?: string | object;
      code?: number;
      data?: unknown;
    };

    export interface Request {
      accessToken: string;
      refreshToken: string;
    }
    export interface Response {
      invalid: (payload: ResponsePayload) => Response;
      failure: (payload: ResponsePayload) => Response;
      unauthorized: (payload: ResponsePayload) => Response;
      success: (payload: ResponsePayload) => Response;
      badData: (payload: ResponsePayload) => Response;
    }
  }
}
