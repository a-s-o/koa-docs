'use strict';

const marked = require('marked');
marked.setOptions({
   renderer: new marked.Renderer(),
   gfm: true,
   tables: true,
   breaks: false,
   pedantic: false,
   sanitize: true,
   smartLists: true,
   smartypants: false
});

module.exports = marked;
