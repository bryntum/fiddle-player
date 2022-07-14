import { Gantt } from 'https://bryntum.com/dist/gantt/build/gantt.module.js';

const gantt = new Gantt({
    appendTo     : targetElement,//->26
    viewPreset   : 'year',
    forceFit     : true,
    columns      : [
        { type : 'name', width : 250 }
    ],
    tasks        : [{
        id        : 1,
        name      : 'Go to Mars',
        iconCls   : 'b-fa b-fa-space-shuttle',
        expanded  : true,
        startDate : '2030-01-01',
        children  : [//->20
            { id : 2, name : 'Astronaut academy', percentDone : 85, duration : 90, iconCls : 'b-fa b-fa-user-graduate' },//->21
            { id : 3, name : 'Buy space suit', percentDone : 50, duration : 30, iconCls : 'b-fa b-fa-user-astronaut' },
            { id : 4, name : 'Wait for Elon´s call', duration : 100, iconCls : 'b-fa b-fa-phone' }
        ]
    }],
    dependencies : [
        { from : 2, to : 3 },
        { from : 3, to : 4 }
    ]
});
