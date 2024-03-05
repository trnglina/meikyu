type Intersection<T extends unknown[]> = T extends [infer H, ...infer Rest] ? H & Intersection<Rest>
  : NonNullable<unknown>;

export type Predicate<D> = (data: D) => boolean;

export const every = <Ds extends unknown[]>(
  ...predicates: { [K in keyof Ds]: Predicate<Ds[K]>; }
): Predicate<Intersection<Ds>> => {
  return (data: unknown): boolean => predicates.every((func) => func(data));
};

export const some = <Ds extends unknown[]>(
  ...predicates: { [K in keyof Ds]: Predicate<Ds[K]>; }
): Predicate<Intersection<Ds>> => {
  return (data: unknown): boolean => predicates.some((func) => func(data));
};
