const db = require("../db")
const util = require("../lib/util")
module.exports = {
  async get(ctx) {
    const res = await db.query("SELECT * FROM products")
    ctx.body = {
      products: res.rows
    };
  },
  async post(ctx) {
    const {
      body
    } = ctx.request
    let {
      product
    } = body
    const opts = {
      abortEarly: false
    }
    product = await ctx.app.schemas.product.validate(product, opts)
    var query_string = "INSERT INTO products(name, category, price) VALUES(" + "'" + [product.name, product.category, product.price].join("','") + "'" + ") RETURNING *";
    const res = await db.query(query_string)
    ctx.body = {
      product: res.rows[0]
    }

  },
  async put(ctx) {
    const {
      id
    } = ctx.params
    const {
      product
    } = ctx.request.body
    const query = util.update_item_by_id("products", id, product)
    const col_values = Object.keys(product).map(key => {
      return product[key]
    })
    const res = await db.query(query, col_values)
    console.log(res)
    ctx.body = {}

  },
  async del(ctx) {
    const {
      id
    } = ctx.params

    const query_string = "DELETE FROM products WHERE id = $1"
    const res = await db.query(query_string, [id])
    ctx.body = {}
  }
};