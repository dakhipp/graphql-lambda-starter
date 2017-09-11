const app = require('./src/app');
const config = require('./src/config');

// let's set the port on which the server will run
app.set('port', config.port);

// start the server
app.listen(
  app.get('port'),
  () => {
    console.log(`GraphQL Server Running at ${config.fullHost}`);
  }
);
