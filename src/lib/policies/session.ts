import { isOwnResource } from '$lib/policies/utilities';

export const canDeleteSession = isOwnResource('session');
