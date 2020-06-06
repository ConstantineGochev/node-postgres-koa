const db = require("../db")
module.exports = {
  async by_id(id, ctx, next) {

    await next()
  },
  get(ctx) {
    db.query("SELECT * FROM products", (err, products) => {
      if (err) {
        return next(err)
      }
      ctx.body = {
        products
      };
    })
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
    const query = db.query(query_string, (err, result) => {
      done()
    })
    query.on("row", (row, result) => {
      ctx.body = {
        row
      }
    })
  },
  async put(ctx) {},
  async del(ctx) {}
};