export const identity = <A>(a: A): A => a;

export const unreachable = <A>(_: never): A => {
  throw new Error(`'unreachable' called`, _);
};
