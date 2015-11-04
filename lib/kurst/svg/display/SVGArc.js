import { SVGPath } from "./SVGPath";
import { Point } from "../../geom/Point";
/**
 * Notes:
 *
 *  http://stackoverflow.com/questions/5737975/circle-drawing-with-svgs-arc-path
 *  http://stackoverflow.com/questions/5736398/how-to-calculate-the-svg-path-for-an-arc-of-a-circle
 *
 */
export class SVGArc extends SVGPath {
    //---------------------------------------------------------------------------------------------------------
    constructor() {
        super();
        //---------------------------------------------------------------------------------------------------------
        this.startPoint = new Point();
        this.endPoint = new Point();
        this._radius = 10;
        this.arcSweep = 0;
        this._startAngle = 0;
        this._endAngle = 359.99;
        this.fillOpacity = 0;
        this.stroke = '#000000';
        this.strokewidth = 10;
        this.drawOnCommand = false;
        this.addDrawCommand(SVGPath.moveto, this.startPoint.x, this.startPoint.y);
        this.drawOnCommand = true;
        this.addDrawCommand(SVGPath.arc, this._radius, this._radius, 0, this.arcSweep, 0, this.endPoint.x, this.endPoint.y);
    }
    //---------------------------------------------------------------------------------------------------------
    /**
     *
     * @param centerX
     * @param centerY
     * @param radius
     * @param angleInDegrees
     * @param point
     * @returns {Point}
     */
    polarToCartesian(centerX, centerY, radius, angleInDegrees, point) {
        var angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
        if (point) {
            point.x = centerX + (radius * Math.cos(angleInRadians));
            point.y = centerY + (radius * Math.sin(angleInRadians));
            return point;
        }
        return new Point(centerX + (radius * Math.cos(angleInRadians)), centerY + (radius * Math.sin(angleInRadians)));
    }
    /**
     *
     * @param x
     * @param y
     * @param radius
     * @param startAngle
     * @param endAngle
     */
    updateArc(x, y, radius, startAngle, endAngle) {
        this.polarToCartesian(x, y, radius, endAngle, this.startPoint);
        this.polarToCartesian(x, y, radius, startAngle, this.endPoint);
        this.arcSweep = endAngle - startAngle <= 180 ? 0 : 1;
        this.commands[0].params[0] = this.startPoint.x;
        this.commands[0].params[1] = this.startPoint.y;
        this.commands[1].params[0] = radius;
        this.commands[1].params[1] = radius;
        this.commands[1].params[2] = 0;
        this.commands[1].params[3] = this.arcSweep;
        this.commands[1].params[4] = 0;
        this.commands[1].params[5] = this.endPoint.x;
        this.commands[1].params[6] = this.endPoint.y;
    }
    /**
     *
     */
    draw() {
        this.updateArc(this.x, this.y, this._radius, this.startAngle, this.endAngle);
        super.draw();
    }
    /**
     *
     */
    updateTransform() {
        this.draw();
        this.element.setAttribute("transform", "rotate(" + this.rotation + "," + (this.x + this.registration.x) + ", " + (this.y + this.registration.y) + ")");
    }
    /**
     *
     * @param val
     */
    set startAngle(val) {
        this._startAngle = val;
        this.draw();
    }
    get startAngle() {
        return this._startAngle;
    }
    /**
     *
     * @param val
     */
    set endAngle(val) {
        this._endAngle = val;
        this.draw();
    }
    get endAngle() {
        return this._endAngle;
    }
    /**
     *
     * @param val
     */
    set radius(val) {
        this._radius = val;
        this.draw();
    }
    get radius() {
        return this._radius;
    }
}
