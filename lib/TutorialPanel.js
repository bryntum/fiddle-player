import FlexChildResize from './FlexChildResize.js';
import Typer from './Typer.js';

const
    isChrome   = navigator.userAgent.match(/Chrom(?:e|ium)\/(\d+)\./),
    isFF       = navigator.userAgent.match(/Firefox\/(\d+)\./),
    keywords   = [
        'do', 'enum', 'finally',  /*'for',*/ 'in', 'instanceof', 'interface', 'null', 'private',
        'protected', 'public', 'super', 'switch', 'this', 'throw', 'try',
        'typeof', 'void', 'while', 'with', 'yield', 'await', 'case', 'catch', 'continue', 'debugger',
        'import', 'if', 'switch', 'else', 'var', 'const', 'let', 'delete', 'true', 'false', /*'from',*/ 'return', 'new',
        'function', '=>', 'class', 'get', 'set', 'break', 'return', 'export', 'default', 'static', 'extends'
    ],
    jsSyntax   = {
        string  : /'.*?'|`.*?`|".*?"/g,
        number  : /^\d+/g,
        keyword : new RegExp(keywords.map(word => `^${word}`).join('|'), 'g'),
        tag     : /&lt;.*?&gt;/g
    },
    syntaxKeys = Object.keys(jsSyntax);

export default class TutorialPanel {
    get elementTpl() {
        return `
            <div class='code-wrap'>
                <div class="b-top-toolbar">
                    <i class="b-js" data-reference="jsLogo">JS</i>
                    ${this.title ? `<div class="b-fiddle-title">${this.title}</div>` : ''}
                    <svg data-reference="toggleFullscreen" height="30" version="1.1" viewBox="0 0 36 36" width="30">
                        <path d="m 10,16 2,0 0,-4 4,0 0,-2 L 10,10 l 0,6 0,0 z"></path>
                        <path d="m 20,10 0,2 4,0 0,4 2,0 L 26,10 l -6,0 0,0 z"></path>
                        <path d="m 24,24 -4,0 0,2 L 26,26 l 0,-6 -2,0 0,4 0,0 z"></path>
                        <path d="M 12,20 10,20 10,26 l 6,0 0,-2 -4,0 0,-4 0,0 z"></path>
                    </svg>
                </div>
                <pre data-reference='pre'>
                    <div class='b-line-numbers' data-reference='lineNumberContainer'></div>
                    <code class='b-idle' spellcheck='false' data-reference='codeElement'></code>
                </pre>
                <div class='b-code-toolbar' data-reference='toolbar' style="${this.hideToolbar ? 'display:none' : ''}">
                    <div class='run action' data-btip='Run code' data-action='run'><i class="b-icon b-fa-play"></i>Run</div>
                    <i class='b-icon b-fa-exclamation-triangle'  data-reference='errorIcon'></i>
                    <div class='action' data-action='increase-fontsize'>A<i class="b-icon b-fa-caret-up"></i></div>
                    <div class='action' data-action='decrease-fontsize'><small>A</small><i class="b-icon b-fa-caret-down"></i></div>
                    <i class='action b-icon b-icon-copy' data-btip='Copy to clipboard' data-action='copy'></i>
                    <span class='action b-line-count' data-reference='progressElement'></span>
                </div>
            </div>
            <div class="b-codepanel-splitter" data-reference="splitter">
                <svg class="b-splitter-grip" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" >
                    <path d="M15 10L12 7M9 10L12 7M9 14L12 17L15 14">
                </svg>
            </div>
            <div class='b-codepanel-result' data-reference="resultContainer" style="${this.fitContent ? 'overflow:hidden' : ''}"></div>
       `;
    }

    constructor(config) {
        super.constructor(config);
        Object.assign(this, config);

        this.createElements();

        this.construct(config);

        if (this.theme === 'dark') {
            this.element.classList.add('b-dark');
        }
    }

