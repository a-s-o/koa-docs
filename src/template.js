'use strict';

const m = require('mithril');
const path = require('path');
const fs = require('fs');

const bootstrap = file => `http://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/${file}`;
const swatch = file => `https://maxcdn.bootstrapcdn.com/bootswatch/3.3.5/${file}`;

const doctype = '<!DOCTYPE html>';
const charset = '<meta charset="utf-8">';
const ua = '<meta http-equiv="X-UA-Compatible" content="IE=edge">';
const vp = '<meta name="viewport" content="width=device-width, initial-scale=1">';

// Read client side includes
const read = file => fs.readFileSync(path.resolve(__dirname, file), 'utf-8');
const css = read('./client/styles.css');
const js = read('./client/script.js');

const header = require('./components/header');
const sidebar = require('./components/sidebar');
const content = require('./components/content');

module.exports = function renderTemplate (opts) {
   const theme = opts.theme && opts.theme !== 'bootstrap' ?
      swatch(`${opts.theme.toLowerCase()}/bootstrap.min.css`) :
      bootstrap('css/bootstrap-theme.min.css');

   return [
      m.trust(doctype),
      m('html', { lang: 'en' }, [
         m.trust(charset),
         m.trust(ua),
         m.trust(vp),

         m('head', [
            m('title', opts.title || 'API Documentation'),

            // CSS
            m('link', {
               rel: 'stylesheet',
               href: bootstrap('css/bootstrap.min.css')
            }),
            m('link', {
               id: 'theme',
               rel: 'stylesheet',
               href: theme
            }),
            m.trust(`<style>${css}</style>`)
         ]),

         m('body', [
            // Navbar
            header(opts),

            // Content
            m('div.content', [
               content(opts),
               sidebar(opts)
            ]),

            // Scripts
            m('script', { src: 'http://code.jquery.com/jquery-2.1.4.min.js' }),
            m('script', { src: bootstrap('js/bootstrap.min.js') }),
            m.trust(`<script>${js}</script>`)
         ])
      ])
   ];
};
