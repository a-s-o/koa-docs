# koa-docs
An automatic documentation generator for [koa](https://github.com/koajs/koa) APIs. The goal is to make documentation easy using route specs that may already exist.

* [Usage](#usage)
* API:
    * [docs.get()](#docsgetpath-options)
    * That's it (just one method)
* Specs:
    * [Groups](#group-specs)
    * [Routes](#route-specs)
* Links:
    * [Github repo](https://github.com/a-s-o/koa-docs)
    * [Sample output](http://a-s-o.github.io/koa-docs/example.html)

## Demo

See `example` folder for source code. [View example output](http://a-s-o.github.io/koa-docs/example.html)

![Screenshot](http://i.imgur.com/jv1k4g3.png)

## Install

    > npm install --save koa-docs@2.x.x

Note version `2.x.x` of this package uses joi router version `^3` specs; use version `1.x.x` of this
package if you are using older specs

## Usage

```javascript
const app = require('koa')();
const docs = require('koa-docs');

// Create a path for viewing the docs (only GET method is supported)
app.use(docs.get('/docs', {
   title: 'Pet Store API',
   version: '1.0.0',

   theme: 'simplex',    // Specify a theme from www.bootswatch.com;
                        // default is un-themed bootstrap

   routeHandlers: 'disabled',  // Hide the route implementation code from docs

   groups: [
      { groupName: 'Pets', routes: [/*  ... route specs ...  */] },
      { groupName: 'Store', routes: [/*  ... route specs ...  */] }
   ]
}));

app.listen(3000, (err) => {
   if (err) throw err;
   console.log(`Docs are available at http://localhost:3000/docs`);
});
```

## docs.get(path, options)

Creates a koa middleware which generates and serves api documentation
using the specs provided in the options object.

**Arguments**

1. path (String): the GET path at which the documentation will be served
2. options (Object)
    - `title`: string representing the page title; displayed at the top of the docs
    - `version`: string representing api version; also displayed at top of the docs
    - `routeHandlers`: string indicating whether to show the route handler code in the docs. Options are __disabled__, __expanded__ or __collapsed__ (collapsed is the default)
    - `theme`: string name of a theme from [bootswatch](http://www.bootswatch.com) to be used as the default theme
    - `groups`: array of [group specs](#group-specs) as described below

**Returns**

(GeneratorFunction): Middleware suitable for use in koa.js app

## Group specs
Groups are used to logically display the various sections of your api. They are declared as follows:

- `groupName`: string representing the name of the group
- `description`: string that describes the group; keep this short at about 1 scentence. This is displayed in both expanded and collapsed states as well as in tooltips. This should be a simple string; no markdown
- `extendedDescription`: string that supports markdown and is displayed only in when a group is being displayed in an expanded state. Make this as long as you need.
- `prefix`: optional string to be prefixed to all route paths in this group
- `routes`: array of [route specs](#route-specs) representing the routes in this group. See below for details on route specs.

## Route specs
The route specs are the same as [koa-joi-router](https://github.com/pebble/koa-joi-router#route-options), therefore, those routes can be used directly with `koa-docs`. Specifications are as follows:

- `method`: **required** HTTP method like "get", "post", "put", etc
- `path`: **required** string
- `validate`
  - `header`: object which conforms to [Joi](https://github.com/hapijs/joi) validation
  - `query`: object which conforms to [Joi](https://github.com/hapijs/joi) validation
  - `params`: object which conforms to [Joi](https://github.com/hapijs/joi) validation
  - `body`: object which conforms to [Joi](https://github.com/hapijs/joi) validation
  - `maxBody`: max incoming body size for forms or json input
  - `failure`: HTTP response code to use when input validation fails. default `400`
  - `type`: if validating the request body, this is **required**. either `form`, `json` or `multipart`
  - `output`: output validator object which conforms to [Joi](https://github.com/hapijs/joi) validation. if output is invalid, an HTTP 500 is returned
  - `continueOnError`: if validation fails, this flags determines if `koa-joi-router` should [continue processing](#handling-errors) the middleware stack or stop and respond with an error immediately. useful when you want your route to handle the error response. default `false`
- `handler`: **required** GeneratorFunction
- `meta`: meta data about this route. `koa-joi-router` ignores this but stores it along with all other route data

### meta

In addition to the above options, `koa-docs` looks for the following properties in the `meta` object of each route:

- `friendlyName`: string which is used in the sidebar and route title; route path is used if this is not proivded
- `description`: string that describes the routes; keep this short at about 1 scentence. This is displayed in both expanded and collapsed states as well as in tooltips. This should be a simple string; no markdown
- `extendedDescription`: string that supports markdown and is displayed only in when a route is being displayed in an expanded state. Make this as long as you need.

### Sample routes

* [pets example](example/routes/pets.js)
* [store example](example/routes/store.js)

## Roadmap / Contribution

Please feel free to claim any of the following features for development; more
features can be requested by opening an issue.

* [ ] Create separate section for models (joi objects that have a label)
* [ ] Add popovers for displaying models
* [ ] Quick filter (fuzzysearch)
* [ ] Ability to save the generated HTML to file
* [ ] E2E testing of output

## License

[MIT](LICENSE)
