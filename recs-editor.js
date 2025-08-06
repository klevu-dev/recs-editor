//recs-editor
//source/modules/recs/recs-editor/activate.js

//source/general/wrapper.js
// templates/wrapper.js
(function ( klevu ) {

  //source/modules/recs/recs-editor/main.js

    klevu.support.hook(["recs"],function(){
        if (klevu.recs && klevu.recs.base) {
            //source/modules/recs/recs-editor/core/helpers.js
klevu.extend(true, klevu.dom.helpers,{
    /**
     * Function to escape HTML from the string
     * @param {*} string
     * @returns
     */
    escapeHTML: function (string) {
        if (string && string.length) {
            var entityMap = {
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#39;',
                '/': '&#x2F;',
                '`': '&#x60;',
                '=': '&#x3D;'
            };
            return String(string).replace(/[&<>"'`=\/]/g, function (s) {
                return entityMap[s];
            });
        } else {
            return string;
        }
    },
    /**
     * Function to clean up product image
     * @param {*} element
     * @returns
     */
    cleanUpProductImage:function (element) {
        var elementSrc = element.getAttribute("src");
        if (elementSrc && elementSrc.length) {
            var kuThumbnailImage = "";
            if (typeof klevu.search.modules.kmcInputs.base.getKMCUserOptionsNoImageUrl === "function") {
                kuThumbnailImage = klevu.search.modules.kmcInputs.base.getKMCUserOptionsNoImageUrl();
            } else {
                kuThumbnailImage = "https://js.klevu.com/klevu-js-v1/img-1-1/place-holder.jpg";
            }

            var isKlevuPlaceholderImage = (element.src.indexOf(kuThumbnailImage) > -1);
            if (isKlevuPlaceholderImage) {
                element.src = "";
                element.onerror = "";
                return;
            }
            var isPubAdded = (element.src.indexOf("/pub") > -1);
            if (isPubAdded) {
                element.src = element.src.replace("/pub", "");
                element.onerror = function () {
                    element.src = kuThumbnailImage;
                    element.onerror = "";
                };
            } else {
                var isOnlyMediaAdded = (element.src.indexOf("/media") > -1);
                var isNeedToChangeAppended = (element.src.indexOf("needtochange/") > -1);
                var originValue = element.getAttribute("origin");
                if (isNeedToChangeAppended) {
                    element.src = element.src.replace("needtochange/", "");
                } else if (isOnlyMediaAdded) {
                    element.src = element.src.replace("/media", "/pub/media");
                } else if (originValue) {
                    element.src = originValue.replace("needtochange/", "pub/");
                    element.onerror = function () {
                        element.src = kuThumbnailImage;
                        element.onerror = "";
                    };
                }
            }
        } else {
            var kuThumbnailImage = "";
            if (typeof klevu.search.modules.kmcInputs.base.getKMCUserOptionsNoImageUrl === "function") {
                kuThumbnailImage = klevu.search.modules.kmcInputs.base.getKMCUserOptionsNoImageUrl();
            } else {
                kuThumbnailImage = "https://js.klevu.com/klevu-js-v1/img-1-1/place-holder.jpg";
            }
            element.src = kuThumbnailImage;
            element.onerror = "";
        }
    },
    /**
     * Function to read stored cookie
     * @param {*} cookieName
     * @returns
     */
    readCookie:function (cookieName) {
        var dataProtection = (klevu.isFunction(klevu.support.isActive))?klevu.support.isActive("dataProtection"):!klevu.isUndefined(klevu.support.dataProtection);

        if(cookieName === klevu.getGlobalSetting("constants.COOKIE_KLEVU_RCP") && dataProtection){
            if(klevu.dataProtection.getUseConsent() && !klevu.dataProtection.dataCanBeTracked()){
                return "";
            }
        }

        var theCookie = " " + document.cookie,
            start = theCookie.indexOf(" " + cookieName + "="),
            end = theCookie.indexOf(";", start + 1);
        if (start === -1) {
            start = theCookie.indexOf(";" + cookieName + "=");
        }
        if (start === -1 || cookieName === "") {
            return "";
        }
        end = theCookie.indexOf(";", start + 1);
        if (end === -1) {
            end = theCookie.length;
        }
        return decodeURIComponent(theCookie.substring(start + cookieName.length + 2, end));
    },
    /**
     * Function to add product id to the recent viewed product cookie
     * @param {*} productId
     */
    addClickedProductToCookie:  function (productId) {
        var dataProtection = (klevu.isFunction(klevu.support.isActive))?klevu.support.isActive("dataProtection"):!klevu.isUndefined(klevu.support.dataProtection);

        if(dataProtection){
            if(klevu.dataProtection.getUseConsent() && !klevu.dataProtection.dataCanBeTracked()){
                return false;
            }
        }
        var encodedProductId = window.btoa(productId),
            cookieValue = klevu.dom.helpers.readCookie(klevu.settings.constants.COOKIE_KLEVU_RCP),
            existingProductIds, updatedCookieValue = encodedProductId,
            cookieExpiry = new Date(),
            httpOnlyTag = "undefined" !== typeof klevu_setHttpOnlyToCookies && klevu_setHttpOnlyToCookies ? "; HttpOnly" : "";
        if (cookieValue && cookieValue.trim() !== '') {
            existingProductIds = cookieValue.split("#-#");
            if (existingProductIds.indexOf(encodedProductId) !== -1) {
                existingProductIds.splice(existingProductIds.indexOf(encodedProductId), 1);
            } else {
                if (existingProductIds.length >= 20) {
                    existingProductIds.splice(-1, 1);
                }
            }
            existingProductIds.splice(0, 0, encodedProductId);
            updatedCookieValue = existingProductIds.join("#-#");
        }
        cookieExpiry.setTime(cookieExpiry.getTime() + (365 * 24 * 60 * 60 * 1000));
        document.cookie = klevu.settings.constants.COOKIE_KLEVU_RCP + "=" + updatedCookieValue +
            ";expires=" + cookieExpiry.toUTCString() + ";path=/" +
            ";SameSite=None; Secure" + httpOnlyTag;
    }
}); //source/modules/recs/recs-editor/core/constants.js
klevu({
    storage: {
        recs: klevu.dictionary("analyticsEvents")
    },
    constants: {
        COOKIE_KLEVU_RCP: "",
        RECS_QUERY_ID: "klevuRECSItemList",
        RECS_PT_HOME: "HOME",
        RECS_PT_CATEGORY: "CATEGORY",
        RECS_PT_PRODUCT: "PRODUCT",
        RECS_PT_CHECKOUT: "CHECKOUT",
        RECS_LC_TRENDING: "TRENDING",
        RECS_LC_TRENDING_PERSONALIZED: "TRENDING_PERSONALIZED",
        RECS_LC_NEWEST_ARRIVALS: "NEWEST_ARRIVALS",
        RECS_LC_RECENTLY_VIEWED: "RECENTLY_VIEWED",
        RECS_LC_HAND_PICKED: "HAND_PICKED",
        RECS_LC_OTHER_ALSO_VIEWED: "OTHER_ALSO_VIEWED",
        RECS_LC_SIMILAR: "SIMILAR",
        RECS_LC_BOUGHT_TOGETHER: "BOUGHT_TOGETHER",
        RECS_LC_BOUGHT_TOGETHER_PDP: "BOUGHT_TOGETHER_PDP",
        RECS_LC_VISUALLY_SIMILAR: "VISUALLY_SIMILAR",
        RECS_LC_RECS_CUSTOM: "CUSTOM_LOGIC",
        RECS_RPT: "recsPageType:"
    }
}); //source/modules/recs/recs-editor/core/recsEditor.js
class RecsEditor {
    static enabledStorageKey = 'kuRecsEditorEnabled';


    // Static method to check if editor is enabled
    static isEnabled() {
      return localStorage.getItem(RecsEditor.enabledStorageKey) === 'true';
    }

    // Static method to enable editor
    static enable() {
      localStorage.setItem(RecsEditor.enabledStorageKey, 'true');
    }

    // Static method to disable editor
    static disable() {
      localStorage.setItem(RecsEditor.enabledStorageKey, 'false');
    }

    constructor(showUI = true) {
      this.storageKey = 'kuRecsPlayground';
      this.editors = {};
      this.activeTab = 'keysEditor';
      this.isOpen = false;
      this.originalContent = {
        scripts: '',
        templates: '',
        css: ''
      };
      this.discoveredKeys = {};
      this.originalKeys = {};
      this.showUI = showUI;
      
      this.init();
    }
  
    init() {
      // Load discoveredKeys immediately for API interception
      this.loadDiscoveredKeys();
      
      if (this.showUI) {
        this.loadMonacoAndEmmet();
        this.injectStyles();
        this.createDOM();
        this.attachEventListeners();
      }
    }
  
    // Load only discoveredKeys from localStorage (for quick access)
    loadDiscoveredKeys() {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          this.discoveredKeys = parsed.keys || {};
          // Restore last active tab
          this.activeTab = parsed.activeTab || 'keysEditor';
          // Store original state for comparison
          this.originalKeys = JSON.parse(JSON.stringify(this.discoveredKeys));
        } catch (e) {
          console.error('Failed to parse stored discoveredKeys:', e);
        }
      }
    }
  
    loadMonacoAndEmmet() {
      // Check if Monaco is already loaded
      if (window.monaco) {
        this.onMonacoReady();
        return;
      }
  
      // Load Monaco Editor
      const script = document.createElement('script');
      script.innerHTML = `var require = { paths: { vs: 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.40.0/min/vs' } };`;
      document.head.appendChild(script);
  
      const loaderScript = document.createElement('script');
      loaderScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.40.0/min/vs/loader.min.js';
      document.head.appendChild(loaderScript);
  
      loaderScript.onload = () => {
        const nlsScript = document.createElement('script');
        nlsScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.40.0/min/vs/editor/editor.main.nls.min.js';
        document.head.appendChild(nlsScript);
  
        const mainScript = document.createElement('script');
        mainScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.40.0/min/vs/editor/editor.main.js';
        document.head.appendChild(mainScript);
  
        mainScript.onload = () => {
          // Load Emmet
          const emmetScript = document.createElement('script');
          emmetScript.src = 'https://unpkg.com/emmet-monaco-es/dist/emmet-monaco.min.js';
          document.head.appendChild(emmetScript);
  
          emmetScript.onload = () => {
            this.onMonacoReady();
          };
        };
      };
  
      // Load Monaco CSS
      const monacoCSS = document.createElement('link');
      monacoCSS.rel = 'stylesheet';
      monacoCSS.href = 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.40.0/min/vs/editor/editor.main.css';
      document.head.appendChild(monacoCSS);
    }
  
    onMonacoReady() {
      // Wait for Monaco to be fully initialized
      const checkInterval = setInterval(() => {
        if (window.monaco && window.monaco.editor && window.emmetMonaco) {
          clearInterval(checkInterval);
          this.initializeEditors();
        }
      }, 100);
    }
  
    injectStyles() {
      const styleId = 'recs-editor-styles';
      if (document.getElementById(styleId)) return;
  
      const styles = `
        .recs-editor-container {
          position: fixed;
          display: flex;
          top: 0;
          right: 0;
          bottom: 0;
          left: 0;
          background: #f0f2ee;
          z-index: 10010;
          transform: translateX(125%);
          transition: .7s ease-in-out all;
          width: 80%;
          box-shadow: 0 0 0 black;
        }
  
        body.recs-editor-open .recs-editor-container {
          transform: translateX(0);
          left: 20%;
          box-shadow: 7px 0 17px black;
        }
  
        body.recs-editor-open {
          overflow: hidden;
        }
  
        .recs-editor-trigger {
          position: absolute;
          height: 40px;
          width: 100px;
          background: #0c4465;
          color: white;
          font-weight: 900;
          display: flex;
          justify-content: center;
          align-items: center;
          transform: rotate(-90deg) translateX(50%);
          top: 50%;
          left: -70px;
          cursor: pointer;
        }
  
        .recs-editor-trigger.edit .recs-editor-trigger-code {
          display: none;
        }
  
        .recs-editor-trigger-save {
          display: none;
        }
  
        .recs-editor-trigger.edit .recs-editor-trigger-save {
          display: block;
        }
  
        .recs-editor-trigger .toggle-indicator {
          position: relative;
          width: 20px;
          height: 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 6px;
          transition-duration: .5s;
          margin-right: 8px;
          cursor: pointer;
        }
  
        .recs-editor-trigger .bars {
          width: 100%;
          height: 4px;
          background-color: white;
          border-radius: 4px;
        }
  
        .recs-editor-trigger #bar2 {
          transition-duration: .8s;
        }
  
        .recs-editor-trigger #bar1, .recs-editor-trigger #bar3 {
          width: 70%;
        }
  
        body.recs-editor-open .toggle-indicator .bars {
          position: absolute;
          transition-duration: .5s;
        }
  
        body.recs-editor-open .toggle-indicator #bar2 {
          transform: scaleX(0);
          transition-duration: .5s;
        }
  
        body.recs-editor-open .toggle-indicator #bar1 {
          width: 100%;
          transform: rotate(45deg);
          transition-duration: .5s;
        }
  
        body.recs-editor-open .toggle-indicator #bar3 {
          width: 100%;
          transform: rotate(-45deg);
          transition-duration: .5s;
        }
  
        body.recs-editor-open .toggle-indicator {
          transition-duration: .5s;
          transform: rotate(180deg);
        }
  
        .recs-editor-wrapper {
          width: 100%;
          display: flex;
          flex-direction: column;
        }
  
        .recs-editor-tabs {
          height: 50px;
          display: flex;
          align-items: end;
          margin: 0 0 0 24%;
          padding: 0;
        }
  
        .recs-editor-tabs li {
          list-style: none;
          padding: 0 15px;
          min-width: 100px;
          border: none;
          cursor: pointer;
          display: inline-flex;
          justify-content: center;
          align-items: center;
          height: 30px;
          color: #5a5a5a;
          font-size: 12px;
          box-sizing: border-box;
        }
  
        .recs-editor-tabs li.active {
          background-color: white;
          border-bottom: 2px solid #84da89;
          color: #84da89;
          font-weight: 900;
        }
  
        .recs-editor-content {
          height: calc(100vh - 50px);
          width: 100%;
          overflow-y: hidden;
          position: relative;
        }
  
        .recs-editor-pane {
          width: 96%;
          height: 100%;
          top: 0;
          left: -100%;
          display: flex;
          margin: 0 auto;
          position: absolute;
          box-sizing: border-box;
          padding: 0 20px;
        }
  
        .recs-editor-pane.active {
          left: 2%;
        }
  
        .recs-editor-description {
          width: 25%;
          padding: 5px;
          box-sizing: border-box;
          margin-left: -20px;
        }
  
        .recs-editor-description h3 {
          margin-top: 0;
          font-family: Poppins, sans-serif;
        }
  
        .recs-editor-description p {
          color: #696969;
          font-size: 15px;
          margin: 30px 0;
          font-family: Poppins, sans-serif;
        }
  
        .recs-editor-section {
          display: inline-block;
          width: 75%;
          height: 100%;
          margin: 0 auto;
          border: none;
        }
  
        .recs-editor-monaco {
          display: inline-block;
          width: 100%;
          height: 100%;
          margin: 0;
          border: none;
        }
  
        .recs-editor-keys-list {
          padding: 20px;
          height: 100%;
          overflow-y: auto;
          background: transparent;
          color: inherit;
          font-family: Poppins, sans-serif;
          font-size: 14px;
        }
  
        .recs-editor-no-keys {
          color: #696969;
          font-style: italic;
          text-align: center;
          margin-top: 50px;
        }
  
        .recs-editor-key-item {
          display: flex;
          align-items: flex-start;
          padding: 15px;
          margin-bottom: 8px;
          background: #1e1e1e;
          border-radius: 6px;
          transition: background 0.2s;
        }
  
        .recs-editor-key-item:hover {
          background: #252526;
        }
  
        .recs-editor-key-checkbox {
          margin-right: 15px;
          margin-top: 2px;
          width: 18px;
          height: 18px;
          cursor: pointer;
        }
  
        .recs-editor-key-info {
          flex: 1;
          cursor: pointer;
        }
  
        .recs-editor-key-title {
          display: block;
          font-size: 14px;
          font-weight: bold;
          color: #ffffff;
          margin-bottom: 4px;
          cursor: pointer;
          user-select: none;
        }
  
        .recs-editor-key-details {
          font-size: 12px;
          color: #cccccc;
          margin-bottom: 6px;
        }
  
        .recs-editor-key-logic {
          background: #0e639c;
          padding: 2px 8px;
          border-radius: 3px;
          font-size: 11px;
          text-transform: uppercase;
          font-weight: bold;
        }
  
        .recs-editor-key-page-type {
          background: #6c757d;
          padding: 2px 8px;
          border-radius: 3px;
          font-size: 11px;
          text-transform: uppercase;
          font-weight: bold;
        }
  
        .recs-editor-key-separator {
          margin: 0 8px;
          color: #666;
        }
  
        .recs-editor-key-id {
          font-size: 11px;
          color: #888;
          font-family: monospace;
          word-break: break-all;
        }
  
        .recs-editor-load-btn {
          background: #007bff;
          color: white;
          border: none;
          border-radius: 4px;
          padding: 4px 12px;
          font-size: 12px;
          cursor: pointer;
          margin-left: 15px;
          transition: background 0.2s;
        }
  
        .recs-editor-load-btn:hover {
          background: #0056b3;
        }
  
        .recs-editor-load-btn:disabled {
          background: #6c757d;
          cursor: not-allowed;
          opacity: 0.6;
        }
      `;
  
      const styleSheet = document.createElement('style');
      styleSheet.id = styleId;
      styleSheet.textContent = styles;
      document.head.appendChild(styleSheet);
    }
  
    createDOM() {
      // Create main container
      this.container = document.createElement('div');
      this.container.className = 'recs-editor-container';
  
      // Create trigger button
      this.trigger = document.createElement('div');
      this.trigger.className = 'recs-editor-trigger';
      this.trigger.innerHTML = `
        <label class="toggle-indicator">
          <div class="bars" id="bar1"></div>
          <div class="bars" id="bar2"></div>
          <div class="bars" id="bar3"></div>
        </label>
        <span class="recs-editor-trigger-code">CODE</span>
        <span class="recs-editor-trigger-save">SAVE</span>
      `;
  
      // Create wrapper
      const wrapper = document.createElement('div');
      wrapper.className = 'recs-editor-wrapper';
  
      // Create tabs
      const tabs = document.createElement('ul');
      tabs.className = 'recs-editor-tabs';
      tabs.innerHTML = `
        <li class="recs-editor-tab ${this.activeTab === 'keysEditor' ? 'active' : ''}" data-type="keysEditor">Keys</li>
        <li class="recs-editor-tab ${this.activeTab === 'scriptsEditor' ? 'active' : ''}" data-type="scriptsEditor">JavaScript</li>
        <li class="recs-editor-tab ${this.activeTab === 'templatesEditor' ? 'active' : ''}" data-type="templatesEditor">HTML</li>
        <li class="recs-editor-tab ${this.activeTab === 'cssEditor' ? 'active' : ''}" data-type="cssEditor">CSS</li>
      `;
  
      // Create content area
      const content = document.createElement('div');
      content.className = 'recs-editor-content';
  
      // Create editor panes
      content.innerHTML = `
        <div class="recs-editor-pane ${this.activeTab === 'keysEditor' ? 'active' : ''}" data-type="keysEditor">
          <div class="recs-editor-description">
            <h3>Recommendation Keys</h3>
            <div>
              <p>
                Select which recommendation instances should use the custom code from the editors.
              </p>
              <p>
                Checked keys will use your custom JS, HTML, and CSS instead of the default configuration.
              </p>
            </div>
          </div>
          <div class="recs-editor-section">
            <div class="recs-editor-keys-list" id="recs-editor-keys-list">
              <p class="recs-editor-no-keys">No recommendation keys discovered yet.</p>
            </div>
          </div>
        </div>
        <div class="recs-editor-pane ${this.activeTab === 'scriptsEditor' ? 'active' : ''}" data-type="scriptsEditor">
          <div class="recs-editor-description">
            <h3>JavaScript</h3>
            <div>
              <p>
                You use JavaScript to modify the configuration for Klevu.
              </p>
              <p>
                You can easily modify requests, responses, and run your own code after templates have completed rendering.
              </p>
            </div>
          </div>
          <div class="recs-editor-section">
            <div class="recs-editor-monaco" id="recs-editor-scripts"></div>
          </div>
        </div>
        <div class="recs-editor-pane ${this.activeTab === 'templatesEditor' ? 'active' : ''}" data-type="templatesEditor">
          <div class="recs-editor-description">
            <h3>HTML</h3>
            <div>
              <p>
                Templates make up the building blocks of how Klevu looks. They are made up of mostly HTML with JavaScript sprinkled in.
              </p>
              <p>
                Use <strong><%</strong> and <strong>%></strong> to jump in and out of JavaScript. Use <strong><%=</strong> and <strong>%></strong> to output a JavaScript expression.
              </p>
            </div>
          </div>
          <div class="recs-editor-section">
            <div class="recs-editor-monaco" id="recs-editor-templates"></div>
          </div>
        </div>
        <div class="recs-editor-pane ${this.activeTab === 'cssEditor' ? 'active' : ''}" data-type="cssEditor">
          <div class="recs-editor-description">
            <h3>CSS</h3>
            <div>
              <p>
                CSS is very easy in Klevu since styles are global. Simply add CSS to your site to change the styling of Klevu.
              </p>
            </div>
          </div>
          <div class="recs-editor-section">
            <div class="recs-editor-monaco" id="recs-editor-css"></div>
          </div>
        </div>
      `;
  
      wrapper.appendChild(tabs);
      wrapper.appendChild(content);
      this.container.appendChild(this.trigger);
      this.container.appendChild(wrapper);
      document.body.appendChild(this.container);
    }
  
    attachEventListeners() {
      // Toggle editor
      this.trigger.addEventListener('click', () => this.toggleEditor());
  
      // Tab switching
      const tabs = this.container.querySelectorAll('.recs-editor-tab');
      tabs.forEach(tab => {
        tab.addEventListener('click', (e) => this.switchTab(e.target.dataset.type));
      });
  
      // Keyboard shortcut for save (Cmd+S on Mac, Ctrl+S on Windows/Linux)
      this.keyboardHandler = (e) => {
        if (this.isOpen && (e.metaKey || e.ctrlKey) && e.key === 's') {
          e.preventDefault();
          this.saveIfChanged();
        }
      };
      document.addEventListener('keydown', this.keyboardHandler);
    }
  
    initializeEditors() {
      // Enable Emmet
      emmetMonaco.emmetJSX(window.monaco);
      emmetMonaco.emmetHTML(window.monaco);
      emmetMonaco.emmetCSS(window.monaco);
  
      monaco.languages.typescript.javascriptDefaults.setEagerModelSync(true);
  
      // Register completion providers
      this.registerCompletionProviders();
  
      // Load saved content
      const savedData = this.loadFromStorage();
  
      // Initialize JavaScript Editor
      this.editors.scriptsEditor = window.monaco.editor.create(
        document.getElementById('recs-editor-scripts'), 
        {
          value: savedData.scripts || '',
          language: 'javascript',
          theme: 'vs-dark',
          minimap: { enabled: false }
        }
      );
  
      // Initialize HTML/Templates Editor
      this.editors.templatesEditor = window.monaco.editor.create(
        document.getElementById('recs-editor-templates'), 
        {
          value: savedData.templates || '',
          language: 'html',
          theme: 'vs-dark',
          minimap: { enabled: false }
        }
      );
  
      // Initialize CSS Editor
      this.editors.cssEditor = window.monaco.editor.create(
        document.getElementById('recs-editor-css'), 
        {
          value: savedData.css || '',
          language: 'css',
          theme: 'vs-dark',
          minimap: { enabled: false }
        }
      );
  
      // Store original content for comparison
      this.originalContent = {
        scripts: savedData.scripts || '',
        templates: savedData.templates || '',
        css: savedData.css || ''
      };
      
      // Store original keys state (already loaded in loadDiscoveredKeys)
      this.originalKeys = JSON.parse(JSON.stringify(this.discoveredKeys));
    }
  
    registerCompletionProviders() {
      // HTML completion provider
      monaco.languages.registerCompletionItemProvider("html", {
        provideCompletionItems: (model, position) => {
          var word = model.getWordUntilPosition(position);
          var range = {
            startLineNumber: position.lineNumber,
            endLineNumber: position.lineNumber,
            startColumn: word.startColumn,
            endColumn: word.endColumn,
          };
          var suggestions = [
            {
              label: "newklevutemplate",
              kind: monaco.languages.CompletionItemKind.Snippet,
              insertText: [
                "<script type=\"template/klevu\" id=\"${1:templateid}\">",
                "\t$0",
                "</script>",
              ].join("\n"),
              insertTextRules:
                monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              documentation: "Add Klevu Template",
              range: range,
            },
          ];
          return { suggestions: suggestions };
        },
      });
  
      // JavaScript completion provider
      monaco.languages.registerCompletionItemProvider("javascript", {
        provideCompletionItems: (model, position) => {
          var word = model.getWordUntilPosition(position);
          var range = {
            startLineNumber: position.lineNumber,
            endLineNumber: position.lineNumber,
            startColumn: word.startColumn,
            endColumn: word.endColumn,
          };
          var suggestions = [
            {
              label: "modifyRequest",
              kind: monaco.languages.CompletionItemKind.Snippet,
              insertText: [
                "klevu.modifyRequest(\"${1:landing}\", function(data, scope){",
                "\t$0",
                "});",
              ].join("\n"),
              insertTextRules:
                monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              documentation: "Modify Request",
              range: range,
            },
            {
              label: "modifyResponse",
              kind: monaco.languages.CompletionItemKind.Snippet,
              insertText: [
                "klevu.modifyResponse(\"${1:landing}\", function(data, scope){",
                "\t$0",
                "});",
              ].join("\n"),
              insertTextRules:
                monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              documentation: "Modify Response",
              range: range,
            },
            {
              label: "afterTemplateRender",
              kind: monaco.languages.CompletionItemKind.Snippet,
              insertText: [
                "klevu.afterTemplateRender(\"${1:landing}\", function(data, scope){",
                "\t$0",
                "});",
              ].join("\n"),
              insertTextRules:
                monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              documentation: "After Template Render",
              range: range,
            },
            {
              label: "beforeActivation",
              kind: monaco.languages.CompletionItemKind.Snippet,
              insertText: [
                "klevu.beforeActivation(\"${1:landing}\", function(data, scope){",
                "\t$0",
                "});",
              ].join("\n"),
              insertTextRules:
                monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              documentation: "Before Activation",
              range: range,
            },
            {
              label: "setTemplates",
              kind: monaco.languages.CompletionItemKind.Snippet,
              insertText: [
                "klevu({",
                "\ttheme: {",
                "\t\tsetTemplates: {",
                "\t\t\t${1:nameThisTemplate}: {",
                "\t\t\t\tscope: \"${2:landing}\",",
                "\t\t\t\tselector: \"#${3:templateid}\",",
                "\t\t\t\tname: \"${4:templatename}\",",
                "\t\t\t},$0",
                "\t\t},",
                "\t}",
                "});",
              ].join("\n"),
              insertTextRules:
                monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              documentation: "Add Set Templates",
              range: range,
            },
            {
              label: "addTemplate",
              kind: monaco.languages.CompletionItemKind.Snippet,
              insertText: [
                "${1:nameThisTemplate}: {",
                "\tscope: \"${2:landing}\",",
                "\tselector: \"#${3:templateid}\",",
                "\tname: \"${4:templatename}\",",
                "},",
              ].join("\n"),
              insertTextRules:
                monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              documentation: "Add Template",
              range: range,
            },
            {
              label: "setHelpers",
              kind: monaco.languages.CompletionItemKind.Snippet,
              insertText: [
                "klevu({",
                "\ttheme: {",
                "\t\tsetHelpers: {",
                "\t\t\t\"${1:landing}\": {",
                "\t\t\t\t${2:namehelper}: function(){",
                "\t\t\t\t\treturn \"$0\";",
                "\t\t\t\t},",
                "\t\t\t},",
                "\t\t},",
                "\t}",
                "});",
              ].join("\n"),
              insertTextRules:
                monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              documentation: "Add Set Helpers",
              range: range,
            },
            {
              label: "addHelper",
              kind: monaco.languages.CompletionItemKind.Snippet,
              insertText: [
                "${1:namehelper}: function(){",
                "\treturn \"$0\";",
                "},",
              ].join("\n"),
              insertTextRules:
                monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              documentation: "Add Helper",
              range: range,
            },
          ];
          return { suggestions: suggestions };
        },
      });
    }
  
    toggleEditor() {
      if (this.isOpen) {
        this.saveIfChanged();
      } else {
        document.body.classList.add('recs-editor-open');
        this.trigger.classList.add('edit');
        this.isOpen = true;
      }
    }
  
    saveIfChanged() {
      // Check if editors are initialized
      if (!this.editors.scriptsEditor || !this.editors.templatesEditor || !this.editors.cssEditor) {
        console.error('Editors not initialized yet');
        alert('Please wait for the editors to finish loading before saving.');
        return;
      }
  
      const currentContent = {
        scripts: this.editors.scriptsEditor.getValue(),
        templates: this.editors.templatesEditor.getValue(),
        css: this.editors.cssEditor.getValue()
      };
  
      // Check if content has changed
      const contentChanged = 
        currentContent.scripts !== this.originalContent.scripts ||
        currentContent.templates !== this.originalContent.templates ||
        currentContent.css !== this.originalContent.css;
  
      // Check if keys state has changed
      const keysChanged = JSON.stringify(this.discoveredKeys) !== JSON.stringify(this.originalKeys);
  
      if (contentChanged || keysChanged) {
        // Save to localStorage
        this.saveToStorage(currentContent);
        
        // Reload the page
        window.location.reload();
      } else {
        // Just close the editor
        document.body.classList.remove('recs-editor-open');
        this.trigger.classList.remove('edit');
        this.isOpen = false;
      }
    }
  
    switchTab(tabType) {
      this.activeTab = tabType;
  
      // Update tab active states
      const tabs = this.container.querySelectorAll('.recs-editor-tab');
      tabs.forEach(tab => {
        tab.classList.toggle('active', tab.dataset.type === tabType);
      });
  
      // Update pane visibility
      const panes = this.container.querySelectorAll('.recs-editor-pane');
      panes.forEach(pane => {
        pane.classList.toggle('active', pane.dataset.type === tabType);
      });
  
      // Refresh the active editor layout
      if (this.editors[tabType]) {
        this.editors[tabType].layout();
      }
  
      // Save only the active tab preference
      this.saveTabPreference();
    }
  
    loadFromStorage() {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          this.discoveredKeys = parsed.keys || {};
          this.updateKeysList();
          return {
            scripts: parsed.code?.scripts?.[0] || '',
            templates: parsed.code?.templates?.[0] || '',
            css: parsed.code?.css?.[0] || ''
          };
        } catch (e) {
          console.error('Failed to parse stored editor content:', e);
        }
      }
      return {
        scripts: '',
        templates: '',
        css: ''
      };
    }
  
    saveToStorage(content) {
      const data = {
        code: {
          scripts: [content.scripts],
          templates: [content.templates],
          css: [content.css]
        },
        keys: this.discoveredKeys,
        activeTab: this.activeTab
      };
      localStorage.setItem(this.storageKey, JSON.stringify(data));
    }
  
    // Public method to get current content from editors
    getContent() {
      return {
        scripts: this.editors.scriptsEditor?.getValue() || '',
        templates: this.editors.templatesEditor?.getValue() || '',
        css: this.editors.cssEditor?.getValue() || ''
      };
    }
  
    // Public method to get saved content from localStorage
    getSavedContent() {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          return {
            scripts: parsed.code?.scripts?.[0] || '',
            templates: parsed.code?.templates?.[0] || '',
            css: parsed.code?.css?.[0] || ''
          };
        } catch (e) {
          console.error('Failed to parse stored editor content:', e);
        }
      }
      return {
        scripts: '',
        templates: '',
        css: ''
      };
    }
  
    // Register a new recommendation key with full API response
    registerKey(response) {
      const metadata = response.metadata;
      const key = metadata?.recsKey;
      if (!key) {
        console.error('No recsKey found in response:', response);
        return;
      }
      
      if (!this.discoveredKeys[key]) {
        // New key - add it with default disabled state     
        this.discoveredKeys[key] = {
          enabled: false,
          metadata: {
            title: metadata.title || key,
            logic: metadata.logic || '',
            pageType: metadata.pageType || ''
          },
          originalCode: {
            templates: response.templates?.base || '',
            scripts: response.scripts?.recsObject || '',
            css: response.styles?.base || ''
          }
        };
        this.updateKeysList();
        this.saveCurrentState();
      } else {
        // Existing key - update metadata and original code but preserve enabled state
        const preservedEnabledState = this.discoveredKeys[key].enabled;
        
        // Update metadata with fresh data from current page
        this.discoveredKeys[key].metadata = {
          title: metadata.title || key,
          logic: metadata.logic || '',
          pageType: metadata.pageType || ''
        };
        // Update original code with fresh data 
        this.discoveredKeys[key].originalCode = {
          templates: response.templates?.base || '',
          scripts: response.scripts?.recsObject || '',
          css: response.styles?.base || ''
        };

        // Preserve the enabled state
        this.discoveredKeys[key].enabled = preservedEnabledState;
        
        this.updateKeysList();
        this.saveCurrentState();
      }
    }
  
    // Check if a key should use custom code
    shouldOverrideKey(key) {
      return this.discoveredKeys[key]?.enabled || false;
    }
  
    // Update the keys list UI
    updateKeysList() {
      const keysList = document.getElementById('recs-editor-keys-list');
      if (!keysList) return;
  
      const keys = Object.keys(this.discoveredKeys);
      if (keys.length === 0) {
        keysList.innerHTML = '<p class="recs-editor-no-keys">No recommendation keys discovered yet.</p>';
        return;
      }
  
      keysList.innerHTML = keys.map(key => {
        const keyData = this.discoveredKeys[key];
        const metadata = keyData.metadata;
        const hasOriginalCode = keyData.originalCode && 
          (keyData.originalCode.templates || keyData.originalCode.scripts || keyData.originalCode.css);
        
        return `
          <div class="recs-editor-key-item">
            <input 
              type="checkbox" 
              class="recs-editor-key-checkbox" 
              id="key-${key}" 
              ${keyData.enabled ? 'checked' : ''}
              data-key="${key}"
            >
            <div class="recs-editor-key-info">
              <label class="recs-editor-key-title" for="key-${key}">
                ${metadata?.title || key}
              </label>
              <div class="recs-editor-key-details">
                <span class="recs-editor-key-page-type">${metadata?.pageType || 'Unknown Page'}</span>
                <span class="recs-editor-key-separator">•</span>
                <span class="recs-editor-key-logic">${metadata?.logic || 'Unknown Logic'}</span>
              </div>
              <div class="recs-editor-key-id">${key}</div>
            </div>
            <button 
              class="recs-editor-load-btn" 
              data-key="${key}"
              ${!hasOriginalCode ? 'disabled' : ''}
              title="${hasOriginalCode ? 'Load original code into editors' : 'No original code available'}"
            >
              Load Original
            </button>
          </div>
        `;
      }).join('');
  
      // Add event listeners to checkboxes
      keysList.querySelectorAll('.recs-editor-key-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', (e) => {
          const key = e.target.dataset.key;
          this.discoveredKeys[key].enabled = e.target.checked;
          this.saveCurrentState();
        });
      });
  
      // Add event listeners to load buttons
      keysList.querySelectorAll('.recs-editor-load-btn').forEach(button => {
        button.addEventListener('click', (e) => {
          const key = e.target.dataset.key;
          this.loadOriginalCode(key);
        });
      });
    }
  
    // Save current state without reloading
    saveCurrentState() {
      if (this.editors.scriptsEditor && this.editors.templatesEditor && this.editors.cssEditor) {
        const content = {
          scripts: this.editors.scriptsEditor.getValue(),
          templates: this.editors.templatesEditor.getValue(),
          css: this.editors.cssEditor.getValue()
        };
        this.saveToStorage(content);
      }
    }
  
    // Save only tab preference without touching editor content
    saveTabPreference() {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        try {
          const data = JSON.parse(stored);
          data.activeTab = this.activeTab;
          localStorage.setItem(this.storageKey, JSON.stringify(data));
        } catch (e) {
          console.error('Failed to save tab preference:', e);
        }
      } else {
        // If no data exists yet, create minimal structure
        const data = {
          code: { scripts: [''], templates: [''], css: [''] },
          keys: this.discoveredKeys,
          activeTab: this.activeTab
        };
        localStorage.setItem(this.storageKey, JSON.stringify(data));
      }
    }
  
    // Load original code from a specific key into the editors
    loadOriginalCode(key) {
      const keyData = this.discoveredKeys[key];
      if (!keyData?.originalCode) {
        console.error('No original code found for key:', key);
        return;
      }
  
      // Wait for editors to be initialized
      if (!this.editors.scriptsEditor || !this.editors.templatesEditor || !this.editors.cssEditor) {
        alert('Please wait for the editors to load before using this feature.');
        return;
      }
  
      const originalCode = keyData.originalCode;
      
      // Confirm before overwriting
      const confirmMessage = `Load original code from "${keyData.metadata?.title || key}"?\n\nThis will replace the current content in all editors.`;
      if (!confirm(confirmMessage)) {
        return;
      }
  
      // Load the code into editors
      this.editors.scriptsEditor.setValue(originalCode.scripts || '');
      this.editors.templatesEditor.setValue(originalCode.templates || '');
      this.editors.cssEditor.setValue(originalCode.css || '');
  
      // Switch to JavaScript tab to show the loaded content
      this.switchTab('scriptsEditor');
    }
  
    // Cleanup method
    destroy() {
      // Remove keyboard event listener
      if (this.keyboardHandler) {
        document.removeEventListener('keydown', this.keyboardHandler);
      }
      
      // Dispose Monaco editors
      Object.values(this.editors).forEach(editor => {
        if (editor && editor.dispose) {
          editor.dispose();
        }
      });
      
      // Remove DOM elements
      if (this.container && this.container.parentNode) {
        this.container.parentNode.removeChild(this.container);
      }
    }
  }

