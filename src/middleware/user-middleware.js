const {
  has
} = require("lodash")
const db = require("../db")

module.exports = async (ctx, next) => {
  if (has(ctx, "state.jwt.sub.id")) {
    const query_string = "SELECT * FROM users WHERE id=$1"
    const res = await db.query(query_string, [ctx.state.jwt.sub.id])
    ctx.state.user = res.rows[0]
  }

  return next()
}