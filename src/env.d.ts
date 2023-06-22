import type { IntegerString } from '@skyra/env-utilities';

declare module '@skyra/env-utilities' {
	interface Env {
		DISCORD_TOKEN: string;
		DISCORD_PUBLIC_KEY: string;
		GUILD_ID: string;
		POCKETBASE_URL: string;
		HTTP_ADDRESS: string;
		HTTP_PORT: IntegerString;
	}
}

export default undefined;
