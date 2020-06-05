const yup = require("yup")

const product_schema = yup.object().shape({
  name: yup.string()
    .required()
    .trim(),
  category: yup.string().required().trim(),
  price: yup.number().required()
})

module.exports = product_schema