'use strict';

const m = require('mithril');

let panels = 0;

module.exports = function collapsablePanel (title) {
   const attrs = arguments.length > 2 ? arguments[1] : {};
   const content = arguments.length > 2 ? arguments[2] : arguments[1];

   const collapsableId = `collapsable-${panels++}`;

   const clickTarget = {
      'data-toggle': 'collapse',
      'data-target': `#${collapsableId}`,
      'style': { cursor: 'pointer' }
   };

   const collapseTarget = {
      id: collapsableId,
      className: 'collapse ' + (attrs.collapsed === true ? '' : 'in')
   };

   return m('div.panel.panel-default.collapsable-panel', attrs, [
      m('div.panel-heading', clickTarget, [
         m('h3.panel-title', title)
      ]),
      m('div', collapseTarget, content)
   ]);
};
