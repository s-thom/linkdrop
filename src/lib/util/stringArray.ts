export function encodeStringArray(arr: string[]): string {
  return arr
    .map((tag) => encodeURIComponent(tag.toLocaleLowerCase()))
    .join(" ");
}

export function decodeStringArray(str: string): string[] {
  if (!str) {
    return [];
  }

  // Plusses are weird in this app.
  // They're valid separators, but also valid as a prefix.
  const splitWithoutPlus = str
    .split(/[, ]/)
    .map((item) => decodeURIComponent(item).toLocaleLowerCase());

  // At this point, all "words" either:
  // 1. have no plusses
  // 2. have a plus as a prefix
  // 3. are a plus separated string of other words
  // 4. are a plus separated string of words prefixed by a plus
  // Point #4 makes this all horrible. Why do I do this to myself.
  // If I hadn't made plus the inclusive prefix, then the above `.split()`
  // would have just included a plus in the regex.
  // It would have been that simple.
  const arr = splitWithoutPlus.flatMap((partial) => {
    // Regex explanation:
    // first option
    //   capture
    //     optional plus at start of string
    //     any non-plus characters
    // second group
    //   when there's a plus
    //   capture
    //     a single plus
    //     any non-plus characters
    const matches = Array.from(
      partial.matchAll(/((?:^\+)?[^+\n]+)|(?:\+(\+[^+\n]+))/g),
    );
    if (!matches) {
      return [];
    }

    // Given the above matches, we want to do a basic coalesce
    return matches.map((match) => match[1] ?? match[2]);
  });

  return arr;
}
