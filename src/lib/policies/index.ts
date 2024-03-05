import type { Session } from '$lib/models/session';
import type { User } from '$lib/models/user';

export interface Actor {
  readonly user: User;
  readonly session: Session;
}
