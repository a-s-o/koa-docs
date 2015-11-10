'use strict';

const m = require('mithril');
const anchor = require('./anchor');

function sidebarLink (route) {
   const meta = route.meta || {};
   const display = meta.friendlyName || `${route.method} ${route.path}`;
   const href = '#' + anchor(route);
   return m('li', m('a', { href }, display));
}

function sidebarGroup (group) {
   return m('ul.nav.nav-sidebar', [
      m.trust(`<lh><strong>${group.groupName}</strong></lh>`),
      group.routes.map(sidebarLink)
   ]);
}

module.exports = function sidebar (opts) {
   return m('nav.sidebar', opts.groups.map(sidebarGroup));
};
