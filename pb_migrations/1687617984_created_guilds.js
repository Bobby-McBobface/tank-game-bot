migrate(
	(db) => {
		const collection = new Collection({
			id: 'nonpyck87x7bopy',
			created: '2023-06-24 14:46:24.654Z',
			updated: '2023-06-24 14:46:24.654Z',
			name: 'guilds',
			type: 'base',
			system: false,
			schema: [
				{
					system: false,
					id: 'zwrpzwnp',
					name: 'guild_id',
					type: 'text',
					required: true,
					unique: false,
					options: {
						min: null,
						max: null,
						pattern: ''
					}
				},
				{
					system: false,
					id: 'zlzq8v03',
					name: 'alive_role',
					type: 'text',
					required: false,
					unique: false,
					options: {
						min: null,
						max: null,
						pattern: ''
					}
				},
				{
					system: false,
					id: 'jxej6kvv',
					name: 'dead_role',
					type: 'text',
					required: false,
					unique: false,
					options: {
						min: null,
						max: null,
						pattern: ''
					}
				}
			],
			indexes: ['CREATE INDEX `idx_YfTsWQw` ON `guilds` (`guild_id`)'],
			listRule: null,
			viewRule: null,
			createRule: null,
			updateRule: null,
			deleteRule: null,
			options: {}
		});

		return Dao(db).saveCollection(collection);
	},
	(db) => {
		const dao = new Dao(db);
		const collection = dao.findCollectionByNameOrId('nonpyck87x7bopy');

		return dao.deleteCollection(collection);
	}
);
