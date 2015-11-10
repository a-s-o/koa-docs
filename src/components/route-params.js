'use strict';

const m = require('mithril');
const get = require('lodash/object/get');

module.exports = function routeParams (route) {
   return [
      paramsTable(route.validate, 'header'),
      paramsTable(route.validate, 'query'),
      paramsTable(route.validate, 'params'),
      paramsTable(route.validate, 'body'),
      paramsTable(route.validate, 'output')
   ];
};

function paramsTable (validations, type) {
   if (!validations || !validations.hasOwnProperty(type)) return [];

   const schema = validations[type];

   return [
      // Heading before the table (i.e Body, Params, etc)
      paramsHeader(schema, type, validations),

      m('table.table.table-striped', [
         m.trust(`
            <colgroup>
               <col span="1" style="width: 20%;">
               <col span="1" style="width: 15%;">
               <col span="1" style="width: 65%;">
            </colgroup>
            <thead>
               <tr>
                  <th>Field</th>
                  <th>Type</th>
                  <th>Description</th>
               </tr>
            </thead>
         `),

         getItems(schema).map(paramsTableBody)
      ])
   ];
}

function paramsHeader (schema, type, validations) {
   const bodyType = validations.type;
   const label = isArray(schema) ? arrayLabel(schema) : itemLabel(schema);

   return m('h4', { style: { margin: '1rem' } }, [
      // Capitalize
      type.slice(0, 1).toUpperCase() + type.slice(1),
      // In case of body also indicate what type of body is expected
      // i.e. json, form, multipart
      type !== 'body' ? '' : m('span.label.label-info', {
         style: { marginLeft: '1ex' }
      }, bodyType),

      !label ? '' : m('em', `: ${label}`)
   ]);
}

function paramsTableBody (schema) {
   const body = m('tbody');

   // TODO: sort validations by required
   if (schema.isJoi) {
      const children = get(schema, '_inner.children', []);
      body.children = children.map(child => paramsRow(child.schema, child.key));
   } else {
      body.children = Object.keys(schema).map(k => paramsRow(schema[k], k));
   }

   return body;
}

function paramsRow (schema, field) {
   const flags = schema._flags || {};
   const required = flags && flags.presence === 'required';
   return m('tr', [
      m('td', field),
      m('td', schema._type + (!required ? '' : ' *')),
      m('td', schema._description || {})
   ]);
}

function isArray (schema) {
   return schema._type === 'array';
}

function getItems (schema) {
   if (!isArray(schema)) return [schema];
   return get(schema, '_inner.items', []);
}

function itemLabel (schema) {
   return get(schema, '_settings.language.label', '');
}

function arrayLabel (schema) {
   if (!isArray(schema)) return '';
   const items = getItems(schema).map(itemLabel);
   return `Array [${items}]`;
}
