'use strict';

const m = require('mithril');

module.exports = function header (opts) {
   return m.trust(`
      <header class="navbar navbar-inverse">
         <div class="container-fluid">
           <div class="navbar-header">
             <a class="navbar-brand" href="#">${opts.title} ${opts.version}</a>
           </div>

           <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
             <ul class="nav navbar-nav navbar-right">
               <li class="dropdown">
                 <a href="#"
                    class="dropdown-toggle"
                    data-toggle="dropdown" role="button"
                    aria-haspopup="true"
                    aria-expanded="false">Switch theme <span class="caret"></span>
                 </a>
                 <ul class="dropdown-menu switch-theme">
                   <li><a href="#" theme="bootstrap">Bootstrap</a></li>
                   <li role="separator" class="divider"></li>
                   <li><a href="#" theme="cerulean">Cerulean</a></li>
                   <li><a href="#" theme="cosmo">Cosmo</a></li>
                   <li><a href="#" theme="cyborg">Cyborg</a></li>
                   <li><a href="#" theme="darkly">Darkly</a></li>
                   <li><a href="#" theme="flatly">Flatly</a></li>
                   <li><a href="#" theme="journal">Journal</a></li>
                   <li><a href="#" theme="lumen">Lumen</a></li>
                   <li><a href="#" theme="paper">Paper</a></li>
                   <li><a href="#" theme="readable">Readable</a></li>
                   <li><a href="#" theme="sandstone">Sandstone</a></li>
                   <li><a href="#" theme="simplex">Simplex</a></li>
                   <li><a href="#" theme="slate">Slate</a></li>
                   <li><a href="#" theme="spacelab">Spacelab</a></li>
                   <li><a href="#" theme="superhero">Superhero</a></li>
                   <li><a href="#" theme="united">United</a></li>
                   <li><a href="#" theme="yeti">Yeti</a></li>
                 </ul>
               </li>
             </ul>
           </div>
         </div>
      </header>
   `);
};
