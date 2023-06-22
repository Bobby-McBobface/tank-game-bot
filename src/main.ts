import '#lib/setup';
import '#lib/database';
import { envIsDefined, envParseString, envParseInteger } from '@skyra/env-utilities';
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

const address = envParseString('HTTP_ADDRESS', '[::]');
const port = envParseInteger('HTTP_PORT', 3000);

await client.listen({ address, port });
console.log(`Listening on ${address}:${port}`);
