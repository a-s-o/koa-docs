'use strict';
/* globals $ */
/* eslint no-var: 0, vars-on-top: 0 */

$('.switch-theme.dropdown-menu').on('click', function changeTheme (evt) {
   var theme = $(evt.target).attr('theme');
   if (typeof theme !== 'string' || !theme) return;

   var themeUrl = theme === 'bootstrap' ?
      'bootstrap/3.3.5/css/bootstrap-theme.min.css' :
      'bootswatch/3.3.5/' + theme + '/bootstrap.min.css';

   $('link#theme').attr('href', 'https://maxcdn.bootstrapcdn.com/' + themeUrl);
});
