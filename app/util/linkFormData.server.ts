import type { FormErrors, FormValues } from "~/components/LinkForm";
import { decodeStringArray } from "./stringArray";

export function validateFormData(
  formData: FormData
):
  | { status: "success"; values: FormValues }
  | { status: "error"; errors: FormErrors } {
  const url = formData.get("url");
  if (typeof url !== "string") {
    return { status: "error", errors: { url: "URL is not valid" } };
  }
  const description = formData.get("description") ?? "";
  if (typeof description !== "string") {
    return { status: "error", errors: { url: "Description is not valid" } };
  }
  const tagsRaw = formData.get("tags") ?? "";
  if (typeof tagsRaw !== "string") {
    return { status: "error", errors: { url: "Tags not valid" } };
  }
  const tags = decodeStringArray(tagsRaw ?? "");
  // If the _tag_entry value is set, the user probably didn't hit enter. They'll probably still want this tag, though.
  if (formData.has("_tag_entry")) {
    const unsavedTag = formData.get("_tag_entry");
    if (unsavedTag && typeof unsavedTag === "string") {
      const candidateTags = decodeStringArray(unsavedTag);
      candidateTags.forEach((tag) => {
        if (tag && !tags.includes(unsavedTag)) {
          tags.push(tag);
        }
      });
    }
  }

  return {
    status: "success",
    values: { url, description, tags },
  };
}
