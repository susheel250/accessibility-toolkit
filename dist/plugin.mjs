const e={hooks:{"plugin:install":async(e,t)=>{t.log.info(`Coddle Accessibility Toolkit installed`,{pluginId:t.plugin.id,event:e})},"plugin:activate":async(e,t)=>{t.log.info(`Coddle Accessibility Toolkit activated`,{pluginId:t.plugin.id,event:e})},"plugin:deactivate":async(e,t)=>{t.log.info(`Coddle Accessibility Toolkit deactivated`,{pluginId:t.plugin.id,event:e})}},routes:{config:{public:!0,methods:[`GET`],handler:async(e,t)=>({enabled:await t.settings.get(`enabled`)??!0,primaryColor:await t.settings.get(`primaryColor`)??`#1863DC`,iconId:await t.settings.get(`iconId`)??`person`,iconSize:await t.settings.get(`iconSize`)??48,positionDesktop:await t.settings.get(`positionDesktop`)??`bottom-right`,positionMobile:await t.settings.get(`positionMobile`)??`bottom-right`,language:await t.settings.get(`language`)??`en`,statementUrl:await t.settings.get(`statementUrl`)??`/accessibility-statement`,version:`1.2.0`,toolkit:`Coddle Accessibility Toolkit`,publisher:`Coddle Technologies`})},snippet:{public:!0,methods:[`GET`],handler:async(e,t)=>{let n=await t.settings.get(`enabled`)??!0,r=await t.settings.get(`primaryColor`)??`#1863DC`,i=await t.settings.get(`positionDesktop`)??`bottom-right`,a=await t.settings.get(`language`)??`en`;return{enabled:n,html:`<script src="/vendor/coddle-access/js/widget.min.js" data-color="${r}" data-position="${i}" data-lang="${a}" async><\/script>`,cdnHtml:`<script src="https://cdn.jsdelivr.net/npm/@coddletech/access-widget@1.2.0/js/widget.min.js" onerror="this.onerror=null;this.src='/vendor/coddle-access/js/widget.min.js';" data-color="${r}" data-position="${i}" data-lang="${a}" async><\/script>`,dynamicLoader:`<script>
(function() {
  fetch('/api/plugins/coddle-access/config')
    .then(function(r) { return r.json(); })
    .then(function(cfg) {
      if (!cfg || !cfg.enabled) return;
      window._cyA11yConfig = {
        primaryColor: cfg.primaryColor,
        iconId: cfg.iconId,
        iconSize: cfg.iconSize,
        position: { desktop: cfg.positionDesktop, mobile: cfg.positionMobile },
        statementUrl: cfg.statementUrl,
        language: { default: cfg.language }
      };
      window._cyA11yAssets = {
        fonts: '/vendor/coddle-access/fonts/'
      };
      var s = document.createElement('script');
      s.src = '/vendor/coddle-access/js/widget.min.js';
      s.async = true;
      document.body ? document.body.appendChild(s) : document.head.appendChild(s);
    });
})();
<\/script>`,companion:`In Astro layouts, you can also render the native companion <CoddleAccessWidget />.`}}},status:{public:!0,methods:[`GET`],handler:async(e,t)=>({status:`active`,pluginId:t.plugin.id,version:`1.2.0`,brand:`Coddle Access`,vendor:`Coddle Technologies`,website:`https://coddletech.com`})}}};export{e as default};