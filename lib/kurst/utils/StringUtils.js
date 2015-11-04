export class StringUtils {
	/**
	 * String to XML
	 * @param xmlString
	 * @returns {Document}
	 */
	static strToXML(xmlString)
	{
		return (new DOMParser()).parseFromString(xmlString, "text/xml");
	}
	/** Function count the occurrences of substring in a string;
	 * @param {String} string   Required. The string;
	 * @param {String} subString    Required. The string to search for;
	 * @param {Boolean} allowOverlapping    Optional. Default: false;
	 */
	static occurrences(str, subString, allowOverlapping = false)
	{
		str += "";
		subString += "";
		if (subString.length <= 0)
			return str.length + 1;
		var n = 0;
		var pos = 0;
		var step = (allowOverlapping) ? (1) : (subString.length);
		while (true)
		{
			pos = str.indexOf(subString, pos);
			if (pos >= 0)
			{
				n++;
				pos += step;
			}
			else
			{
				break;
			}
		}
		return (n);
	}
	/**
	 *
	 * @param value
	 * @returns {boolean}
	 */
	static isString(value)
	{
		return Object.prototype.toString.apply(value, []) === '[object String]';
	}
	/**
	 *
	 * @param array
	 * @returns {string}
	 */
	static fromCharCodeArray(array)
	{
		return String.fromCharCode.apply(null, array);
	}
	/**
	 *  Test if string ends with
	 * @param string
	 * @param value
	 * @returns {boolean}
	 */
	static endsWith(string, value)
	{
		return string.substring(string.length - value.length, string.length) === value;
	}
	/**
	 * Test if string starts with
	 * @param string
	 * @param value
	 * @returns {boolean}
	 */
	static startsWith(string, value)
	{
		return string.substr(0, value.length) === value;
	}
	/**
	 *
	 * @param source
	 * @param sourceIndex
	 * @param destination
	 * @param destinationIndex
	 * @param count
	 */
	static copyTo(source, sourceIndex, destination, destinationIndex, count)
	{
		for (var i = 0; i < count; i++)
		{
			destination[destinationIndex + i] = source.charCodeAt(sourceIndex + i);
		}
	}
	/**
	 * repeat value
	 * @param value
	 * @param count
	 * @returns {string}
	 */
	static repeat(value, count)
	{
		return Array(count + 1).join(value);
	}
	/**
	 * Compare two strings
	 * @param val1
	 * @param val2
	 * @returns {boolean}
	 */
	static stringEquals(val1, val2)
	{
		return val1 === val2;
	}
	/**
	 * Capitalise first letter in string
	 * @param str
	 * @returns {string}
	 */
	static capitaliseFirstLetter(str)
	{
		return str.charAt(0).toUpperCase() + str.slice(1);
	}
	/**
	 * Catptalise all words
	 * @param str
	 * @returns {string}
	 */
	static capitaliseAllWords(str)
	{
		var a = str.split(' ');
		var l = a.length;
		var result = '';
		for (var c = 0; c < l; c++)
		{
			result += ' ' + StringUtils.capitaliseFirstLetter(a[c].toLowerCase());
		}
		return result;
	}
}
