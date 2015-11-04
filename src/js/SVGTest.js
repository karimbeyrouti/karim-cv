import { EventDispatcher } from "../../lib/kurst/events/EventDispatcher";
import { Event } from "../../lib/kurst/events/Event";
import { SVGCanvas } from "../../lib/kurst/svg/display/SVGCanvas";
import { SVGRectangle } from "../../lib/kurst/svg/display/SVGRectangle";
import { SVGCircle } from "../../lib/kurst/svg/display/SVGCircle";
import { SVGImage } from "../../lib/kurst/svg/display/SVGImage";
import { SVGPolygon } from "../../lib/kurst/svg/display/SVGPolygon";
import { SVGText } from "../../lib/kurst/svg/display/SVGText";
import { SVGGroup } from "../../lib/kurst/svg/display/SVGGroup";
import { SVGPath } from "../../lib/kurst/svg/display/SVGPath";
import { SVGArc } from "../../lib/kurst/svg/display/SVGArc";
import { Color } from "../../lib/kurst/geom/Color";
import { SVGBlurFilter } from "../../lib/kurst/svg/filters/SVGBlurFilter";
import { SVGLoader } from "../../lib/kurst/svg/loader/SVGLoader";
import { SVGDropShadowFilter } from "../../lib/kurst/svg/filters/SVGDropShadowFilter";
import { SVGLinearGradient } from "../../lib/kurst/svg/gradients/SVGLinearGradient";
import { SVGRadialGradient } from "../../lib/kurst/svg/gradients/SVGRadialGradient";
import { SVGGradientSpreadMethod } from "../../lib/kurst/svg/gradients/SVGGradientSpreadMethod";
import { RequestAnimationFrame } from "../../lib/kurst/utils/RequestAnimationFrame";

