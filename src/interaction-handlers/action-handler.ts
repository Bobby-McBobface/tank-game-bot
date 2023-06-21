import type { PlayersRecord } from '#lib/database';
import { canExecuteActionRequiringPoints, Actions } from '#lib/util';
import { InteractionHandler } from '@skyra/http-framework';

export class MessageComponentInteractionHandler extends InteractionHandler {
	public async run(interaction: InteractionHandler.Interaction, [action, userId, targetId]: [Actions, string, string]) {
		await interaction.deferUpdate();

		// Query the database for the user and the target by their ids using the collection method
		const user = await this.container.pocketbase.collection('players').getOne<PlayersRecord>(userId);
		const target = await this.container.pocketbase.collection('players').getOne<PlayersRecord>(targetId);

		// Check if the user can perform an action
		if (!canExecuteActionRequiringPoints(user)) {
			return interaction.followup({ content: 'Please obtain more action points or wait.' });
		}

		// Calculate the L1 distance between the user and the target by their x_pos and y_pos
		const distance = Math.abs(user.x_pos - target.x_pos) + Math.abs(user.y_pos - target.y_pos);

		// If the distance is less than or equal to 2, tell the user off
		if (distance > 2) {
			return interaction.followup({ content: 'Invalid.' });
		}
		if (Number(action) === Actions.attack) await this.attack(user, target);
		else if (Number(action) === Actions.give_points) await this.give_points(user, target);
		else return interaction.followup({ content: 'This should never happen. ' });
		return interaction.followup({ content: 'Success' });
	}

	private async attack(user: PlayersRecord, target: PlayersRecord) {
		await this.container.pocketbase.collection('players').update<PlayersRecord>(user.id, {
			action_points: user.action_points - 1,
			last_action_at: new Date().toISOString()
		});
		await this.container.pocketbase.collection('players').update<PlayersRecord>(target.id, {
			health: target.health - 1
		});
	}

	private async give_points(user: PlayersRecord, target: PlayersRecord) {
		await this.container.pocketbase.collection('players').update<PlayersRecord>(user.id, {
			action_points: user.action_points - 1,
			last_action_at: new Date().toISOString()
		});
		await this.container.pocketbase.collection('players').update<PlayersRecord>(target.id, {
			action_points: target.action_points + 1
		});
	}
}
