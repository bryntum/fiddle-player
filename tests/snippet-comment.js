import Grid from '../../bryntum-suite/Grid/lib/Grid/view/Grid.js';
/*
* bar
* */
/*foo*/const grid = new Grid({
    appendTo : targetElement,
    height   : '100%',
    flex     : 1,
    // Define the columns to show in the grid (you can add / remove programmatically too)
    columns  : [
        {
            text  : 'Food',
            /*foo*/
            field : 'food',
            flex  : 1
        }
    ]            /*
    foo*/
}); // End of line inline comment
/// grid.store.data = [{ food : 'Pizza' }, { food : 'Salad' }, { food : 'Burger' }];
