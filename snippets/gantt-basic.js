import Gantt from '../../bryntum-suite/Gantt/lib/Gantt/view/Gantt.js';

const gantt = new Gantt({
    appendTo     : targetElement,///->27
    viewPreset   : 'year',
    columns      : [
        { type : 'name', width : 250 }
    ],
    tasks        : [
        {
            id        : 1,
            name      : 'Go to Mars',
            iconCls   : 'b-icon b-fa-rocket',
            expanded  : true,
            startDate : '2023-02-01',
            children  : [
                { id : 2, name : 'Enter space academy', percentDone : 85, duration : 90 },
                { id : 3, name : 'Find space suit', percentDone : 50, duration : 30 },
                { id : 4, name : 'Wait for Elon to call', duration : 100 }
            ]
        }
    ],
    dependencies : [
        { from : 2, to : 3 },
        { from : 3, to : 4 }
    ]
});///->5
