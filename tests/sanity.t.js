import '../lib/TutorialPanel.js';

StartTest(t => {
    let panelElement,
        panel;

    t.beforeEach(async() => {
        t.setWindowSize(1024, 768);

        panelElement?.remove();

        document.body.innerHTML = '<tutorial-panel data-keystroke-interval="1" style="display:flex;width:100%;height:100%" id="grid-basic" data-resource-root="../resources" stylesheet="../../../Grid/build/grid.classic-dark.css" fa-path="../../../Core/build/fonts" data-url="snippet.js"></tutorial-panel>';

        panelElement = document.body.firstElementChild;

        await t.waitFor(() => panelElement?.widget?.lineCount);
        panel = panelElement.widget;
    });

    t.it('Should render a sane initial state', async t => {
        await t.waitForSelector('tutorial-panel -> .b-tutorialpanel');
        await t.waitForSelector('tutorial-panel -> .b-tutorialpanel code.b-idle');
        await t.waitForSelector('tutorial-panel -> .b-codepanel-result:empty');
        await t.waitForSelector('tutorial-panel -> .b-line-visible');
        t.selectorCountIs('tutorial-panel -> .b-line-numbers .b-line-visible', 1, 'Only first line visible');
    });

    t.iit('Should Resize in splitter drag', async t => {
        await t.waitForSelector('tutorial-panel -> .b-tutorialpanel .code-wrap');
        await t.waitForSelector('tutorial-panel -> .b-tutorialpanel .b-codepanel-result');

        const
            codeWrap = t.query('tutorial-panel -> .b-tutorialpanel .code-wrap')[0],
            splitter = t.query('tutorial-panel -> .b-tutorialpanel .b-codepanel-splitter')[0],
            resultPanel = t.query('tutorial-panel -> .b-tutorialpanel .b-codepanel-result')[0];

        const
            codeWrapWidth = codeWrap.getBoundingClientRect().width,
            resultPanelWidth = resultPanel.getBoundingClientRect().width;

        await t.dragBy(splitter, [50, 0]);

        t.is(codeWrap.getBoundingClientRect().width, codeWrapWidth + 50);
        t.is(resultPanel.getBoundingClientRect().width, resultPanelWidth - 50);
    });

    t.it('Should play to finish', async t => {
        await t.click('tutorial-panel -> .b-tutorialpanel .b-fa-play');
        await t.waitForSelector('tutorial-panel -> .b-tutorialpanel.b-typing code.b-started');
        t.selectorNotExists('tutorial-panel -> .b-tutorialpanel code.b-idle');

        await t.waitForSelector('tutorial-panel -> .b-tutorialpanel:not(.b-typing)');
        await t.waitForSelector('tutorial-panel -> .b-codepanel-result .b-grid');

        t.selectorCountIs('tutorial-panel -> .b-codepanel-result .b-grid', 1, 'One grid produced');
    });

    t.it('Should restart after clicking play when finished', async t => {
        for (let i = 0; i < 2; i++) {
            await t.click('tutorial-panel -> .b-tutorialpanel .b-fa-play');
            await t.waitForSelector('tutorial-panel -> .b-tutorialpanel.b-typing code.b-started');
            t.selectorNotExists('tutorial-panel -> .b-tutorialpanel code.b-idle');
            await t.waitForSelector('tutorial-panel -> .b-codepanel-result .b-grid');
            t.selectorCountIs('tutorial-panel -> .b-codepanel-result .b-grid', 1, 'One grid produced');
            t.selectorCountIs('tutorial-panel -> .b-codepanel-result .b-column', 0, 'No columns yet');

            await t.waitForSelector('tutorial-panel -> .b-tutorialpanel:not(.b-typing)');
            await t.waitForSelector('tutorial-panel -> .b-codepanel-result .b-grid');

            t.selectorCountIs('tutorial-panel -> .b-codepanel-result .b-grid', 1, 'One grid produced');
        }
    });

    t.it('Should toggle row commented when clicking checkbox', async t => {
        panel.start();

        await t.waitForSelectorNotFound('tutorial-panel -> .b-tutorialpanel.b-typing');
        await t.click('tutorial-panel -> input:checkbox');
        await t.waitForSelector('tutorial-panel -> .b-codepanel-result .b-grid-cell');

        await t.click('tutorial-panel -> input:checkbox');
        await t.waitForSelectorNotFound('tutorial-panel -> .b-codepanel-result .b-grid-cell');
    });

    t.it('Should show toast message when typing invalid syntax', async t => {
        await t.type('tutorial-panel -> code', 'const');

        await t.waitForSelector('tutorial-panel -> .b-tutorialpanel .b-codepanel-result[data-error]');
        t.elementIsVisible('tutorial-panel -> .b-tutorialpanel .b-fa-exclamation-triangle');

        await t.type('tutorial-panel -> code', ' foo = 1;');

        await t.waitForSelectorNotFound('tutorial-panel -> .b-tutorialpanel .b-codepanel-result[data-error]');
        t.elementIsNotVisible('tutorial-panel -> .b-tutorialpanel .b-fa-exclamation-triangle');
    });

    t.it('Should switch to flex-direction column for narrow screen', async t => {
        t.setWindowSize(500, 500);

        const panelElement = t.query('tutorial-panel -> .b-tutorialpanel')[0];
        t.elementIsNotVisible('tutorial-panel -> .b-line-numbers');

        t.is(getComputedStyle(panelElement).flexDirection, 'column');
    });

    t.it('Should switch to flex-direction column for narrow screen', async t => {
        t.setWindowSize(500, 500);

        const panelElement = t.query('tutorial-panel -> .b-tutorialpanel')[0];
        t.elementIsNotVisible('tutorial-panel -> .b-line-numbers');

        t.is(getComputedStyle(panelElement).flexDirection, 'column');
    });

    t.it('Should start when clicking pre element, if not already started', async t => {
        await t.click('tutorial-panel -> pre');
        await t.waitForSelector('tutorial-panel -> .b-tutorialpanel.b-typing');
    });
});
