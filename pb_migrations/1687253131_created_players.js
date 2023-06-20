migrate(
	(db) => {
		const collection = new Collection({
			id: 'hhorcr6ji8eahc6',
			created: '2023-06-20 09:25:31.485Z',
			updated: '2023-06-20 09:25:31.485Z',
			name: 'players',
			type: 'base',
			system: false,
			schema: [
				{
					system: false,
					id: 'ngrnwqz9',
					name: 'user_id',
					type: 'number',
					required: true,
					unique: false,
					options: {
						min: null,
						max: null
					}
				},
				{
					system: false,
					id: 'zx5djczj',
					name: 'guild_id',
					type: 'number',
					required: true,
					unique: false,
					options: {
						min: null,
						max: null
					}
				},
				{
					system: false,
					id: 'eiytngka',
					name: 'avatar_emote_id',
					type: 'number',
					required: true,
					unique: false,
					options: {
						min: null,
						max: null
					}
				},
				{
					system: false,
					id: 'ereicvp2',
					name: 'avatar',
					type: 'file',
					required: true,
					unique: false,
					options: {
						maxSelect: 1,
						maxSize: 5242880,
						mimeTypes: [],
						thumbs: [],
						protected: false
					}
				},
				{
					system: false,
					id: '76xrhdtm',
					name: 'x_pos',
					type: 'number',
					required: true,
					unique: false,
					options: {
						min: 1,
						max: 20
					}
				},
				{
					system: false,
					id: 'lrgkpj4f',
					name: 'y_pos',
					type: 'number',
					required: true,
					unique: false,
					options: {
						min: 1,
						max: 20
					}
				},
				{
					system: false,
					id: 'gilqspsk',
					name: 'health',
					type: 'number',
					required: false,
					unique: false,
					options: {
						min: null,
						max: 3
					}
				},
				{
					system: false,
					id: '5djvk44x',
					name: 'last_action_at',
					type: 'date',
					required: true,
					unique: false,
					options: {
						min: '',
						max: ''
					}
				}
			],
			indexes: [],
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
		const collection = dao.findCollectionByNameOrId('hhorcr6ji8eahc6');

		return dao.deleteCollection(collection);
	}
);
