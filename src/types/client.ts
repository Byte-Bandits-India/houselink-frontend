import type { RequestInit } from "next/dist/server/web/spec-extension/request";

export type RequestOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
  /** Skip automatic Authorization header injection */
  skipAuth?: boolean;
};