klevu.recs.base.RecsEditor = RecsEditor;
 //source/modules/recs/recs-editor/core/actionTypes.js
// static content
klevu.setObjectPath( klevu.recs.base.getScope(), "chains.type.staticContent" , klevu.chain( { stopOnFalse : true } ) );
klevu.setObjectPath( klevu.recs.base.getScope(), "chains.type.hideBanner" , klevu.chain( { stopOnFalse : true } ) );

klevu.recs.base.getScope().chains.response.success.addBefore('executeSearchObjectPowerUp', {
  name : "checkForHideBanner" ,
  fire : function ( data , scope ) {
    var action = klevu.getObjectPath(scope.recsScope, "kmcData.metadata.action", false);
      if (action === "HIDE_RECOMMENDATION") {
        var chain = klevu.getObjectPath( scope.recsScope , "chains.type.hideBanner" );
        if ( !klevu.isUndefined( chain ) && chain.list().length !== 0 ) {
          chain.setScope( scope.recsElem );
          chain.setData( data );
          chain.fire();
          
        }
          return false;
      }
  }
} );
klevu.recs.base.getScope().chains.response.success.addBefore('executeSearchObjectPowerUp', {
  name : "checkForStaticContent" ,
  fire : function ( data , scope ) {
    var action = klevu.getObjectPath(scope.recsScope, "kmcData.metadata.action", false);
      if (action === "STATIC_CONTENT") {
        var chain = klevu.getObjectPath( scope.recsScope , "chains.type.staticContent" );
        if ( !klevu.isUndefined( chain ) && chain.list().length !== 0 ) {
          chain.setScope( scope.recsElem );
          chain.setData( data );
          chain.fire();
        }
          return false;
      }
  }
} );

