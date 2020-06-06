const db = require("../db")
module.exports = {
  async by_id(id, ctx, next) {
    await next()
  },
  async get(ctx) {
    ctx.body = {};
  },
  async post(ctx) {},
  async put(ctx) {}
};