    async construct(config) {
        const me = this;

        me.onPreClick = me.onPreClick.bind(me);
        me.codeElement.addEventListener('input', me.onInput.bind(me));
        me.pre.addEventListener('click', me.onPreClick);
        me.lineNumberContainer.addEventListener('change', me.onChange.bind(me));
        // todo fix
        // me.codeElement.addEventListener('keydown', event => {
        //     if (event.key === 'Enter') {
        //         document.execCommand('insertHTML', false, '<br><div class="b-line"></div>');
        //         event.preventDefault();
        //     }
        // });

        me.toolbar.addEventListener('click', me.onToolbarClick.bind(me));

        me.typer = new Typer(Object.assign({
            codeElement        : me.codeElement,
            keystrokeInterval  : config.keystrokeInterval || 20,
            intervalRandomness : config.intervalRandomness || 20,
            async onMetaNodeCallback(text) {
                return me.evaluateCode(true);
            },

            async onBeforeLineCallback(index, line) {
                me.onBeforeLineExecute?.({ index, line });
                // When we processed all imports, no need to show loading indicator
                if (!line.textContent.trim().match(/^import/)) {
                    me.processedImports = true;
                }
                me.setProgress(me.typer.currentLineIndex);
            },

            async onAfterLineCallback(index, line) {
                me.onAfterLineExecute?.({ index, line });

                me.pre.scrollTop = me.pre.scrollHeight;
                me.pre.scrollLeft = 0;

                if (line.textContent) {
                    return me.evaluateCode();
                }
            },

            onStart() {
                me.element.classList.add('b-typing');
            },

            onStop() {
                me.element.classList.remove('b-typing');
            }
        }, me.typer));

        me.code = ' ';

        if (me.orientation === 'vertical') {
            me.element.classList.add('b-vertical');
        }
        if (me.autoStart && me.url) {
            await me.loadCode(me.url);
        }
        else if (me.initialCode) {
            me.code = me.initialCode;
        }

        if (me.autoStart) {
            me.start();
        }
    }

    destroy() {
        // TODO
    }

    async start() {
        const
            me = this;

        if (me.url && me.code !== ' ') {
            me.reset();
            await me.loadCode(me.url);
        }
        me.started = true;

        if (me.cleanupOnNextStart) {
            me.cleanup();
            me.cleanupOnNextStart = false;
        }

        if (me.typer.currentLineIndex === 0) {
            me.processedImports = false;
        }

        me.typer.start();
        me.triggerOnHost('start')
    }

    stop() {
        this.typer.stop();
        this.triggerOnHost('stop')
    }

    triggerOnHost(event) {
        this.element.getRootNode().host.dispatchEvent(new Event(event));
    }

    createElements() {
        this.element = Object.assign(document.createElement('div'), {
            className : 'b-tutorialpanel',
            innerHTML : this.elementTpl
        });

        this.appendTo.appendChild(this.element);

        // Setup references to elements
        Array.from(this.element.querySelectorAll('[data-reference]')).forEach(el => {
            this[el.dataset.reference] = el;
        });

        this.splitter = new FlexChildResize({
            element : this.splitter
        });

        this.toggleFullscreen.addEventListener('click', this.onFullScreenClick.bind(this));

        if (!this.orientation) {
            this.observer = new ResizeObserver(() => {
                this.element.classList.toggle('b-vertical', this.element.offsetWidth < 1000);
            });
            this.observer.observe(this.element)
        }
    }

