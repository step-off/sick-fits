const Query = {
	async items(parent, args, ctx, info) {
		return  await ctx.db.query.items()
	}
};

module.exports = Query;
