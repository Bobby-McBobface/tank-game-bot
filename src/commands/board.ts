import { BOARD_HEIGHT, BOARD_WIDTH } from '#lib/config';
import type { PlayersRecord } from '#lib/database';
import { Command, RegisterCommand } from '@skyra/http-framework';
import { createCanvas, loadImage } from 'canvas';

@RegisterCommand((builder) =>
	builder //
		.setName('board')
		.setDescription('View the current state of the game board.')
		.setDMPermission(false)
)
export class UserCommand extends Command {
	private cellSize = 64;

	private canvas = createCanvas(this.cellSize * BOARD_WIDTH, this.cellSize * BOARD_HEIGHT);
	private ctx = this.canvas.getContext('2d');

	private healthColours = {
		3: 'green',
		2: 'yellow',
		1: 'red'
	} as const;

	public override async chatInputRun(interaction: Command.ChatInputInteraction) {
		await interaction.defer();

		const players = await this.container.pocketbase
			.collection('players')
			.getFullList<PlayersRecord>({ filter: `guild_id='${interaction.guild_id}'` });

		await this.createGrid(players);

		await interaction.followup({
			attachments: [{ id: '0', filename: 'board.png' }],
			files: [{ name: 'board.png', data: this.canvas.toBuffer() }]
		});
	}

	private drawCell(x: number, y: number, color: string) {
		// Set the fill style to the given color
		this.ctx.fillStyle = color;
		// Draw a rectangle with 40 by 40 pixels at the given x and y coordinates
		this.ctx.fillRect(x * this.cellSize, y * this.cellSize, this.cellSize, this.cellSize);
		// Set the stroke style to black
		this.ctx.strokeStyle = 'black';
		this.ctx.lineWidth = 1;
		// Draw a border around the rectangle
		this.ctx.strokeRect(x * this.cellSize, y * this.cellSize, this.cellSize, this.cellSize);
	}

	// Define a function to draw an avatar
	private async drawAvatar(x: number, y: number, player: PlayersRecord) {
		// Get the file URL from the pocketbase instance using the avatar string
		const fileURL = this.container.pocketbase.getFileUrl(player, player.avatar);
		// Set the image source to the file URL
		const image = await loadImage(Buffer.from(await (await fetch(fileURL)).arrayBuffer()));
		// Draw the image with 40 by 40 pixels at the given x and y coordinates
		this.ctx.drawImage(image, x * this.cellSize, y * this.cellSize, this.cellSize, this.cellSize);
		// Draw a border around the rectangle depending on the health
		this.ctx.strokeStyle = this.healthColours[player.health as 3 | 2 | 1];
		// Ensure the rectangle is in the centre of the grid, and is a bit smaller than the size of the cell so it doesn't overflow into other cells
		this.ctx.strokeRect(
			x * this.cellSize + this.ctx.lineWidth / 2,
			y * this.cellSize + this.ctx.lineWidth / 2,
			this.cellSize - this.ctx.lineWidth,
			this.cellSize - this.ctx.lineWidth
		);
	}

	// Define a function to create the grid image
	private async createGrid(players: PlayersRecord[]) {
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		this.ctx.imageSmoothingEnabled = false;
		// Loop through the rows and columns of the grid. Draw the cells first
		for (let x = 0; x < BOARD_WIDTH; x++) {
			for (let y = 0; y < BOARD_HEIGHT; y++) {
				// Define the color variable
				let color: string;
				// If the sum of x and y is even, set the color to dark brown
				if ((x + y) % 2 === 0) {
					color = '#90826D';
				} else {
					// Otherwise, set the color to very dark brown
					color = '#6D523B';
				}
				// Draw an empty cell with the chosen color
				this.drawCell(x, y, color);
			}
		}

		this.ctx.lineWidth = 4;
		const drawAvatarPromises: Promise<void>[] = [];
		for (let x = 0; x < BOARD_WIDTH; x++) {
			for (let y = 0; y < BOARD_HEIGHT; y++) {
				// Query the database for a user at the current position
				const row = players.find((v) => v.x_pos === x && v.y_pos === y);
				// If there is a user, draw their avatar
				if (row) {
					drawAvatarPromises.push(this.drawAvatar(x, y, row));
				}
			}
		}
		await Promise.all(drawAvatarPromises);
	}
}
