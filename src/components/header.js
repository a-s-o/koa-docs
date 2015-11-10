'use strict';

const m = require('mithril');

module.exports = function header (opts) {
   return m.trust(`
      <header class="navbar navbar-inverse">
         <div class="container-fluid">
           <div class="navbar-header">
             <a class="navbar-brand" href="#">${opts.title} ${opts.version}</a>
           </div>
         </div>
      </header>
   `);
};
