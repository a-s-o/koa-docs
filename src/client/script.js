'use strict';
/* globals $ */

$('.switch-theme.dropdown-menu').on('click', function changeThem (evt) {
   const theme = $(evt.target).attr('theme');
   if (typeof theme !== 'string' || !theme) return;

   const themeUrl = theme === 'bootstrap' ?
      'bootstrap/3.3.5/css/bootstrap-theme.min.css' :
      'bootswatch/3.3.5/' + theme + '/bootstrap.min.css';

   $('link#theme').attr('href', 'https://maxcdn.bootstrapcdn.com/' + themeUrl);
});
