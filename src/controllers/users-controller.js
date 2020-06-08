const _ = require("lodash")
const bcrypt = require("bcrypt")
const {
  ValidationError
} = require("../lib/errors")
const {
  generateJWTforUser
} = require("../lib/util")
const db = require("../db")

module.exports = {
  async get(ctx) {
    const user = generateJWTforUser(ctx.state.user)

    ctx.body = {
      user
    }
  },



  async login(ctx) {
    const {
      body
    } = ctx.request

    ctx.assert(
      _.isObject(body.user) && body.user.name && body.user.password,
      422,
      new ValidationError(["malformed request"], "", "name or password"),
    )
    let res = await db.query("SELECT * FROM users WHERE name=$1", [body.user.name])
    console.log(res)
    let user = res.rows[0]
    console.log(user)
    ctx.assert(
      user,
      401,
      new ValidationError(["is invalid"], "", "name or password"),
    )

    const is_valid = body.user.password === user.password ? true : false
    console.log(body.user.password)
    console.log(user.password)
    console.log(is_valid)
    ctx.assert(
      is_valid,
      401,
      new ValidationError(["is invalid"], "", "password"),
    )

    user = generateJWTforUser(user)

    ctx.body = {
      user: _.omit(user, ["password"])
    }
  },
}