klevu.recs.base.getScope().chains.response.success.move({name:"buildTheSearchObject",before:"executeSearchObjectPowerUp"});
 //source/modules/recs/recs-editor/core/chains.js
var RECS_BASE = klevu.recs.base;

//source/modules/recs/recs-editor/core/chains/init.js
RECS_BASE.getScope().chains.search.control.add({
    name: "checkRecsAction",
    fire: function (data, scope) {
        var recsAction = klevu.getObjectPath(scope.recsScope, "kmcData.search.recsAction");
        switch(recsAction) {
            case "HIDE_RECOMMENDATION":
                return false;
                break;
        }
    }
});

RECS_BASE.getScope().chains.search.control.add({
    name: "validateRECSElementData",
    fire: function (data, scope) {
        var recsKey = klevu.getObjectPath(scope.recsScope, "kmcData.metadata.recsKey");
        if (!recsKey) {
            console.info("RECS element id is missing.");
            return false;
        }

        var isEnabled = klevu.getObjectPath(scope.recsScope, "kmcData.metadata.enabled");
        if (!isEnabled) {
            console.info("[" + recsKey + "] element is disabled.");
            return false;
        }

        var hasAnyError = false;
        var logic = klevu.getObjectPath(scope.recsScope, "kmcData.metadata.logic");
        if (!logic) {
            console.info("[" + recsKey + "] RECS logic is missing.");
            hasAnyError = true;
        }

        var pageType = klevu.getObjectPath(scope.recsScope, "kmcData.metadata.pageType");
        if (!pageType) {
            console.info("[" + recsKey + "] RECS page type is missing.");
            hasAnyError = true;
        }

        var maxProducts = klevu.getObjectPath(scope.recsScope, "kmcData.metadata.maxProducts");
        if (typeof maxProducts === "undefined" || maxProducts === "") {
            klevu.setObjectPath(scope.recsScope, "kmcData.metadata.maxProducts", 12);
        }

        var productThreshold = klevu.getObjectPath(scope.recsScope, "kmcData.metadata.productThreshold");
        if (typeof productThreshold === "undefined" || productThreshold === "") {
            klevu.setObjectPath(scope.recsScope, "kmcData.metadata.productThreshold", 4);
        }

        if (hasAnyError) {
            return false;
        }

        scope.recsScope.searchObject.getScope().parentScope = scope.recsScope;
    }
});

