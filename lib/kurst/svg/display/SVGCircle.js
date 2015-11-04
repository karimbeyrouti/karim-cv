import { SVGDisplayObjectBase } from "./../core/SVGDisplayObjectBase";
export class SVGCircle extends SVGDisplayObjectBase {
    //---------------------------------------------------------------------------------------------------------
    constructor() {
        super();
        this.initElement('circle');
    }
    //---------------------------------------------------------------------------------------------------------
    /**
     *
     * @param val
     */
    set r(val) {
        this.element.setAttribute('r', String(val));
    }
    get r() {
        return parseFloat(this.element.getAttribute('r'));
    }
    /**
     *
     * @param val
     */
    set width(val) {
        this.element.setAttribute('width', String(val));
    }
    get width() {
        return this.element.getAttribute('width');
    }
    /**
     *
     * @param val
     */
    set height(val) {
        this.element.setAttribute('height', String(val));
    }
    get height() {
        return this.element.getAttribute('height');
    }
    /**
     *
     * @param val
     */
    set cy(val) {
        this.element.setAttribute('cy', String(val));
    }
    get cy() {
        return parseFloat(this.element.getAttribute('cy'));
    }
    /**
     *
     * @param val
     */
    set cx(val) {
        this.element.setAttribute('cx', String(val));
    }
    get cx() {
        return parseFloat(this.element.getAttribute('cx'));
    }
}
