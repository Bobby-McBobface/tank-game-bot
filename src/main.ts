import '#lib/setup';
import { envIsDefined, envParseString } from '@skyra/env-utilities';
import { Client, container, Registry } from '@skyra/http-framework';

const client = new Client();
const registry = new Registry({
	token: envParseString('DISCORD_TOKEN')
});

await registry.load();

if (envIsDefined('GUILD_ID')) {
	await registry.registerGlobalCommandsInGuild(envParseString('GUILD_ID'));
} else {
	await registry.registerGlobalCommands();
}

await client.load();

client.on('error', (error) => container.logger.error(error));

const address = '[::]';
const port = 3000;

await client.listen({ address, port });
console.log(`Listening on ${address}:${port}`);
