migrate(
	(db) => {
		const dao = new Dao(db);
		const collection = dao.findCollectionByNameOrId('hhorcr6ji8eahc6');

		// remove
		collection.schema.removeField('ngrnwqz9');

		// remove
		collection.schema.removeField('zx5djczj');

		// remove
		collection.schema.removeField('eiytngka');

		// add
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

		// add
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

		// add
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
	},
	(db) => {
		const dao = new Dao(db);
		const collection = dao.findCollectionByNameOrId('hhorcr6ji8eahc6');

		// add
		collection.schema.addField(
			new SchemaField({
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
			})
		);

		// add
		collection.schema.addField(
			new SchemaField({
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
			})
		);

		// add
		collection.schema.addField(
			new SchemaField({
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
			})
		);

		// remove
		collection.schema.removeField('f1wseybh');

		// remove
		collection.schema.removeField('txglikej');

		// remove
		collection.schema.removeField('5nraxafd');

		return dao.saveCollection(collection);
	}
);
