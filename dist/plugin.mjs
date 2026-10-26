const e=`sha384-PkHCo9yYYt43CM9mczXrTqkNN0ddgEpZos0hrTEP62/Iox7z6iWI3CfR06lzbWdK`,t=`https://cdn.jsdelivr.net/gh/susheel250/accessibility-toolkit@v1.3.5/vendor/accessibility-toolkit/`,n=t,r=`/vendor/accessibility-toolkit/js/widget.min.js`,i=`/vendor/accessibility-toolkit/fonts/`,a=`/vendor/coddle-access/js/widget.min.js`;function o(e){if(typeof e!=`string`)return``;let n=e.trim();if(!n)return``;if(n.toLowerCase()===`default`)return t;if(n.toLowerCase()===`local`||n.toLowerCase()===`none`)return``;try{let e=new URL(n);if(e.protocol!==`https:`)return``;e.search=``,e.hash=``;let r=e.href.toLowerCase();if(r.includes(`coddle-accessibility`)||r.includes(`coddle-access`))return t;let i=e.pathname.replace(/[/]+(js([/]widget([.]min)?[.]js)?|fonts)[/]?$/,``).replace(/[/]+$/,``);return`${e.origin}${i}`}catch{return``}}function s(t){let n=o(t);if(n){let t=n.replace(/[/]+$/,``);return{cdnConfigured:!0,mode:`cdn`,cdnBaseUrl:`${t}/`,scriptUrl:`${t}/js/widget.min.js`,fontsUrl:`${t}/fonts/`,sri:e}}return{cdnConfigured:!1,mode:`local`,cdnBaseUrl:``,scriptUrl:r,fontsUrl:i,sri:e}}const c={enabled:!0,language:`en`,primaryColor:`#1863DC`,iconId:`default`,iconSize:48,positionDesktop:`bottom-right`,positionMobile:`bottom-right`,statementUrl:`/accessibility-statement`,cdnBaseUrl:t},l=[{value:`en`,label:`English`},{value:`es`,label:`Spanish (Español)`},{value:`fr`,label:`French (Français)`},{value:`de`,label:`German (Deutsch)`},{value:`it`,label:`Italian (Italiano)`},{value:`pt`,label:`Portuguese (Português)`},{value:`nl`,label:`Dutch (Nederlands)`},{value:`pl`,label:`Polish (Polski)`},{value:`da`,label:`Danish (Dansk)`},{value:`sv`,label:`Swedish (Svenska)`},{value:`no`,label:`Norwegian (Norsk)`},{value:`fi`,label:`Finnish (Suomi)`}],u=[{value:`default`,label:`Default (Accessibility Figure)`},{value:`accessibility`,label:`Universal Access`},{value:`assist`,label:`Assist / Help`},{value:`wheel`,label:`Wheelchair`}],d=[{value:`40`,label:`Small (40px)`},{value:`48`,label:`Medium (48px)`},{value:`56`,label:`Large (56px)`}],f=[{value:`bottom-right`,label:`Bottom Right`},{value:`bottom-left`,label:`Bottom Left`},{value:`top-right`,label:`Top Right`},{value:`top-left`,label:`Top Left`}],p=[{hex:`#1863DC`,label:`Ocean Blue (Default)`},{hex:`#0369A1`,label:`Deep Ocean Blue`},{hex:`#0D9488`,label:`Teal`},{hex:`#4F46E5`,label:`Indigo`},{hex:`#16A34A`,label:`Emerald`},{hex:`#0F172A`,label:`Slate Dark`}];function m(e,t=!0){if(e==null)return t;if(typeof e==`boolean`)return e;if(typeof e==`string`){let t=e.trim().toLowerCase();if(t===`false`||t===`0`||t===`off`||t===`no`)return!1;if(t===`true`||t===`1`||t===`on`||t===`yes`)return!0}return typeof e==`number`?e!==0:t}function h(e){if(!e)return`#1863DC`;let t=e.trim();if(/^#[0-9A-Fa-f]{6}$/.test(t))return t.toUpperCase();if(/^#[0-9A-Fa-f]{3}$/.test(t)){let e=t[1],n=t[2],r=t[3];return`#${e}${e}${n}${n}${r}${r}`.toUpperCase()}return`#1863DC`}function g(e){let t=String(e||``).trim();return t===`person`?`default`:t===`universal-access`?`accessibility`:t===`wheelchair`?`wheel`:[`default`,`accessibility`,`assist`,`wheel`].includes(t)?t:`default`}function _(e){let t=String(e||``).trim();return[`bottom-right`,`bottom-left`,`top-right`,`top-left`].includes(t)?t:`bottom-right`}const v={header:e=>({type:`header`,text:e}),context:e=>({type:`context`,text:e}),banner:e=>({type:`banner`,title:e.title,description:e.description,variant:e.variant||`default`}),actions:e=>({type:`actions`,elements:e}),form:e=>({type:`form`,fields:e.fields,submit:e.submit}),fields:e=>({type:`fields`,fields:e}),divider:()=>({type:`divider`})},y={link:(e,t,n)=>({type:`link`,label:e,target:t,appearance:n?.appearance||`secondary`}),toggle:(e,t,n)=>({type:`toggle`,action_id:e,label:t,description:n?.description,initial_value:n?.initialValue}),select:(e,t,n,r)=>({type:`select`,action_id:e,label:t,options:n,initial_value:r?.initialValue}),textInput:(e,t,n)=>({type:`text_input`,action_id:e,label:t,placeholder:n?.placeholder,initial_value:n?.initialValue,multiline:n?.multiline})};function b(e,n=`http://localhost:4321/`){let r=n.startsWith(`http://`)||n.startsWith(`https://`)?n:`http://localhost:4321/`;return[v.header(`Accessibility Toolkit`),v.context(`Customize the language, colour, icon, dimensions, and positioning of the official Accessibility Toolkit.`),v.actions([y.link(`Preview Frontend ↗`,{kind:`external`,url:r},{appearance:`secondary`})]),v.banner({title:`Accessibility Suite — WCAG 2.2 Level AA`,description:`Municipal & Web Accessibility Suite • Standard Edition`,variant:`default`}),v.form({fields:[y.toggle(`enabled`,`Enable Accessibility Widget`,{description:`When enabled, the accessibility widget launcher and toolbar tools are rendered on all public website pages.`,initialValue:e.enabled}),y.select(`language`,`Widget Language (12 Locales)`,l,{initialValue:e.language}),y.textInput(`primaryColor`,`Widget Colour (Current: ${e.primaryColor})`,{placeholder:`#1863DC`,initialValue:e.primaryColor}),y.select(`iconId`,`Launcher Icon (Shape)`,u,{initialValue:e.iconId}),y.select(`iconSize`,`Button Size (Diameter)`,d,{initialValue:String(e.iconSize)}),y.select(`positionDesktop`,`Desktop Screen Position`,f,{initialValue:e.positionDesktop}),y.select(`positionMobile`,`Mobile Screen Position`,f,{initialValue:e.positionMobile}),y.textInput(`cdnBaseUrl`,`CDN Base URL (Optional)`,{placeholder:t,initialValue:e.cdnBaseUrl||``}),y.textInput(`statementUrl`,`Accessibility Statement URL`,{placeholder:`/accessibility-statement or https://example.com/accessibility-statement`,initialValue:e.statementUrl})],submit:{label:`Save Settings`,action_id:`save_settings`}}),v.divider(),v.fields([{label:`Active Settings Summary`,value:`Status: ${e.enabled?`Active (Enabled)`:`Disabled`} • Color: ${e.primaryColor} • Icon: ${e.iconId} (${e.iconSize}px) • Desktop: ${e.positionDesktop} • Mobile: ${e.positionMobile} • CDN: ${e.cdnBaseUrl?`Configured`:`Local Assets`}`},{label:`Quick Palette Suggestions`,value:`Ocean Blue: #1863DC | Deep Blue: #0369A1 | Teal: #0D9488 | Indigo: #4F46E5 | Emerald: #16A34A | Slate Dark: #0F172A`},{label:`Frontend Integration`,value:`In EmDash, sandboxed registry plugins require theme integration. Add the dynamic loader snippet (from the snippet endpoint) or companion <AccessibilityWidget /> to your layout (e.g. src/layouts/Base.astro).`},{label:`Compliance Standards`,value:`WCAG 2.2 Level AA & ADA Section 508 Compliant • Municipal & Enterprise Accessibility Suite`}])]}async function x(e){let t=m(await e.get(`enabled`),c.enabled),n=await e.get(`language`)??c.language,r=await e.get(`primaryColor`)??c.primaryColor,i=g(await e.get(`iconId`)??c.iconId),a=await e.get(`iconSize`),s=Number(a??c.iconSize),l=_(await e.get(`positionDesktop`)??c.positionDesktop),u=_(await e.get(`positionMobile`)??c.positionMobile),d=await e.get(`statementUrl`)??c.statementUrl,f=await e.get(`cdnBaseUrl`),p;return p=f==null?c.cdnBaseUrl||``:o(f),{enabled:!!t,language:String(n||`en`),primaryColor:h(String(r||`#1863DC`)),iconId:i,iconSize:[40,48,56].includes(s)?s:48,positionDesktop:l,positionMobile:u,statementUrl:String(d||``),cdnBaseUrl:p}}const S={hooks:{"plugin:install":async(e,t)=>{t.log.info(`Accessibility Toolkit installed`,{pluginId:t.plugin.id,event:e})},"plugin:activate":async(e,t)=>{t.log.info(`Accessibility Toolkit activated`,{pluginId:t.plugin.id,event:e})},"plugin:deactivate":async(e,t)=>{t.log.info(`Accessibility Toolkit deactivated`,{pluginId:t.plugin.id,event:e})},"page:fragments":async(t,n)=>{let i=await x(n.settings);if(!i.enabled)return[];let a=s(i.cdnBaseUrl),o=a.scriptUrl,c=a.cdnConfigured?r:``,l=a.fontsUrl,u={status:{mobile:!0,desktop:!0},iconId:i.iconId,iconSize:i.iconSize,label:`Accessibility menu`,heading:`Accessibility Toolkit`,position:{mobile:i.positionMobile,desktop:i.positionDesktop},language:{default:i.language,selected:[]},margins:{desktop:{top:20,bottom:20,left:20,right:20},mobile:{top:20,bottom:20,left:20,right:20}},primaryColor:i.primaryColor,keyboard:{enabled:!0,shortcut:`alt+a`},modules:{color:{darkContrast:{enabled:!0},lightContrast:{enabled:!0},highContrast:{enabled:!0},highSaturation:{enabled:!0},lowSaturation:{enabled:!0},monochrome:{enabled:!0}},content:{adjustFontSizing:{enabled:!0},highlightTitle:{enabled:!0},highlightLinks:{enabled:!0},dyslexicFont:{enabled:!0},letterSpacing:{enabled:!0},lineHeight:{enabled:!0},fontWeight:{enabled:!0},textAlign:{enabled:!0}},navigation:{readingGuide:{enabled:!0},pauseAnimations:{enabled:!0},bigCursor:{enabled:!0}},statement:{enabled:!!i.statementUrl,url:i.statementUrl,displayInWidget:!1,generatedDate:``,formData:{companyName:``,businessEmail:``,website:``,wcagStandard:`WCAG 2.2 Level AA`,conformanceStatus:`fully-conformant`}},profiles:{enabled:!0},pageRead:{enabled:!0},muteSounds:{enabled:!0}}};return[{kind:`inline-script`,placement:`body:end`,code:`(function() {
  if (window.__accessibility_toolkit_initialized) return;
  if (document.getElementById('accessibility-toolkit-script')) return;
  window.__accessibility_toolkit_initialized = true;
  window._cyA11yConfig = ${JSON.stringify(u)};
  window._cyA11yAssets = {
    fonts: '${l}'
  };
  var s = document.createElement('script');
  s.id = 'accessibility-toolkit-script';
  s.src = '${o}';
  s.async = true;
  ${a.cdnConfigured?`s.integrity = '`+e+`'; s.crossOrigin = 'anonymous';`:``}
  ${c?`s.onerror = function() { var fb = document.createElement('script'); fb.id = 'accessibility-toolkit-script-fallback'; fb.src = '`+c+`'; fb.async = true; (document.body || document.head).appendChild(fb); };`:``}

  function applyShadowOverrides() {
    var container = document.getElementById("cya11y-container");
    if (!container || !container.shadowRoot) return false;
    var sr = container.shadowRoot;
    if (!sr.getElementById("a11y-toolkit-overrides")) {
      var style = document.createElement("style");
      style.id = "a11y-toolkit-overrides";
      style.textContent = [
        ".cya11y-footer-brand { display: none !important; }",
        ".cya11y-footer:not(:has(.cya11y-footer-statement-link:not([style*='display: none']):not([style*='display:none']))) { display: none !important; }"
      ].join(" ");
      sr.appendChild(style);

      var syncFooter = function() {
        var footer = sr.querySelector(".cya11y-footer");
        if (!footer) return;
        var statement = footer.querySelector(".cya11y-footer-statement-link");
        var hasStatement = statement && window.getComputedStyle(statement).display !== "none";
        if (!hasStatement) {
          footer.style.display = "none";
        }
      };

      var footerObserver = new MutationObserver(syncFooter);
      footerObserver.observe(sr, { childList: true, subtree: true });
    }
    return true;
  }

  if (!applyShadowOverrides()) {
    var obs = new MutationObserver(function() {
      if (applyShadowOverrides()) {
        obs.disconnect();
      }
    });
    obs.observe(document.body || document.documentElement, { childList: true, subtree: true });
    setTimeout(function() { obs.disconnect(); }, 30000);
  }

  (document.body || document.head).appendChild(s);
})();`,key:`accessibility-toolkit-widget`}]}},routes:{admin:{public:!1,methods:[`POST`],handler:async(e,n)=>{let r=e.input||{},i=await x(n.settings),a=`http://localhost:4321/`;try{let t=e?.url;if(t){let e=new URL(t);e.origin&&(e.protocol===`http:`||e.protocol===`https:`)&&(a=e.origin+`/`)}}catch{}if(r.type===`page_load`)return{blocks:b(i,a)};if(r.type===`form_submit`){let e=r.values||{},o=[],s=String(e.primaryColor||``).trim();s&&!/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(s)&&o.push(`Widget Colour must be a valid hex color (e.g. #1863DC)`);let c=h(s||i.primaryColor),u=String(e.language||``).trim();u&&!l.some(e=>e.value===u)&&o.push(`Unsupported language code "${u}"`);let d=u||i.language,f=String(e.statementUrl||``).trim();f&&!f.startsWith(`/`)&&!f.startsWith(`http://`)&&!f.startsWith(`https://`)&&o.push(`Accessibility statement must be a valid URL or path (e.g. /accessibility-statement)`);let p=``,m=e.cdnBaseUrl===void 0?void 0:String(e.cdnBaseUrl).trim();if(m!==void 0)if(m===``||m.toLowerCase()===`local`||m.toLowerCase()===`none`)p=``;else if(m.toLowerCase()===`default`)p=t;else if(!m.startsWith(`https://`))o.push(`Custom CDN Base URL must be a valid HTTPS URL (e.g. https://your-cdn.example.com/assets) or 'default'`);else try{if(new URL(m).protocol!==`https:`)throw Error();p=m}catch{o.push(`Custom CDN Base URL is not a valid HTTPS URL`)}else p=i.cdnBaseUrl||``;if(o.length>0)return{blocks:[v.banner({title:`Validation Error`,description:o.join(`; `),variant:`error`}),...b(i,a)],toast:{message:o[0],type:`error`}};let y={enabled:e.enabled===void 0?i.enabled:!!e.enabled,language:d,primaryColor:c,iconId:g(e.iconId??i.iconId),iconSize:Number(e.iconSize??i.iconSize),positionDesktop:_(e.positionDesktop??i.positionDesktop),positionMobile:_(e.positionMobile??i.positionMobile),statementUrl:f,cdnBaseUrl:p};return await n.settings.set(`enabled`,y.enabled),await n.settings.set(`language`,y.language),await n.settings.set(`primaryColor`,y.primaryColor),await n.settings.set(`iconId`,y.iconId),await n.settings.set(`iconSize`,y.iconSize),await n.settings.set(`positionDesktop`,y.positionDesktop),await n.settings.set(`positionMobile`,y.positionMobile),await n.settings.set(`statementUrl`,y.statementUrl),await n.settings.set(`cdnBaseUrl`,y.cdnBaseUrl),n.log.info(`Accessibility settings updated`,{pluginId:n.plugin.id,settings:y}),{blocks:b(y,a),toast:{message:`✓ Settings saved successfully`,type:`success`}}}return{blocks:b(i,a)}}},config:{public:!0,methods:[`GET`],handler:async(t,n)=>{let r=await x(n.settings),i=s(r.cdnBaseUrl);return t?.request?.url&&t.request.url.match(/_emdash\/api\/plugins\/([^/?#]+)/)?.[1]||n.plugin.id,{...r,cdnBaseUrl:r.cdnBaseUrl,cdnConfigured:i.cdnConfigured,mode:i.mode,scriptUrl:i.scriptUrl,fontsUrl:i.fontsUrl,version:`1.3.5`,toolkit:`Accessibility Toolkit`,publisher:`EmDash Community`,sri:e}}},snippet:{public:!0,methods:[`GET`],handler:async(t,n)=>{let r=await x(n.settings),i=s(r.cdnBaseUrl),a=t?.request?.url&&t.request.url.match(/_emdash\/api\/plugins\/([^/?#]+)/)?.[1]||n.plugin.id,o=i.cdnConfigured?`<script src="${i.scriptUrl}" integrity="${e}" crossorigin="anonymous" data-color="${r.primaryColor}" data-position="${r.positionDesktop}" data-lang="${r.language}" async><\/script>`:`<script src="${i.scriptUrl}" data-color="${r.primaryColor}" data-position="${r.positionDesktop}" data-lang="${r.language}" async><\/script>`,c=i.cdnConfigured?o:null,l=`<script>
(function() {
  if (window.__accessibility_toolkit_initialized) return;
  if (document.getElementById('accessibility-toolkit-script')) return;
  window.__accessibility_toolkit_initialized = true;
  var endpoints = [
    '/_emdash/api/plugins/${a}/config'
  ];
  if ('${a}' !== 'accessibility-toolkit') {
    endpoints.push('/_emdash/api/plugins/accessibility-toolkit/config');
  }
  endpoints.push('/_emdash/api/plugins/accessibility/config');

  function tryFetchConfig(idx) {
    if (idx >= endpoints.length) {
      window.__accessibility_toolkit_initialized = false;
      console.warn('[Accessibility Toolkit] All candidate configuration endpoints failed.');
      return;
    }
    fetch(endpoints[idx])
      .then(function(r) { return r.ok ? r.json() : null; })
      .then(function(res) {
        var cfg = (res && res.data) || res;
        if (!cfg) {
          tryFetchConfig(idx + 1);
          return;
        }
        if (cfg.enabled === false) return;
      window._cyA11yConfig = {
        primaryColor: cfg.primaryColor,
        iconId: cfg.iconId,
        iconSize: cfg.iconSize,
        position: { desktop: cfg.positionDesktop, mobile: cfg.positionMobile },
        statementUrl: cfg.statementUrl,
        language: { default: cfg.language },
        label: "Accessibility menu"
      };

      var cdnConfigured = Boolean(cfg.cdnConfigured);
      var primarySrc = cfg.scriptUrl || (cdnConfigured && cfg.cdnBaseUrl ? cfg.cdnBaseUrl.replace(/[/]+$/, '') + '/js/widget.min.js' : '/vendor/accessibility-toolkit/js/widget.min.js');
      var fontsSrc = cfg.fontsUrl || (cdnConfigured && cfg.cdnBaseUrl ? cfg.cdnBaseUrl.replace(/[/]+$/, '') + '/fonts/' : '/vendor/accessibility-toolkit/fonts/');
      var fallbackSrc = cdnConfigured ? '/vendor/accessibility-toolkit/js/widget.min.js' : '';

      window._cyA11yAssets = {
        fonts: fontsSrc
      };

      if (document.getElementById('accessibility-toolkit-script')) return;
      var s = document.createElement('script');
      s.id = 'accessibility-toolkit-script';
      s.src = primarySrc;
      s.async = true;
      if (cdnConfigured) {
        s.integrity = '${e}';
        s.crossOrigin = 'anonymous';
      }
      s.onerror = function() {
        if (fallbackSrc && fallbackSrc !== primarySrc) {
          if (document.getElementById('accessibility-toolkit-script-fallback')) return;
          console.warn('[Accessibility Toolkit] Primary CDN script failed to load from ' + primarySrc + ', attempting local fallback: ' + fallbackSrc);
          var fb = document.createElement('script');
          fb.id = 'accessibility-toolkit-script-fallback';
          fb.src = fallbackSrc;
          fb.async = true;
          fb.onerror = function() {
            window.__accessibility_toolkit_initialized = false;
            console.warn('[Accessibility Toolkit] Both CDN (' + primarySrc + ') and local fallback (' + fallbackSrc + ') failed to load. Ensure assets exist in public/vendor/accessibility-toolkit/ or check CDN availability.');
          };
          (document.body || document.head).appendChild(fb);
        } else {
          window.__accessibility_toolkit_initialized = false;
          console.warn('[Accessibility Toolkit] Widget script failed to load from ' + primarySrc + '. Ensure vendor assets exist in public/vendor/accessibility-toolkit/ or configure a valid CDN URL.');
        }
      };

      function applyShadowOverrides() {
        var container = document.getElementById("cya11y-container");
        if (!container || !container.shadowRoot) return false;
        var sr = container.shadowRoot;
        if (!sr.getElementById("a11y-toolkit-overrides")) {
          var style = document.createElement("style");
          style.id = "a11y-toolkit-overrides";
          style.textContent = [
            ".cya11y-footer-brand { display: none !important; }",
            ".cya11y-footer:not(:has(.cya11y-footer-statement-link:not([style*=\\'display: none\\']):not([style*=\\'display:none\\']))) { display: none !important; }"
          ].join(" ");
          sr.appendChild(style);

          var syncFooter = function() {
            var footer = sr.querySelector(".cya11y-footer");
            if (!footer) return;
            var statement = footer.querySelector(".cya11y-footer-statement-link");
            var hasStatement = statement && window.getComputedStyle(statement).display !== "none";
            if (!hasStatement) {
              footer.style.display = "none";
            }
          };

          var footerObserver = new MutationObserver(syncFooter);
          footerObserver.observe(sr, { childList: true, subtree: true });
        }
        return true;
      }

      if (!applyShadowOverrides()) {
        var obs = new MutationObserver(function() {
          if (applyShadowOverrides()) {
            obs.disconnect();
          }
        });
        obs.observe(document.body || document.documentElement, { childList: true, subtree: true });
        setTimeout(function() { obs.disconnect(); }, 10000);
      }

      (document.body || document.head).appendChild(s);
    })
      .catch(function(err) {
        tryFetchConfig(idx + 1);
      });
  }

  tryFetchConfig(0);
})();
<\/script>`;return{enabled:r.enabled,mode:i.mode,cdnConfigured:i.cdnConfigured,cdnBaseUrl:i.cdnBaseUrl,scriptUrl:i.scriptUrl,fontsUrl:i.fontsUrl,sri:e,html:o,cdnHtml:c,dynamicLoader:l,companion:`In Astro layouts, you can also render the native companion <AccessibilityWidget />.`}}},status:{public:!0,methods:[`GET`],handler:async(e,t)=>({status:`active`,pluginId:t.plugin.id,version:`1.3.5`,brand:`Accessibility Toolkit`,vendor:`EmDash Community`,website:`https://emdashcms.com`})}}};export{t as CANONICAL_CDN_BASE_URL,n as DEFAULT_CDN_BASE_URL,c as DEFAULT_SETTINGS,u as ICONS,a as LEGACY_LOCAL_WIDGET_SCRIPT_PATH,i as LOCAL_FONTS_PATH,r as LOCAL_WIDGET_SCRIPT_PATH,f as POSITIONS,p as PRESET_COLORS,d as SIZES,l as SUPPORTED_LANGUAGES,e as WIDGET_SRI_HASH,v as blocks,S as default,y as elements,m as normalizeBoolean,g as normalizeIconId,_ as normalizePosition,b as renderAdminBlocks,s as resolveCdnConfig,o as sanitizeCdnBaseUrl,h as toValid7CharHex};