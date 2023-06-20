import { container } from '@skyra/http-framework';
import { Logger } from '@skyra/logger';
import { setup } from '@skyra/env-utilities';

setup(new URL('../../.env', import.meta.url));

container.logger = new Logger();

declare module '@sapphire/pieces' {
	export interface Container {
		logger: Logger;
	}
}
