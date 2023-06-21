import { Command, RegisterCommand } from '@skyra/http-framework';
import { ActionRowBuilder, ButtonBuilder } from '@discordjs/builders';
import { ButtonStyle, type APIActionRowComponent, type APIButtonComponent } from 'discord-api-types/v10';
import { type PlayersRecord } from '#lib/database';

@RegisterCommand((builder) =>
	builder //
		.setName('action')
		.setDescription('Hmmm')
		.setDMPermission(false)
)
export class UserCommand extends Command {
	public override async chatInputRun(interaction: Command.ChatInputInteraction) {
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
						// If there is a player, set the label to their emoji
						button.setEmoji({ name: player.user_id, id: player.avatar_emote_id });
						// Set the customId to executor ID, target ID, real X and Y position of target
						button.setCustomId(`action-handler.${myself.user_id}.${player.user_id}.${myself.x_pos + dX}.${myself.y_pos + dY}`);
					} else {
						// Otherwise, disable the button and set the label to "Empty"
						button.setDisabled(true);
						button.setLabel('឵');
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
