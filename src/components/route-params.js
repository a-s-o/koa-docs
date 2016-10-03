'use strict';

const m = require('mithril');
const get = require('lodash/get');

const collapsablePanel = require('./collapsable-panel');

module.exports = function routeParams (route) {
  return [
    paramsTable(route.validate, 'header'),
    paramsTable(route.validate, 'query'),
    paramsTable(route.validate, 'params'),
    paramsTable(route.validate, 'body'),
    ...outputTable(route.validate)
  ];
};

function outputTable (validations) {
  if (!validations || !validations.hasOwnProperty('output')) return [];
  const ret = [];
  Object.keys(validations.output).forEach(status => {
    if (validations.output[status].body) ret.push(paramsTable(validations, 'output', 'body', status));
    if (validations.output[status].header) ret.push(paramsTable(validations, 'output', 'header', status));
  });
  return ret;
}

function paramsTable (validations, type, label, status) {
  if (!validations || !validations.hasOwnProperty(type)) return [];

  let schema = validations[type];

  if (label && status) {
    schema = schema[status][label];
  }

  const heading = paramsHeader(schema, type, validations, label, status);

  const table = {
    style: { marginBottom: 0 }
  };

  const panel = {
    className: type === 'output' ? 'panel-primary' : ''
  };

  return collapsablePanel(heading, panel, [
    m('table.table.table-striped', table, [
      m.trust(`
            <colgroup>
               <col span="1" style="width: 15%;">
               <col span="1" style="width: 30%;">
               <col span="1" style="width: 15%;">
               <col span="1" style="width: 40%;">
            </colgroup>
         `),

      getItems(schema).map(paramsTableBody)
    ])
  ]);
}

function paramsHeader (schema, type, validations, outputLabel, status) {
  const bodyType = validations.type;
  const label = isArray(schema) ? arrayLabel(schema) : itemLabel(schema);

  const header = [
    type.slice(0, 1).toUpperCase() + type.slice(1),
    outputLabel ? `[${outputLabel}]` : '',
    !label ? '' : `: ${label}`
  ];

  // In case of body also indicate what type of body is expected
  // i.e. json, form, multipart
  if (type === 'body') {
    const tag = { style: { float: 'right' } };
    const bodyTag = m('span.label.label-info', tag, bodyType);
    header.push(bodyTag);
  } else if (type === 'output') {
    const outputTag = m('span.label.label-info', { style: { float: 'left', marginRight: '10px' } }, status);
    header.push(outputTag);
  }

  return header;
}

function paramsTableBody (schema) {
  const body = m('tbody');

  // TODO: sort validations by required

  body.children = traversingSchema(schema);

  body.children.unshift(m('tr', [
    m('th', 'Key = default'),
    m('th', 'Type* (tests) in [valids] not in [invalids]'),
    m('th', 'Eaxmples'),
    m('th', 'Description'),
  ]));

  return body;
}

function traversingSchema (schema, key) {
  const result = [];
  key && result.push(paramsRow(schema, key));
  if (schema.isJoi) {
    if (schema._type === 'object') {
      const children = get(schema, '_inner.children', []);
      if(children) {
        children.forEach(child => {
          result.push(...traversingSchema(child.schema, key ? `${key}.${child.key}` : child.key));
        });
      }
    } else if (schema._type === 'array') {
      const items = get(schema, '_inner.items', []);
      if(items) {
        items.forEach(item => {
          result.push(...traversingSchema(item, `${key}[]`));
        });
      }
    }
  } else if (typeof schema === 'object') {
    Object.keys(schema).forEach(k => {
      result.push(...traversingSchema(schema[k], key ? `${key}.${k}` : k));
    });
  } else {
    // schema is wrong
    throw new Error(`schema is invalid with key: ${key}, got ${JSON.stringify(schema)}`);
  }
  return result;
}

function paramsRow (schema, field) {
  const flags = schema._flags || {};
  const required = flags && flags.presence === 'required';
  const valids = schema._valids._set;
  const invalids = schema._invalids._set;
  const tests = schema._tests;
  let type = schema._type;
  if(type === 'alternatives') {
    const schemas = get(schema, '_inner.matches', []);
    type = schemas.map(s => s.schema._type).join(' | ');
  }
  return m('tr', [
    m('td', field + (flags.default !== undefined ? ` = ${flags.default}` : '')),
    m('td', [
      type,
      Array.isArray(schema) && 'array' || '',
      !required ? '' : ' *',
      tests.length > 0 ? ` [${tests.map(test => {
        return `${test.name}(${test.arg !== undefined ? test.arg : ''})`
      }).join(',')}]` : '',
      valids.toString() ? ` in [${valids}]` : '',
      invalids.toString() ? ` not in [${invalids}]` : ''
    ]),
    m('td', schema._examples.join(' | ')),
    m('td', schema._description || {}),
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
  const label = get(schema, '_settings.language.label', '');
  const type = schema._type || schema.constructor.name;
  const flags = schema._flags || {};
  return label || ((type.slice(0, 1).toUpperCase() + type.slice(1)) + (flags.default ? ` = ${flags.default}` : ''));
}

function arrayLabel (schema) {
  if (!isArray(schema)) return '';
  const items = getItems(schema).map(itemLabel);
  return `Array [ ${items} ]`;
}
