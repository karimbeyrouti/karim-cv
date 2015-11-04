import { EventDispatcher } from "../../events/EventDispatcher";
export class SVGObjectBase extends EventDispatcher {
    //---------------------------------------------------------------------------------------------------------
    constructor() {
        super();
    }
    //---------------------------------------------------------------------------------------------------------
    /**
     * @param elementName
     */
    initElement(elementName) {
        this.element = this.createSVGElement(elementName);
    }
    /**
     * @param elementName
     * @returns {Selection}
     */
    createSVGElement(elementName) {
        return document.createElementNS('http://www.w3.org/2000/svg', elementName);
    }
    //---------------------------------------------------------------------------------------------------------
    /**
     *
     * @param val
     */
    set id(val) {
        this.element.setAttribute('id', val);
    }
    get id() {
        return this.element.getAttribute('id');
    }
}
