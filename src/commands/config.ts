import { Command, RegisterCommand, type TransformedArguments } from '@skyra/http-framework';
import { PermissionFlagsBits } from 'discord-api-types/v10';

@RegisterCommand((builder) =>
	builder //
		.setName('config')
		.setDescription('Change the settings of the game')
		.setDMPermission(false)
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
		.addRoleOption((builder) =>
			builder //
				.setName('alive_role')
				.setDescription('The role to grant when a player is in the game and alive')
				.setRequired(false)
		)
		.addRoleOption((builder) =>
			builder //
				.setName('dead_role')
				.setDescription('The role to grant when a player is in the game but dead')
				.setRequired(false)
		)
)
export class UserCommand extends Command {
	public override async chatInputRun(
		interaction: Command.ChatInputInteraction,
		{ alive_role, dead_role }: { alive_role: TransformedArguments.Role | undefined; dead_role: TransformedArguments.Role | undefined }
	) {
		console.log(alive_role, dead_role);
		await interaction.defer();
		const guild = await this.container.pocketbase.collection('guilds').getList(1, 1, { filter: `guild_id='${interaction.guild_id}'` });
		if (guild.items.length === 0) {
			await this.container.pocketbase
				.collection('guilds')
				.create({ guild_id: interaction.guild_id, alive_role: alive_role?.id, dead_role: dead_role?.id });
		} else {
			await this.container.pocketbase.collection('guilds').update(guild.items[0].id, { alive_role: alive_role?.id, dead_role: dead_role?.id });
		}
		return interaction.followup({ content: 'Success.' });
	}
}
