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
	}
};

module.exports = mutations;
