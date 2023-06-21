migrate(
	(db) => {
		const dao = new Dao(db);
		const collection = dao.findCollectionByNameOrId('hhorcr6ji8eahc6');

		collection.indexes = [
			'CREATE UNIQUE INDEX `idx_EtRa9cL` ON `players` (\n  `user_id`,\n  `guild_id`\n)',
			'CREATE UNIQUE INDEX `idx_fhdqMTZ` ON `players` (\n  `x_pos`,\n  `y_pos`,\n  `guild_id`\n)'
		];

		return dao.saveCollection(collection);
	},
	(db) => {
		const dao = new Dao(db);
		const collection = dao.findCollectionByNameOrId('hhorcr6ji8eahc6');

		collection.indexes = ['CREATE UNIQUE INDEX `idx_EtRa9cL` ON `players` (\n  `user_id`,\n  `guild_id`\n)'];

		return dao.saveCollection(collection);
	}
);
