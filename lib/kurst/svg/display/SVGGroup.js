import { SVGDisplayObjectBase } from "./../core/SVGDisplayObjectBase";
export class SVGGroup extends SVGDisplayObjectBase {
    //---------------------------------------------------------------------------------------------------------
    constructor() {
        super();
        this.initElement('g');
    }
    //---------------------------------------------------------------------------------------------------------
    /**
     *
     * @param d3Object
     */
    append(obj) {
        if (!this.isChild(obj)) {
            this.children.push(obj);
            obj.parentSVGObject = this;
            this.element.appendChild(obj.element);
        }
        else {
            this.element.appendChild(obj.element); // move to front
        }
    }
}
