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
        await t.waitForSelector('tutorial-panel -> .b-codepanel-result:empty');
        await t.waitForSelector('tutorial-panel -> .b-line-visible');

        t.selectorExists('tutorial-panel -> .b-line:nth-child(7) .comment:textEquals(// Define the columns to show in the grid (you can add / remove programmatically too))', 'Solo inline comment OK');
        t.selectorExists('tutorial-panel -> .b-line:nth-child(17) .comment:textEquals(// End of line inline comment)', 'Inline comment after code OK');
    });

    t.iit('Should process multiline comments', async t => {
        await t.waitForSelector('tutorial-panel -> .b-tutorialpanel');
        await t.waitForSelector('tutorial-panel -> .b-tutorialpanel code.b-idle');
        await t.waitForSelector('tutorial-panel -> .b-codepanel-result:empty');
        await t.waitForSelector('tutorial-panel -> .b-line-visible');

        t.selectorExists('tutorial-panel -> .b-line:nth-child(7) .comment:textEquals(// Define the columns to show in the grid (you can add / remove programmatically too))', 'Solo inline comment OK');
        t.selectorExists('tutorial-panel -> .b-line:nth-child(17) .comment:textEquals(// End of line inline comment)', 'Inline comment after code OK');
    });
});
