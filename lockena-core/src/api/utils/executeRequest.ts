import { AxiosError } from "axios";
import type { ErrorDto } from "../../dto/response/error.dto";
import type { RequestResult } from "../../dto/response";

export async function executeRequest<T>(
  requestPromise: Promise<{ status: number; data: T }>,
): Promise<RequestResult<T>> {
  try {
    const response = await requestPromise;
    return { state: "success", code: response.status, data: response.data };
  } catch (error) {
    const serverError = error as AxiosError<ErrorDto>;
    return {
      state: "error",
      code: serverError.response?.status || 500,
      errors: serverError.response?.data.errors || [],
    };
  }
}
