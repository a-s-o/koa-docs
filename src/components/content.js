'use strict';

const m = require('mithril');
const stripIndent = require('strip-indent');
const hasha = require('hasha');
const get = require('lodash/object/get');

const anchor = require('./anchor');
const markdown = require('./markdown');
const routeParams = require('./route-params');

function routeHeading (route, collapseClass) {
   const meta = route.meta || {};

   const collapsable = {
      'data-toggle': `collapse`,
      'data-target': `.${collapseClass}`,
      'style': { cursor: 'pointer' }
   };
   return m('div.panel-heading', collapsable, [
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

function routeDescription (route) {
   const meta = route.meta || {};
   const desc = meta.description;
   const extd = meta.extendedDescription;

   return m('div.panel-body', [
      m('p', routeInfo(route.method, route.path)),
      !desc ? '' : m('p', desc),
      !extd ? '' : m('p', m.trust( markdown( stripIndent(extd) ) ))
   ]);
}

function routeFooter (route) {
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
   const id = anchor(route);
   const collapseSelector = `collapse-${id}`;
   const collapseState = [collapseSelector, 'collapse', 'in'].join(' ');

   return m(`div.panel.panel-default`, { id }, [
      routeHeading(route, collapseSelector),
      m('div', { className: collapseState }, [
         routeDescription(route),
         routeParams(route),
         routeFooter(route)
      ])
   ]);
}

function routeGroup (group) {
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

module.exports = function content (opts) {
   return m('main', opts.groups.map(routeGroup));
};

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
