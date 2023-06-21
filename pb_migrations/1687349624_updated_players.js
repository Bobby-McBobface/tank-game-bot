migrate(
	(db) => {
		const dao = new Dao(db);
		const collection = dao.findCollectionByNameOrId('hhorcr6ji8eahc6');

		// update
		collection.schema.addField(
			new SchemaField({
				system: false,
				id: 'f1wseybh',
				name: 'user_id',
				type: 'text',
				required: true,
				unique: false,
				options: {
					min: null,
					max: null,
					pattern: ''
				}
			})
		);

		// update
		collection.schema.addField(
			new SchemaField({
				system: false,
				id: 'txglikej',
				name: 'guild_id',
				type: 'text',
				required: true,
				unique: false,
				options: {
					min: null,
					max: null,
					pattern: ''
				}
			})
		);

		// update
		collection.schema.addField(
			new SchemaField({
				system: false,
				id: '5nraxafd',
				name: 'avatar_emote_id',
				type: 'text',
				required: true,
				unique: false,
				options: {
					min: null,
					max: null,
					pattern: ''
				}
			})
		);

		return dao.saveCollection(collection);
	},
	(db) => {
		const dao = new Dao(db);
		const collection = dao.findCollectionByNameOrId('hhorcr6ji8eahc6');

		// update
		collection.schema.addField(
			new SchemaField({
				system: false,
				id: 'f1wseybh',
				name: 'user_id',
				type: 'text',
				required: false,
				unique: false,
				options: {
					min: null,
					max: null,
					pattern: ''
				}
			})
		);

		// update
		collection.schema.addField(
			new SchemaField({
				system: false,
				id: 'txglikej',
				name: 'guild_id',
				type: 'text',
				required: false,
				unique: false,
				options: {
					min: null,
					max: null,
					pattern: ''
				}
			})
		);

		// update
		collection.schema.addField(
			new SchemaField({
				system: false,
				id: '5nraxafd',
				name: 'avatar_emote_id',
				type: 'text',
				required: false,
				unique: false,
				options: {
					min: null,
					max: null,
					pattern: ''
				}
			})
		);

		return dao.saveCollection(collection);
	}
);
