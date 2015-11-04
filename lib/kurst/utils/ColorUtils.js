export class ColorUtils {
	/**
	 *
	 * @param float32Color
	 * @param result
	 * @returns {*}
	 */
	static float32ColorToARGB(float32Color, result)
	{
		var a = (float32Color & 0xff000000) >>> 24;
		var r = (float32Color & 0xff0000) >>> 16;
		var g = (float32Color & 0xff00) >>> 8;
		var b = float32Color & 0xff;
		if (result != null)
		{
			result.length = 0;
			result.push(a);
			result.push(r);
			result.push(g);
			result.push(b);
			return result;
		}
		return [a, r, g, b];
	}
	/**
	 *
	 * @param c
	 * @returns {string}
	 */
	static componentToHex(c)
	{
		var hex = c.toString(16);
		return hex.length == 1 ? "0" + hex : hex;
	}
	/**
	 *
	 * @param argb
	 * @returns {string}
	 * @constructor
	 */
	static RGBToHexString(argb)
	{
		return "#" + ColorUtils.componentToHex(argb[1]) + ColorUtils.componentToHex(argb[2]) + ColorUtils.componentToHex(argb[3]);
	}
	/**
	 *
	 * @param argb
	 * @returns {string}
	 * @constructor
	 */
	static ARGBToHexString(argb)
	{
		return "#" + ColorUtils.componentToHex(argb[0]) + ColorUtils.componentToHex(argb[1]) + ColorUtils.componentToHex(argb[2]) + ColorUtils.componentToHex(argb[3]);
	}
}
