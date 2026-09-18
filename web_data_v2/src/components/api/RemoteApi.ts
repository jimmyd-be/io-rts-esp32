import { ActionResult, Remote } from "../../models/Types";

declare global {
  interface Window {
    MiOpenApi: {
      requestJson<T>(url: string, options?: RequestInit): Promise<T>;
      postJson<T>(url: string, payload: unknown): Promise<T>;
    };
  }
  function t(key: string, params?: Record<string, string | number>): string;
  function showToast(
    message: string,
    kind?: "success" | "error" | "info",
  ): void;
}

export const REMOTE_ID_RE = /^[0-9A-F]{6}$/;


export function startCaptureRequest(): Promise<unknown> {
  return window.MiOpenApi.postJson("/api/remote/capture/start", {});
}

export function cancelCaptureRequest(): Promise<unknown> {
  return window.MiOpenApi.postJson("/api/remote/capture/cancel", {});
}

export function linkRemote(
  remoteId: string,
  deviceId: string,
): Promise<ActionResult> {
  return window.MiOpenApi.postJson<ActionResult>("/api/action", {
    action: "linkRemote",
    remoteId,
    deviceId,
  });
}

export function unlinkRemote(remoteId: string): Promise<ActionResult> {
  return window.MiOpenApi.postJson<ActionResult>("/api/action", {
    action: "unlinkRemote",
    remoteId,
  });
}

export function deleteRemote(remoteId: string): Promise<ActionResult> {
  return window.MiOpenApi.postJson<ActionResult>("/api/action", {
    action: "deleteRemote",
    remoteId,
  });
}
