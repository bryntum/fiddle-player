# fiddle-player
A simple JS fiddle tool which simulates typing code into a CODE editor. As the code is typed, it is also evaluated
which makes it a great way to teach someone how to use the DOM or visualise the results of a UI library. 

# Meta commands
You can write a few different magic commands (prefixed by triple slash `///`) in the code to jump between lines, or pause at a certain line to let the user
read before continuing. `window.targetElement` points to the DOM result panel element where you can render any
HTML. 

Add a pause before continuing:
```
///$2 
```

Add a commented line with a checkbox for users to uncomment:
```
/// document.body.style="background:#000";
```

Full example:
```
import { Grid } from 'https://bryntum.com/dist/grid/build/grid.module.js';

const grid = new Grid({
    appendTo : targetElement,
    ///$2 (=== 2 second pause) 
    height   : '100%',
    flex     : 1,
    columns  : [
        {
            text  : 'Food',
            // Point to a field in the data model
            field : 'food',
            flex  : 1
        }
    ]
});
///$2 (=== 2 second pause) 
// The below line adds a checkbox for the user to easily uncomment the line
/// grid.store.data = [{ food : 'Pizza' }, { food : 'Salad' }, { food : 'Burger' }];
```

Use it to send code snippets to coworkers or in the API documentation for your JS library.

# Live demo 

[Click here](https://lmctfy.net/player) for a live demo.
