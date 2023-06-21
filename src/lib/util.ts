import { type PlayersRecord } from '#lib/database';
import { container } from '@skyra/http-framework';

// Define a function to check if the user can execute an action
export async function canExecuteAction(userId: string) {
	// Query the database for the user by their id using the collection method
	const user = await container.pocketbase.collection('players').getOne<PlayersRecord>(userId);

	// Get the current timestamp in milliseconds
	const now = Date.now();

	// Get the last_action_at timestamp in milliseconds from the user by parsing the ISO string
	const last_action_at = new Date(user.last_action_at).getTime();

	// Calculate the difference between now and last_action_at in minutes
	const difference = (now - last_action_at) / (1000 * 60);

	// If the difference is more than or equal to 15, return true
	// For debugging, set the time to 1 minute. TODO: set it back in production
	if (difference >= 1) {
		return true;
	}
	// Otherwise, return false
	return false;
}
