import '../lib/TutorialPanel.js';

StartTest(t => {
    let panelElement,
        panel;

    t.beforeEach(async() => {
        t.setWindowSize(1024, 768);

        panelElement?.remove();

        document.body.innerHTML = '<tutorial-panel data-keystroke-interval="1" style="display:flex;width:100%;height:100%" id="grid-basic" data-resource-root="../resources" stylesheet="../../../Grid/build/grid.classic-dark.css" fa-path="../../../Core/build/fonts" data-url="snippet-waits.js"></tutorial-panel>';

        panelElement = document.body.firstElementChild;

        await t.waitFor(() => panelElement?.widget?.lineCount);
        panel = panelElement.widget;
    });

    t.it('Should wait correctly', async t => {
        await t.click('tutorial-panel -> .b-tutorialpanel .b-fa-play');

        await t.waitFor(() => panel.typer.currentLineIndex === 6);
        await t.waitFor(1000);

        t.is(panel.typer.currentLineIndex, 6, 'Still waiting');
        await t.waitForSelector('tutorial-panel -> .b-tutorialpanel:not(.b-typing)');
    });

});
