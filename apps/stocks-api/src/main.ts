/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 **/
import { Server } from 'hapi';
import { environment } from './environments/environment';
const H2o2 = require('@hapi/h2o2');

const init = async () => {
  const server = new Server({
    port: 3333,
    host: 'localhost',
    routes: {
      cors: {
        origin: ["*"],
        headers: ["Accept", "Content-Type"]
      }
    }
  });

  await server.register(H2o2);

  const fetchQuery = async (symbol, period) => {
    let result = '';
     await server.inject(`/proxy/stock/${symbol}/chart/${period}`).then(res => {
       result = res.payload;
     });
     return result;
   };
 
 
   server.method({
     name: 'fetchQuery',
     method: fetchQuery,
     options: {
       cache: {
         expiresIn: 5 * 60 * 1000,
         generateTimeout: 4000 // number of milliseconds to wait before returning a timeout error
       }
     }
   });

   server.route({
    method: 'GET',
    path: '/beta/stock/{symbol}/chart/{period}',
    handler: async (request, h) => {
      return server.methods.fetchQuery(request.params.symbol, request.params.period);
    }
  });

  server.route({
    method: 'GET',
    path: '/proxy/stock/{symbol}/chart/{period}',
    options: {
      handler: {
        proxy: {
          uri: environment.apiURL + '/beta/stock/{symbol}/chart/{period}?token=' + environment.apiKey,
          passThrough: true,
          xforward: true
        }
      }
    }
  });

  server.route({
    method: '*',
    path: '/{any*}',
    handler:  (request, h) => {
      return '404 Error! Page Not Found!';
    }
  });

  await server.start();
  console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', err => {
  console.log(err);
  process.exit(1);
});

init();
