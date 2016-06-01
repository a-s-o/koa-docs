'use strict';

const m = require('mithril');
const stripIndent = require('strip-indent');
const hasha = require('hasha');
const get = require('lodash/get');

const anchor = require('./anchor');
const markdown = require('./markdown');
const routeParams = require('./route-params');
const collapsablePanel = require('./collapsable-panel');

module.exports = function content (opts) {
   return m('main', opts.groups.map(group => section(group, opts)));
};

function section (group, opts) {
   const name = group.groupName;
   const desc = group.description;
   const extd = group.extendedDescription;

   const hash = hasha([name, desc, get(group, 'routes.length', 0)].join('-'));
   const id = `group-${hash.slice(0, 12)}`;

   return [
      // Header
      m('div.group-header', [
         collapseButton(`#${id}`),
         m('h2.sub-header', group.groupName)
      ]),

      !desc ? '' : m('p.lead', desc),

      // `in` class means open by default
      m('div.collapse.in', { id }, [
         !extd ? '' : m('p', m.trust( markdown( stripIndent(extd) ) )),
         group.routes.map((route, index) => routePanel(route, index, group, opts))
      ])
   ];
}

function routePanel (route, index, group, opts) {
   const id = anchor(route);
   const title = get(route, 'meta.friendlyName', route.path);

   return collapsablePanel(title, { id }, [
      m('div.panel-body', [
         routeDescription(route, index, group),
         routeParams(route, index, group),
         opts.routeHandlers === 'disabled' ? null : routeHandler(route, opts)
      ]),
      routeFooter(route, index, group)
   ]);
}

/////////////////
// Description //
/////////////////

function routeDescription (route, index, group) {
   const meta = route.meta || {};
   const desc = meta.description;
   const extd = meta.extendedDescription;

   return [
      routeInfo(route.method, route.path, group.prefix),
      !desc ? '' : m('p', desc),
      !extd ? '' : m('p', m.trust( markdown( stripIndent(extd) ) ))
   ];
}

function routeInfo (method, path, prefix) {
   return m('h4', { style: { marginTop: '0' } }, [
      m('span.label.label-primary', { style: { marginRight: '0.5em' } }, method),
      (prefix || '') + path
   ]);
}

////////////////////////
// Handler and footer //
////////////////////////

function routeHandler (route, opts) {
   const handler = stripIndent(`   ${route.handler.toString()}`);
   const code = m('pre', { style: { border: 0, margin: 0 } }, handler);

   const panelOptions = { collapsed: opts.routeHandlers !== 'expanded' };

   // Handler is collapsed by default
   return collapsablePanel('Handler', panelOptions, code);
}

function routeFooter (route, index, group) {
   const transparent = { background: 'transparent' };
   const prefix = group.prefix || '';

   return m('div.panel-footer', { style: transparent }, [
      // Reference
      m('small.text-muted', [
         'End of',
         route.method.toString().toUpperCase(),
         prefix + route.path.toString()
      ].join(' ')),

      // Back to top link
      m('a', { href: '#', style: { float: 'right' } }, 'Back to top')
   ]);
}

/////////////
// Helpers //
/////////////

function collapseButton (selector) {
   return m('button.btn.btn-default.collapse-button', {
      'data-toggle': 'collapse',
      'data-target': selector,
      'aria-expanded': 'true',
      'style': { float: 'right' }
   }, [
      m('span.icon-expand', icon('eye-open', 'Expand')),
      m('span.icon-collapse', icon('eye-close', 'Collapse'))
   ]);
}

function icon (name, label) {
   const hasLabel = !!label;

   const glyph = m(`span.glyphicon.glyphicon-${name}`, {
      style: hasLabel ? { marginRight: '1rem' } : {}
   });

   return [glyph].concat(hasLabel ? label : []);
}
