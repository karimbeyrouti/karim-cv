import { Point } from "../../geom/Point";
import { SVGObjectBase } from "./SVGObjectBase";
export class SVGDisplayObjectBase extends SVGObjectBase {
    //---------------------------------------------------------------------------------------------------------
    constructor() {
        super();
        this.children = new Array();
        this.registration = new Point();
        //---------------------------------------------------------------------------------------------------------
        this._column = 0;
        this._row = 0;
        this._rotation = 0;
        this._scaleX = 1;
        this._scaleY = 1;
    }
    //---------------------------------------------------------------------------------------------------------
    /**
     *
     */
    updateTransform() {
        //this.element.setAttribute( "transform" , "translate(" + this._x + "," + this._y + ")" + " rotate(" + this._rotation + "," + this.registration.x + ", " + this.registration.y + ")" );
        this.element.setAttribute("transform", "translate(" + this._column + "," + this._row + ")" + " rotate(" + this._rotation + "," + this.registration.x + ", " + this.registration.y + ")" + " scale(" + this._scaleX + "," + this._scaleY + ")");
    }
    /**
     *
     */
    draw() {
    }
    /**
     *
     * @param colour
     */
    fill(colour) {
        if (this.element) {
            this.element.setAttribute('fill', colour);
        }
    }
    /**
     *
     */
    remove() {
        if (this.element.parentNode) {
            var n;
            var l = this.parentSVGObject.children.length;
            for (var c = 0; c < l; c++) {
                n = this.parentSVGObject.children[c];
                if (n == this) {
                    this.parentSVGObject.children.splice(c, 1);
                }
            }
            this.parentSVGObject = null;
            this.element.parentNode.removeChild(this.element);
        }
    }
    /**
     *
     * @param obj
     * @returns {boolean}
     */
    isChild(obj) {
        var l = this.children.length;
        var o;
        for (var c = 0; c < l; c++) {
            o = this.children[c];
            if (o === obj) {
                return true;
            }
        }
        return false;
    }
    //---------------------------------------------------------------------------------------------------------
    /**
     *
     * @param val
     */
    set color(val) {
        this.fill(val);
    }
    get color() {
        return this.element.getAttribute('fill');
    }
    /**
     *
     * @param colour
     */
    set gradient(grad) {
        if (this.element) {
            this.fill('url(#' + grad.id + ')');
        }
    }
    /**
     *
     * @returns {number}
     */
    get parentNode() {
        return this.element.parentNode;
    }
    /**
     *
     */
    get fillOpacity() {
        return parseFloat(this.element.getAttribute('fill-opacity'));
    }
    set fillOpacity(val) {
        this.element.setAttribute('fill-opacity', String(val));
    }
    /**
     *
     */
    get strokeOpacity() {
        return parseFloat(this.element.getAttribute('stroke-opacity'));
    }
    set strokeOpacity(val) {
        this.element.setAttribute('stroke-opacity', String(val));
    }
    /**
     *
     * @param val
     */
    set stroke(val) {
        this.element.setAttribute('stroke', String(val));
    }
    get stroke() {
        return this.element.getAttribute('stroke');
    }
    /**
     *
     * @param val
     */
    set strokewidth(val) {
        this.element.setAttribute('stroke-width', String(val));
    }
    get strokewidth() {
        return parseFloat(this.element.getAttribute('stroke-width'));
    }
    /**
     *
     * @param val
     */
    set x(val) {
        this._column = val;
        this.updateTransform();
    }
    get x() {
        return this._column;
    }
    /**
     *
     * @param val
     */
    set y(val) {
        this._row = val;
        this.updateTransform();
    }
    get y() {
        return this._row;
    }
    /**
     *
     * @param val
     */
    set scaleX(val) {
        this._scaleX = val;
        this.updateTransform();
    }
    get scaleX() {
        return this._scaleX;
    }
    /**
     *
     * @param val
     */
    set scaleY(val) {
        this._scaleY = val;
        this.updateTransform();
    }
    get scaleY() {
        return this._scaleY;
    }
    /**
     *
     * @param val
     */
    set rotation(val) {
        this._rotation = val;
        this.updateTransform();
    }
    get rotation() {
        return this._rotation;
    }
    /**
     *
     * @returns {number}
     */
    get width() {
        return this.element.getBoundingClientRect().width;
    }
    get height() {
        return this.element.getBoundingClientRect().height;
    }
    /**
     *
     * @param filter
     */
    set filter(filter) {
        if (this.element) {
            this.element.setAttribute('filter', 'url(#' + filter.id + ')');
        }
    }
}