RECS_BASE.getScope().chains.search.control.add({
    name: "addElementStylesToHead",
    fire: function (data, scope) {
        var recsKey = klevu.getObjectPath(scope.recsScope, "kmcData.metadata.recsKey");
        var elementStyles = klevu.getObjectPath(scope.recsScope, "kmcData.styles.base");
        if (recsKey) {
            klevu.each(klevu.dom.find("#ku-recs-" + recsKey), function (key, existingElement) {
                if (existingElement && existingElement.parentNode) {
                    existingElement.parentNode.removeChild(existingElement);
                }
            });
        }
        klevu.dom.helpers.addElementToHead({
            content: elementStyles,
            type: "css",
            name: "ku-recs-" + recsKey
        });
    }
});

RECS_BASE.getScope().chains.search.control.add({
    name: "createStorageForRECS",
    fire: function (data, scope) {
        var storage = klevu.getSetting(scope.recsScope.settings, "settings.storage");
        storage.recs.setStorage("local");
        storage.recs.mergeFromGlobal();
        storage.recs.mergeToGlobal();
    }
});

RECS_BASE.getScope().chains.search.control.add({
    name: "addSearchSettings",
    fire: function (data, scope) {
        var inputKEY = klevu.getSetting(scope.recsScope, "settings.recs.apiKey", klevu.getGlobalSetting("recs.apiKey", klevu.getGlobalSetting("global.apiKey")));
        var searchBasePath = klevu.getObjectPath(scope.recsScope, "kmcData.search.basePath");

        var apiKeyForCookie = inputKEY.replace(/-/g, "_");
        klevu.setObjectPath(klevu.settings, "constants.COOKIE_KLEVU_RCP", "klevu_rcp_" + apiKeyForCookie);

        var RECS_BOX = scope.recsScope.searchObject;
        klevu.setSetting(RECS_BOX.getScope().settings, "settings.search.apiKey", inputKEY);
        klevu.setSetting(RECS_BOX.getScope().settings, "settings.analytics.apiKey", inputKEY);
        klevu.setSetting(RECS_BOX.getScope().settings, "settings.search.minChars", 1);
        klevu.setSetting(RECS_BOX.getScope().settings, "settings.url.search", "https:" + "//" + searchBasePath);
    }
});

RECS_BASE.getScope().chains.search.control.add({
    name: "registerRECSTemplate",
    fire: function (data, scope) {
        var RECS_BOX = scope.recsScope.searchObject;
        var templateString = klevu.getObjectPath(scope.recsScope, "kmcData.templates.base");
        RECS_BOX.getScope().template.setTemplate(templateString, "kuRECSTemplate", true);
    }
});
 //source/modules/recs/recs-editor/core/chains/processors.js
