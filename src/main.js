'use strict';

const render = require('mithril-node-render');
const tpl = require('./template');

function createMiddleware (route, opts) {
   const html = render(tpl(opts));

   return function *middleware (next) {
      // Skip all requests other then a GET request at specified route
      if (this.method !== 'get' && this.url.indexOf(route) !== 0) {
         return yield next;
      }

      this.body = html;
      return void 0;
   };
}

module.exports = {
   get: createMiddleware
};
