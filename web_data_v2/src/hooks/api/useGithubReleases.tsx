import useApi, { ApiResponse } from "../useApi";
import { GithubReleaseResponse } from "../../models/Types";

export function useGithubReleases():ApiResponse<GithubReleaseResponse> {
  return useApi<GithubReleaseResponse>({
    endpoint: "https://api.github.com/repos/rspaargaren/io-rts-esp32/releases",
    method: "GET",
  });
}
