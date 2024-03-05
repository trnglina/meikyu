import type { Predicate } from '$lib/authorization';
import type { Permission } from '$lib/models/group';
import type { Actor } from '$lib/policies';

interface BasePolicyContext {
  readonly actor: Actor;
}

export const isOwnResource = <R extends { readonly userId: string; }, N extends string>(
  resource: N,
): Predicate<BasePolicyContext & { readonly [K in N]: R; }> =>
(ctx: BasePolicyContext & { readonly [K in N]: R; }) => ctx.actor.user.userId === ctx[resource].userId;

export const hasPermission = <P extends Permission>(
  key: P,
): Predicate<BasePolicyContext> =>
(ctx: BasePolicyContext) => ctx.actor.user.groups.some((group) => group.permissions.includes(key));
