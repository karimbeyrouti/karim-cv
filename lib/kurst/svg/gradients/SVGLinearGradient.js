import { SVGGradientBase } from "./../core/SVGGradientBase";
export class SVGLinearGradient extends SVGGradientBase {
    //---------------------------------------------------------------------------------------------------------
    constructor() {
        super();
        this.initElement('svg:linearGradient');
    }
    //---------------------------------------------------------------------------------------------------------
    /**
     *
     * @param val
     */
    set x1(val) {
        this.element.setAttribute('x1', String(val));
    }
    get x1() {
        return this.element.getAttribute('x1');
    }
    /**
     *
     * @param val
     */
    set y1(val) {
        this.element.setAttribute('y1', String(val));
    }
    get y1() {
        return this.element.getAttribute('y1');
    }
    /**
     *
     * @param val
     */
    set x2(val) {
        this.element.setAttribute('x2', String(val));
    }
    get x2() {
        return this.element.getAttribute('x2');
    }
    /**
     *
     * @param val
     */
    set y2(val) {
        this.element.setAttribute('y2', String(val));
    }
    get y2() {
        return this.element.getAttribute('y2');
    }
}
