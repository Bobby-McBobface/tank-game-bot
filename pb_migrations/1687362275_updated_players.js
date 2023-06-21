migrate(
	(db) => {
		const dao = new Dao(db);
		const collection = dao.findCollectionByNameOrId('hhorcr6ji8eahc6');

		// add
		collection.schema.addField(
			new SchemaField({
				system: false,
				id: 'rcnzhqhc',
				name: 'action_points',
				type: 'number',
				required: false,
				unique: false,
				options: {
					min: null,
					max: null
				}
			})
		);

		return dao.saveCollection(collection);
	},
	(db) => {
		const dao = new Dao(db);
		const collection = dao.findCollectionByNameOrId('hhorcr6ji8eahc6');

		// remove
		collection.schema.removeField('rcnzhqhc');

		return dao.saveCollection(collection);
	}
);
