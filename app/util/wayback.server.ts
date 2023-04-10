export interface WaybackAuth {
  key: string;
  secret: string;
}

export interface WaybackOptions {
  auth?: WaybackAuth;
}

const SAVE_URL = "https://web.archive.org/save";

interface WaybackSaveResponse {
  url: string;
  job_id: string;
}

export async function savePageToWaybackMachine(
  url: string,
  { auth }: WaybackOptions
) {
  const headers = new Headers();
  if (auth) {
    headers.append("Authorization", `LOW ${auth.key}:${auth.secret}`);
  }
  const body = new URLSearchParams({ url });

  const response = await fetch(SAVE_URL, { body, headers, method: "POST" });
  const responseData: WaybackSaveResponse = await response.json();

  return responseData;
}
