import { Grid } from 'https://bryntum.com/dist/grid/build/grid.module.js';

const grid = new Grid({
    appendTo : targetElement, ///->17
    // ..2
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
///$2
// Try uncommenting the line below to load data into the grid
/// grid.store.data = [{ food : 'Pizza' }, { food : 'Salad' }, { food : 'Burger' }];
