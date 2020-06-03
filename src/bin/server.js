require('../lib/bootstrap');
const p_event = require('p-event');
const create_server_n_listen = require('../lib/server');
const config = require('config');
const logger = require('../lib/logger');
const app = require('../lib/app');

async function main() {
   const host = config.get('server.host');
   const port = config.get('server.port');
   let server;

   try {
      server = await create_server_n_listen(app, port, host);
      logger.debug(`Server is listening on: ${host}:${port}`);

      await Promise.race([
         ...['SIGNINT', 'SIGHUP', 'SIGTERM'].map((s) =>
            p_event(process, s, {
               rejectionEvents: ['uncaughtException', 'unhandledRejection']
            })
         )
      ]);
   } catch (err) {
      process.exitCode = 1;
      logger.fatal(err);
   } finally {
      if (server) {
         logger.debug('Close server.');
         await server.stop();
         logger.debug('Server closed');
      }
      logger.debug('Close database');

      setTimeout(() => process.exit(), 1000).unref();
   }
}

main();
