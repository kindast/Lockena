import { handleError, httpClient } from "../httpClient";

export const logoService = {
  async getLogo(service: string) {
    try {
      const response = await httpClient.get("/logo/" + service, {
        responseType: "blob",
      });
      return { state: "success", status: response.status, data: response.data };
    } catch (error) {
      return handleError(error);
    }
  },
};
