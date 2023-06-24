import { type PlayersRecord } from '#lib/database';
import { Command, RegisterCommand } from '@skyra/http-framework';
import { PermissionFlagsBits } from 'discord-api-types/v10';

@RegisterCommand((builder) =>
	builder //
		.setName('give-ap')
		.setDescription('Give 1 action point to everyone in the guild')
		.setDMPermission(false)
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
)
export class UserCommand extends Command {
	public override async chatInputRun(interaction: Command.ChatInputInteraction) {
		await interaction.defer();
		const players = await this.container.pocketbase
			.collection('players')
			.getFullList<PlayersRecord>({ filter: `guild_id=${interaction.guild_id}` });

		// No UPDATE ... WHERE ... and transactions in Pocketbase. TODO: refactor when feature is implemented
		const promises: Promise<any>[] = [];
		for (const player of players) {
			promises.push(this.container.pocketbase.collection('players').update(player.id, { action_points: player.action_points + 1 }));
		}
		await Promise.all(promises);
		return interaction.followup({ content: 'Success.' });
	}
}
