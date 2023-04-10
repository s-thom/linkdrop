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
