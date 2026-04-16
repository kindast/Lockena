export type RequestResult<T> =
  | {
      state: "success";
      code: number;
      data: T;
    }
  | {
      state: "error";
      code: number;
      errors: string[];
    };
