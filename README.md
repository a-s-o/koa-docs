# koa-docs
An automatic documentation generator for [koa](https://github.com/koajs/koa) APIs. The goal is to make documentation easy using route specs that may already exist.

Currently supports routes created using [koa-joi-router](https://github.com/pebble/koa-joi-router) which exposes the internal route configuration and allows this type of documentation to be generated.

## Demo

See `example` folder for source code. [View example output](http://a-s-o.github.io/koa-docs/example.html)

![Screenshot](http://i.imgur.com/jUcraT6.png)

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

   groups: [
      // Provide the routes to the koa-api-docs for rendering
      { groupName: 'Pets', routes: [/*  ... route specs ...  */] },
      { groupName: 'Store', routes: [/*  ... route specs ...  */] }
   ]
}));

app.listen(3000, (err) => {
   if (err) throw err;
   console.log(`Docs are available at http://localhost:3000/v1/docs`);
});
```

## Roadmap to 1.0

* [ ] Multi version support
* [ ] Ability to collapse/expand routes and groups
* [ ] Quick filter
* [ ] Quickly switch themes and configurable default theme


## License

[MIT](LICENSE)
