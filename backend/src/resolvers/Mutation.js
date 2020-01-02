const mutations = {
	async createItem(parent, args, ctx, info) {
		return await ctx.db.mutation.createItem({
			...args
		}, info);
	},
	async updateItem(parent, args, ctx, info) {
		const {data, id} = args;

		return await ctx.db.mutation.updateItem({
			data,
			where: {
				id
			}
		}, info)
	},
	async deleteItem(parent, args, ctx, info) {
		const where = {id: args.id};
		const item = await ctx.db.query.item({where}, `{ id title}`);
		return ctx.db.mutation.deleteItem({where}, info);
	},
};

module.exports = mutations;
