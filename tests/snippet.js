import Grid from '../../../Grid/lib/Grid/view/Grid.js';

const grid = new Grid({
    appendTo : targetElement,
    height   : '100%',
    flex     : 1,
    // Define the columns to show in the grid (you can add / remove programmatically too)
    columns  : [
        {
            text  : 'Food',
            // Point to a field in the data model
            field : 'food',
            flex  : 1
        }
    ]
});
/// grid.store.data = [{ food : 'Pizza' }, { food : 'Salad' }, { food : 'Burger' }];
