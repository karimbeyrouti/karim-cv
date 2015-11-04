import { SVGGradientBase } from "./../core/SVGGradientBase";
export class SVGRadialGradient extends SVGGradientBase {
    //---------------------------------------------------------------------------------------------------------
    constructor() {
        super();
        this.initElement('svg:radialGradient');
    }
    //---------------------------------------------------------------------------------------------------------
    /**
     *
     * @param val
     */
    set cx(val) {
        this.element.setAttribute('cx', String(val));
    }
    get cx() {
        return this.element.getAttribute('cx');
    }
    /**
     *
     * @param val
     */
    set cy(val) {
        this.element.setAttribute('cy', String(val));
    }
    get cy() {
        return this.element.getAttribute('cy');
    }
    /**
     *
     * @param val
     */
    set fx(val) {
        this.element.setAttribute('fx', String(val));
    }
    get fx() {
        return this.element.getAttribute('fx');
    }
    /**
     *
     * @param val
     */
    set fy(val) {
        this.element.setAttribute('fy', String(val));
    }
    get fy() {
        return this.element.getAttribute('fy');
    }
    /**
     *
     * @param val
     */
    set r(val) {
        this.element.setAttribute('r', String(val));
    }
    get r() {
        return this.element.getAttribute('r');
    }
}
