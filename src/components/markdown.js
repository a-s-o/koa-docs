'use strict';

const marked = require('marked');
marked.setOptions({
   renderer: new marked.Renderer(),
   gfm: true,
   tables: true,
   breaks: true,
   pedantic: false,
   sanitize: true,
   smartLists: true,
   smartypants: false
});

module.exports = marked;
