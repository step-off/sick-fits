const Query = {
	async items(parent, args, ctx, info) {
		return await ctx.db.query.items()
	},
	async item(parent, args, ctx, info) {
		return await ctx.db.query.item(args);
	}
};

module.exports = Query;