RECS_BASE.getScope().chains.search.control.add({
    name: "populateSearchQueryData",
    fire: function (data, scope) {
        var RECS_BOX = scope.recsScope.searchObject;

        RECS_BOX.getScope().chains.request.build.add({
            name: "addSearchQuery",
            fire: function (data, scope) {

                var searchPayload = klevu.getObjectPath(scope.kScope.parentScope, "kmcData.search.payload");
                try {
                    var searchQueryJSON = JSON.parse(searchPayload);
                    var recordQueries = (searchQueryJSON && searchQueryJSON.recordQueries) ? searchQueryJSON.recordQueries : [];
                    klevu.setObjectPath(data, "request.current.recordQueries", recordQueries);
                    data.context.doSearch = true;
                } catch (error) {
                    klevu.support.hook(["core.logger"],function(){
                        klevu.logger.log("recs.component","error","KLEVU - RECS - received invalid json for search payload");
                        klevu.logger.log("recs.component","error",error);
                    });
                }
            }
        });

        RECS_BOX.getScope().chains.request.build.add({
            name: "addStoredProductIdsV1",
            fire: function (data, scope) {
                var maxProducts = klevu.getObjectPath(scope.kScope.parentScope, "kmcData.metadata.maxProducts");
                var cookieValue = klevu.dom.helpers.readCookie(klevu.settings.constants.COOKIE_KLEVU_RCP);

                data.context.storedProductIds = [];
                if (cookieValue && cookieValue.trim() !== '') {
                    var productIds = [];
                    var storedProductIdList = cookieValue.split("#-#");
                    storedProductIdList.forEach(function (productId) {
                        if (productIds.length < maxProducts) {
                            productIds.push(atob(productId));
                        }
                    });
                    data.context.storedProductIds = productIds;
                }
            }
        });

        RECS_BOX.getScope().chains.request.build.add({
            name: "addTrendingProductsQueryOp",
            fire: function (data, scope) {
                var pageType = klevu.getObjectPath(scope.kScope.parentScope, "kmcData.metadata.pageType");
                var logic = klevu.getObjectPath(scope.kScope.parentScope, "kmcData.metadata.logic");
                if (logic != klevu.settings.constants.RECS_LC_TRENDING) {
                    return;
                }
                var recordQueries = klevu.getObjectPath(data, "request.current.recordQueries");
                if (recordQueries) {
                    klevu.each(recordQueries, function (key, query) {
                        if (query.id == klevu.settings.constants.RECS_QUERY_ID) {

                            if (pageType == klevu.settings.constants.RECS_PT_CATEGORY) {
                                var categoryName = "";

                                if(klevu.pageMeta.getPageType() === "category"){
                                    categoryName = klevu.dom.helpers.convertHtmlToText(klevu.pageMeta.getData("page.category.categoryPath"));
                                }
                                klevu.setObjectPath(query, "settings.query.categoryPath", categoryName);
                            }

                        }
                    });
                }
            }
        });

        RECS_BOX.getScope().chains.request.build.add({
            name: "addTrendingProductsWithPersonalizationQueryOp",
            fire: function (data, scope) {
                var pageType = klevu.getObjectPath(scope.kScope.parentScope, "kmcData.metadata.pageType");
                var logic = klevu.getObjectPath(scope.kScope.parentScope, "kmcData.metadata.logic");

                if (logic != klevu.settings.constants.RECS_LC_TRENDING_PERSONALIZED) {
                    return;
                }
                //toDo: removed for now, should be added back
                //var enablePersonalisation = klevu.getObjectPath(scope.kScope.parentScope, "kmcData.metadata.enablePersonalisation");
                //if (!enablePersonalisation) {
                //     return;
                //}

                var recordQueries = klevu.getObjectPath(data, "request.current.recordQueries");
                if (recordQueries) {
                    klevu.each(recordQueries, function (key, query) {
                        if (query.id == klevu.settings.constants.RECS_QUERY_ID) {

                            var recentObjectsList = [];
                            var recentObjects = klevu.getObjectPath(query, "settings.context.recentObjects");
                            if (recentObjects && recentObjects.length) {
                                recentObjectsList = recentObjects;
                            }
                            var storedProductIds = data.context.storedProductIds;
                            if (storedProductIds && storedProductIds.length) {
                                var recentDataObject = {
                                    "typeOfRecord": "KLEVU_PRODUCT",
                                    "records": []
                                };
                                klevu.each(storedProductIds, function (key, productId) {
                                    recentDataObject.records.push({
                                        "id": productId
                                    });
                                });
                                recentObjectsList.push(recentDataObject);
                            }
                            klevu.setObjectPath(query, "settings.context.recentObjects", recentObjectsList);

                            if (pageType == klevu.settings.constants.RECS_PT_CATEGORY) {
                                var categoryName = "";
                                if(klevu.pageMeta.getPageType() === "category"){
                                    categoryName = klevu.dom.helpers.convertHtmlToText(klevu.pageMeta.getData("page.category.categoryPath"));
                                }
                                klevu.setObjectPath(query, "settings.query.categoryPath", categoryName);
                            }

                        }
                    });
                }
            }
        });

        RECS_BOX.getScope().chains.request.build.add({
            name: "addNewestArrivalsQueryOp",
            fire: function (data, scope) {
                var pageType = klevu.getObjectPath(scope.kScope.parentScope, "kmcData.metadata.pageType");
                var logic = klevu.getObjectPath(scope.kScope.parentScope, "kmcData.metadata.logic");
                if (logic != klevu.settings.constants.RECS_LC_NEWEST_ARRIVALS) {
                    return;
                }

                var recordQueries = klevu.getObjectPath(data, "request.current.recordQueries");
                if (recordQueries) {
                    klevu.each(recordQueries, function (key, query) {
                        if (query.id == klevu.settings.constants.RECS_QUERY_ID) {

                            if (pageType == klevu.settings.constants.RECS_PT_CATEGORY) {
                                var categoryName = "";
                                if(klevu.pageMeta.getPageType() === "category"){
                                    categoryName = klevu.dom.helpers.convertHtmlToText(klevu.pageMeta.getData("page.category.categoryPath"));
                                }
                                klevu.setObjectPath(query, "settings.query.categoryPath", categoryName);
                            }

                        }
                    });
                }
            }
        });

        RECS_BOX.getScope().chains.request.build.add({
            name: "addRecentlyViewedQueryOp",
            fire: function (data, scope) {
                var pageType = klevu.getObjectPath(scope.kScope.parentScope, "kmcData.metadata.pageType");
                var logic = klevu.getObjectPath(scope.kScope.parentScope, "kmcData.metadata.logic");
                if (logic != klevu.settings.constants.RECS_LC_RECENTLY_VIEWED) {
                    return;
                }

                var recordQueries = klevu.getObjectPath(data, "request.current.recordQueries");
                if (recordQueries) {
                    //check if there are any products to be used, if not dont continue with the call
                    if (!data.context.storedProductIds || data.context.storedProductIds.length == 0) {
                        data.context.doSearch = false;
                        return false;
                    }
                    klevu.each(recordQueries, function (key, query) {
                        if (query.id == klevu.settings.constants.RECS_QUERY_ID) {

                            var storedProductIds = data.context.storedProductIds;
                            var customANDQueryStr = "";
                            var topIds = [];

                            if (storedProductIds && storedProductIds.length) {
                                klevu.each(storedProductIds, function (key, productId) {
                                    if (key > 0) {
                                        customANDQueryStr += " OR ";
                                    }
                                    customANDQueryStr += '\"'+ productId + '\"';
                                    topIds.push({
                                        "key": "id",
                                        "value": productId
                                    });
                                });
                                klevu.setObjectPath(query, "settings.customANDQuery", "id:(" + customANDQueryStr + ")");
                                klevu.setObjectPath(query, "settings.topIds", topIds);
                            }

                            klevu.setObjectPath(query, "settings.limit", topIds.length);

                            if (pageType == klevu.settings.constants.RECS_PT_CATEGORY) {
                                var categoryName = "";
                                if(klevu.pageMeta.getPageType() === "category"){
                                    categoryName = klevu.dom.helpers.convertHtmlToText(klevu.pageMeta.getData("page.category.categoryPath"));
                                }
                                klevu.setObjectPath(query, "settings.query.categoryPath", categoryName);
                            }

                        }
                    });
                }
            }
        });

        RECS_BOX.getScope().chains.request.build.add({
            name: "addHandPickedQueryOp",
            fire: function (data, scope) {
                var pageType = klevu.getObjectPath(scope.kScope.parentScope, "kmcData.metadata.pageType");
                var logic = klevu.getObjectPath(scope.kScope.parentScope, "kmcData.metadata.logic");
                if (logic != klevu.settings.constants.HAND_PICKED) {
                    return;
                }
            }
        });

        RECS_BOX.getScope().chains.request.build.add({
            name: "addOtherAlsoViewedQueryOp",
            fire: function (data, scope) {
                var pageType = klevu.getObjectPath(scope.kScope.parentScope, "kmcData.metadata.pageType");
                var logic = klevu.getObjectPath(scope.kScope.parentScope, "kmcData.metadata.logic");
                if (logic != klevu.settings.constants.RECS_LC_OTHER_ALSO_VIEWED) {
                    return;
                }

                var recordQueries = klevu.getObjectPath(data, "request.current.recordQueries");
                if (recordQueries) {
                    klevu.each(recordQueries, function (key, query) {
                        if (query.id == klevu.settings.constants.RECS_QUERY_ID) {

                            var recentObjectsList = [];
                            var recentObjects = klevu.getObjectPath(query, "settings.context.recentObjects");
                            if (recentObjects && recentObjects.length) {
                                recentObjectsList = recentObjects;
                            }

                            var pdpProductId;
                            var pdpProductGroupId;
                            if(klevu.pageMeta.getPageType() === "pdp"){
                                if (klevu.pageMeta.hasData("page.pdp.products.0.itemGroupId")) {
                                    pdpProductGroupId = klevu.pageMeta.getData("page.pdp.products.0.itemGroupId");
                                }
                                if (klevu.pageMeta.hasData("page.pdp.products.0.itemId")) {
                                    pdpProductId = klevu.pageMeta.getData("page.pdp.products.0.itemId");
                                }
                            }
                            if (!pdpProductId) {
                                return;
                            }

                            var storedProductIds = [pdpProductId];
                            if (storedProductIds && storedProductIds.length) {
                                var recentDataObject = {
                                    "typeOfRecord": "KLEVU_PRODUCT",
                                    "records": []
                                };
                                klevu.each(storedProductIds, function (key, productId) {
                                    recentDataObject.records.push({
                                        "id": productId
                                    });
                                });
                                recentObjectsList.push(recentDataObject);
                            }
                            if (pdpProductGroupId) {
                                var excludeIds = [{
                                    "key": "itemGroupId",
                                    "value": pdpProductGroupId
                                }];
                                var existingExcludeIds = klevu.getObjectPath(query, "settings.excludeIds", []);
                                if (existingExcludeIds && existingExcludeIds.length) {
                                    excludeIds = excludeIds.concat(existingExcludeIds);
                                }
                                klevu.setObjectPath(query, "settings.excludeIds", excludeIds);
                            }

                            klevu.setObjectPath(query, "settings.context.recentObjects", recentObjectsList);

                        }
                    });
                }


            }
        });

        RECS_BOX.getScope().chains.request.build.add({
            name: "addRelatedQueryOp",
            fire: function (data, scope) {
                var pageType = klevu.getObjectPath(scope.kScope.parentScope, "kmcData.metadata.pageType");
                var logic = klevu.getObjectPath(scope.kScope.parentScope, "kmcData.metadata.logic");
                if (logic != klevu.settings.constants.RECS_LC_SIMILAR) {
                    return;
                }

                var recordQueries = klevu.getObjectPath(data, "request.current.recordQueries");
                if (recordQueries) {
                    klevu.each(recordQueries, function (key, query) {
                        if (query.id == klevu.settings.constants.RECS_QUERY_ID) {

                            var recentObjectsList = [];
                            var recentObjects = klevu.getObjectPath(query, "settings.context.recentObjects");
                            if (recentObjects && recentObjects.length) {
                                recentObjectsList = recentObjects;
                            }
                            var pdpProductId;
                            var pdpProductGroupId;
                            if(klevu.pageMeta.getPageType() === "pdp"){
                                if (klevu.pageMeta.hasData("page.pdp.products.0.itemGroupId")) {
                                    pdpProductGroupId = klevu.pageMeta.getData("page.pdp.products.0.itemGroupId");
                                }
                                if (klevu.pageMeta.hasData("page.pdp.products.0.itemId")) {
                                    pdpProductId = klevu.pageMeta.getData("page.pdp.products.0.itemId");
                                }
                            }
                            if (!pdpProductId) {
                                return;
                            }

                            var storedProductIds = [pdpProductId];
                            if (storedProductIds && storedProductIds.length) {
                                var recentDataObject = {
                                    "typeOfRecord": "KLEVU_PRODUCT",
                                    "records": []
                                };
                                klevu.each(storedProductIds, function (key, productId) {
                                    recentDataObject.records.push({
                                        "id": productId
                                    });
                                });
                                recentObjectsList.push(recentDataObject);
                            }

                            if (pdpProductGroupId) {
                                var excludeIds = [{
                                    "key": "itemGroupId",
                                    "value": pdpProductGroupId
                                }];
                                var existingExcludeIds = klevu.getObjectPath(query, "settings.excludeIds", []);
                                if (existingExcludeIds && existingExcludeIds.length) {
                                    excludeIds = excludeIds.concat(existingExcludeIds);
                                }
                                klevu.setObjectPath(query, "settings.excludeIds", excludeIds);
                            }

                            klevu.setObjectPath(query, "settings.context.recentObjects", recentObjectsList);

                        }
                    });
                }

            }
        });

        RECS_BOX.getScope().chains.request.build.add({
            name: "addBoughtTogetherQueryOp",
            fire: function (data, scope) {
                var pageType = klevu.getObjectPath(scope.kScope.parentScope, "kmcData.metadata.pageType");
                var logic = klevu.getObjectPath(scope.kScope.parentScope, "kmcData.metadata.logic");
                if (logic != klevu.settings.constants.RECS_LC_BOUGHT_TOGETHER) {
                    return;
                }

                var recordQueries = klevu.getObjectPath(data, "request.current.recordQueries");
                if (recordQueries) {
                    klevu.each(recordQueries, function (key, query) {
                        if (query.id == klevu.settings.constants.RECS_QUERY_ID) {

                            var recentObjectsList = [];
                            var recentObjects = klevu.getObjectPath(query, "settings.context.recentObjects");
                            if (recentObjects && recentObjects.length) {
                                recentObjectsList = recentObjects;
                            }

                            var boughtTogetherIds = [];
                            var excludeIdsList = [];

                            if(klevu.pageMeta.getPageType() === "cart"){
                                var cartRecords = klevu.pageMeta.getData("page.cart.products",[]);
                                if (cartRecords && cartRecords.length) {
                                    klevu.each(cartRecords, function (key, record) {
                                        if (record.itemId) {
                                            boughtTogetherIds.push(record.itemId);
                                        }
                                        if (record.itemGroupId) {
                                            excludeIdsList.push(record.itemGroupId);
                                        }
                                    });
                                }
                            }
                            if (!boughtTogetherIds.length) {
                                return;
                            }

                            var storedProductIds = boughtTogetherIds;
                            if (storedProductIds && storedProductIds.length) {
                                var recentDataObject = {
                                    "typeOfRecord": "KLEVU_PRODUCT",
                                    "records": []
                                };
                                klevu.each(storedProductIds, function (key, productId) {
                                    recentDataObject.records.push({
                                        "id": productId
                                    });
                                });
                                recentObjectsList.push(recentDataObject);
                            }

                            if (excludeIdsList && excludeIdsList.length > 0) {
                                var excludeIds = [];
                                klevu.each(excludeIdsList, function (key, productId) {
                                    excludeIds.push({
                                        "key": "itemGroupId",
                                        "value": productId
                                    });
                                });
                                var existingExcludeIds = klevu.getObjectPath(query, "settings.excludeIds", []);
                                if (existingExcludeIds && existingExcludeIds.length) {
                                    excludeIds = excludeIds.concat(existingExcludeIds);
                                }
                                klevu.setObjectPath(query, "settings.excludeIds", excludeIds);
                            }



                            klevu.setObjectPath(query, "settings.context.recentObjects", recentObjectsList);

                        }
                    });
                }
            }
        });
        RECS_BOX.getScope().chains.request.build.add({
            name: "addBoughtTogetherPdpQueryOp",
            fire: function (data, scope) {
                var pageType = klevu.getObjectPath(scope.kScope.parentScope, "kmcData.metadata.pageType");
                var logic = klevu.getObjectPath(scope.kScope.parentScope, "kmcData.metadata.logic");
                if (logic != klevu.settings.constants.RECS_LC_BOUGHT_TOGETHER_PDP) {
                    return;
                }

                var recordQueries = klevu.getObjectPath(data, "request.current.recordQueries");
                if (recordQueries) {
                    klevu.each(recordQueries, function (key, query) {
                        if (query.id == klevu.settings.constants.RECS_QUERY_ID) {

                            var recentObjectsList = [];
                            var recentObjects = klevu.getObjectPath(query, "settings.context.recentObjects");
                            if (recentObjects && recentObjects.length) {
                                recentObjectsList = recentObjects;
                            }
                            var pdpProductId;
                            var pdpProductGroupId;
                            if(klevu.pageMeta.getPageType() === "pdp"){
                                if (klevu.pageMeta.hasData("page.pdp.products.0.itemGroupId")) {
                                    pdpProductGroupId = klevu.pageMeta.getData("page.pdp.products.0.itemGroupId");
                                }
                                if (klevu.pageMeta.hasData("page.pdp.products.0.itemId")) {
                                    pdpProductId = klevu.pageMeta.getData("page.pdp.products.0.itemId");
                                }
                            }
                            if (!pdpProductId) {
                                return;
                            }

                            var storedProductIds = [pdpProductId];
                            if (storedProductIds && storedProductIds.length) {
                                var recentDataObject = {
                                    "typeOfRecord": "KLEVU_PRODUCT",
                                    "records": []
                                };
                                klevu.each(storedProductIds, function (key, productId) {
                                    recentDataObject.records.push({
                                        "id": productId
                                    });
                                });
                                recentObjectsList.push(recentDataObject);
                            }

                            if (pdpProductGroupId) {
                                var excludeIds = [{
                                    "key": "itemGroupId",
                                    "value": pdpProductGroupId
                                }];
                                var existingExcludeIds = klevu.getObjectPath(query, "settings.excludeIds", []);
                                if (existingExcludeIds && existingExcludeIds.length) {
                                    excludeIds = excludeIds.concat(existingExcludeIds);
                                }
                                klevu.setObjectPath(query, "settings.excludeIds", excludeIds);
                            }

                            klevu.setObjectPath(query, "settings.context.recentObjects", recentObjectsList);

                        }
                    });
                }
            }
        });

        RECS_BOX.getScope().chains.request.build.add({
            name: "addSimilarImagesQueryOp",
            fire: function (data, scope) {
                var pageType = klevu.getObjectPath(scope.kScope.parentScope, "kmcData.metadata.pageType");
                var logic = klevu.getObjectPath(scope.kScope.parentScope, "kmcData.metadata.logic");
                if (logic != klevu.settings.constants.RECS_LC_VISUALLY_SIMILAR) {
                    return;
                }

                var recordQueries = klevu.getObjectPath(data, "request.current.recordQueries");
                if (recordQueries) {
                    klevu.each(recordQueries, function (key, query) {
                        if (query.id == klevu.settings.constants.RECS_QUERY_ID) {
                            // check what is already added as source as we do not want to remove forced source
                            var sourceObjectsList = [];
                            var sourceObjects = klevu.getObjectPath(query, "settings.context.sourceObjects");
                            if (sourceObjects && sourceObjects.length) {
                                sourceObjectsList = sourceObjects;
                            }
                            //build the objects needed as a source
                            var pdpProductId;
                            var pdpProductGroupId;
                            var recentDataObject = {
                                "typeOfRecord": "KLEVU_PRODUCT",
                                "records": []
                            };
                            if(klevu.pageMeta.getPageType() === "pdp"){
                                if (klevu.pageMeta.hasData("page.pdp.products.0.itemGroupId")) {
                                    pdpProductGroupId = klevu.pageMeta.getData("page.pdp.products.0.itemGroupId");
                                    recentDataObject.records.push({
                                        "itemGroupId": pdpProductGroupId
                                    });
                                }
                                if (klevu.pageMeta.hasData("page.pdp.products.0.itemId")) {
                                    pdpProductId = klevu.pageMeta.getData("page.pdp.products.0.itemId");
                                    recentDataObject.records.push({
                                        "id": pdpProductId
                                    });
                                }
                            }
                            if (!pdpProductId && !pdpProductGroupId) {
                                return;
                            }
                            // add exclude the current product
                            sourceObjectsList.push(recentDataObject);
                            var excludeIds;
                            if (pdpProductGroupId) {
                                excludeIds = [{
                                    "key": "itemGroupId",
                                    "value": pdpProductGroupId
                                }];
                                var existingExcludeIds = klevu.getObjectPath(query, "settings.excludeIds", []);
                                if (existingExcludeIds && existingExcludeIds.length) {
                                    excludeIds = excludeIds.concat(existingExcludeIds);
                                }
                                klevu.setObjectPath(query, "settings.excludeIds", excludeIds);
                            } else if (pdpProductId) {
                                excludeIds = [{
                                    "key": "id",
                                    "value": pdpProductId
                                }];
                                var existingExcludeIds = klevu.getObjectPath(query, "settings.excludeIds", []);
                                if (existingExcludeIds && existingExcludeIds.length) {
                                    excludeIds = excludeIds.concat(existingExcludeIds);
                                }
                                klevu.setObjectPath(query, "settings.excludeIds", excludeIds);
                            }
                            // add the list of object as source
                            klevu.setObjectPath(query, "settings.context.sourceObjects", sourceObjectsList);

                        }
                    });
                }

            }
        });



        RECS_BOX.getScope().chains.request.build.add({
            name: "addCustomLogicQueryOp",
            fire: function (data, scope) {
                var pageType = klevu.getObjectPath(scope.kScope.parentScope, "kmcData.metadata.pageType");
                var logic = klevu.getObjectPath(scope.kScope.parentScope, "kmcData.metadata.logic");
                if (logic != klevu.settings.constants.RECS_LC_RECS_CUSTOM) {
                    return;
                }

                var recordQueries = klevu.getObjectPath(data, "request.current.recordQueries");
                if (recordQueries) {
                    klevu.each(recordQueries, function (key, query) {
                        if (query.id == klevu.settings.constants.RECS_QUERY_ID) {


                            if (pageType == klevu.settings.constants.RECS_PT_CATEGORY) {
                                let categoryName = "";
                                if(klevu.pageMeta.getPageType() === "category"){
                                    categoryName = klevu.dom.helpers.convertHtmlToText(klevu.pageMeta.getData("page.category.categoryPath"));
                                }
                                klevu.setObjectPath(query, "settings.query.categoryPath", categoryName);
                            }
                            if (pageType == klevu.settings.constants.RECS_PT_PRODUCT) {
                                let recentObjectsList = [];
                                let recentObjects = klevu.getObjectPath(query, "settings.context.recentObjects");
                                if (recentObjects && recentObjects.length) {
                                    recentObjectsList = recentObjects;
                                }
                                let pdpProductId;
                                let pdpProductGroupId;
                                if(klevu.pageMeta.getPageType() === "pdp"){
                                    if (klevu.pageMeta.hasData("page.pdp.products.0.itemGroupId")) {
                                        pdpProductGroupId = klevu.pageMeta.getData("page.pdp.products.0.itemGroupId");
                                    }
                                    if (klevu.pageMeta.hasData("page.pdp.products.0.itemId")) {
                                        pdpProductId = klevu.pageMeta.getData("page.pdp.products.0.itemId");
                                    }
                                }
                                if (!pdpProductId) {
                                    return;
                                }

                                let storedProductIds = [pdpProductId];
                                if (storedProductIds && storedProductIds.length) {
                                    let recentDataObject = {
                                        "typeOfRecord": "KLEVU_PRODUCT",
                                        "records": []
                                    };
                                    klevu.each(storedProductIds, function (key, productId) {
                                        recentDataObject.records.push({
                                            "id": productId
                                        });
                                    });
                                    recentObjectsList.push(recentDataObject);
                                }

                                if (pdpProductGroupId) {
                                    let excludeIds = [{
                                        "key": "itemGroupId",
                                        "value": pdpProductGroupId
                                    }];
                                    let existingExcludeIds = klevu.getObjectPath(query, "settings.excludeIds", []);
                                    if (existingExcludeIds && existingExcludeIds.length) {
                                        excludeIds = excludeIds.concat(existingExcludeIds);
                                    }
                                    klevu.setObjectPath(query, "settings.excludeIds", excludeIds);
                                }

                                klevu.setObjectPath(query, "settings.context.recentObjects", recentObjectsList);
                            }
                            if (pageType == klevu.settings.constants.RECS_PT_CHECKOUT){
                                var recentObjectsList = [];
                                var recentObjects = klevu.getObjectPath(query, "settings.context.recentObjects");
                                if (recentObjects && recentObjects.length) {
                                    recentObjectsList = recentObjects;
                                }

                                var boughtTogetherIds = [];
                                var excludeIdsList = [];
                                if(klevu.pageMeta.getPageType() === "cart"){
                                    var cartRecords = klevu.pageMeta.getData("page.cart.products",[]);
                                    if (cartRecords && cartRecords.length) {
                                        klevu.each(cartRecords, function (key, record) {
                                            if (record.itemId) {
                                                boughtTogetherIds.push(record.itemId);
                                            }
                                            if (record.itemGroupId) {
                                                excludeIdsList.push(record.itemGroupId);
                                            }
                                        });
                                    }
                                }
                                if (!boughtTogetherIds.length) {
                                    return;
                                }
                                var storedProductIds = boughtTogetherIds;
                                if (storedProductIds && storedProductIds.length) {
                                    var recentDataObject = {
                                        "typeOfRecord": "KLEVU_PRODUCT",
                                        "records": []
                                    };
                                    klevu.each(storedProductIds, function (key, productId) {
                                        recentDataObject.records.push({
                                            "id": productId
                                        });
                                    });
                                    recentObjectsList.push(recentDataObject);
                                }
                                if (excludeIdsList && excludeIdsList.length > 0) {
                                    var excludeIds = [];
                                    klevu.each(excludeIdsList, function (key, productId) {
                                        excludeIds.push({
                                            "key": "itemGroupId",
                                            "value": productId
                                        });
                                    });
                                    var existingExcludeIds = klevu.getObjectPath(query, "settings.excludeIds", []);
                                    if (existingExcludeIds && existingExcludeIds.length) {
                                        excludeIds = excludeIds.concat(existingExcludeIds);
                                    }
                                    klevu.setObjectPath(query, "settings.excludeIds", excludeIds);
                                }
                                klevu.setObjectPath(query, "settings.context.recentObjects", recentObjectsList);
                            }
                        }
                    });
                }

            }
        });


        RECS_BOX.getScope().chains.request.build.add({
            name: "processRecordQueries",
            fire: function (data, scope) {
                if (typeof (klevu_processRECSRecordQueries) === "function") {
                    var recsKey = klevu.getObjectPath(scope.kScope.parentScope, "kmcData.metadata.recsKey");
                    klevu_processRECSRecordQueries(data.request.current.recordQueries, recsKey);
                }
            }
        });
    }
});
 //source/modules/recs/recs-editor/core/chains/response.js
