import {Random} from './Random';
export class NumberUtils {
	static seed(seed, flag = true)
	{
		NumberUtils.psrnd = flag;
		if (NumberUtils.rnd)
		{
			NumberUtils.rnd.seed(seed);
		}
		else
		{
			NumberUtils.rnd = new Random(seed);
		}
	}
	/**
	 * Random integer
	 *
	 * @param min
	 * @param max
	 * @returns {number}
	 */
	static getRandomInt(min, max)
	{
		return NumberUtils.psrnd ?
		Math.floor(NumberUtils.rnd.next() * (max - min + 1)) + min :
		Math.floor(Math.random() * (max - min + 1)) + min;
	}
	/**
	 * flipWeightedCoin
	 *
	 * @param percentage - 	weight percentage, if random value is less than coin will return true.
	 * 						A percentage of .5 will return true 50% of the time whereas a percentage value of 25% will
	 * 						only return tru 25% of the time.
	 * @returns {boolean}
	 */
	static flipWeightedCoin(percentage)
	{
		return (NumberUtils.random(0, 1) <= percentage);
	}
	/**
	 * Flip coins
	 *
	 * @returns {boolean}
	 */
	static flipCoin()
	{
		return (NumberUtils.getRandomInt(0, 2) <= 1);
	}
	/**
	 * random number ( between min / max )
	 * @param low
	 * @param high
	 * @returns {any}
	 */
	static random(low = 0, high = 1)
	{
		if (low == 0 && high == 1)
		{
			return NumberUtils.psrnd ? NumberUtils.rnd.next() : Math.random();
		}
		if (low >= high)
		{
			return low;
		}
		var diff = high - low;
		return NumberUtils.psrnd ?
		(NumberUtils.rnd.next() * diff) + low :
		(Math.random() * diff) + low;
	}
	/**
	 * constrain number
	 *
	 * @param v
	 * @param min
	 * @param max
	 * @returns {any}
	 */
	static constrain(v, min, max)
	{
		if (v < min)
		{
			v = min;
		}
		else if (v > max)
		{
			v = max;
		}
		return v;
	}
	/**
	 * convert decimal value to Hex
	 * @param d
	 * @param padding
	 * @returns {string}
	 */
	static decimalToHex(d, padding)
	{
		var hex = d.toString(16).toUpperCase();
		padding = typeof (padding) === "undefined" || padding === null ? padding = 2 : padding;
		while (hex.length < padding)
		{
			hex = "0" + hex;
		}
		return hex;
	}
	/**
	 * convert rgb( 12, 213, 123 ) to hex
	 * @param rgb
	 * @returns {string}
	 */
	static rgbToHex(rgb)
	{
		var rgbRegex = /^rgb\(\s*(-?\d+)(%?)\s*,\s*(-?\d+)(%?)\s*,\s*(-?\d+)(%?)\s*\)$/;
		var result, r, g, b, hex = "";
		if ((result = rgbRegex['exec'](rgb)))
		{
			r = NumberUtils.componentFromStr(result[1], result[2]);
			g = NumberUtils.componentFromStr(result[3], result[4]);
			b = NumberUtils.componentFromStr(result[5], result[6]);
			hex = "#" + (0x1000000 + (r << 16) + (g << 8) + b).toString(16).slice(1);
		}
		return hex;
	}
	/**
	 *
	 * @param numStr
	 * @param percent
	 * @returns {number}
	 */
	static componentFromStr(numStr, percent = false)
	{
		var num = Math.max(0, parseInt(numStr, 10));
		return percent ? Math.floor(255 * Math.min(100, num) / 100) : Math.min(255, num);
	}
	/**
	 *
	 * @param degrees
	 * @returns {number}
	 */
	static degToRad(degrees)
	{
		return degrees * (Math.PI / 180);
	}
	/**
	 *
	 * @param rad
	 * @returns {number}
	 */
	static radToDeg(rad)
	{
		return rad * (180 / Math.PI);
	}
}
NumberUtils.psrnd = false;
