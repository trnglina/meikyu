import { hasPermission, isOwnResource } from '$lib/policies/utilities';

export const canListUserProfiles = hasPermission('manage_users');
export const canUpdateUserProfile = isOwnResource('userProfile');
export const canDeleteUserProfile = isOwnResource('userProfile');

export const canUpdateUserGroups = hasPermission('manage_users');

export const canReadUserCredentials = isOwnResource('userCredentials');
export const canUpdateUserCredentials = isOwnResource('userCredentials');