    highlightCode(codeSnippet) {
        let multiLineComment;

        let isBlockComment = false;

        return codeSnippet.split('\n').map(line => {
            const
                rowConfig  = {
                    tag       : 'span',
                    className : 'b-line'
                },
                rowDataset = {},
                trimmed    = line.trim();

            let trimmedLine       = trimmed.split('///')[0],
                leadingWhitespace = line.match(/^\s*/);

            // First process any comment
            let comment      = trimmed.startsWith('//') ? trimmed.split('//')[1] : '';
            const
                isToggleHint = trimmed.startsWith('/// '),
                jumpToLine   = trimmed.match(/->(\d+)/),
                metaMatch    = trimmed.match(/\$(.*)/);

            if (isToggleHint) {
                rowDataset.isHint = 1;
            }

            if (metaMatch) {
                comment               = comment.split(/\$(.*)/)[0];
                trimmedLine           = trimmedLine.split('//$')[0];
                rowDataset.pauseAfter = parseInt(metaMatch[1]);
            }

            if (jumpToLine) {
                comment         = comment.split(/->/)[0];
                trimmedLine     = trimmedLine.split('//')[0];
                rowDataset.goto = jumpToLine[1];
            }

            if (comment) {
                comment = comment.replace(/^\//, '');

                comment = {
                    tag       : 'span',
                    className : comment ? 'comment' : '',
                    innerHTML : comment ? ('// ' + comment.trim()) : '\n'
                };
            }

            let inlineComment;

            let inlineCommentParts = !trimmedLine.startsWith('import') && trimmedLine.split('//');

            if (inlineCommentParts.length > 0) {
                trimmedLine   = inlineCommentParts[0];
                inlineComment = inlineCommentParts[1];
            }

            const lineWords = trimmedLine?.match(/\\?.|^$/g).reduce((p, c) => {
                if (c === '"' || c === "'") {
                    p.quote ^= 1;

                    if (p.quote) {
                        p.a[p.a.length - 1] = c;
                    }
                    if (!p.quote) {
                        p.a[p.a.length - 1] += c.replace(/\\(.)/, "$1");
                    }
                }
                else if (!p.quote && !p.singleQuote && c === ' ') {
                    p.a.push('');
                }
                else {
                    p.a[p.a.length - 1] += c.replace(/\\(.)/, "$1");
                }
                return p;
            }, { a : [''] }).a;

            const lineChildren = lineWords ? lineWords.map((word, index, all) => {
                let matchedWord;
                const
                    children               = [],
                    blockCommentStartParts = word.split('/*');

                if (blockCommentStartParts.length > 1) { // const a = 1;/*hello
                    word           = (blockCommentStartParts[0] || blockCommentStartParts[1]);
                    isBlockComment = true;

                    children.push({
                        tag       : 'span',
                        className : 'block-comment block-comment-start',
                        innerHTML : '/*' + word.split('*/')[0]
                    });

                    word = word.substring(word.indexOf('*/'));
                }

                if (word.includes('*/')) {
                    const blockCommentEndParts = word.split('*/');
                    word                       = blockCommentEndParts[1];
                    isBlockComment             = false;

                    children.push({
                        tag       : 'span',
                        className : 'block-comment block-comment-end',
                        innerHTML : blockCommentEndParts.length > 1 ? blockCommentEndParts[0] + '*/' : '*/' + blockCommentEndParts[0] ?? ''
                    });

                    if (!word) {
                        return children;
                    }
                }

                if (!isBlockComment) {
                    syntaxKeys.forEach(type => {
                        if (!matchedWord) {
                            const matches = word.match(jsSyntax[type]);

                            if (matches) {
                                let firstMatch = matches[0];
                                if (type === 'string') {
                                    // innerHTML encode tags used in strings
                                    firstMatch = firstMatch.replace(/</g, '&lt;').replace(/>/g, '&gt;');
                                }

                                children.push({
                                        tag       : 'span',
                                        className : type,
                                        innerHTML : firstMatch
                                    },
                                    {
                                        tag       : 'span',
                                        innerHTML : word.replace(firstMatch, '') + (index < all.length - 1 ? ' ' : '')
                                    });
                                matchedWord = true;
                            }
                        }
                    });
                }

                if (!matchedWord) {
                    children.push({
                        tag       : 'span',
                        className : isBlockComment ? 'block-comment' : '',
                        innerHTML : word + (index < all.length - 1 ? ' ' : '')
                    });
                }

                return children;
            }).flat() : [];

            if (line === '') {
                lineChildren.push('\n');
            }
            else if (leadingWhitespace[0]?.length > 0) {
                lineChildren.unshift({
                    tag       : 'span',
                    className : 'whitespace',
                    innerHTML : leadingWhitespace[0]
                });
            }

            if (inlineComment) {
                inlineComment = inlineComment.replace(/^\//, '');

                lineChildren.push({
                    tag       : 'span',
                    className : inlineComment ? 'comment' : '',
                    innerHTML : inlineComment ? ('// ' + inlineComment.trim()) : '\n'
                });
            }

            const
                rowEl = Object.assign(document.createElement('div'), rowConfig);

            Object.assign(rowEl.dataset, rowDataset);

            lineChildren.map(config => {
                const el = typeof config === 'string' ? document.createTextNode(config) : Object.assign(document.createElement(config.tag), config);

                rowEl.appendChild(el);
            });

            return rowEl;
        });
    }

    onInput(event) {
        if (event?.target.nodeName === 'INPUT') {
            return;
        }

        this.evaluateCode();
    }

    onPreClick() {
        const me = this;

        if (!me.url) {
            return;
        }

        if (me.started && !me.togglePlayOnClick) {
            me.pre.removeEventListener('click', me.onPreClick);
            return;
        }
        if (me.isTyping) {
            me.stop();
        }
        else if (!me.isFinished) {
            me.start();
        }
    }

    onChange({ target }) {
        const line = target.closest('.b-line');

        this.toggleRowCommented(this.codeElement.children[Array.from(line.parentElement.children).indexOf(line)]);
    }

    async onToolbarClick({ target }) {
        const actionNode = target.closest('.action');

        if (!actionNode) {
            return;
        }

        switch (actionNode.dataset.action) {
            case 'copy':
                this.copyCodeToClipboard();
                break;

            case 'increase-fontsize':
            case 'decrease-fontsize': {
                const
                    sign        = actionNode.dataset.action === 'decrease-fontsize' ? -1 : 1,
                    currentSize = this.pre.style.fontSize || '1em';

                this.pre.style.fontSize = (parseFloat(currentSize.substr(0, currentSize.length - 2)) + (sign * 0.1)) + 'em';
                break;
            }

            case 'run':
                if (this.isTyping) {
                    this.typer.stop();
                }
                else {
                    if (this.url && this.typer.currentLineIndex === this.lineCount) {
                        this.reset();
                        await this.loadCode(this.url);
                    }
                    this.start();
                }
                break;
        }
    }

    reset() {
        this.typer.currentLineIndex  = 0;
        this.codeElement.textContent = this.resultContainer.textContent = '';
    }

    copyCodeToClipboard() {
        const
            code     = Array.from(this.codeElement.children).map(node => node.textContent).join('\n'),
            textArea = document.createElement('textarea');

        textArea.value        = code;
        textArea.style.height = textArea.style.width = 0;
        document.body.appendChild(textArea);

        textArea.select();
        try {
            document.execCommand('copy');

            this.toast('Copied to clipboard');
        }
        catch (e) {
            console.error(e);
        }
        textArea.remove();
    }

    toggleRowCommented(rowNode) {
        let content;

        if (rowNode.textContent.includes('//')) {
            content = rowNode.textContent.replace('// ', '');
        }
        else {
            content = '// ' + rowNode.textContent;
        }

        rowNode.innerHTML = this.highlightCode(content)[0].innerHTML;
        this.onInput();
    }

    // elements passed are from the previous run
    cleanup(elements = Array.from(this.resultContainer.children)) {
        // TODO Managed destruction of all widgets
        // Remove any additional elements added by the snippet
        elements.forEach(element => element.remove());
    }

    async evaluateCode(ignoreError) {
        const
            me   = this,
            code = me.codeElement.innerText + '\nexport default null;\n';

        me.element.classList.remove('b-error');

        let oldElements;

        try {
            const
                imports     = code.match(/import .*/gm),
                pathParts   = document.location.pathname.split('/'),
                base        = `${document.location.protocol}//${document.location.host}`;

            oldElements = Array.from(me.resultContainer.children);

            let rewrittenCode = code;

            // Rewrite relative imports as absolute, to work with createObjectURL approach below
            imports?.forEach(importLine => {
                const
                    parts = !importLine.includes('//') && importLine.split('../');

                if (parts && parts.length) {
                    const
                        absolute  = pathParts.slice().splice(0, pathParts.length - parts.length).join('/'),
                        statement = `${parts[0]}${base}${absolute}/${parts[parts.length - 1]}`;

                    rewrittenCode = rewrittenCode.replace(importLine, statement);
                }
            });

            // Retrieve module from object url. Wrapped in eval() to hide it from FF, it refuses to load otherwise
            const
                objectUrl = URL.createObjectURL(new Blob([rewrittenCode], { type : 'text/javascript' }));

            // Make targetElement global available
            window.targetElement = me.resultContainer;

            let loadIcon;

            if (imports?.length && !me.processedImports) {
                me.jsLogo.classList.add('b-fa-spin');
            }
            // eslint-disable-next-line no-eval
            await eval(`import(objectUrl)`);

            URL.revokeObjectURL(objectUrl);

            me.jsLogo.classList.remove('b-fa-spin');
            me.cleanup(oldElements);
            delete me.resultContainer.dataset.error;
        }
        catch (e) {
            if (me.isTyping && (e instanceof SyntaxError || e.message.startsWith('Bryntum bundle'))) {
                // Ignore syntax errors while typing since we eval code after every line
            }
            else {
                // Exception, invalid code
                if (!ignoreError) {
                    me.toast(e.message);
                }
                me.typer.stop();
                me.cleanupOnNextStart = true;
                me.element.classList.add('b-error');
                me.errorIcon.dataset.btip = e.message;
                console.error(e);
            }
        }
        me.element.classList.remove('b-loading');
    }

    toast(message) {
        this.resultContainer.dataset.error = message;
        setTimeout(() => this.resultContainer.dataset.error, 1500);
    }

    async loadCode(url) {
        const
            me = this;

        try {
            const
                response = await fetch(url),
                code     = await response.text();

            me.code = code;
        }
        catch (e) {
            console.error(e);
        }
    }

    setProgress(lineIndex) {
        // Ensure line numbers are in sync with code typing
        this.lineNumberContainer.children[lineIndex].classList.add('b-line-visible');

        // Update line counter in toolbar
        this.progressElement.innerHTML = `${lineIndex + 1} / ${this.lineCount}`;
    }

    // Find all imports in the code, extracting their filename to populate combo with
    extractImports(code) {
        const
            regex   = /'\.\/(.*)';/g,
            imports = [];

        let result;

        while ((result = regex.exec(code)) !== null) {
            imports.push(result[1]);
        }

        return imports;
    }

    get isTyping() {
        return this.typer.typing;
    }

    get isFinished() {
        return !this.isTyping && this.typer.currentLineIndex === this.lineCount;
    }

    get code() {
        return this.codeElement.innerText;
    }

    set code(code) {
        const me = this;

        if (!me.codeElement) {
            // Not yet setup
            return;
        }

        me.lineElements = me.highlightCode(code);

        me.lineElements.forEach(lineEl => me.codeElement.appendChild(lineEl));

        // Render line numbers + any checkboxes for hints
        me.lineNumberContainer.innerHTML = me.lineElements.map(line => {
            return `<div class="b-line ${line.dataset.isHint ? 'hint' : ''}"> ${line.dataset.isHint ? '<input type="checkbox"/>' : ''}</div>`;
        }).join('');

        me.lineCount = me.lineElements.length;
        me.setProgress(0);
    }


    onFullScreenClick() {
        const element = this.element;

        if (!document.fullscreenElement) {
            element.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    }
}

// A minimal web component tag class
class TutorialPanelTag extends HTMLElement {
    connectedCallback() {
        this.setup();
    }

    async setup() {
        const me = this;

        // Setup just once
        if (me.shadowRoot) {
            return;
        }

        const
            shadowRoot = me.attachShadow({ mode : 'open' }),
            config     = {
                appendTo : shadowRoot,
                features : {}
            };

        if (me.dataset.lazyLoadResources) {
            const
                triggerEl = document.querySelector(me.dataset.lazyLoadResources),
                isHovered = triggerEl?.matches(':hover');

            if (isHovered) {
                me.onHoverContainer();
            }
            else {
                triggerEl?.addEventListener('mousemove', me.onHoverContainer.bind(me), { once : true });
            }
        }
        else {
            await me.loadResources();
        }

        me.convertDatasetToConfigs(me.dataset, config);

        me.widget = me.createInstance(config);
    }

    async onHoverContainer() {
        await this.loadResources();

        if (this.url) {
            await this.loadCode(this.url);
        }

        this.start();
    }

    async loadResources() {
        let linkResolver, codeFontLinkResolver, font;

        this.loadingResources = true;

        const
            me         = this,
            // Only load font awesome if not already on page, otherwise each instance will load it
            faPath     = (!isChrome || !document.fonts.check(`normal 14px "Font Awesome 6 Free"`)) && me.getAttribute('fa-path'),
            stylesheet = me.getAttribute('stylesheet'),
            // Go over to the dark side
            shadowRoot = me.shadowRoot,
            // Include css and target div in shadow dom
            link       = Object.assign(document.createElement('link'), {
                tag  : 'link',
                rel  : 'stylesheet',
                href : stylesheet
            }),
            codeFontLink       = Object.assign(document.createElement('link'), {
                tag  : 'link',
                rel  : 'stylesheet',
                href : 'https://fonts.googleapis.com/css2?family=Source+Code+Pro:wght@400&display=swap'
            }),
            promises   = [
                new Promise(resolve => {
                    linkResolver = resolve;
                }),
                new Promise(resolve => {
                    codeFontLinkResolver = resolve;
                }),
            ];

        if (me.dataset.inlineCss) {
            const inlineSheet     = document.createElement('style');
            inlineSheet.innerText = me.dataset.inlineCss;
            me.shadowRoot.appendChild(inlineSheet);
        }

        me.shadowRoot.appendChild(link);
        document.head.appendChild(codeFontLink);

        link.onload = () => linkResolver();

        codeFontLink.onload = () => codeFontLinkResolver();

        // Load FontAwesome if path was supplied
        if (faPath) {
            // FF cannot use the name "Font Awesome 6 Free", have if fixed in CSS to handle it also without spaces
            font = new FontFace(isFF ? 'FontAwesome6Free' : 'Font Awesome 6 Free', `url("${faPath}/fa-solid-900.woff2")`);
            promises.push(font.load());
        }

        await Promise.all(promises);

        if (font) {
            document.fonts.add(font);
        }
    }

    convertDatasetToConfigs(dataset, config = {}) {
        for (const key in dataset) {
            let value = dataset[key];

            try {
                value = JSON.parse(value);
            }
            catch (e) {

            }

            config[key] = value;
        }

        return config;
    }

    createInstance(config) {
        // Load the stylesheet used to style the tutorial panel
        this.internalStyleSheet = Object.assign(document.createElement('link'), {
            tag  : 'link',
            rel  : 'stylesheet',
            href : this.dataset.resourceRoot + '/tutorialpanel.css'
        });

        this.shadowRoot.appendChild(this.internalStyleSheet);

        if (config.keystrokeInterval) {
            config.keystrokeInterval = parseInt(config.keystrokeInterval, 10);
        }

        if (config.intervalRandomness) {
            config.intervalRandomness = parseInt(config.intervalRandomness, 10);
        }

        return new TutorialPanel(config);
    }

    async start() {
        if (this.widget) {
            this.widget.start();
        }
        else {
            // widget not yet created
            this.dataset.autoStart = true;
        }
    }

    get code() {
        return this.shadowRoot.querySelector('code').innerText;
    }
}

window.customElements.define('tutorial-panel', TutorialPanelTag);
