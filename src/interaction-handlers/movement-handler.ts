import type { PlayersRecord } from '#lib/database';
import { InteractionHandler } from '@skyra/http-framework';
import { canExecuteActionRequiringPoints } from '#lib/util';

export class MessageComponentInteractionHandler extends InteractionHandler {
	public async run(interaction: InteractionHandler.ButtonInteraction, [user_id, userId, newX, newY]: [string, string, string, string]) {
		// Don't allow other users to hijack buttons
		if (interaction.user.id !== user_id) {
			return interaction.deferUpdate();
		}
		await interaction.defer();

		// Query the database for the user and the target by their ids using the collection method
		const user = await this.container.pocketbase.collection('players').getOne<PlayersRecord>(userId);

		// Check if the user can perform an action
		const [canPerform, errorMessage] = canExecuteActionRequiringPoints(user);
		if (!canPerform) {
			return interaction.followup({ content: errorMessage });
		}

		// Calculate the distance between the user and the target by their x_pos and y_pos
		const distance = Math.max(Math.abs(user.x_pos - Number(newX)), Math.abs(user.y_pos - Number(newY)));

		// If the distance is less than or equal to 2, tell the user off
		if (distance > 2) {
			return interaction.followup({ content: 'You are not in range. You have moved since the buttons were sent.' });
		}

		const targetSquare = await this.container.pocketbase
			.collection('players')
			.getList(1, 1, { filter: `guild_id='${interaction.guild_id}' && x_pos=${newX} && y_pos=${newY}` });

		// If someone is occupying the square, don't allow the user to move there
		if (targetSquare.items.length > 0) {
			return interaction.followup({ content: 'That square is occupied. Someone has moved onto this space since the buttons were sent.' });
		}
		await this.container.pocketbase
			.collection('players')
			.update<PlayersRecord>(userId, { x_pos: newX, y_pos: newY, last_action_at: new Date().toISOString() });

		return interaction.followup({ content: 'Success.' });
	}
}