RECS_BASE.getScope().chains.search.control.add({
    name: "processSearchResponse",
    fire: function (data, scope) {

        var RECS_BOX = scope.recsScope.searchObject;

        RECS_BOX.getScope().chains.template.process.success.add({
            name: "processCurrencySetting",
            fire: function (data, scope) {
                var recsCurrencies = RECS_BOX.getScope().template.getTranslator().getCurrencyObject().getCurrencys();
                var productCurrency = "";
                klevu.each(data.template.query, function (key, query) {
                    if (productCurrency == "") {
                        klevu.each(query.result, function (key, result) {
                            if (result.currency && result.currency.length) {
                                productCurrency = result.currency;
                            }
                        });
                    }
                });
                if (productCurrency.length && !recsCurrencies[productCurrency]) {
                    recsCurrencies[productCurrency] = {
                        string: productCurrency,
                        format: "%s %s"
                    };
                    var currencyLanding = RECS_BOX.getScope().template.getTranslator().getCurrencyObject();
                    currencyLanding.setCurrencys(recsCurrencies);
                    currencyLanding.mergeToGlobal();
                }
            }
        });

        RECS_BOX.getScope().chains.template.process.success.add({
            name: "populateTemplateMetadata",
            fire: function (data, scope) {
                data.template.metadata = klevu.getObjectPath(scope.kScope.parentScope, "kmcData.metadata");
            }
        });

        RECS_BOX.getScope().chains.response.success.addAfter("addResponseDataQuery", {
            name: "processQueryResults",
            fire: function (data, scope) {
                if (typeof (klevu_processRECSQueryResults) === "function") {
                    var recsKey = klevu.getObjectPath(scope.kScope.parentScope, "kmcData.metadata.recsKey");
                    var queryResults = klevu.getObjectPath(data, "response.current.queryResults");
                    klevu_processRECSQueryResults(queryResults, recsKey);
                }
            }
        });

        RECS_BOX.getScope().chains.template.process.success.add({
            name: "processTemplateData",
            fire: function (data, scope) {
                if (typeof (klevu_processRECSTemplateData) === "function") {
                    var recsKey = klevu.getObjectPath(scope.kScope.parentScope, "kmcData.metadata.recsKey");
                    klevu_processRECSTemplateData(data.template, recsKey);
                }
            }
        });

    }
});

RECS_BASE.getScope().chains.search.control.add({
    name: "renderSearchResult",
    fire: function (data, scope) {
        var RECS_BOX = scope.recsScope.searchObject;
        RECS_BOX.getScope().chains.template.render.add({
            name: "renderResponse",
            fire: function (data, scope) {
                if (data.context.isSuccess) {
                    var productThreshold = klevu.getObjectPath(data, "template.metadata.productThreshold");
                    var klevuRECSItemList = klevu.getObjectPath(data, "template.query." + klevu.settings.constants.RECS_QUERY_ID + ".result");
                    if (typeof productThreshold !== "undefined" && klevuRECSItemList && klevuRECSItemList.length) {
                        var klevuRECSItemListLength = klevuRECSItemList.length;
                        if (productThreshold > klevuRECSItemListLength) {
                            return;
                        }
                    }
                    scope.kScope.template.setData(data.template);
                    var targetBox = "kuRECSTemplate";
                    var element = scope.kScope.template.convertTemplate(scope.kScope.template.render(targetBox));
                    var target = klevu.getSetting(scope.kScope.settings, "settings.search.searchBoxTarget");
                    target.innerHTML = '';
                    target.classList.add("klevuTarget");
                    scope.kScope.element.kData = data.template;
                    scope.kScope.template.insertTemplate(target, element);
                }
            }
        });
    }
});

