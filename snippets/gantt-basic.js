import Gantt from '../../bryntum-suite/Gantt/lib/Gantt/view/Gantt.js';

const gantt = new Gantt({
    viewPreset   : 'year',
    appendTo     : targetElement,//->25
    columns      : [
        { type : 'name', width : 250 }
    ],
    tickSize : 30,
    tasks        : [{//->20
        id        : 1,
        name      : `Go to Mars`,
        startDate : '2030-03-01',
        expanded  : true,
        children  : [//->19
            { id : 2, name : 'Astronaut academy', percentDone : 50, duration : 300 },
            { id : 3, name : 'Make space suit', percentDone : 50, duration : 300},
            { id : 4, name : 'Wait for Elon´s call', duration : 0, eventColor : 'orange' }
        ],
    }],
    dependencies : [
        { from : 2, to : 3 },
        { from : 3, to : 4, lag : 30 }
    ]
});
