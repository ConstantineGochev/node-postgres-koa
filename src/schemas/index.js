const order = require("./order-schema")
const product = require("./product-schema")

module.exports = (app) => {
  app.schemas = {
    order,
    product
  }
}