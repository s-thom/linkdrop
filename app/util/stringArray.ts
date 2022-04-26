export function encodeStringArray(arr: string[]): string {
  return arr
    .map((tag) => encodeURIComponent(tag.toLocaleLowerCase()))
    .join(" ");
}

export function decodeStringArray(str: string): string[] {
  return str
    ? str
        .split(/[,+ ]/)
        .map((item) => decodeURIComponent(item).toLocaleLowerCase())
    : [];
}
