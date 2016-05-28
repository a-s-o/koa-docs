'use strict';

const app = require('koa')();
const router = require('koa-joi-router');
const docs = require('../');

// Temporary fix for koa-joi-router only accepting routes one at a time
const createRouter = route => {
   const rtr = router();
   [].concat(route || []).forEach(it => rtr.route(it));
   return rtr;
};

// Create the routers for various resources
const petRouter = createRouter( require('./routes/pets') );
const storeRouter = createRouter( require('./routes/store') );

// Add the routes to the koa server
app.use(petRouter.middleware());
app.use(storeRouter.middleware());

// Setup a path for hosting the documentation
app.use(docs.get('/docs', {
   title: 'Pet Store API',    // Add page title and other info
   version: '1.0.0',

   theme: 'paper',            // Any theme from www.bootswatch.com

   groups: [
      // Provide the routes to the koa-api-docs for rendering
      {
         groupName: 'Pets',
         routes: petRouter.routes,
         description: 'Functionality for dealing with pets',
         extendedDescription: `
            Markdown is supported in the \`extendedDescription\` fields so
            it is an ideal place to add additional information while leaving
            the \`friendlyName\` and \`description\` fields concise. This allows
            easier navigation and better collapsing of groups and routes.

            * Donec et mollis dolor.
            * Praesent et diam eget libero egestas mattis sit amet vitae augue.
            * Nam tincidunt congue enim, ut porta lorem lacinia consectetur.
            * Donec ut libero sed arcu vehicula ultricies a non tortor.
            * Lorem ipsum dolor sit amet, consectetur adipiscing elit.
         `
      },
      {
         groupName: 'Store',
         routes: storeRouter.routes,
         prefix: '/store'
      }
   ]
}));

app.listen(3000, (err) => {
   if (err) throw err;
   console.log('Docs are available at http://localhost:3000/docs');
});
