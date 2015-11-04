import { SVGObjectBase } from "./../core/SVGObjectBase";
export class SVGGradientStop extends SVGObjectBase {
    //---------------------------------------------------------------------------------------------------------
    constructor(gradient, offset, color, opacity) {
        super();
        this.initElement('svg:stop');
        if (gradient) {
            this.gradient_ref = gradient;
            this.gradient_ref.appendStop(this);
        }
        this.setData(offset, color, opacity);
    }
    //---------------------------------------------------------------------------------------------------------
    /**
     *
     * @param offset
     * @param color
     * @param opacity
     */
    setData(offset, color, opacity) {
        if (offset) {
            this.element.setAttribute('offset', offset);
        }
        if (color) {
            this.element.setAttribute('stop-color', color);
        }
        if (opacity) {
            this.element.setAttribute('stop-opacity', String(opacity));
        }
    }
    //---------------------------------------------------------------------------------------------------------
    /**
     *
     * @param val
     */
    set alpha(val) {
        this.element.setAttribute('stop-opacity', String(val));
    }
    get alpha() {
        return parseFloat(this.element.getAttribute('stop-opacity'));
    }
    /**
     *
     * @param val
     */
    set color(val) {
        this.element.setAttribute('stop-color', val);
    }
    get color() {
        return this.element.getAttribute('stop-color');
    }
    /**
     *
     * @param val
     */
    set offset(val) {
        this.element.setAttribute('offset', val);
    }
    get offset() {
        return this.element.getAttribute('offset');
    }
}
