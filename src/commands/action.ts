import { Command, RegisterCommand, RegisterSubCommand } from '@skyra/http-framework';
import { ActionRowBuilder, ButtonBuilder } from '@discordjs/builders';
import { ButtonStyle, type APIActionRowComponent, type APIButtonComponent } from 'discord-api-types/v10';
import { type PlayersRecord } from '#lib/database';
import { Actions } from '#lib/util';

@RegisterCommand((builder) =>
	builder //
		.setName('action')
		.setDescription('Hmmm')
		.setDMPermission(false)
)
export class UserCommand extends Command {
	@RegisterSubCommand((builder) =>
		builder //
			.setName('move')
			.setDescription('Move your tank')
	)
	public async move(interaction: Command.ChatInputInteraction) {
		return this.sendButtons(interaction, Actions.move);
	}

	@RegisterSubCommand((builder) =>
		builder //
			.setName('give-points')
			.setDescription('Give points to someone')
	)
	public async givePoints(interaction: Command.ChatInputInteraction) {
		return this.sendButtons(interaction, Actions.attack);
	}

	@RegisterSubCommand((builder) =>
		builder //
			.setName('attack')
			.setDescription('Attack someone')
	)
	public async attack(interaction: Command.ChatInputInteraction) {
		return this.sendButtons(interaction, Actions.attack);
	}

	private async sendButtons(interaction: Command.ChatInputInteraction, action: Actions) {
		await interaction.defer();
		const data = await this.container.pocketbase
			.collection('players')
			.getFullList<PlayersRecord>({ filter: `guild_id='${interaction.guildId}'` });
		const myself = data.find((v) => v.user_id === interaction.member?.user.id);
		if (!myself) {
			return interaction.followup({ content: 'You have not joined the game.' });
		}

		// Create an empty array of ActionRowBuilder
		const rows: APIActionRowComponent<APIButtonComponent>[] = [];

		// Loop through the possible values of dY from -2 to 2
		for (let dY = -2; dY <= 2; dY++) {
			// Create a new ActionRowBuilder for each row
			const row = new ActionRowBuilder<ButtonBuilder>();

			// Loop through the possible values of dX from -2 to 2
			for (let dX = -2; dX <= 2; dX++) {
				// Create a new ButtonBuilder for each button
				const button = new ButtonBuilder();

				// Set the customId with the values of dX and dY
				button.setCustomId(`should-be-disabled.${dX}.${dY}`);

				// Set the style to Primary
				button.setStyle(ButtonStyle.Primary);

				// If dX and dY are both zero, disable the button and set the label to "You"
				if (dX === 0 && dY === 0) {
					button.setDisabled(true);
					button.setEmoji({ name: myself.user_id, id: myself.avatar_emote_id });
					button.setStyle(ButtonStyle.Secondary);
				} else {
					// Otherwise, find the player in the data array that matches the x_pos and y_pos
					const player = data.find((p) => p.x_pos === myself.x_pos + dX && p.y_pos === myself.y_pos + dY);
					if (player) {
						button.setEmoji({ name: player.user_id, id: player.avatar_emote_id });
					}

					// Handle movement
					if (action === Actions.move) {
						if (player) {
							// Ensure 2 players cannot overlap
							button.setDisabled(true);
						} else {
							// Set the customId to the player's ID and the coordinates they want to move to
							button.setCustomId(`movement-handler.${myself.id}.${myself.x_pos + dX}.${myself.y_pos + dY}`);
							button.setLabel('឵');
						}
					} else {
						// Handle giving points and attacking
						// eslint-disable-next-line no-lonely-if
						if (player) {
							// Set the customId to action, player's pocketbase ID and target's pocketbase ID
							button.setCustomId(`action-handler.${action}.${myself.id}.${player.id}`);
						} else {
							// Otherwise, disable the button and set the label to "Empty"
							button.setDisabled(true);
							button.setLabel('឵');
						}
					}
				}

				// Add the button to the row
				row.addComponents(button);
			}

			// Add the row to the rows array
			rows.push(row.toJSON());
		}
		return interaction.followup({ components: rows });
	}
}
