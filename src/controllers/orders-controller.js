const db = require("../db")
module.exports = {

  async get(ctx) {

    const res = await db.query("SELECT * FROM orders")
    ctx.body = {
      orders: res.rows
    };

  },
  async post(ctx) {
    const {
      body
    } = ctx.request
    let {
      order
    } = body
    const opts = {
      abortEarly: false
    }
    order = await ctx.app.schemas.order.validate(order, opts)
    const query_string = "INSERT INTO orders(_date, products, status) VALUES(" + "'" + [order.date, order.products, order.status].join("','") + "'" + ") RETURNING *";
    const res = await db.query(query_string)
    ctx.body = {
      order: res.rows[0]
    }
  },
  status: {
    async put(ctx) {

      const {
        id
      } = ctx.params
      const {
        status
      } = ctx.request.body
      const query_string = "UPDATE orders SET status=$1 WHERE id=$2 RETURNING *"
      const res = await db.query(query_string, [status, id])
      ctx.body = {
        order: res.rows[0]
      }
    }
  }
};