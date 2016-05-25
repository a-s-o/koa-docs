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
   return m('main', opts.groups.map(section));
};

function section (group) {
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
         group.routes.map(routePanel)
      ])
   ];
}

function routePanel (route) {
   const id = anchor(route);
   const title = get(route, 'meta.friendlyName', route.path);

   return collapsablePanel(title, { id }, [
      m('div.panel-body', [
         routeDescription(route),
         routeParams(route),
         routeHandler(route)
      ]),
      routeFooter(route)
   ]);
}

/////////////////
// Description //
/////////////////

function routeDescription (route) {
   const meta = route.meta || {};
   const desc = meta.description;
   const extd = meta.extendedDescription;

   return [
      m('p', routeInfo(route.method, route.path)),
      !desc ? '' : m('p', desc),
      !extd ? '' : m('p', m.trust( markdown( stripIndent(extd) ) ))
   ];
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

////////////////////////
// Handler and footer //
////////////////////////

function routeHandler (route) {
   const handler = stripIndent(`   ${route.handler.toString()}`);
   const code = m('pre', { style: { border: 0, margin: 0 } }, handler);

   // Handler is collapsed by default
   return collapsablePanel('Handler', { collapsed: true }, code);
}

function routeFooter (route) {
   const transparent = { background: 'transparent' };

   return m('div.panel-footer', { style: transparent }, [
      // Reference
      m('small.text-muted', [
         'End of',
         route.method.toString().toUpperCase(),
         route.path.toString()
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
      'data-toggle': `collapse`,
      'data-target': selector,
      'aria-expanded': `true`,
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