RECS_BASE.getScope().chains.search.control.add({
    name: "bindSearchResultElementEvents",
    fire: function (data, scope) {

        var RECS_BOX = scope.recsScope.searchObject;
        RECS_BOX.getScope().chains.template.events.add({
            name: "storeResultItems",
            fire: function (data, scope) {

                var apiKey = klevu.getSetting(scope.kScope.parentScope, "settings.recs.apiKey", klevu.getGlobalSetting("recs.apiKey", klevu.getGlobalSetting("global.apiKey")));
                var recsKey = klevu.getObjectPath(scope.kScope.parentScope, "kmcData.metadata.recsKey");
                var recsTitle = klevu.getObjectPath(scope.kScope.parentScope, "kmcData.metadata.title");
                var recsLogic = klevu.getObjectPath(scope.kScope.parentScope, "kmcData.metadata.logic");
                var pageType = klevu.getObjectPath(scope.kScope.parentScope, "kmcData.metadata.pageType");
                var spotKey  = klevu.getObjectPath(scope.kScope.parentScope, "kmcData.metadata.spotKey",false);
                var spotName  = klevu.getObjectPath(scope.kScope.parentScope, "kmcData.metadata.spotName",false);
                var segmentKey  = klevu.getObjectPath(scope.kScope.parentScope, "kmcData.metadata.segmentKey",false);
                var segmentName  = klevu.getObjectPath(scope.kScope.parentScope, "kmcData.metadata.segmentName",false);
                var recsQueryId =  klevu.getGlobalSetting("constants.RECS_QUERY_ID","klevuRECSItemList");
                klevu.setObjectPath(scope.data,"context.section",recsQueryId);
                var eventTags = [];
                eventTags.push(klevu.settings.constants.RECS_RPT + pageType);
                if(klevu.isFunction(klevu.support.isActive) && klevu.support.isActive("webhook")){
                    // CUSTOM COLLECT EVENT
                    let collectorPayload ={
                        type:"recommendation_view",
                        component:"recs",
                        scope:scope.kObject.getWebhookSettings().scope,
                        object:scope.kObject.getWebhookSettings().object,
                        apiKey:apiKey,
                        user:{},
                        data:{
                            general:{
                                "tags": eventTags,
                                "list_name": recsTitle,
                                "list_logic": recsLogic,
                                "page_type":pageType,
                                "recs_key": recsKey
                            },
                            meta:klevu.analytics.dataExtract.search.metaFromScope(scope),
                            filters:klevu.analytics.dataExtract.search.filtersFromScope(scope),
                            items:klevu.analytics.dataExtract.search.itemsFromScope(scope)
                        }

                    };

                    if(!spotKey) {
                        klevu.setObjectPath(collectorPayload,"data.general.list_id", recsKey);
                    } else {
                        klevu.setObjectPath(collectorPayload,"data.general.list_id", spotKey);
                        klevu.setObjectPath(collectorPayload,"data.general.spot_id", spotKey);
                    }
                    if(spotName) klevu.setObjectPath(collectorPayload,"data.general.spot_name", spotName);
                    if(segmentKey) klevu.setObjectPath(collectorPayload,"data.general.segment_id", segmentKey);
                    if(segmentName) klevu.setObjectPath(collectorPayload,"data.general.segment_name", segmentName);
                    if(!klevu.isUndefined(klevu.user) && klevu.user.getSessionId()){
                        klevu.setObjectPath(collectorPayload,"user.session_id", klevu.user.getSessionId());
                    }
                    if(klevu.isFunction(klevu.support.hook)){
                        klevu.support.hook(["analytics.collector"],function(){
                            klevu.analytics.collector.addEvent(collectorPayload);
                        });
                    }


                    // END CUSTOM COLLECT EVENT

                    scope.kScope.parentScope.viewPayload = collectorPayload;
                }

            }
        });

        RECS_BOX.getScope().chains.template.events.add({
            name: "storeResultItemsClick",
            fire: function (data, scope) {
                var target = klevu.getSetting(scope.kScope.settings, "settings.search.searchBoxTarget");
                var kuRECSItemClick = klevu.dom.find(".kuRECSItemClick", target);

                if (kuRECSItemClick) {
                    klevu.each(kuRECSItemClick, function (key, element) {
                        klevu.event.attach(element, "click", function (e) {

                            //get the global elements
                            var parentRECSElem = klevu.dom.helpers.getClosest(element, ".klevuTarget");
                            var recsKey = klevu.getObjectPath(parentRECSElem.recsScope, "kmcData.metadata.recsKey");
                            //get the item data
                            var itemId = (element.dataset && element.dataset.id && element.dataset.id != "") ? element.dataset.id : "";
                            var topElement = klevu.dom.helpers.getClosest(element, ".kuRECSItem,.kcResultItem");
                            var topItemId = (topElement.dataset && topElement.dataset.id && topElement.dataset.id != "") ? topElement.dataset.id : "";
                            //validate item data
                            if ((itemId != "" || topItemId != "") && recsKey) {
                                if (itemId == "") itemId = topItemId;
                                //add the product to cookie
                                klevu.dom.helpers.addClickedProductToCookie(itemId);

                                let viewPayload = klevu.getObjectPath(parentRECSElem.recsScope,"viewPayload",false);
                                if(viewPayload){
                                    let items = klevu.getObjectPath(viewPayload,"data.items",[]);
                                    if (items.length > 0) {
                                        klevu.each(items, function (key, impression) {
                                            if (impression.id == itemId) {
                                                let clickedItems = [impression];
                                                klevu.setObjectPath(viewPayload,"type","recommendation_click");
                                                klevu.setObjectPath(viewPayload,"data.items",clickedItems);
                                                if(klevu.isFunction(klevu.support.hook)){
                                                    klevu.support.hook(["analytics.collector"],function(){
                                                        klevu.analytics.collector.addEvent(viewPayload);
                                                    });
                                                }

                                            }
                                        });
                                    }
                                }
                            }
                        });

                    });
                }
            }
        });

        RECS_BOX.getScope().chains.template.events.add({
            name: "attachObserverFunctionForItemClick",
            fire: function (data, scope) {
                var target = klevu.getSetting(scope.kScope.settings, "settings.search.searchBoxTarget");
                var kuRECSItemClick = klevu.dom.find(".kuRECSItemClick", target);
                if (kuRECSItemClick) {
                    klevu.each(kuRECSItemClick, function (key, element) {
                        klevu.event.attach(element, "click", function (e) {
                            if (typeof (klevu_RECSItemClick) === "function") {
                                var parentRECSElem = klevu.dom.helpers.getClosest(element, ".klevuTarget");
                                var recsKey = klevu.getObjectPath(parentRECSElem.recsScope, "kmcData.metadata.recsKey");
                                var itemId = (element.dataset && element.dataset.id && element.dataset.id != "") ? element.dataset.id : "";
                                var topElement = klevu.dom.helpers.getClosest(element, ".kuRECSItem,.kcResultItem");
                                var topItemId = (topElement.dataset && topElement.dataset.id && topElement.dataset.id != "") ? topElement.dataset.id : "";
                                if ((itemId != "" || topItemId != "") && recsKey) {
                                    if (itemId == "") itemId = topItemId;
                                }
                                klevu_RECSItemClick(data.template, itemId, recsKey);
                            }
                        });
                    });
                }
            }
        });

        RECS_BOX.getScope().chains.template.events.add({
            name: "bindTemplateElementEvents",
            fire: function (data, scope) {
                if (typeof (klevu_bindRECSTemplateElementEvents) === "function") {
                    var recsKey = klevu.getObjectPath(scope.kScope.parentScope, "kmcData.metadata.recsKey");
                    klevu_bindRECSTemplateElementEvents(data.template, recsKey);
                }
            }
        });

    }
});
RECS_BASE.getScope().chains.search.control.add({
    name: "addScriptEvaluation",
    fire: function (data, scope) {
        var script = klevu.getObjectPath(scope.recsScope, "kmcData.scripts.recsObject");
        if (!klevu.isUndefined(script) && script !== "") {
            var randomFunctionName = klevu.randomFunctionName();
            klevu.globalEval("function " + randomFunctionName + "(data,scope){" + script + "}");
            klevu.executeFunctionByName(randomFunctionName, window, data, scope);
        }

    }
});
RECS_BASE.getScope().chains.search.control.add({
    name: "setSearchBoxTarget",
    fire: function (data, scope) {
        var RECS_BOX = scope.recsScope.searchObject;
        RECS_BOX.setTarget(scope.recsScope.element);
    }
});
RECS_BASE.getScope().chains.search.control.add({
    name: "addWebhookBuild",
    fire: function (data, scope) {
        if(klevu.isFunction(klevu.support.isActive) && klevu.support.isActive("webhook")) {
                var RECS_BOX = scope.recsScope.searchObject;
                //trigger webhook before init
                var webhookSettings = klevu.extend(true, {}, RECS_BOX.getWebhookSettings());
                webhookSettings.name = "mainObject";
                webhookSettings.action = "build";
                klevu.event.webhook.runForScopeList({
                    data: RECS_BOX.getScope().data, scope: RECS_BOX.getScope().element, settings: webhookSettings
                });
        }
    }
});

RECS_BASE.getScope().chains.search.control.add({
    name: "powerUpRECSSearchObject",
    fire: function (data, scope) {
        var RECS_BOX = scope.recsScope.searchObject;
        var tempElement = RECS_BOX.getScope().element;
        tempElement.value = "*";
        tempElement.kScope.data = tempElement.kObject.resetData(tempElement);
        if(klevu.isFunction(klevu.support.isActive) && klevu.support.isActive("webhook")) {
                //trigger webhook before init
                var webhookSettings = klevu.extend(true,{},RECS_BOX.getWebhookSettings());
                webhookSettings.name = "mainObject";
                webhookSettings.action = "beforeInit";
                klevu.event.webhook.runForScopeList({
                    data:RECS_BOX.getScope().data,
                    scope:RECS_BOX.getScope().element,
                    settings:webhookSettings
                });
        }


        // power up the box
        klevu.event.fireChain(tempElement.kScope, "chains.events.keyUp", tempElement, tempElement.kScope.data, null);

        if(klevu.isFunction(klevu.support.isActive) && klevu.support.isActive("webhook")) {
                //trigger webhook after init
                var webhookSettings = klevu.extend(true, {}, RECS_BOX.getWebhookSettings());
                webhookSettings.name = "mainObject";
                webhookSettings.action = "afterInit";
                klevu.event.webhook.runForScopeList({
                    data: RECS_BOX.getScope().data, scope: RECS_BOX.getScope().element, settings: webhookSettings
                });
        }

    }
});

RECS_BASE.getScope().chains.response.success.addBefore("saveSettings", {
    name: "preSaveSettings",
    fire: function (data, scope) {
        const response = klevu.getObjectPath(data.response, 'data', false)
        if (response) {
            window.klevu.recs.base.recsEditor.registerKey(response);
            const shouldOverrideKey = window.klevu.recs.base.recsEditor.shouldOverrideKey(response.metadata.recsKey);
            if (shouldOverrideKey) {
                const customCode = window.klevu.recs.base.recsEditor.getSavedContent();
                if (customCode) {
                    klevu.setObjectPath(data.response, "data.scripts.recsObject", customCode.scripts);
                    klevu.setObjectPath(data.response, "data.templates.base", customCode.templates);
                    klevu.setObjectPath(data.response, "data.styles.base", customCode.css);
                }
            }
        }
    }
});
 //source/modules/recs/recs-editor/core/chains/hide-banner.js
RECS_BASE.getScope().chains.type.hideBanner.add({
  name: "checkHideBanner",
  fire: function (data, scope) {
      var recsKey = klevu.getObjectPath(scope.recsScope, "kmcData.metadata.recsKey");
      var action = klevu.getObjectPath(scope.recsScope, "kmcData.metadata.action", false);
      if (action === "HIDE_RECOMMENDATION") {
          console.info("RECS element is hidden");
          return false;
      }
  }
}); //source/modules/recs/recs-editor/core/chains/static-recs.js

RECS_BASE.getScope().chains.type.staticContent.add({
    name: "validateRECSElementData",
    fire: function (data, scope) {
        var recsKey = klevu.getObjectPath(scope.recsScope, "kmcData.metadata.recsKey");
        if (!recsKey) {
            console.info("RECS element id is missing.");
            return false;
        }

        var isEnabled = klevu.getObjectPath(scope.recsScope, "kmcData.metadata.enabled");
        if (!isEnabled) {
            console.info("[" + recsKey + "] element is disabled.");
            return false;
        }

        var hasAnyError = false;
        var logic = klevu.getObjectPath(scope.recsScope, "kmcData.metadata.logic");
        if (!logic) {
            console.info("[" + recsKey + "] RECS logic is missing.");
            hasAnyError = true;
        }

        var pageType = klevu.getObjectPath(scope.recsScope, "kmcData.metadata.pageType");
        if (!pageType) {
            console.info("[" + recsKey + "] RECS page type is missing.");
            hasAnyError = true;
        }

        if (hasAnyError) {
            return false;
        }

    }
});

RECS_BASE.getScope().chains.type.staticContent.add({
    name: "addElementStylesToHead",
    fire: function (data, scope) {
        var recsKey = klevu.getObjectPath(scope.recsScope, "kmcData.metadata.recsKey");
        var elementStyles = klevu.getObjectPath(scope.recsScope, "kmcData.styles.base");
        if (recsKey) {
            klevu.each(klevu.dom.find("#ku-recs-" + recsKey), function (key, existingElement) {
                if (existingElement && existingElement.parentNode) {
                    existingElement.parentNode.removeChild(existingElement);
                }
            });
        }
        klevu.dom.helpers.addElementToHead({
            content: elementStyles,
            type: "css",
            name: "ku-recs-" + recsKey
        });
    }
});


RECS_BASE.getScope().chains.type.staticContent.add({
    name: "registerRECSTemplate",
    fire: function (data, scope) {
      var RECS_TEMPLATE_OBJ = klevu.template();
      scope.recsScope.template = RECS_TEMPLATE_OBJ;
        var templateString = klevu.getObjectPath(scope.recsScope, "kmcData.templates.base");
        RECS_TEMPLATE_OBJ.setTemplate(templateString, "kuRECSTemplate", true);
    }
});

RECS_BASE.getScope().chains.type.staticContent.add({
    name: "addScriptEvaluation",
    fire: function (data, scope) {
        var script = klevu.getObjectPath(scope.recsScope, "kmcData.scripts.recsObject");
        if (!klevu.isUndefined(script) && script !== "") {
            var randomFunctionName = klevu.randomFunctionName();
            klevu.globalEval("function " + randomFunctionName + "(data,scope){" + script + "}");
            klevu.executeFunctionByName(randomFunctionName, window, data, scope);
        }

    }
});


RECS_BASE.getScope().chains.type.staticContent.add({
    name: "renderStaticContent",
    fire: function (data, scope) {
    var RECS_TEMPLATE_OBJ = scope.recsScope.template;
        var action = klevu.getObjectPath(scope.recsScope, "kmcData.metadata.action");
        if(action === 'STATIC_CONTENT'){
            if (data.context.isSuccess) {
                RECS_TEMPLATE_OBJ.setData(data.scope.recsScope.kmcData);
                var targetBox = "kuRECSTemplate";
                var element = RECS_TEMPLATE_OBJ.convertTemplate(RECS_TEMPLATE_OBJ.render(targetBox));
                var target = scope.recsScope.element;
                target.innerHTML = '';
                target.classList.add("klevuTarget");
                RECS_TEMPLATE_OBJ.insertTemplate(target, element);
            }
        }
    }
});

