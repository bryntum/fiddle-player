export default class Typer {

    constructor(config) {
        Object.assign(this, config);

        this.treeWalker = document.createTreeWalker(this.codeElement, NodeFilter.SHOW_ALL, null, false);
        this.currentLineIndex = 0;
        this.typing = false;
    }

    async start() {
        const
            me    = this,
            lines = me.lines = Array.from(me.codeElement.children);

        let resume = me.currentLineIndex > 0;

        me.onStart?.();
        me.codeElement.classList.add('b-started');
        me.typing = true;

        for (let i = me.currentLineIndex; i < lines.length; i++) {
            const line = lines[i];

            if (line.dataset.done) {
                continue;
            }

            me.currentLineIndex = i;

            if (!me.typing) {
                return;
            }

            await me.onBeforeLineCallback?.(i, line);

            if (line.dataset.pauseBefore) {
                await me.wait(parseInt(line.dataset.pauseBefore, 10) * 1000);
            }

            // User could stop playback during any async flow
            if (!me.typing) {
                return;
            }

            // Are we resuming a paused playback?
            if (resume) {
                resume = false;
            }
            else {
                // If not, point treewalker to line node
                me.treeWalker.currentNode = line;
            }

            await me.processLine(line);

            // User could stop playback during any async flow
            if (!me.typing) {
                return;
            }

            await me.onAfterLineCallback?.(i, line);

            if (line.dataset.pauseAfter) {
                await me.wait(parseInt(line.dataset.pauseAfter, 10) * 1000);
            }

            // User could stop playback during any async flow
            if (!me.typing) {
                return;
            }

            if (line.dataset.goto) {
                const next = parseInt(line.dataset.goto, 10);
                lines[next - 1].dataset.goto = i + 1;
                // Jump to index is 1-based, do -2 since for-header iterates to next
                i = next - 2;
            }
            line.dataset.done = 1;
        }

        me.currentLineIndex++;

        me.stop();
    }

    async processLine(line) {
        const
            me          = this,
            trimmedLine = line.textContent.trim(),
            treeWalker  = me.treeWalker;

        me.codeElement.querySelector('.b-current-line')?.classList.remove('b-current-line');

        line.classList.add('b-line-visible', 'b-current-line');

        for (let node = treeWalker.currentNode; node && line.contains(node); node = treeWalker.nextNode()) {
            if (!me.typing) {
                return;
            }

            if (node.matches?.('.whitespace')) {
                node.style.display = 'inline-block';
                node               = treeWalker.nextNode();
                this.currentNode = node.parentElement;
                continue;
            }

            const nodeText = node._textContent || node.textContent;

            if (node.nodeType === Element.TEXT_NODE || nodeText === '') {
                const
                    isMetaNode = nodeText.includes('//$');

                if (isMetaNode) {
                    node.textContent = nodeText.substr(0, node.textContent.indexOf('//$'));
                }

                await me.typeChars(node);

                if (!me.typing) {
                    return;
                }

                if (isMetaNode) {
                    await me.onMetaNodeCallback?.(trimmedLine);

                    const number = nodeText.match(/\$(\d*)/);

                    if (number) {
                        const seconds = parseInt(number[1], 10);

                        await me.wait(seconds * 1000);
                    }

                    // If this was a pure meta-row, hide
                    if (nodeText.split('//')[0].trim().length === 0) {
                        line.style.display = 'none';
                    }
                }
            }
        }
    }

    stop() {
        this.onStop?.();
        this.typing = false;
    }

    async typeChars(textNode) {
        let text = textNode.textContent;
        let startPosition = 0;

        if (textNode._textContent) {
            // Resuming play mid-string
            startPosition = text.length + 1;
            text = textNode._textContent;
        }
        else {
            textNode.textContent = '';
            textNode._textContent = text;
        }

        if (textNode.nodeType === Element.TEXT_NODE) {
            this.currentNode = textNode.parentElement;
        }
        else {
            // empty span (=== empty row)
            this.currentNode = textNode;
        }

        if (!textNode.parentElement.matches('.b-line')) {
            textNode.parentElement.style.display = 'inline';
        }

        for (let i = startPosition; i <= text.length; i++) {
            if (textNode.parentElement.offsetLeft + textNode.parentElement.offsetWidth > this.codeElement.offsetWidth - 40) {
                this.codeElement.parentElement.scrollLeft += 10;
            }
            textNode.textContent = text.substr(0, i);
            await this.waitBeforeKeyStroke();

            if (!this.typing) {
                return;
            }
        }
        textNode._textContent = null;
    }

    get typing() {
        return this._typing;
    }

    set typing(value) {
        this.codeElement.classList.toggle('b-idle', !value);
        if (!value) {
            this.currentNode = null;
        }

        this._typing = value;
    }

    get currentNode() {
        return this._currentNode;
    }

    set currentNode(node){
        this.codeElement.querySelector('.b-current')?.classList.remove('b-current');
        node?.classList.add('b-current');
    }

    waitBeforeKeyStroke() {
        const ms = this.keystrokeInterval * this.intervalRandomness * Math.random();

        return this.wait(ms);
    }

    wait(ms) {
        return new Promise(resolve => {
            if (ms > 1000) {
                this.codeElement.classList.add('b-idle');
            }

            setTimeout(() => {
                this.codeElement.classList.remove('b-idle');
                resolve();
            }, ms);
        });
    }

    get currentLine() {
        return this.lines[this.currentLineIndex];
    }
};
