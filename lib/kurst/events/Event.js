export class Event {
    constructor(type) {
        /**
         * Type of event
         * @property type
         * @type String
         */
        this.type = undefined;
        /**
         * Reference to target object
         * @property target
         * @type Object
         */
        this.target = undefined;
        this.type = type;
    }
    clone() {
        return new Event(this.type);
    }
}
Event.COMPLETE = 'complete';
Event.OPEN = 'open';
Event.ENTER_FRAME = 'enterFrame';
Event.EXIT_FRAME = 'exitFrame';
Event.RESIZE = "resize";
Event.ERROR = "error";
Event.CHANGE = "change";
