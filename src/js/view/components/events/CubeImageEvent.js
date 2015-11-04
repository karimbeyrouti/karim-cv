import {Event} from "../../../../../lib/kurst/events/Event";

export class CubeImageEvent extends Event {
    constructor(type) {
        super(type);
        this.row = null;
        this.column = null;
    }
}
CubeImageEvent.ANIMATION_COMPLETE = "ANIMATION_COMPLETE";
CubeImageEvent.ROLL_OVER = "ROLL_OVER";
CubeImageEvent.ROLL_OUT = "ROLL_OUT";
CubeImageEvent.CLICK = "CLICK";

