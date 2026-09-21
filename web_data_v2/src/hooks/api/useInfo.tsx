import useApi, { ApiResponse } from "../useApi";
import { InfoResponse } from "../../models/Types";

export function useInfo(): ApiResponse<InfoResponse> {
  return useApi<InfoResponse>({
    endpoint: "/api/info",
    method: "GET",
  });
}
