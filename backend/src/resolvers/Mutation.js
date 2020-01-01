const mutations = {
	async createItem(parent, args, ctx, info) {
		return await ctx.db.mutation.createItem({
			...args
		}, info);
	}
};

module.exports = mutations;
