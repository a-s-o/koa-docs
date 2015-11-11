# koa-docs
An automatic documentation generator for [koa](https://github.com/koajs/koa) APIs. The goal is to make documentation easy using route specs that may already exist.

## Demo

See `example` folder for source code. [View example output](http://a-s-o.github.io/koa-docs/example.html)

![Screenshot](http://i.imgur.com/jv1k4g3.png)

## Install

    > npm install --save koa-docs

## Usage:

```javascript
const app = require('koa')();
const docs = require('koa-docs');

// Create a path for viewing the docs (only GET method is supported)
app.use(docs.get('/v1/docs', {
   title: 'Pet Store API',
   version: '1.0.0',

   theme: 'simplex',    // Specify a theme from www.bootswatch.com;
                        // default is un-themed bootstrap

   groups: [
      { groupName: 'Pets', routes: [/*  ... route specs ...  */] },
      { groupName: 'Store', routes: [/*  ... route specs ...  */] }
   ]
}));

app.listen(3000, (err) => {
   if (err) throw err;
   console.log(`Docs are available at http://localhost:3000/v1/docs`);
});
```

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

### sample routes

* [pets example](example/routes/pets.js)
* [store example](example/routes/store.js)

## Roadmap to 1.0

* [x] Render `extendedDescription` using markdown
* [x] Add `description` and `extendedDescription` for groups
* [x] Ability to collapse/expand routes and groups
* [x] Ability to switch themes and make default theme configurable
* [x] More descriptive type descriptions for arrays and nested objects
* [x] ~~Create separate section for models (joi objects that have a label)~~ Deferred; for now, displayed directly where they are used
* [x] ~~Add popovers for displaying models~~ Deferred
* [ ] Quick filter (fuzzysearch)
* [ ] Ability to save the generated HTML to file
* [x] ~~Multi version support~~ Deferred; need more feedback

## License

[MIT](LICENSE)
