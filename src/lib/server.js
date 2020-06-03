const http = require('http');
const stoppable = require('stoppable');
const p_event = require('p-event');
const util = require('util');

module.exports = async function create_server_n_listen(app, port, host) {
   const server = stoppable(http.createServer(app.callback()), 7000);

   server.listen(port, host);

   server.stop = util.promisify(server.stop);

   await p_event(server, 'listening');

   return server;
};
