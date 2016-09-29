'use strict';

const t = require('koa-joi-router').Joi;

const Order = t.object().label('Order').keys({
   id: t.number(),
   petId: t.number(),
   quantity: t.number(),
   shipDate: t.date(),
   status: t.string().valid(['placed', 'approved', 'delivered']),
   complete: t.boolean()
});

const Quantity = t.number().integer().label('Quantity');

const storeInventory = {
   method: 'get',
   path: '/inventory',
   meta: {
      friendlyName: 'Store inventory',
      description: 'Returns pet inventories by status',
      extendedDescription: `
         **Implementation notes**
         * Returns a map of status codes to quantities
      `
   },
   validate: {
      output: {
        200: {
          body: {
            available: Quantity.description('Pets available for sale'),
            pending: Quantity.description('# of pets awaiting processing'),
            sold: Quantity.description('# of pets sold')
          }
        },
        400: {
          body: {
            code: t.number().integer().min(0).max(100).default(0).description('Code to explain the response.'),
            errors: t.object().keys({
              name: {
                message: t.string().required().default('Some pet has no name!').description('Thrown when some pets has no name.')
              }
            }),
            tags: t.array().items(t.object().keys({
              label: t.string().example('Hello').example('World'),
              signal: t.array().items(t.string())
            })),
            error: t.string().valid('Pets not found!').description('Pets not found!')
          }
        },
        500: {
          body: t.string().default('Server Internal Error.')
        }
      }
   },
   *handler () {
      // This route does not have any validations
      return this.db().table('store')
         .groupBy('statusCode')
         .map('quantity')
         .run();
   }
};

const orderPet = {
   method: 'post',
   path: '/order',
   meta: {
      friendlyName: 'Place an order for a pet'
   },
   validate: {
      type: 'json',
      body: Order
   },
   *handler () {
      const order = this.request.body;
      yield this.db().table('orders').insert(order).run();
   }
};

module.exports = [
   storeInventory,
   orderPet
];
