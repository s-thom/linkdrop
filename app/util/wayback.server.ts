export interface WaybackAuth {
  key: string;
  secret: string;
}

export interface WaybackOptions {
  auth?: WaybackAuth;
}

const SAVE_URL = "https://web.archive.org/save";
const ARCHIVE_URL_BASE = "https://web.archive.org/web";

interface WaybackSaveResponse {
  url: string;
  job_id: string;
}

interface SaveToWaybackResponse {
  url: string;
}

export async function savePageToWaybackMachine(
  url: string,
  { auth }: WaybackOptions
): Promise<SaveToWaybackResponse> {
  const headers = new Headers();
  if (auth) {
    headers.append("Authorization", `LOW ${auth.key}:${auth.secret}`);
  }
  const body = new URLSearchParams({ url });

  const response = await fetch(SAVE_URL, { body, headers, method: "POST" });
  const responseData: WaybackSaveResponse = await response.json();

  return {
    url: `${ARCHIVE_URL_BASE}/${responseData.url}`,
  };
}

export function validateWaybackFormData(
  formData: FormData
):
  | { status: "success"; values: { key: string; secret: string } }
  | { status: "error"; errors: { key?: string; secret?: string } } {
  const key = formData.get("key");
  if (typeof key !== "string") {
    return { status: "error", errors: { key: "Key is not valid" } };
  }
  const secret = formData.get("secret") ?? "";
  if (typeof secret !== "string") {
    return { status: "error", errors: { key: "Secret is not valid" } };
  }

  return { status: "success", values: { key, secret } };
}
