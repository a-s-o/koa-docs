'use strict';

const m = require('mithril');
const anchor = require('./anchor');
const stripIndent = require('strip-indent');

const routeParams = require('./route-params');

function heading (route) {
   const meta = route.meta || {};

   return m('div.panel-heading', [
      m('h3.panel-title', meta.friendlyName || route.path)
   ]);
}

function routeInfo (method, path) {
   return m('div.input-group', [
      m('span.input-group-btn', m('button.btn.btn-primary', method)),
      m('input.form-control', {
         type: 'text',
         value: path,
         style: { paddingLeft: '1em' }
      })
   ]);
}

function description (route) {
   const meta = route.meta || {};

   return m('div.panel-body', [
      m('p', routeInfo(route.method, route.path)),
      m('p', meta.description),
      m('p', meta.extendedDescription)
   ]);
}

function footer (route) {
   const handler = stripIndent(`   ${route.handler.toString()}`);

   const style = {
      border: 0,
      margin: 0
   };

   return m('div.panel-footer', [
      m('h5', { style: { margin: '1rem' } }, 'Implementation:'),
      m('pre', { style }, handler)
   ]);
}

function routePanel (route) {
   return m(`div.panel.panel-default`, { id: anchor(route) }, [
      heading(route),
      description(route),
      routeParams(route),
      footer(route)
   ]);
}

function routeGroup (group) {
   return [
      m('h2.sub-header', group.groupName),
      group.routes.map(routePanel)
   ];
}

module.exports = function content (opts) {
   return m('main', opts.groups.map(routeGroup));
};