export class SVGTest extends EventDispatcher {
    //private stats       : STATSLIB.StatsView;
    //------------------------------------------------------------------------------------------------------------------------------
    constructor() {
        super();
        this.arcs = new Array();
        this.cntr = 0;

        // Request Animation
        this.raf = new RequestAnimationFrame(this.raframe, this);
        this.container = document.createElement('div');

        // Init mouse / resize handlers
        document.body.appendChild(this.container);
        document.addEventListener('mousedown', () => this.onMouseDown());
        window.addEventListener('resize', () => this.onResize());

        // SVG Canvas
        this.svg = new SVGCanvas(this.container);
        this.svg.width = 800;
        this.svg.height = 600;

        // SVG Loader
        this.svgLoader = new SVGLoader();
        this.svgLoader.load('assets/ruby.svg');
        this.svgLoader.addEventListener(Event.COMPLETE, (e) => this.svgLoaded(e));

        // Blur Filter
        this.blurFilter = new SVGBlurFilter();
        this.blurFilter.id = 'blurFilterTest';
        this.svg.appendDef(this.blurFilter);
        this.dropFilter = new SVGDropShadowFilter();
        this.dropFilter.id = 'dropShadowFilterTest';
        this.svg.appendDef(this.dropFilter);

        // Gradient
        this.gradient = new SVGLinearGradient();
        this.gradient.id = "gradient";
        this.gradient.x1 = "0%";
        this.gradient.y1 = "50%";
        this.gradient.x2 = "100%";
        this.gradient.y2 = "50%";
        this.gradient.spreadMethod = SVGGradientSpreadMethod.PAD;
        this.gradient.addStop("0%", "#00ff00", 1);
        this.gradient.addStop("100%", "#00b700", 1);
        this.svg.appendDef(this.gradient);

        // Gradient
        this.rgradient = new SVGRadialGradient();
        this.rgradient.id = "gradient_rad";
        this.rgradient.spreadMethod = SVGGradientSpreadMethod.PAD;
        this.rgradient.addStop("0%", "#00ff00", 1);
        this.rgradient.addStop("100%", "#00b700", 1);
        this.svg.appendDef(this.rgradient);

        // Rectangle
        this.rect = new SVGRectangle();
        this.rect.width = 200;
        this.rect.height = 200;
        this.rect.x = 10;
        this.rect.y = 10;
        this.rect.gradient = this.rgradient;
        this.rect.filter = this.dropFilter;
        this.svg.append(this.rect);

        // Group
        this.group = new SVGGroup();
        this.group.x = 20;
        this.group.y = 20;
        this.svg.append(this.group);

        // Arc Path
        this.arcPath = new SVGPath();
        this.arcPath.addDrawCommand(SVGPath.moveto, 0, 0);
        this.arcPath.addDrawCommand(SVGPath.arc, 35, 35, 0, 1, 1, 100, 100);
        this.arcPath.fill('#ffffff');
        this.arcPath.stroke = '#00ff00';
        this.arcPath.strokewidth = 20;
        this.arcPath.x = 190;
        this.arcPath.filter = this.dropFilter;
        this.group.append(this.arcPath);

        // Image
        this.img = new SVGImage();
        this.img.src = 'assets/apps_icon.png';
        this.img.width = 20;
        this.img.height = 20;
        this.img.x = 0;
        this.img.y = 0;
        this.group.append(this.img);

        // Polygon
        this.poly = new SVGPolygon();
        this.poly.x = 10;
        this.poly.y = 10;
        this.poly.addPoint(5, 30);
        this.poly.addPoint(15, 10);
        this.poly.addPoint(25, 30);
        this.poly.fill('#00ff00');
        this.poly.stroke = '#000000';
        this.poly.filter = this.dropFilter;
        this.group.append(this.poly);

        // Text
        this.txt = new SVGText();
        this.txt.y = 80;
        this.txt.text = 'Hello SVG';
        this.txt.font = 'Arial';
        this.txt.color = '#000000';
        this.group.append(this.txt);
        this.txt.registration.x = this.txt.width / 2;
        this.txt.registration.y = this.txt.height / 2;

        // Circle
        this.circle = new SVGCircle();
        this.circle.r = 20;
        this.circle.x = 150;
        this.circle.y = 150;
        this.circle.fillOpacity = .5;
        this.circle.gradient = this.gradient;
        this.group.append(this.circle);

        // Path
        this.path = new SVGPath();
        this.path.x = 115;
        this.path.y = -10;

        // Path
        this.path.gradient = this.gradient;
        this.path.addDrawCommand(SVGPath.moveto, 75, 0);
        this.path.addDrawCommand(SVGPath.lineto, 75, 200);
        this.path.addDrawCommand(SVGPath.lineto, 255, 200);
        this.path.addDrawCommand(SVGPath.close);
        this.path.filter = this.dropFilter;
        this.group.append(this.path);
        this.raf.start();
        var startColor = new Color();
        startColor.set('#00a8ff');
        var endColor = new Color();
        endColor.set('#F6EB0F');
        var l = 20;
        var i = 1 / l;
        for (var c = 0; c < l; c++) {
            startColor.lerp(endColor, c * i);
            var a = new SVGArc();
            a.radius = 20 + (c * 10);
            a.strokewidth = 11;
            a.startAngle = 0 + (c * 10);
            a.endAngle = 30 + (c * 20);
            a.x = this.svg.width / 2;
            a.y = this.svg.height / 2;
            a.stroke = '#' + startColor.getHexString();
            this.svg.append(a);
            this.arcs.push(a);
        }

        this.onResize();
    }
    /**
     *
     * @param e
     */
    svgLoaded(e) {
        this.svg.append(this.svgLoader.element);
        this.ruby = this.svgLoader.element;
        this.ruby.filter = this.blurFilter;
        this.onResize();
    }
    /**
     *
     */
    raframe() {
        //this.stats.begin();
        this.cntr += 0.01;
        var b = Math.abs(Math.sin(this.cntr) * 5);
        var l = this.arcs.length;
        this.blurFilter.blurY = this.blurFilter.blurX = b;
        for (var c = 0; c < l; c++) {
            this.arcs[c].rotation += 1 + (c * .2);
        }
        //this.stats.end();
    }
    //------------------------------------------------------------------------------------------------------------------------------
    /**
     *
     */
    onMouseDown() {
        this.gradient.getStops()[0].color = "#" + ((1 << 24) * Math.random() | 0).toString(16);
        this.gradient.getStops()[1].color = "#" + ((1 << 24) * Math.random() | 0).toString(16);
        if (this.rect) {
            console.log(this.rect.parentSVGObject);
            if (this.rect.parentSVGObject) {
                console.log(this.rect.parentSVGObject.children);
            }
            if (this.rect.parentNode) {
                this.rect.remove();
            }
            else {
                this.svg.append(this.rect);
                this.svg.append(this.group); // keep group in front
            }
        }
    }
    /**
     *
     */
    onResize() {
        this.svg.width = window.innerWidth;
        this.svg.height = window.innerHeight;
        var l = this.arcs.length;
        for (var c = 0; c < l; c++) {
            this.arcs[c].x = this.svg.width / 2;
            this.arcs[c].y = this.svg.height / 2;
        }
        if (this.ruby) {
            this.ruby.x = (this.svg.width - this.ruby.width) / 2;
            this.ruby.y = (this.svg.height - this.ruby.height) / 2;
        }
    }
}
