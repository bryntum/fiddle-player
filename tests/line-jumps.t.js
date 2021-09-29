import '../lib/TutorialPanel.js';

StartTest(t => {
    let panelElement,
        panel;

    t.beforeEach(async() => {
        t.setWindowSize(1024, 768);

        panelElement?.remove();

        document.body.innerHTML = '<tutorial-panel data-keystroke-interval="1" style="display:flex;width:100%;height:100%" id="grid-basic" data-resource-root="../resources" stylesheet="../../../Grid/build/grid.classic-dark.css" fa-path="../../../Core/build/fonts" data-url="snippet-goto.js"></tutorial-panel>';

        panelElement = document.body.firstElementChild;

        await t.waitFor(() => panelElement?.widget?.lineCount);
        panel = panelElement.widget;
    });

    t.it('Should jump to lines correctly', async t => {
        const sequence = [];
        await t.click('tutorial-panel -> .b-tutorialpanel .b-fa-play');

        panel.onBeforeLineExecute = ({ index }) => sequence.push(index);

        await t.waitForSelector('tutorial-panel -> .b-tutorialpanel:not(.b-typing)');

        t.isDeeply(sequence, [1, 2, 3, 15, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 16, 17, 18]);
    });
});
