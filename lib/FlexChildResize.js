export default class FlexChildResize {

    // The minimum size to shrink to
    minSize = 50;

    constructor(config) {
        const me = this;

        Object.assign(me, config);

        me.onMouseDown = me.onMouseDown.bind(me);
        me.onMouseMove = me.onMouseMove.bind(me);
        me.onMouseUp   = me.onMouseUp.bind(me);
        me.element.addEventListener('pointerdown', me.onMouseDown);
    }

    onMouseDown(event) {
        const
            me       = this,
            vertical = me.currentOrientation === 'column';

        event.preventDefault();

        me.startSize = me.element.previousElementSibling.getBoundingClientRect()[vertical ? 'height' : 'width'];
        me.startPosition = event[vertical ? 'clientY' : 'clientX'];

        document.addEventListener('pointermove', me.onMouseMove);
        document.addEventListener('pointerup', me.onMouseUp);

        me.flexParentRect = me.element.parentElement.getBoundingClientRect();
    }

    onMouseMove(event) {
        const
            me       = this,
            vertical = me.currentOrientation === 'column',
            {
                element
            }        = me,
            {
                previousElementSibling,
                nextElementSibling
            }        = element,
            delta    = event[vertical ? 'clientY' : 'clientX'] - me.startPosition,
            maxSize  = element.parentElement[vertical ? 'clientHeight' : 'clientWidth'] -
                element[vertical ? 'offsetHeight' : 'offsetWidth'] - me.minSize;

        previousElementSibling.style.flex = `0 0 ${Math.min(Math.max(me.minSize, me.startSize + delta), maxSize)}px`;
        nextElementSibling.style.flex = '1 1 0';
    }

    get currentOrientation() {
        return window.getComputedStyle(this.element.parentElement).flexDirection;
    }

    onMouseUp(event) {
        document.removeEventListener('pointermove', this.onMouseMove);
        document.removeEventListener('pointerup', this.onMouseUp);
    }
};
