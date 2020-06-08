const config = require("config")
const jwt = require("jsonwebtoken")
const _ = require("lodash")

function generateJWTforUser(user = {}) {
  return Object.assign({}, user, {
    token: jwt.sign({
        sub: _.pick(user, ["id", "name"]),
      },
      config.get("secret"), {
        expiresIn: "1h",
      },
    ),
  })
}

function update_item_by_id(table, id, cols) {
  // Setup static beginning of query
  var query = ['UPDATE ' + table];
  query.push('SET');

  // Create another array storing each set command
  // and assigning a number value for parameterized query
  let set = [];
  Object.keys(cols).forEach(function(key, i) {
    set.push(key + ' = ($' + (i + 1) + ')');
  });
  query.push(set.join(', '));

  // Add the WHERE statement to look up by id
  query.push('WHERE id = ' + id);

  // Return a complete query string
  return query.join(' ');
}

module.exports = {
  update_item_by_id,
  generateJWTforUser
}