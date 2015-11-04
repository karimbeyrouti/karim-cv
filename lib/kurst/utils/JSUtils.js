import {Point} from "../geom/Point";
export class JSUtils {
	/*
	 * Check is running platform is android
	 */
	static isAndroid()
	{
		return navigator.userAgent.match(/Android/i) ? true : false;
	}

	/*
	 * Check is running platform is Blackberry
	 */
	static isBlackBerry()
	{
		return navigator.userAgent.match(/BlackBerry/i) ? true : false;
	}

	/*
	 * Check is running platform is IOS
	 */
	static isIOS()
	{
		return navigator.userAgent.match(/iPhone|iPad|iPod/i) ? true : false;
	}

	/*
	 * Check is running platform is Window Mobile
	 */
	static isWindowsMob()
	{
		return navigator.userAgent.match(/IEMobile/i) ? true : false;
	}

	/*
	 * Check is running platform is Mobile
	 */
	static isMobile()
	{
		return (JSUtils.isAndroid() || JSUtils.isBlackBerry() || JSUtils.isIOS() || JSUtils.isWindowsMob());
	}

	//--Selection------------------------------------------------------------------------
	//

	/*
	 * select an element by ID
	 */
	static getId(id)
	{
		return document.getElementById(id);
	}

	/*
	 * select a list of elements by class
	 */
	static getClass(className)
	{
		return document.getElementsByClassName(className);
	}

	/*
	 * get a list of elenement by classname
	 */
	static getElementsByClassNme(theClass)
	{
		var classElms = new Array();
		var node = document;
		var i = 0;
		if (node.getElementsByClassName)
		{
			var tempEls = node.getElementsByClassName(theClass);
			for (i = 0; i < tempEls.length; i++)
				classElms.push(tempEls[i]);
		}
		else
		{
			var getclass = new RegExp('\\b' + theClass + '\\b');
			var elems = node.getElementsByTagName('*');
			for (i = 0; i < elems.length; i++)
			{
				var classes = elems[i]['className'];
				if (getclass.test(classes))
					classElms.push(elems[i]);
			}
		}
		return classElms;
	}

	/**
	 * get query parameters (
	 * @param qs: Query string
	 */
	static getQueryParams(qs)
	{
		qs = qs.split("+").join(" ");
		var params = {}, tokens, re = /[?&]?([^=]+)=([^&]*)/g;
		while (tokens = re.exec(qs))
		{
			params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
		}
		return params;
	}

	//--Desktop------------------------------------------------------------------------

	/*
	 * Check is running platform is Firefox
	 */
	static isFireFox()
	{
		return (navigator.userAgent.search("Firefox") != -1);
	}

	/*
	 * Check is running platform is Internet Explorer
	 */
	static isIE()
	{
		return (navigator.appVersion.indexOf("MSIE") != -1);
	}

	/*
	 * Get version of internet Explorer
	 */
	static getIEVersion()
	{
		if (JSUtils.isIE())
			return parseFloat(navigator.appVersion.split("MSIE")[1]);
		return -1;
	}

	/*
	 * Check if platform supports flash
	 */
	static isFlashEnabled()
	{
		if (JSUtils.isIE())
		{
			var version = JSUtils.getIEVersion();
			if (version > 8)
			{
				return (window['ActiveXObject'] && (new ActiveXObject("ShockwaveFlash.ShockwaveFlash")) != false);
			}
			else
			{
				try
				{
					var aXObj = new ActiveXObject('ShockwaveFlash.ShockwaveFlash');
					if (aXObj)
						return true;
					return false;
				}
				catch (ex)
				{
					return false;
				}
			}
			return false;
		}
		else
		{
			return ((typeof navigator.plugins != "undefined" && typeof navigator.plugins["Shockwave Flash"] == "object") != false);
		}
	}

	/**
	 *
	 * @returns {boolean}
	 */
	static isChromeApp()
	{
		if (!window.hasOwnProperty('chrome'))
			return false;

		if (!chrome)
			return false;
		if (!chrome['system'])
			return false;
		return true;
	}

	/**
	 *
	 * @returns {Point}
	 */
	static getPageOffset()
	{
		var doc = document.documentElement;
		var body = document.body;
		return new Point((doc && doc.scrollLeft || body && body.scrollLeft || 0), (doc && doc.scrollTop || body && body.scrollTop || 0));
	}
}
