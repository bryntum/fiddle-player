import Gantt from '../../bryntum-suite/Gantt/lib/Gantt/view/Gantt.js';

const gantt = new Gantt({
    appendTo     : targetElement,//->25
    columns      : [
        { type : 'name', width : 250 }
    ],
    viewPreset   : 'year',
    tickSize : 30,
    tasks        : [{//->20
        id        : 1,
        name      : `Go to Mars`,
        expanded  : true,
        startDate : '2030-01-01',
        children  : [//->19
            { id : 2, name : 'Astronaut academy', percentDone : 85, duration : 90, iconCls : 'b-fa b-fa-user-graduate' },//->21
            { id : 3, name : 'Buy space suit', percentDone : 50, duration : 30, iconCls : 'b-fa b-fa-user-astronaut' },
            { id : 4, name : 'Wait for Elon´s call', duration : 0, iconCls : 'b-fa b-fa-phone' }
        ]
    }],
    dependencies : [
        { from : 2, to : 3 },
        { from : 3, to : 4, lag : 5 }
    ]
});
