const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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
	async signup(parent, args, ctx, info) {
		args.email = args.email.toLowerCase();
		const password = await bcrypt.hash(args.password, 10);
		const user = await ctx.db.mutation.createUser({
			data: {
				...args,
				password,
				permissions: {set: ['USER']}
			}
		}, info);
		const token = jwt.sign({userId: user.id}, process.env.APP_SECRET);
		ctx.response.cookie('token', token, {
			httpOnly: true,
			maxAge: 1000 * 3600 * 24 * 365,
		});
		return user;
	}
};

module.exports = mutations;
