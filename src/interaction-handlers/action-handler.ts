import type { PlayersRecord } from '#lib/database';
import { canExecuteActionRequiringPoints, Actions } from '#lib/util';
import { InteractionHandler } from '@skyra/http-framework';
import { Routes } from 'discord-api-types/v10';

export class MessageComponentInteractionHandler extends InteractionHandler {
	public async run(interaction: InteractionHandler.ButtonInteraction, [user_id, action, userId, targetId]: [string, Actions, string, string]) {
		// Don't allow other users to hijack buttons
		if (interaction.user.id !== user_id) {
			return interaction.deferUpdate();
		}
		await interaction.defer();

		// Query the database for the user and the target by their ids using the collection method
		const user = await this.container.pocketbase.collection('players').getOne<PlayersRecord>(userId);
		const target = await this.container.pocketbase.collection('players').getOne<PlayersRecord>(targetId);

		// Check if the user can perform an action
		const [canPerform, errorMessage] = canExecuteActionRequiringPoints(user);
		if (!canPerform) {
			return interaction.followup({ content: errorMessage });
		}

		if (target.health === 0) {
			return interaction.followup({ content: 'The person you are targetting has died.' });
		}

		// Calculate the distance between the user and the target by their x_pos and y_pos
		const distance = Math.max(Math.abs(user.x_pos - target.x_pos), Math.abs(user.y_pos - target.y_pos));

		// If the distance is less than or equal to 2, tell the user off
		if (distance > 2) {
			return interaction.followup({ content: 'You are not in range. You and/or your target have moved since the buttons were sent.' });
		}
		if (Number(action) === Actions.attack) await this.attack(user, target, interaction);
		else if (Number(action) === Actions.send_points) await this.give_points(user, target);
		else return interaction.followup({ content: 'This should never happen.' });

		return interaction.followup({ content: 'Success.' });
	}

	private async attack(user: PlayersRecord, target: PlayersRecord, interaction: InteractionHandler.ButtonInteraction) {
		// TODO: transactions when they get added to Pocketbase
		await this.container.pocketbase.collection('players').update<PlayersRecord>(user.id, {
			action_points: user.action_points - 1,
			last_action_at: new Date().toISOString()
		});
		await this.container.pocketbase.collection('players').update<PlayersRecord>(target.id, {
			health: target.health - 1
		});

		if (target.health - 1 <= 0) {
			// Give alive role and assign it
			const guild = await this.container.pocketbase.collection('guilds').getList(1, 1, { filter: `guild_id='${interaction.guild_id}'` });
			if (interaction.guild_id && guild.items.length > 0 && guild.items[0].alive_role && guild.items[0].dead_role) {
				await this.container.rest.delete(Routes.guildMemberRole(interaction.guild_id, target.user_id, guild.items[0].alive_role));
				await this.container.rest.put(Routes.guildMemberRole(interaction.guild_id, target.user_id, guild.items[0].dead_role));
			}
		}
	}

	private async give_points(user: PlayersRecord, target: PlayersRecord) {
		// TODO: transactions when they get added to Pocketbase
		await this.container.pocketbase.collection('players').update<PlayersRecord>(user.id, {
			action_points: user.action_points - 1,
			last_action_at: new Date().toISOString()
		});
		await this.container.pocketbase.collection('players').update<PlayersRecord>(target.id, {
			action_points: target.action_points + 1
		});
	}
}
