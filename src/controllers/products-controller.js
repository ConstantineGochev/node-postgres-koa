const db = require("../db")
module.exports = {
  all(ctx) {
    db.query("SELECT * FROM products", (err, products) => {
      if (err) {
        return next(err)
      }
      ctx.body = {
        products
      };
    })
  },
  async add_one(ctx) {},
  async update_one(ctx) {},
  async delete_one(ctx) {}
};