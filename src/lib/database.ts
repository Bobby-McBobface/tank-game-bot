import PocketBase, { Record } from 'pocketbase';
import { container } from '@skyra/http-framework';
import { envParseString } from '@skyra/env-utilities';

const pb = new PocketBase(envParseString('POCKETBASE_URL'));
container.pocketbase = pb;

export interface PlayersRecord extends Record {
	user_id: string;
	guild_id: string;
	avatar: string;
	avatar_emote_id: string;
	x_pos: number;
	y_pos: number;
	health: number;
	action_points: number;
	last_action_at: string;
}

declare module '@sapphire/pieces' {
	export interface Container {
		pocketbase: PocketBase;
	}
}
