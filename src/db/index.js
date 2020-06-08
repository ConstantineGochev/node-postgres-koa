const {
  Pool
} = require('pg')
const fs = require("fs")
const config = require("config")
const logger = require("../lib/logger")
const sql = fs.readFileSync(__dirname + '/init_db.sql').toString();
const pool = new Pool({
  user: config.get("db.user"),
  host: config.get("db.host"),
  database: config.get("db.database"),
  password: config.get("db.password"),
  port: config.get("db.port"),
})

// the pool will emit an error on behalf of any idle clients
// it contains if a backend error or network partition happens
pool.on('error', (err, client) => {
  logger.debug('Unexpected error on idle client', err)
  process.exit(-1)
})

function init_db() {
  pool
    .query(sql)
    .then(res => {
      //console.log(res);
      pool.end();
    })
    .catch(err => {

      setImmediate(() => {
        throw err
      })
    })
}

module.exports = {
  init_db,
  query: async (text, params) => {
    const res = await pool.query(text, params)
    return res
  },
  get_client: (callback) => {
    pool.connect((err, client, done) => {
      const query = client.query
      // monkey patch the query method to keep track of the last query executed
      client.query = (...args) => {
        client.last_query = args
        return query.apply(client, args)
      }
      // set a timeout of 5 seconds, after which we will log this client's last query
      const timeout = setTimeout(() => {
        logger.debug('A client has been checked out for more than 5 seconds!')
        logger.debug(`The last executed query on this client was: ${client.last_query}`)
      }, 5000)
      const release = (err) => {
        // call the actual 'done' method, returning this client to the pool
        done(err)
        // clear our timeout
        clearTimeout(timeout)
        // set the query method back to its old un-monkey-patched version
        client.query = query
      }
      callback(err, client, release)
    })
  }
}
require('make-runnable');