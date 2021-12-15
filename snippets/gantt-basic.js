import Gantt from '../../bryntum-suite/Gantt/lib/Gantt/view/Gantt.js';
import ProjectModel from '../../bryntum-suite/Gantt/lib/Gantt/model/ProjectModel.js';

const project = new ProjectModel({
    transport : {
        load : {
            url : '../../bryntum-suite/Gantt/examples/_datasets/launch-saas.json'
        }
    }
});

new Gantt({
    appendTo : targetElement,

    project,

    dependencyIdField : 'sequenceNumber',

    columns : [
        { type : 'name', width : 250 }
    ],

    // Custom task content, display task name on child tasks
    taskRenderer({ taskRecord }) {
        if (taskRecord.isLeaf && !taskRecord.isMilestone) {
            return taskRecord.name;
        }
    }
});

project.load();
