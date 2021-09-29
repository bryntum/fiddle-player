import Grid from '../../../Grid/lib/Grid/view/Grid.js';

const grid = new Grid({
    appendTo : targetElement, //->16
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
    ]//->17
});//->5
// Try uncommenting the line below to load data into the grid
/// grid.store.data = [{ food : 'Pizza' }, { food : 'Salad' }, { food : 'Burger' }];
