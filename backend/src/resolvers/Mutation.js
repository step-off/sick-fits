const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {randomBytes} = require('crypto');
const {promisify} = require('util');
const {hasPermission} = require("../utils");

const mutations = {
	async createItem(parent, args, ctx, info) {
		const userId = ctx.request.userId;
		if (!userId) {
			throw 'You are not logged in';
		}
		return await ctx.db.mutation.createItem({
			data: {
				...args.data,
				user: {
					connect: {
						id: userId,
					}
				}
			}
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
		const item = await ctx.db.query.item({where}, `{ id title user { id }}`);
		const ownsItem = item.user.id === ctx.request.userId;
		const hasPermissions = ctx.request.user.permissions.some(permission => {
				const isAdmin = permission === 'ADMIN';
				const hasDeletePermission = permission === 'ITEMDELETE';
				return isAdmin || hasDeletePermission;
			}
		);

		if (!ownsItem && !hasPermissions) {
			throw new Error("You don't have permission to delete this item!");
		}
		return ctx.db.mutation.deleteItem({where}, info);
	},
	async signup(parent, args, ctx, info) {
		args.email = args.email.toLowerCase();
		const password = await bcrypt.hash(args.password, 10);
		const user = await ctx.db.mutation.createUser({
			data: {
				...args,
				password,
				permissions: {set: ['USER', 'PERMISSIONUPDATE']}
			}
		}, info);
		const token = jwt.sign({userId: user.id}, process.env.APP_SECRET);
		ctx.response.cookie('token', token, {
			httpOnly: true,
			maxAge: 1000 * 3600 * 24 * 365,
		});
		return user;
	},
	async signin(parent, args, ctx, info) {
		const email = args.email.toLowerCase();
		const password = args.password;
		const user = await ctx.db.query.user({
			where: {email}
		});
		if (!user) {
			throw `No such user found for ${email}`
		}
		const isValid = await bcrypt.compare(password, user.password);
		if (!isValid) {
			throw `Invalid password`
		}
		const token = jwt.sign({userId: user.id}, process.env.APP_SECRET);
		ctx.response.cookie('token', token, {
			httpOnly: true,
			maxAge: 1000 * 3600 * 24 * 365,
		});
		return user;
	},
	async signout(parent, args, ctx, info) {
		ctx.response.clearCookie('token');
		return {
			message: 'Successfully signed out!'
		}
	},
	async requestPasswordReset(parent, args, ctx, info) {
		const user = await ctx.db.query.user({where: {email: args.email}});
		if (!user) {
			throw new Error(`No such user found for email ${args.email}`);
		}
		const randomBytesPromiseified = promisify(randomBytes);
		const resetToken = (await randomBytesPromiseified(20)).toString('hex');
		const resetTokenExpiry = Date.now() + 3600000; // 1 hour from now
		const res = await ctx.db.mutation.updateUser({
			where: {email: args.email},
			data: {resetToken, resetTokenExpiry},
		});
		return {message: ''};
	},
	async resetPassword(parent, args, ctx, info) {
		if (args.password !== args.confirmPassword) {
			throw new Error("Yo Passwords don't match!");
		}
		const [user] = await ctx.db.query.users({
			where: {
				resetToken: args.resetToken,
				resetTokenExpiry_gte: Date.now() - 3600000,
			},
		});
		if (!user) {
			throw new Error('This token is either invalid or expired!');
		}
		const password = await bcrypt.hash(args.password, 10);
		const updatedUser = await ctx.db.mutation.updateUser({
			where: {email: user.email},
			data: {
				password,
				resetToken: null,
				resetTokenExpiry: null,
			},
		});
		const token = jwt.sign({userId: updatedUser.id}, process.env.APP_SECRET);
		ctx.response.cookie('token', token, {
			httpOnly: true,
			maxAge: 1000 * 60 * 60 * 24 * 365,
		});
		return updatedUser;
	},
	async updateUserPermissions(parent, args, ctx, info) {
		const userId = ctx.request.userId;
		if (!userId) {
			throw 'You are not logged in';
		}
		const currentUser = await ctx.db.query.user({
			where: {
				id: userId
			}
		}, info);
		if (currentUser) {
			hasPermission(currentUser, ['ADMIN', 'PERMISSIONUPDATE'])
			return ctx.db.mutation.updateUser({
				data: {
					permissions: {
						set: args.permissions
					}
				},
				where: {
					id: args.userId
				}
			}, info)
		}
	}
};

module.exports = mutations;
