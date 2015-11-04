import { SVGDisplayObjectBase } from "./../core/SVGDisplayObjectBase";
export class SVGCanvas extends SVGDisplayObjectBase {
    //---------------------------------------------------------------------------------------------------------
    constructor(container) {
        super();
        this.initElement('svg');
        this.container = container;
        this.svg = this.element;
        this.defs = this.createSVGElement('svg:defs');
        this.container.appendChild(this.svg);
        this.svg.appendChild(this.defs);
    }
    //---------------------------------------------------------------------------------------------------------
    /**
     *
     */
    get alpha() {
        return parseFloat(this.svg.getAttribute('fill-opacity'));
    }
    set alpha(val) {
        this.svg.setAttribute('fill-opacity', String(val));
    }
    /**
     *
     * @param d3Object
     */
    append(obj) {
        if (!this.isChild(obj)) {
            this.children.push(obj);
            obj.parentSVGObject = this;
            this.svg.appendChild(obj.element);
        }
        else {
            this.element.appendChild(obj.element); // move to front
        }
    }
    /**
     *
     * @param d3Object
     */
    appendDef(obj) {
        this.defs.appendChild(obj.element);
    }
    /**
     *
     * @param val
     */
    set width(val) {
        this.svg.setAttribute('width', String(val));
    }
    get width() {
        return this.svg.getAttribute('width');
    }
    /**
     *
     * @param val
     */
    set height(val) {
        this.svg.setAttribute('height', String(val));
    }
    get height() {
        return this.svg.getAttribute('height');
    }
}
