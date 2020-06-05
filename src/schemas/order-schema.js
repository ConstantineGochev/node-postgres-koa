const yup = require("yup")

const order_schema = yup.object().shape({
  date: yup.date().required(),
  status: yup.string().required().trim(),
  products: yup.array().of(yup.number())
})

module.exports = order_schema