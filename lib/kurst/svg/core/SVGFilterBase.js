import { SVGObjectBase } from "./SVGObjectBase";
export class SVGFilterBase extends SVGObjectBase {
    //---------------------------------------------------------------------------------------------------------
    constructor() {
        super();
        //---------------------------------------------------------------------------------------------------------
        this.filters = new Array();
        this.initElement('filter');
    }
    //---------------------------------------------------------------------------------------------------------
    /**
     *
     * @param SVGFilterPrimitive
     */
    appendFilter(SVGFilterPrimitive) {
        if (!this.containsFilter(SVGFilterPrimitive)) {
            this.filters.push(SVGFilterPrimitive);
            this.element.appendChild(SVGFilterPrimitive);
        }
    }
    /**
     *
     * @param SVGFilterPrimitive
     */
    containsFilter(SVGFilterPrimitive) {
        var l = this.filters.length;
        var o;
        for (var c = 0; c < l; c++) {
            o = this.filters[c];
            if (o === SVGFilterPrimitive) {
                return true;
            }
        }
        return false;
    }
    /**
     *
     * @param SVGFilterPrimitive
     */
    removeFilter(SVGFilterPrimitive) {
        if (this.containsFilter(SVGFilterPrimitive)) {
            this.element.removeChild(SVGFilterPrimitive);
            var n;
            var l = this.filters.length;
            for (var c = 0; c < l; c++) {
                n = this.filters[c];
                if (n == SVGFilterPrimitive) {
                    this.filters.splice(c, 1);
                }
            }
        }
    }
}
