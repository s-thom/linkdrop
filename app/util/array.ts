export function splitMap<T, U>(
  arr: T[],
  filter: (x: T) => boolean,
  mapper: (x: T) => U,
): { include: U[]; exclude: U[] } {
  return arr.reduce<{ include: U[]; exclude: U[] }>(
    (val, item) => {
      (filter(item) ? val.include : val.exclude).push(mapper(item));
      return val;
    },
    { include: [], exclude: [] },
  );
}
