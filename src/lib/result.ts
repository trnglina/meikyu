export type Ok<D> = D extends Error ? never : D;

export type Err<E extends Error> = E;

export type Result<D, E extends Error> = Ok<D> | Err<E>;
export type PromiseResult<E, D extends Error> = Promise<Result<E, D>>;

export const isOk = <D, E extends Error>(result: Result<D, E>): result is Ok<D> => !(result instanceof Error);
export const isErr = <D, E extends Error>(result: Result<D, E>): result is Err<E> => result instanceof Error;

export class NotFoundError extends Error {}
export class UnauthorizedError extends Error {}
