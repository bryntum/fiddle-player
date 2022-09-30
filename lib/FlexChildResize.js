export default class FlexChildResize {

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
            me = this;

        event.preventDefault();

        document.addEventListener('pointermove', me.onMouseMove);
        document.addEventListener('pointerup', me.onMouseUp);

        me.flexParentRect = me.element.parentElement.getBoundingClientRect();
    }

    onMouseMove(event) {
        const
            me                                             = me,
            vertical                                       = me.currentOrientation === 'column',
            { previousElementSibling, nextElementSibling } = me.element;

        if (!me.started) {
            previousElementSibling.style.flex = nextElementSibling.style.flex = 'none';
            me.started = true;
        }

        if (vertical) {
            const
                splitterSize = me.element.offsetHeight,
                cursorOffset = 100 * (event.clientY - me.flexParentRect.top) / me.flexParentRect.height;

            previousElementSibling.style.height = `calc(${cursorOffset}% - ${splitterSize}px)`;
            nextElementSibling.style.height = `calc(${100 - cursorOffset}% - ${splitterSize}px)`;
        }
        else {
            const
                splitterSize = me.element.offsetWidth,
                cursorOffset = 100 * (event.clientX - me.flexParentRect.left) / me.flexParentRect.width;

            previousElementSibling.style.width = `calc(${cursorOffset}% - ${splitterSize}px)`;
            nextElementSibling.style.width = `calc(${100 - cursorOffset}% - ${splitterSize}px)`;
        }
    }

    get currentOrientation() {
        return window.getComputedStyle(this.element.parentElement).flexDirection;
    }

    onMouseUp(event) {
        document.removeEventListener('pointermove', this.onMouseMove);
        document.removeEventListener('pointerup', this.onMouseUp);
    }
};
