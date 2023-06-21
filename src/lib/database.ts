import PocketBase, { Record } from 'pocketbase';
import { container } from '@skyra/http-framework';

const pb = new PocketBase('http://127.0.0.1:8090');
container.pocketbase = pb;

export interface PlayersRecord extends Record {
	user_id: string;
	guild_id: string;
	avatar: string;
	x_pos: number;
	y_pos: number;
	health: number;
	last_action_at: string;
}

declare module '@sapphire/pieces' {
	export interface Container {
		pocketbase: PocketBase;
	}
}
