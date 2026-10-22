const e=`sha384-PkHCo9yYYt43CM9mczXrTqkNN0ddgEpZos0hrTEP62/Iox7z6iWI3CfR06lzbWdK`,t={enabled:!0,language:`en`,primaryColor:`#1863DC`,iconId:`default`,iconSize:48,positionDesktop:`bottom-right`,positionMobile:`bottom-right`,statementUrl:`/accessibility-statement`,cdnBaseUrl:``},n=[{value:`en`,label:`English`},{value:`es`,label:`Spanish (Español)`},{value:`fr`,label:`French (Français)`},{value:`de`,label:`German (Deutsch)`},{value:`it`,label:`Italian (Italiano)`},{value:`pt`,label:`Portuguese (Português)`},{value:`nl`,label:`Dutch (Nederlands)`},{value:`pl`,label:`Polish (Polski)`},{value:`da`,label:`Danish (Dansk)`},{value:`sv`,label:`Swedish (Svenska)`},{value:`no`,label:`Norwegian (Norsk)`},{value:`fi`,label:`Finnish (Suomi)`}],r=[{value:`default`,label:`Default (Accessibility Figure)`},{value:`accessibility`,label:`Universal Access`},{value:`assist`,label:`Assist / Help`},{value:`wheel`,label:`Wheelchair`}],i=[{value:`40`,label:`Small (40px)`},{value:`48`,label:`Medium (48px)`},{value:`56`,label:`Large (56px)`}],a=[{value:`bottom-right`,label:`Bottom Right`},{value:`bottom-left`,label:`Bottom Left`},{value:`top-right`,label:`Top Right`},{value:`top-left`,label:`Top Left`}],o=[{hex:`#1863DC`,label:`Ocean Blue (Default)`},{hex:`#0369A1`,label:`Deep Ocean Blue`},{hex:`#0D9488`,label:`Teal`},{hex:`#4F46E5`,label:`Indigo`},{hex:`#16A34A`,label:`Emerald`},{hex:`#0F172A`,label:`Slate Dark`}];function s(e){if(!e)return`#1863DC`;let t=e.trim();if(/^#[0-9A-Fa-f]{6}$/.test(t))return t.toUpperCase();if(/^#[0-9A-Fa-f]{3}$/.test(t)){let e=t[1],n=t[2],r=t[3];return`#${e}${e}${n}${n}${r}${r}`.toUpperCase()}return`#1863DC`}function c(e){let t=String(e||``).trim();return t===`person`?`default`:t===`universal-access`?`accessibility`:t===`wheelchair`?`wheel`:[`default`,`accessibility`,`assist`,`wheel`].includes(t)?t:`default`}function l(e){let t=String(e||``).trim();return[`bottom-right`,`bottom-left`,`top-right`,`top-left`].includes(t)?t:`bottom-right`}const u={header:e=>({type:`header`,text:e}),context:e=>({type:`context`,text:e}),banner:e=>({type:`banner`,title:e.title,description:e.description,variant:e.variant||`default`}),actions:e=>({type:`actions`,elements:e}),form:e=>({type:`form`,fields:e.fields,submit:e.submit}),fields:e=>({type:`fields`,fields:e}),divider:()=>({type:`divider`})},d={link:(e,t,n)=>({type:`link`,label:e,target:t,appearance:n?.appearance||`secondary`}),toggle:(e,t,n)=>({type:`toggle`,action_id:e,label:t,description:n?.description,initial_value:n?.initialValue}),select:(e,t,n,r)=>({type:`select`,action_id:e,label:t,options:n,initial_value:r?.initialValue}),textInput:(e,t,n)=>({type:`text_input`,action_id:e,label:t,placeholder:n?.placeholder,initial_value:n?.initialValue,multiline:n?.multiline})};function f(e,t=`http://localhost:4321/`){let o=t.startsWith(`http://`)||t.startsWith(`https://`)?t:`http://localhost:4321/`;return[u.header(`Accessibility Toolkit`),u.context(`Customize the language, colour, icon, dimensions, and positioning of the official Accessibility Toolkit.`),u.actions([d.link(`Preview Frontend ↗`,{kind:`external`,url:o},{appearance:`secondary`})]),u.banner({title:`Accessibility Suite — WCAG 2.2 Level AA`,description:`Municipal & Web Accessibility Suite • Standard Edition`,variant:`default`}),u.form({fields:[d.toggle(`enabled`,`Enable Accessibility Widget`,{description:`When enabled, the accessibility widget launcher and toolbar tools are rendered on all public website pages.`,initialValue:e.enabled}),d.select(`language`,`Widget Language (12 Locales)`,n,{initialValue:e.language}),d.textInput(`primaryColor`,`Widget Colour (Current: ${e.primaryColor})`,{placeholder:`#1863DC`,initialValue:e.primaryColor}),d.select(`iconId`,`Launcher Icon (Shape)`,r,{initialValue:e.iconId}),d.select(`iconSize`,`Button Size (Diameter)`,i,{initialValue:String(e.iconSize)}),d.select(`positionDesktop`,`Desktop Screen Position`,a,{initialValue:e.positionDesktop}),d.select(`positionMobile`,`Mobile Screen Position`,a,{initialValue:e.positionMobile}),d.textInput(`cdnBaseUrl`,`Custom CDN Base URL (Optional)`,{placeholder:`https://your-cdn.example.com/assets`,initialValue:e.cdnBaseUrl||``}),d.textInput(`statementUrl`,`Accessibility Statement URL`,{placeholder:`/accessibility-statement or https://example.com/accessibility-statement`,initialValue:e.statementUrl})],submit:{label:`Save Settings`,action_id:`save_settings`}}),u.divider(),u.fields([{label:`Active Settings Summary`,value:`Status: ${e.enabled?`Active (Enabled)`:`Disabled`} • Color: ${e.primaryColor} • Icon: ${e.iconId} (${e.iconSize}px) • Desktop: ${e.positionDesktop} • Mobile: ${e.positionMobile}`},{label:`Quick Palette Suggestions`,value:`Ocean Blue: #1863DC | Deep Blue: #0369A1 | Teal: #0D9488 | Indigo: #4F46E5 | Emerald: #16A34A | Slate Dark: #0F172A`},{label:`Frontend Integration`,value:`Automatic injection on all pages via page:fragments hook in <EmDashBodyEnd />. Also supports native companion component <AccessibilityWidget />.`},{label:`Compliance Standards`,value:`WCAG 2.2 Level AA & ADA Section 508 Compliant • Municipal & Enterprise Accessibility Suite`}])]}async function p(e){let n=await e.get(`enabled`)??t.enabled,r=await e.get(`language`)??t.language,i=await e.get(`primaryColor`)??t.primaryColor,a=c(await e.get(`iconId`)??t.iconId),o=await e.get(`iconSize`),u=Number(o??t.iconSize),d=l(await e.get(`positionDesktop`)??t.positionDesktop),f=l(await e.get(`positionMobile`)??t.positionMobile),p=await e.get(`statementUrl`)??t.statementUrl,m=await e.get(`cdnBaseUrl`),h=typeof m==`string`?m.trim():``;return{enabled:!!n,language:String(r||`en`),primaryColor:s(String(i||`#1863DC`)),iconId:a,iconSize:[40,48,56].includes(u)?u:48,positionDesktop:d,positionMobile:f,statementUrl:String(p||``),cdnBaseUrl:h}}const m={hooks:{"plugin:install":async(e,t)=>{t.log.info(`Accessibility Toolkit installed`,{pluginId:t.plugin.id,event:e})},"plugin:activate":async(e,t)=>{t.log.info(`Accessibility Toolkit activated`,{pluginId:t.plugin.id,event:e})},"plugin:deactivate":async(e,t)=>{t.log.info(`Accessibility Toolkit deactivated`,{pluginId:t.plugin.id,event:e})},"page:fragments":async(t,n)=>{let r=await p(n.settings);if(!r.enabled)return[];let i={status:{mobile:!0,desktop:!0},iconId:r.iconId,iconSize:r.iconSize,label:`Accessibility widget`,heading:`Accessibility Toolkit`,position:{mobile:r.positionMobile,desktop:r.positionDesktop},language:{default:r.language,selected:[]},margins:{desktop:{top:20,bottom:20,left:20,right:20},mobile:{top:20,bottom:20,left:20,right:20}},primaryColor:r.primaryColor,keyboard:{enabled:!0,shortcut:`alt+a`},modules:{color:{darkContrast:{enabled:!0},lightContrast:{enabled:!0},highContrast:{enabled:!0},highSaturation:{enabled:!0},lowSaturation:{enabled:!0},monochrome:{enabled:!0}},content:{adjustFontSizing:{enabled:!0},highlightTitle:{enabled:!0},highlightLinks:{enabled:!0},dyslexicFont:{enabled:!0},letterSpacing:{enabled:!0},lineHeight:{enabled:!0},fontWeight:{enabled:!0},textAlign:{enabled:!0}},navigation:{readingGuide:{enabled:!0},pauseAnimations:{enabled:!0},bigCursor:{enabled:!0}},statement:{enabled:!!r.statementUrl,url:r.statementUrl,displayInWidget:!1,generatedDate:``,formData:{companyName:``,businessEmail:``,website:``,wcagStandard:`WCAG 2.2 Level AA`,conformanceStatus:`fully-conformant`}},profiles:{enabled:!0},pageRead:{enabled:!0},muteSounds:{enabled:!0}}},a=r.cdnBaseUrl&&r.cdnBaseUrl.startsWith(`https://`)?r.cdnBaseUrl.replace(/\/+$/,``):``,o=a?`${a}/js/widget.min.js`:`/vendor/accessibility-toolkit/js/widget.min.js`,s=a?`/vendor/accessibility-toolkit/js/widget.min.js`:`/vendor/coddle-access/js/widget.min.js`,c=a?`${a}/fonts/`:`/vendor/accessibility-toolkit/fonts/`;return[{kind:`inline-script`,placement:`body:end`,code:`(function() {
  if (window.__accessibility_toolkit_initialized || window.__coddle_access_initialized) return;
  window.__accessibility_toolkit_initialized = true;
  window.__coddle_access_initialized = true;
  window._cyA11yConfig = ${JSON.stringify(i)};
  window._cyA11yAssets = {
    fonts: '${c}'
  };
  var s = document.createElement('script');
  s.id = 'accessibility-toolkit-script';
  s.src = '${o}';
  s.async = true;
  ${a?`s.integrity = '`+e+`'; s.crossOrigin = 'anonymous';`:``}
  ${s?`s.onerror = function() { var fb = document.createElement('script'); fb.id = 'accessibility-toolkit-script-fallback'; fb.src = '`+s+`'; fb.async = true; (document.body || document.head).appendChild(fb); };`:``}
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
          ].join("\\n");
          sr.appendChild(style);

          var btn = sr.querySelector(".cya11y-menu-btn");
          if (btn && btn.getAttribute("aria-label")) {
            btn.setAttribute("aria-label", btn.getAttribute("aria-label").replace(/Coddle\\s+/i, ""));
          }

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
})();`,key:`accessibility-toolkit-widget`}]}},routes:{admin:{public:!1,methods:[`POST`],handler:async(e,t)=>{let r=e.input||{},i=await p(t.settings),a=`http://localhost:4321/`;try{let t=e?.url;if(t){let e=new URL(t);e.origin&&(e.protocol===`http:`||e.protocol===`https:`)&&(a=e.origin+`/`)}}catch{}if(r.type===`page_load`)return{blocks:f(i,a)};if(r.type===`form_submit`){let e=r.values||{},o=[],d=String(e.primaryColor||``).trim();d&&!/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(d)&&o.push(`Widget Colour must be a valid hex color (e.g. #1863DC)`);let p=s(d||i.primaryColor),m=String(e.language||``).trim();m&&!n.some(e=>e.value===m)&&o.push(`Unsupported language code "${m}"`);let h=m||i.language,g=String(e.statementUrl||``).trim();g&&!g.startsWith(`/`)&&!g.startsWith(`http://`)&&!g.startsWith(`https://`)&&o.push(`Accessibility statement must be a valid URL or path (e.g. /accessibility-statement)`);let _=String(e.cdnBaseUrl||``).trim();if(_&&!_.startsWith(`https://`)&&o.push(`Custom CDN Base URL must be a valid HTTPS URL (e.g. https://your-cdn.example.com/assets)`),o.length>0)return{blocks:[u.banner({title:`Validation Error`,description:o.join(`; `),variant:`error`}),...f(i,a)],toast:{message:o[0],type:`error`}};let v={enabled:e.enabled===void 0?i.enabled:!!e.enabled,language:h,primaryColor:p,iconId:c(e.iconId??i.iconId),iconSize:Number(e.iconSize??i.iconSize),positionDesktop:l(e.positionDesktop??i.positionDesktop),positionMobile:l(e.positionMobile??i.positionMobile),statementUrl:g,cdnBaseUrl:_};return await t.settings.set(`enabled`,v.enabled),await t.settings.set(`language`,v.language),await t.settings.set(`primaryColor`,v.primaryColor),await t.settings.set(`iconId`,v.iconId),await t.settings.set(`iconSize`,v.iconSize),await t.settings.set(`positionDesktop`,v.positionDesktop),await t.settings.set(`positionMobile`,v.positionMobile),await t.settings.set(`statementUrl`,v.statementUrl),await t.settings.set(`cdnBaseUrl`,v.cdnBaseUrl),t.log.info(`Accessibility settings updated`,{pluginId:t.plugin.id,settings:v}),{blocks:f(v,a),toast:{message:`✓ Settings saved successfully`,type:`success`}}}return{blocks:f(i,a)}}},config:{public:!0,methods:[`GET`],handler:async(t,n)=>({...await p(n.settings),version:`1.3.5`,toolkit:`Accessibility Toolkit`,publisher:`EmDash Community`,sri:e})},snippet:{public:!0,methods:[`GET`],handler:async(t,n)=>{let r=await p(n.settings),i=r.cdnBaseUrl&&r.cdnBaseUrl.startsWith(`https://`)?r.cdnBaseUrl.replace(/\/+$/,``):``,a=!!i,o=a?`${i}/js/widget.min.js`:null;return{enabled:r.enabled,mode:a?`cdn`:`local`,cdnConfigured:a,sri:e,html:`<script src="/vendor/accessibility-toolkit/js/widget.min.js" data-color="${r.primaryColor}" data-position="${r.positionDesktop}" data-lang="${r.language}" async><\/script>`,cdnHtml:a?`<script src="${o}" integrity="${e}" crossorigin="anonymous" data-color="${r.primaryColor}" data-position="${r.positionDesktop}" data-lang="${r.language}" async><\/script>`:null,dynamicLoader:`<script>
(function() {
  if (window.__accessibility_toolkit_initialized) return;
  window.__accessibility_toolkit_initialized = true;
  fetch('/_emdash/api/plugins/${n.plugin.id}/config')
    .then(function(r) { return r.ok ? r.json() : null; })
    .then(function(res) {
      var cfg = (res && res.data) || res;
      if (!cfg || cfg.enabled === false) return;
      window._cyA11yConfig = {
        primaryColor: cfg.primaryColor,
        iconId: cfg.iconId,
        iconSize: cfg.iconSize,
        position: { desktop: cfg.positionDesktop, mobile: cfg.positionMobile },
        statementUrl: cfg.statementUrl,
        language: { default: cfg.language }
      };
      var cdnBase = (cfg.cdnBaseUrl && cfg.cdnBaseUrl.startsWith('https://')) ? cfg.cdnBaseUrl.replace(/\\/+$/, '') : '';
      var primarySrc = cdnBase ? cdnBase + '/js/widget.min.js' : '/vendor/accessibility-toolkit/js/widget.min.js';
      var fallbackSrc = cdnBase ? '/vendor/accessibility-toolkit/js/widget.min.js' : '/vendor/coddle-access/js/widget.min.js';
      window._cyA11yAssets = {
        fonts: cdnBase ? cdnBase + '/fonts/' : '/vendor/accessibility-toolkit/fonts/'
      };
      var s = document.createElement('script');
      s.id = 'accessibility-toolkit-script';
      s.src = primarySrc;
      s.async = true;
      if (cdnBase) {
        s.integrity = '${e}';
        s.crossOrigin = 'anonymous';
      }
      s.onerror = function() {
        if (fallbackSrc) {
          console.warn('[Accessibility Toolkit] Primary CDN script failed to load from ' + primarySrc + ', attempting local fallback: ' + fallbackSrc);
          var fb = document.createElement('script');
          fb.id = 'accessibility-toolkit-script-fallback';
          fb.src = fallbackSrc;
          fb.async = true;
          fb.onerror = function() {
            console.warn('[Accessibility Toolkit] Both CDN and local fallback widget scripts failed to load. Ensure assets exist in public/vendor/accessibility-toolkit/ (or legacy public/vendor/coddle-access/) or check CDN availability.');
          };
          (document.body || document.head).appendChild(fb);
        } else {
          console.warn('[Accessibility Toolkit] Widget script failed to load from ' + primarySrc + '. Ensure vendor assets exist in public/vendor/accessibility-toolkit/ (or legacy public/vendor/coddle-access/) or configure a valid CDN URL.');
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
            ".cya11y-footer:not(:has(.cya11y-footer-statement-link:not([style*='display: none']):not([style*='display:none']))) { display: none !important; }"
          ].join("\\n");
          sr.appendChild(style);

          var btn = sr.querySelector(".cya11y-menu-btn");
          if (btn && btn.getAttribute("aria-label")) {
            btn.setAttribute("aria-label", btn.getAttribute("aria-label").replace(/Coddle\\s+/i, ""));
          }

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
      console.warn('[Accessibility Toolkit] Failed to load configuration:', err);
    });
})();
<\/script>`,companion:`In Astro layouts, you can also render the native companion <AccessibilityWidget />.`}}},status:{public:!0,methods:[`GET`],handler:async(e,t)=>({status:`active`,pluginId:t.plugin.id,version:`1.3.5`,brand:`Accessibility Toolkit`,vendor:`EmDash Community`,website:`https://emdashcms.com`})}}};export{t as DEFAULT_SETTINGS,r as ICONS,a as POSITIONS,o as PRESET_COLORS,i as SIZES,n as SUPPORTED_LANGUAGES,e as WIDGET_SRI_HASH,u as blocks,m as default,d as elements,c as normalizeIconId,l as normalizePosition,f as renderAdminBlocks,s as toValid7CharHex};