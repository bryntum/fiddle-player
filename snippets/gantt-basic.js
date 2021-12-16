import Gantt from '../../bryntum-suite/Gantt/lib/Gantt/view/Gantt.js';

const gantt = new Gantt({
    appendTo     : targetElement,//->25
    viewPreset   : 'year',
    columns      : [
        { type : 'name', width : 250 }
    ],
    tasks        : [{
        id        : 1,
        name      : 'Go to Mars',
        iconCls   : 'b-icon b-fa-space-shuttle',
        expanded  : true,
        startDate : '2030-01-01',//->20
        children  : [//->19
            { id : 2, name : 'Enter austronaut academy', percentDone : 85, duration : 90, iconCls : 'b-icon b-fa-user-graduate' },
            { id : 3, name : 'Buy space suit', percentDone : 50, duration : 30, iconCls : 'b-icon b-fa-user-astronaut' },
            { id : 4, name : 'Wait for Elon to call', duration : 100, iconCls : 'b-icon b-fa-phone' }
        ]
    }],
    dependencies : [
        { from : 2, to : 3 },
        { from : 3, to : 4 }
    ]
});//->5
