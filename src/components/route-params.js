'use strict';

const m = require('mithril');
const get = require('lodash/object/get');

module.exports = function routeParams (route) {
   return [
      paramsTable(route.validate, 'header'),
      paramsTable(route.validate, 'query'),
      paramsTable(route.validate, 'params'),
      paramsTable(route.validate, 'body')
   ];
};

function paramsTable (validations, type) {
   if (!validations || !validations.hasOwnProperty(type)) return [];

   const schema = validations[type];

   const style = {
      borderTop: '1px solid #eee',
      borderBottom: '1px solid #eee'
   };

   return [
      // Heading before the table (i.e Body, Params, etc)
      paramsHeader(schema, type, validations),

      m('table.table.table-bordered.table-striped', { style }, [
         m.trust(`
            <colgroup>
               <col span="1" style="width: 25%;">
               <col span="1" style="width: 15%;">
               <col span="1" style="width: 60%;">
            </colgroup>
            <thead>
               <tr>
                  <th>Field</th>
                  <th>Type</th>
                  <th>Description</th>
               </tr>
            </thead>
         `),

         paramsTableBody(schema, type, validations)
      ])
   ];
}

function paramsHeader (schema, type, validations) {
   const bodyType = validations.type;
   const label = get(schema, '_settings.language.label');

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