RECS_BASE.getScope().chains.type.staticContent.add({
    name: "staticContentAnalyticsView",
    fire: function (data, scope) {
        var action = klevu.getObjectPath(scope.recsScope, "kmcData.metadata.action");
        var recsKey = klevu.getObjectPath(scope.recsScope, "kmcData.metadata.recsKey");
        var apiKey = klevu.getSetting(scope.recsScope, "settings.recs.apiKey", klevu.getGlobalSetting("recs.apiKey", klevu.getGlobalSetting("global.apiKey")));
        var recsTitle = klevu.getObjectPath(scope.recsScope, "kmcData.metadata.title");
        var recsLogic = klevu.getObjectPath(scope.recsScope, "kmcData.metadata.logic");
        var pageType = klevu.getObjectPath(scope.recsScope, "kmcData.metadata.pageType");
        var spotKey  = klevu.getObjectPath(scope.recsScope, "kmcData.metadata.spotKey",false);
        var spotName  = klevu.getObjectPath(scope.recsScope, "kmcData.metadata.spotName",false);
        var segmentKey  = klevu.getObjectPath(scope.recsScope, "kmcData.metadata.segmentKey",false);
        var segmentName  = klevu.getObjectPath(scope.recsScope, "kmcData.metadata.segmentName",false);
        var staticContent = klevu.getObjectPath(scope.recsScope, "kmcData.staticContent",false);

        let target = scope.recsScope.element;
            if(!target){
                return;
            }
            let allVisibleContent = klevu.dom.find('[data-view="banner"]', target);
            let activeStaticContent = [];

            if (allVisibleContent.length) {
                klevu.each(allVisibleContent, function (key, value) {
                    let image = value.querySelector("img");
                    let content = {
                        "static_item_id": value.getAttribute("data-id") || '',
                        "content_type": value.getAttribute("data-type") || '',
                        "resolution": value.getAttribute("data-resolution") || '',
                        "banner_image_url": (image===null)?"":value.querySelector("img").getAttribute("src"),
                        "banner_alt_tag": (image===null)?"":value.querySelector("img").getAttribute("alt"),
                        "index": (key + 1)
                    };
                    activeStaticContent.push(content);
                });
            }

        var eventTags = [];
        eventTags.push(klevu.getGlobalSetting("constants.RECS_RPT", "") + pageType);
        if(action === 'STATIC_CONTENT' && klevu.isFunction(klevu.support.hook)){

            let collectorPayload = {
            type:"recommendation_view_static",
            component:"recs",
            apiKey:apiKey,
            user:{},
            data:{
                general:{
                    "tags": eventTags,
                    "list_name": recsTitle,
                    "list_logic": recsLogic,
                    "page_type":pageType,
                    "recs_key": recsKey,
                    "spot_id": spotKey,
                    "spot_name": spotName
                },
                staticContent: staticContent,
                activeStaticContent: activeStaticContent
                }

            };

            if(!spotKey) {
                klevu.setObjectPath(collectorPayload,"data.general.list_id", recsKey);
            } else {
                klevu.setObjectPath(collectorPayload,"data.general.list_id", spotKey);
                klevu.setObjectPath(collectorPayload,"data.general.spot_id", spotKey);
            }
            !!spotName && klevu.setObjectPath(collectorPayload,"data.general.spot_name", spotName);
            !!segmentKey && klevu.setObjectPath(collectorPayload,"data.general.segment_id", segmentKey);
            !!segmentName && klevu.setObjectPath(collectorPayload,"data.general.segment_name", segmentName);
            !!action && klevu.setObjectPath(collectorPayload,"data.general.action", action);

            if(!klevu.isUndefined(klevu.user) && klevu.user.getSessionId()){
                klevu.setObjectPath(collectorPayload,"user.session_id", klevu.user.getSessionId());
            }
            
            klevu.support.hook(["analytics.collector"],function(){
                klevu.analytics.collector.addEvent(collectorPayload);
            });
            
        }
    }
});

RECS_BASE.getScope().chains.type.staticContent.add({
    name: "staticContentAnalyticsClick",
    fire: function (data, scope) {
        var action = klevu.getObjectPath(scope.recsScope, "kmcData.metadata.action");
        var recsKey = klevu.getObjectPath(scope.recsScope, "kmcData.metadata.recsKey");
        var apiKey = klevu.getSetting(scope.recsScope, "settings.recs.apiKey", klevu.getGlobalSetting("recs.apiKey", klevu.getGlobalSetting("global.apiKey")));
        var recsTitle = klevu.getObjectPath(scope.recsScope, "kmcData.metadata.title");
        var recsLogic = klevu.getObjectPath(scope.recsScope, "kmcData.metadata.logic");
        var pageType = klevu.getObjectPath(scope.recsScope, "kmcData.metadata.pageType");
        var spotKey  = klevu.getObjectPath(scope.recsScope, "kmcData.metadata.spotKey",false);
        var spotName  = klevu.getObjectPath(scope.recsScope, "kmcData.metadata.spotName",false);
        var segmentKey  = klevu.getObjectPath(scope.recsScope, "kmcData.metadata.segmentKey",false);
        var segmentName  = klevu.getObjectPath(scope.recsScope, "kmcData.metadata.segmentName",false);
        var staticContent = klevu.getObjectPath(scope.recsScope, "kmcData.staticContent",false);

        var eventTags = [];
        eventTags.push(klevu.getGlobalSetting("constants.RECS_RPT", "") + pageType);
        if(action === 'STATIC_CONTENT'){

            let collectorPayload = {
            type:"recommendation_click_static",
            component:"recs",
            apiKey:apiKey,
            user:{},
            data:{
                    general:{
                        "tags": eventTags,
                        "list_name": recsTitle,
                        "list_logic": recsLogic,
                        "page_type":pageType,
                        "recs_key": recsKey,
                        "spot_id": spotKey,
                        "spot_name": spotName
                    },
                    staticContent: staticContent
                }

            };

            if(!spotKey) {
                klevu.setObjectPath(collectorPayload,"data.general.list_id", recsKey);
            } else {
                klevu.setObjectPath(collectorPayload,"data.general.list_id", spotKey);
                klevu.setObjectPath(collectorPayload,"data.general.spot_id", spotKey);
            }
            !!spotName && klevu.setObjectPath(collectorPayload,"data.general.spot_name", spotName);
            !!segmentKey && klevu.setObjectPath(collectorPayload,"data.general.segment_id", segmentKey);
            !!segmentName && klevu.setObjectPath(collectorPayload,"data.general.segment_name", segmentName);
            !!action && klevu.setObjectPath(collectorPayload,"data.general.action", action);

            if(!klevu.isUndefined(klevu.user) && klevu.user.getSessionId()){
                klevu.setObjectPath(collectorPayload,"user.session_id", klevu.user.getSessionId());
            }
            
            let target = scope.recsScope.element;
            let kuRECSItemClick = klevu.dom.find(".kuRECSItemClick", target);

            if (kuRECSItemClick && klevu.isFunction(klevu.support.hook)) {
                klevu.each(kuRECSItemClick, function (key, element) {
                    klevu.event.attach(element, "click", function (e) {
        
                        let parentTarget = klevu.dom.helpers.getClosest(e.target, ".kuRECSItemClick");
                        let image = parentTarget.querySelector("img");
                        let content = {
                            "static_item_id": parentTarget.getAttribute("data-id") || '',
                            "content_type": parentTarget.getAttribute("data-type") || '',
                            "resolution": parentTarget.getAttribute("data-resolution") || '',
                            "banner_image_url": (image===null)?"":value.querySelector("img").getAttribute("src"),
                            "banner_alt_tag": (image===null)?"":value.querySelector("img").getAttribute("alt"),
                            "index": (key + 1)
                        };
    
                        klevu.setObjectPath(collectorPayload,"data.staticContent", [content]);
    
                        klevu.support.hook(["analytics.collector"],function(){
                            klevu.analytics.collector.addEvent(collectorPayload);
                        });
                        
                    });
                });
            }
        }
    }
});
  
        }
    });
 

})( klevu );
//source/general/wrapper.js
// templates/wrapper.js
(function ( klevu ) {

  //source/modules/recs/recs-editor/events-build.js
klevu.coreEvent.build({
    name: "setRemoteConfigRecsBaseUpdates",
    fire: function () {
        if (
            klevu.isUndefined(klevu.recs) ||
            klevu.isUndefined(klevu.recs.base)
        ) {
            return false;
        }
        return true;
    },
    maxCount: 500,
    delay: 30
});

klevu.coreEvent.build({
    name: "setRemoteConfigRecs",
    fire: function () {
        if (
            klevu.isUndefined(klevu.recs) ||
            !klevu.getGlobalSetting( "recs.apiKey",klevu.getGlobalSetting( "global.apiKey" ,false) ) ||
            !klevu.dom.find(".klevu-recs").length ||
            !klevu.getSetting(klevu.settings, "settings.powerUp.recsModule")
        ) {
            return false;
        }
        return true;
    },
    maxCount: 50,
    delay: 300
});
 //source/modules/recs/recs-editor/utility/addToCart.js
klevu.coreEvent.attach("setRemoteConfigRecsBaseUpdates", {
    name: "klevuRECSCustomization",
    fire: function () {

        klevu.recs.base.getScope().chains.search.control.add({
            name: "attachCustomEvents",
            fire: function (data, scope) {

                var parentScope = scope.recsScope;

                scope.recsScope.searchObject.getScope().chains.template.events.add({
                    name: "bindAddToCartButtonEvent",
                    fire: function (data, scope) {
                        var target = klevu.getSetting(scope.kScope.settings, "settings.search.searchBoxTarget");
                        var kuRECSAddToCart = klevu.dom.find(".kuRECSAddToCartBtn", target);
                        if (kuRECSAddToCart) {
                            klevu.each(kuRECSAddToCart, function (key, element) {
                                klevu.event.attach(element, "click", function () {
                                    var variantId = (element.dataset && element.dataset.id) ? element.dataset.id : "";
                                    var productURL = (element.dataset && element.dataset.url) ? element.dataset.url : "";
                                    var quantity = (element.dataset && element.dataset.qty) ? element.dataset.qty : 0;
                                    if (typeof (klevu_addtocart) === "function") {
                                        var recsKey = klevu.getObjectPath(parentScope, "kmcData.metadata.recsKey");
                                        klevu_addtocart(variantId, productURL, quantity, recsKey,scope);
                                    }
                                });
                            });
                        }
                    }
                });

                scope.recsScope.searchObject.getScope().chains.template.events.add({
                    name: "bindAddToCartButtonAnalytics",
                    fire: function (data, scope) {
                        var target = klevu.getSetting(scope.kScope.settings, "settings.search.searchBoxTarget");
                        var kuRECSAddToCart = klevu.dom.find(".kuRECSAddToCartBtn", target);
                        if (kuRECSAddToCart) {
                            klevu.each(kuRECSAddToCart, function (key, element) {
                                klevu.event.attach(element, "click", function () {
                                    var parentRECSElem = klevu.dom.helpers.getClosest(element, ".klevuTarget");
                                    var recsKey = klevu.getObjectPath(parentRECSElem.recsScope, "kmcData.metadata.recsKey");
                                    var itemId = (element.dataset && element.dataset.id && element.dataset.id != "") ? element.dataset.id : "";
                                    var topElement = klevu.dom.helpers.getClosest(element, ".kuRECSItem,.kcResultItem");
                                    var topItemId = (topElement.dataset && topElement.dataset.id && topElement.dataset.id != "") ? topElement.dataset.id : "";
                                    if ((itemId != "" || topItemId != "" ) && recsKey) {
                                        if(itemId == "") itemId = topItemId;
                                        klevu.dom.helpers.addClickedProductToCookie(itemId);
                                        let viewPayload = klevu.getObjectPath(parentRECSElem.recsScope,"viewPayload",false);
                                        if(viewPayload){
                                            let items = klevu.getObjectPath(viewPayload,"data.items",[]);
                                            if (items.length > 0) {
                                                klevu.each(items, function (key, impression) {
                                                    if (impression.id == itemId) {
                                                        let clickedItems = [impression];
                                                        klevu.setObjectPath(viewPayload,"type","recommendation_click");
                                                        klevu.setObjectPath(viewPayload,"data.items",clickedItems);
                                                        if(klevu.isFunction(klevu.support.hook)){
                                                            klevu.support.hook(["analytics.collector"],function(){
                                                                klevu.analytics.collector.addEvent(viewPayload);
                                                            });
                                                        }

                                                    }
                                                });
                                            }
                                        }
                                    }
                                });
                            });
                        }
                    }
                });

            }
        });


    }
}); //source/modules/recs/recs-editor/events.js

klevu.coreEvent.attach("setRemoteConfigRecs", {
    name: "initializeRecsEditor",
    fire: function () {
        // Auto-initialize when DOM is ready (based on URL parameter and localStorage)
        function initializeRecsEditor() {
            // Check URL parameter first
            const urlParam = klevu.getUrlParameter('editor');
            
            if (urlParam !== undefined) {
                // URL parameter provided - update localStorage
                if (urlParam === '1' || urlParam === 'true') {
                    klevu.recs.base.RecsEditor.enable();
                } else {
                    klevu.recs.base.RecsEditor.disable();
                }
            }
            
            // Initialize editor if enabled
            const showUi = klevu.recs.base.RecsEditor.isEnabled();
            klevu.recs.base.recsEditor = new klevu.recs.base.RecsEditor(showUi);
        }
        initializeRecsEditor();
    }
});

klevu.coreEvent.attach("setRemoteConfigRecs", {
    name: "populateRECSObjectClone",
    fire: function () {
        klevu.each(klevu.dom.find(".klevu-recs"), function (key, recsTargetElement) {
            if (!recsTargetElement.id) {
                console.info("No Klevu RECS ID found on the targeted element!", recsTargetElement);
                return;
            }
            klevu.recs.clone({
                recId: recsTargetElement.id,
                apiKey: klevu.getGlobalSetting( "recs.apiKey",klevu.getGlobalSetting( "global.apiKey" ) ),
                element: recsTargetElement
            });
        });
    }
});

klevu.coreEvent.attach("setRemoteConfigRecs", {
    name: "powerUpRECSList",
    fire: function () {
        var recsList = klevu.recs.list;
        if (recsList && recsList.length) {
            klevu.each(recsList, function (key, recsObj) {
                recsObj.powerUp();
            });
        }
    }
}); 

})( klevu );
//recs-editor
