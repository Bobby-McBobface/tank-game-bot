import { type PlayersRecord } from '#lib/database';
import { ACTION_COOLDOWN_SECONDS } from '#lib/config';

/**
 * Define a function to check if the user can execute an action
 * @param user PlayersRecord
 * @returns A tuple containing if the action succeeded, or if the action failed. If it failed, an error message will be returned.
 */
export function canExecuteActionRequiringPoints(user: PlayersRecord): [true, null] | [false, string] {
	// If the user has no action points, return false
	if (user.action_points <= 0) {
		return [false, 'You have no action points remaning.'];
	}

	// If the user has no health, return false
	if (user.health <= 0) {
		return [false, 'You are dead.'];
	}

	// Get the current timestamp in milliseconds
	const now = Date.now();
	// Get the last_action_at timestamp in milliseconds from the user by parsing the ISO string
	const last_action_at = new Date(user.last_action_at).getTime();
	// Calculate the difference between now and last_action_at in seconds
	const difference = (now - last_action_at) / 1000;
	// If the difference is less than or equal to ACTION_COOLDOWN, return false
	if (difference <= ACTION_COOLDOWN_SECONDS) {
		const action_allowed_at = Math.round(last_action_at / 1000 + ACTION_COOLDOWN_SECONDS);
		// Discord relative timestamp formatting will make the message '...perform an action `in xx minutes`'
		return [false, `You are on cooldown. You are allowed to perform an action <t:${action_allowed_at}:R>.`];
	}

	// Otherwise, return true
	return [true, null];
}

export enum Actions {
	move,
	send_points,
	attack
}
