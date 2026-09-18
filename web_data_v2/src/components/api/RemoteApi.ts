import { ActionResult } from "../../models/Types";

async function postJson<T>(url: string, payload: unknown): Promise<T> {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
  });

  const text = await response.text();
  const data = text ? (JSON.parse(text) as T) : ({} as T);

  if (!response.ok) {
    const message =
      typeof data === "object" && data !== null && "message" in data
        ? String((data as { message?: unknown }).message ?? response.statusText)
        : response.statusText;

    throw new Error(message || `Request failed with status ${response.status}`);
  }

  return data;
}

export const REMOTE_ID_RE = /^[0-9A-F]{6}$/;
export function startCaptureRequest(): Promise<unknown> {
  return postJson("/api/remote/capture/start", {});
}

export function cancelCaptureRequest(): Promise<unknown> {
  return postJson("/api/remote/capture/cancel", {});
}

export function linkRemote(
  remoteId: string,
  deviceId: string,
): Promise<ActionResult> {
  return postJson<ActionResult>("/api/action", {
    action: "linkRemote",
    remoteId,
    deviceId,
  });
}

export function unlinkRemote(remoteId: string): Promise<ActionResult> {
  return postJson<ActionResult>("/api/action", {
    action: "unlinkRemote",
    remoteId,
  });
}

export function deleteRemote(remoteId: string): Promise<ActionResult> {
  return postJson<ActionResult>("/api/action", {
    action: "deleteRemote",
    remoteId,
  });
}
