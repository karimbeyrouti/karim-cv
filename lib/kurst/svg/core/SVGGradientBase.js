import { SVGObjectBase } from "./SVGObjectBase";
import { SVGGradientStop } from "./../gradients/SVGGradientStop";
export class SVGGradientBase extends SVGObjectBase {
    //---------------------------------------------------------------------------------------------------------
    constructor() {
        super();
        //---------------------------------------------------------------------------------------------------------
        this.stops = new Array();
    }
    //---------------------------------------------------------------------------------------------------------
    /**
     *
     * @param stop
     */
    appendStop(stop) {
        this.element.appendChild(stop.element);
    }
    /**
     *
     * @param offset : String - "0%"
     * @param color : String - "#00ff00"
     * @param opacity : Number - ( 0 to 1 )
     */
    addStop(offset, color, opacity) {
        this.stops.push(new SVGGradientStop(this, offset, color, opacity));
        return this.stops[this.stops.length - 1];
    }
    //---------------------------------------------------------------------------------------------------------
    /**
     *
     * @returns {Array<SVGGradientStop>}
     */
    getStops() {
        return this.stops;
    }
    /**
     *
     * @param id
     * @returns {SVGGradientStop}
     */
    getStop(id) {
        if (id < this.stops.length) {
            return this.stops[id];
        }
    }
    /**
     *
     * @param val
     */
    set alpha(val) {
        for (var c = 0; c < this.stops.length; c++) {
            this.stops[c].alpha = val;
        }
    }
    /**
     *
     * @param val
     */
    set spreadMethod(val) {
        this.element.setAttribute('spreadMethod', String(val));
    }
    get spreadMethod() {
        return this.element.getAttribute('spreadMethod');
    }
}
