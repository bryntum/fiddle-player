import '../lib/TutorialPanel.js';

StartTest(t => {
    let panelElement,
        panel;

    t.beforeEach(async() => {
        t.setWindowSize(1024, 768);

        panelElement?.remove();

        document.body.innerHTML = `<tutorial-panel data-auto-start="true" data-keystroke-interval="1" style="display:flex;width:100%;height:100%" id="grid-basic" data-resource-root="../resources" stylesheet="../../bryntum-suite/Grid/build/grid.classic-dark.css" fa-path="../../bryntum-suite/Core/build/fonts" data-url="snippet-comment.js"></tutorial-panel>`;

        panelElement = document.body.firstElementChild;

        await t.waitFor(() => panelElement?.widget?.lineCount);
        panel = panelElement.widget;
    });

    t.it('Should process inline comments', async t => {
        await t.waitForSelector('tutorial-panel -> .b-tutorialpanel');
        await t.waitForSelector('tutorial-panel -> .b-tutorialpanel code.b-idle');
        await t.waitForSelector('tutorial-panel -> .b-codepanel-result:not(:empty)');
        await t.waitForSelector('tutorial-panel -> .b-line-visible');

        t.selectorExists('tutorial-panel -> .b-line:nth-child(9) .comment:textEquals(// Define the columns to show in the grid (you can add / remove programmatically too))', 'Solo inline comment OK');
        t.selectorExists('tutorial-panel -> .b-line:nth-child(19) .comment:textEquals(// End of line inline comment)', 'Inline comment after code OK');
    });

    t.it('Should process multiline comments', async t => {
        await t.waitForSelector('tutorial-panel -> .b-tutorialpanel');
        await t.waitForSelector('tutorial-panel -> .b-tutorialpanel code.b-idle');
        await t.waitForSelector('tutorial-panel -> .b-codepanel-result:not(:empty)');
        await t.waitForSelector('tutorial-panel -> .b-line-visible');

        t.selectorExists('tutorial-panel -> .b-line:nth-child(2) .block-comment:textEquals(/*)', 'Block comment starts OK');
        t.selectorExists('tutorial-panel -> .b-line:nth-child(3) .block-comment:nth-child(1):textEquals(*)', 'Min block comment OK');
        t.selectorExists('tutorial-panel -> .b-line:nth-child(3) .block-comment:nth-child(2):textEquals(bar)', 'Mid block comment OK');
        t.selectorExists('tutorial-panel -> .b-line:nth-child(4) .block-comment:nth-child(1):textEquals(*)', 'End block comment OK');
        t.selectorExists('tutorial-panel -> .b-line:nth-child(4) .block-comment:nth-child(2):textEquals(*/)', 'End block comment OK');

        t.selectorExists('tutorial-panel -> .b-line:nth-child(5) .block-comment-start:nth-child(1):textEquals(/*foo)', 'Inline block comment start OK');
        t.selectorExists('tutorial-panel -> .b-line:nth-child(5) .block-comment-end:nth-child(2):textEquals(*/)', 'Inline block comment end OK');
        t.selectorExists('tutorial-panel -> .b-line:nth-child(5) span.keyword:nth-child(3):textEquals(const)', 'Keyword after inline block comment OK');

        t.selectorExists('tutorial-panel -> .b-line:nth-child(13) .block-comment-start:textEquals(/*foo)', 'Inline block comment OK');

        t.selectorExists('tutorial-panel -> .b-line:nth-child(13) .block-comment-start:textEquals(/*foo)', 'Inline block comment OK');
        t.selectorExists('tutorial-panel -> .b-line:nth-child(13) .block-comment-end:textEquals(*/)', 'Inline block comment OK');

        t.selectorExists('tutorial-panel -> .b-line:nth-child(18) .block-comment-end:textEquals(foo*/)', 'Inline block comment OK');
    });
});
