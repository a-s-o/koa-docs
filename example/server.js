'use strict';

const app = require('koa')();
const router = require('koa-joi-router');
const docs = require('../');

// Create the routers for various resources
const petRouter = router().route( require('./routes/pets') );
const storeRouter = router().route( require('./routes/store') );

// Add the routes to the koa server
app.use(petRouter.middleware());
app.use(storeRouter.middleware());

// Setup a path for hosting the documentation
app.use(docs.get('/v1/docs', {
   title: 'Pet Store API',    // Add page title and other info
   version: '1.0.0',

   groups: [
      // Provide the routes to the koa-api-docs for rendering
      { groupName: 'Pets', routes: petRouter.routes },
      { groupName: 'Store', routes: storeRouter.routes }
   ]
}));

app.listen(3000, (err) => {
   if (err) throw err;
   console.log(`Docs are available at http://localhost:3000/v1/docs`);
});
