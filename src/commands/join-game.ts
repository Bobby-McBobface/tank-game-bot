import { BOARD_HEIGHT, BOARD_WIDTH } from '#lib/config';
import { type PlayersRecord } from '#lib/database';
import { Command, RegisterCommand } from '@skyra/http-framework';
import { Routes, type RESTPostAPIGuildEmojiResult, type RESTPostAPIGuildEmojiJSONBody } from 'discord-api-types/v10';

@RegisterCommand((builder) =>
	builder //
		.setName('join-game')
		.setDescription('Join the game and create a new tank with a random position on the grid')
		.setDMPermission(false)
)
export class UserCommand extends Command {
	public override async chatInputRun(interaction: Command.ChatInputInteraction) {
		if (!interaction.guild_id) {
			return interaction.reply({ content: 'You must run this command in a server, not a DM.' });
		}
		await interaction.defer();
		// Get the user_id, guild_id, and avatar hash from the interaction
		const user_id = interaction.user.id;
		const { guild_id } = interaction;
		const { avatar } = interaction.user;

		// Check if the player is already in the game by querying the database
		const player = await this.container.pocketbase.collection('players').getList<PlayersRecord>(1, 1, {
			filter: `user_id='${user_id}' && guild_id='${guild_id}'`
		});
		// If the player exists, return a followup message saying they have already joined
		if (player.items.length > 0) {
			return interaction.followup({ content: 'You have already joined the game.' });
		}

		const players = await this.container.pocketbase.collection('players').getFullList<PlayersRecord>({
			filter: `user_id='${user_id}' && guild_id='${guild_id}'`
		});

		// Generate a random x_pos and y_pos between 0 and BOARD_WIDTH and 0 and BOARD_HEIGHT respectively
		// If there's already a player in the position, try again up to 200 attempts
		let x_pos: number;
		let y_pos: number;
		let attempts = 0;
		do {
			x_pos = Math.floor(Math.random() * BOARD_WIDTH);
			y_pos = Math.floor(Math.random() * BOARD_HEIGHT);
			attempts++;
		} while (players.find((v) => v.x_pos === x_pos && v.y_pos === y_pos) || attempts < 200);

		if (attempts >= 200) {
			return interaction.followup({
				content: 'Could not place you on the board. Perhaps the board is full. If it is not, try executing the command again.'
			});
		}

		// Download the avatar from the user using the rest instance and the avatar hash
		let avatarUrl;
		if (avatar === null) {
			avatarUrl = this.container.rest.cdn.defaultAvatar(
				Number(interaction.user.discriminator) ? Number(interaction.user.discriminator) % 5 : Number((BigInt(user_id) >> 25n) % 6n)
			);
		} else {
			avatarUrl = this.container.rest.cdn.avatar(user_id, avatar, { size: 128, extension: 'png' });
		}
		const avatarData = await (await fetch(avatarUrl)).arrayBuffer();

		// Upload the emoji to the guild using the rest instance and get its id
		const emojiData = (await this.container.rest.post(Routes.guildEmojis(guild_id), {
			body: {
				name: user_id,
				image: `data:image/png;base64,${Buffer.from(avatarData).toString('base64')}`
			} as RESTPostAPIGuildEmojiJSONBody
		})) as RESTPostAPIGuildEmojiResult;

		const emote_id = emojiData.id;

		// Set the health to 3 and action points to 0
		const health = 3;
		const action_points = 0;

		// Get the current timestamp as last_action_at
		const last_action_at = new Date().toISOString();

		// Create a new FormData instance and append the data fields
		const formData = new FormData();
		formData.append('user_id', user_id);
		formData.append('guild_id', guild_id);
		formData.append('x_pos', `${x_pos}`);
		formData.append('y_pos', `${y_pos}`);
		formData.append('health', `${health}`);
		formData.append('action_points', `${action_points}`);
		formData.append('avatar_emote_id', `${emote_id}`);
		formData.append('avatar', new Blob([avatarData]));
		formData.append('last_action_at', last_action_at);

		// Upload the data to the database using the pocketbase instance and create a new record
		await this.container.pocketbase.collection('players').create(formData);

		// Return a followup message saying they have successfully joined the game
		return interaction.followup({
			content: 'You have successfully joined the game.'
		});
	}
}
