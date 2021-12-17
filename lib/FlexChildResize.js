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
            vertical    = this.currentOrientation === 'column',
            { previousElementSibling, nextElementSibling } = this.element;

        if (!this.started) {
            previousElementSibling.style.flex = nextElementSibling.style.flex = 'none';
            this.started = true;
        }

        if (vertical) {
            const
                splitterSize = this.element.offsetHeight,
                cursorOffset = 100 * (event.clientY - this.flexParentRect.top) / this.flexParentRect.height;

            previousElementSibling.style.height = `calc(${cursorOffset}% - ${splitterSize}px)`;
            nextElementSibling.style.height = `calc(${100 - cursorOffset}% - ${splitterSize}px)`;
        }
        else {
            const
                splitterSize = this.element.offsetWidth,
                cursorOffset = 100 * (event.clientX - this.flexParentRect.left) / this.flexParentRect.width;

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
