import Grid from '../../lib/Grid/view/Grid.js';
import DataGenerator from '../../lib/Core/helper/util/DataGenerator.js';

const grid = new Grid({
    appendTo : 'b-codepanel-result',
    height   : '100%',
    flex     : 1,
    columns  : [
        {
            text   : 'Name',
            // Point to the field in the data model that we want to be rendered into cells in this column
            field  : 'name',
            flex   : 2,
            editor : {
                type     : 'textfield',
                required : true
            }
        },
        {
            text  : 'Food',
            field : 'food',
            flex  : 1
        }
    ]
});
// $0

// Click checkbox and load some dummy data into the grid's Store
/// grid.store.data = DataGenerator.generateData(50);
// $5

// Now add a new record programmatically - it is super easy!
/// grid.store.add({ name : 'New row', food : 'Pizza' });

// Wait, where did it go? Scroll it into view too
/// grid.scrollRowIntoView(grid.store.last, { highlight : true });
