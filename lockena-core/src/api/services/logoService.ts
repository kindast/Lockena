import { httpClient } from "../httpClient";
import { executeRequest } from "../utils/executeRequest";

export const logoService = {
  async get(service: string) {
    return executeRequest(
      httpClient.get<Blob>("/logo/" + service, {
        responseType: "blob",
      }),
    );
  },
};
